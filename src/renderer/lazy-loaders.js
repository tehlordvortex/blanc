import { parseFile } from 'music-metadata'
// import * as mime from 'mime'
// import Vibrant from 'node-vibrant'
// import { Quantizer, default as Vibrant } from 'node-vibrant'
// import ImageColorWorker from './image-color.worker'
import { remote } from 'electron'
import { join } from 'path'
import { stat, mkdir, writeFile } from 'fs'
// import { parseFile } from 'music-metadata'
import * as crypto from 'crypto'
import db from '@/library.db'
import Color from 'color'
import Vibrant from 'node-vibrant'
import Queue from 'queue'
// import Color from 'color'
const app = remote.app
let userData = app.getPath('userData')
let artsCachePath = join(userData, 'albumArts')
stat(artsCachePath, (err, details) => {
  if (err && err.code === 'ENOENT') {
    mkdir(artsCachePath, (err) => {
      if (err) {
        console.log('Couldn\'t create album art cache directory:', err)
      }
    })
  }
})

let colorQueue = new Queue()
colorQueue.concurrency = 16
colorQueue.autostart = true

export function toColorString (color) {
  if (color.background && color.foreground) return 'background-color:' + color.background + ';color:' + color.foreground
  else return ''
}

export function toDataURI (format, buffer) {
  return 'data:image/' + format + ';base64,' + buffer.toString('base64')
}
export function getAlbumArt (filePath) {
  // return new Promise((resolve, reject) => {
  //   imageQueue.push(cb => {
  //     if (imageJobs[filePath]) {
  //       resolve(imageJobs[filePath])
  //       cb()
  //       return null
  //     }
  // return parseFile(filePath).then(metadata => {
  //   let picture = metadata.common.picture && metadata.common.picture[0]
  //   if (picture) {
  //     let image = 'data:image/' + picture.format + ';base64,' + picture.data.toString('base64')
  //     // imageJobs[filePath] = image
  //     return image
  //   } else {
  //     return ''
  //   }
  // })
  //   })
  // })
  return cacheAlbumArt(filePath).then((path) => Promise.resolve('file://' + path))
}
export function getAlbum (name) {
  return new Promise((resolve, reject) => {
    db.cfind({ album: name }).sort({ album: 1, title: 1 }).exec().then((res) => {
      if (!res || res.length === 0) return resolve({})
      let id = 0
      while (!res[id]) {
        if (id >= res.length) {
          console.log('All empty cells in result?', res, name)
          return
        }
        id++
      }
      let album = {}
      album.name = name
      album.artists = []
      album.artPath = res[id].filePath
      album.songs = res
      album.colors = null
      album.art = null
      let resolves = []
      res.forEach(song => {
        if (!song) return
        if (song.colors && !album.colors) {
          album.colors = song.colors
        }
        song.artists.forEach(artist => {
          if (!album.artists.includes(artist)) {
            album.artists.push(artist)
          }
        })
        if (!album.art) {
          resolves.push(cacheAlbumArt(song.filePath).then((art) => {
            if (art && !album.art) {
              // console.log(art)
              if (album.art) return
              album.art = art
            }
          }))
        }
      })
      Promise.all(resolves).then(() => resolve(album))
    })
  })
}
export function getAlbums (skip = 0, limit = 0, deep = true) {
  let p = db.cfind({ album: { $nin: ['', null, undefined] } })
  p = p.exec().then((docs) => {
    let albums = []
    // console.log(docs)
    docs.forEach(doc => {
      if (!albums.some(album => album.name === doc.album)) {
        albums.push({
          name: doc.album,
          colors: doc.colors
        })
      }
    })
    return albums
  })
  p = p.then((albums) => {
    return albums.sort((a, b) => {
      return a.name && b.name && (a.name.toLowerCase() > b.name.toLowerCase())
    })
  })
  p = p.then((res) => {
    let slice = res.slice(skip, skip + (limit || res.length))
    return slice
  })
  if (deep) {
    p = p.then((res) => res.map(album => getAlbum(album.name)))
  }
  p = p.then((promises) => {
    return Promise.all(promises)
  })
  return p
}
export function getColors (resource) {
  return new Promise((resolve, reject) => {
    if (resource && resource.startsWith('data')) {
      colorQueue.push(cb => {
        // let resourceHash = crypto.createHash('md5').update(resource).digest('hex')
        // if (colorJobs[resourceHash]) {
        //   resolve(colorJobs[resourceHash])
        //   cb()
        //   return null
        // }
        let buffer = Buffer.from(resource.split(',')[1], 'base64')
        let v = Vibrant.from(buffer).getSwatches()
        v.then((swatches) => {
          let c = (swatches.Vibrant || swatches.Muted).getRgb().map(Math.floor)
          let background = Color.rgb(c)
          let foreground = background.isDark() ? Color.rgb(255, 255, 255) : Color.rgb(0, 0, 0)
          let backgroundText = background.rgb().string()
          let foregroundText = foreground.rgb().string()
          return {
            background: backgroundText,
            foreground: foregroundText
          }
        })
          .then((colors) => {
            // colorJobs[resourceHash] = colors
            resolve(colors)
          })
          .then(() => cb())
          .catch((e) => {
            cb()
            reject(e)
          })
      })
    } else {
      resolve({})
    }
  })
}
export function getBackgroundImageCSS (resource) {
  return 'background-image: url(' + resource + ')'
}
export function cacheAlbumArt (filePath) {
  return new Promise((resolve, reject) => {
    parseFile(filePath).then((metadata) => {
      if (metadata.common.picture) {
        let picture = metadata.common.picture[0]
        let hash = crypto.createHash('md5')
        hash.update(picture.data)
        let hashsum = hash.digest('hex')
        let cachePath = join(artsCachePath, hashsum)
        stat(cachePath, (err, res) => {
          if (err && err.code === 'ENOENT') {
            console.log('Caching art for', filePath)
            writeFile(cachePath, picture.data, (err) => {
              if (err) {
                reject(err)
              } else {
                db.update({filePath: filePath}, { $set: {albumArt: cachePath} })
                  .then(() => resolve(cachePath))
                  .catch(reject)
              }
            })
          } else if (err) {
            reject(err)
          } else {
            db.update({filePath: filePath}, { $set: {albumArt: cachePath} })
              .then(() => resolve(cachePath))
              .catch(reject)
          }
        })
      } else {
        resolve('')
      }
    })
  })
}

export function loadAlbumArt (filePath) {
  return db.find({ filePath: filePath }).then((res) => {
    if (res && res.length > 0 && res[0].albumArt) {
      console.log('Using cached art', res[0].albumArt, 'for', filePath)
      return 'file://' + res[0].albumArt // we already have an album art
    } else {
      console.log('Caching art for', filePath)
      return cacheAlbumArt(filePath)
        .then(path => 'file://' + path)
    }
  })
}

import { parseFile } from 'music-metadata'
import { remote } from 'electron'
// import { join } from 'path'
import { join, win32, posix } from 'path'
// import { stat, mkdir, writeFile } from 'fs'
import { stat, mkdir, readFile } from 'fs'
// import * as crypto from 'crypto'
import { colorsDB, albumsDB, default as db } from '@/library.db'
import Color from 'color'
import Vibrant from 'node-vibrant'
import Queue from 'queue'
// import store from '@/store'
// import { fieldCaseInsensitiveSort, toFileURL } from './lib/utils'
import { fieldCaseInsensitiveSort, toFileURL, hashsum, cacheAlbumArt as pureCacheAlbumArt } from './lib/utils'
import WorkerQuantizer from 'node-vibrant/lib/quantizer/worker'
import { promisify } from 'bluebird'
// import * as Jimp from 'jimp'

const app = remote.app
const userData = app.getPath('userData')

const statAsync = promisify(stat)
const readFilePromise = promisify(readFile)

export const artsCachePath = join(userData, 'albumArts')
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
colorQueue.concurrency = 4
colorQueue.autostart = true

let colorCache = {}
let artCache = {}

export function getAlbumArt (filePath) {
  return cacheAlbumArt(filePath).then((path) => Promise.resolve(toFileURL(path)))
}
export function getSong (id) {
  return db.findOneAsync({_id: id})
}
export function getSongs (albumName) {
  return albumsDB.findOne({name: albumName}).map(album => album.songs).execAsync().then(songs => {
    if (!songs) return []
    else {
      return Promise.all(songs.map(song => db.findOneAsync({_id: song})))
    }
  })
}
export function getAlbum (name) {
  return new Promise((resolve, reject) => {
    db.find({ album: name }).sort({ title: 1 }).execAsync().then((res) => {
      if (!res || res.length === 0) return resolve({})
      let album = {}
      album.name = name
      album.artists = []
      album.songs = res.map(song => song['_id'])
      album.colors = null
      album.art = null
      let resolves = []
      res.forEach(song => {
        if (!song) return
        console.log(album.name, song.albumArt, song.colors)
        if (song.colors && !album.colors) {
          album.colors = song.colors
          album.art = song.albumArt
        }
        song.artists.forEach(artist => {
          if (!album.artists.includes(artist)) {
            album.artists.push(artist)
          }
        })
        if (!album.art && song.albumArt) {
          album.art = song.albumArt
          if (!song.colors) {
            resolves.push(getColors(album.art).then((colors) => {
              album.colors = colors
            }).catch(e => {
              console.warn('Error getting colors for', song.filePath, e)
              album.art = ''
            }))
          } else album.colors = song.colors
        }
      })
      Promise.all(resolves).then(() => resolve(album))
    })
  })
}

export async function getLibrary () {
  // let library = await db.find({}).execAsync()
  // await db.find({}).execAsync()
  // store.commit('UPDATE_LIBRARY', library)
  // return Promise.resolve()
}
export function indexAlbums () {
  let p = db.find({ album: { $nin: ['', null, undefined] } })
  p = p.execAsync().then((docs) => {
    let albums = []
    // console.log(docs)
    docs.forEach(doc => {
      if (!albums.some(album => album.name === doc.album)) {
        albums.push({
          name: doc.album
        })
      }
    })
    return albums
  })
  p = p.then((albums) => {
    return albums.sort(fieldCaseInsensitiveSort('name'))
  })
  p = p.then((res) => res.map(album => getAlbum(album.name)))
  p = p.then((promises) => {
    return Promise.all(promises)
  })
  p = p.then((albums) => {
    return Promise.all(albums.map(album => {
      return albumsDB.updateAsync({name: album.name}, album, {upsert: true})
    }))
      // .then(() => store.commit('UPDATE_ALBUMS', albums))
      .then(() => {
        albums = undefined
      })
  })
  return p
}

export function getAlbums (forceRefresh = false) {
  let albumsPromise = albumsDB.find({}).sort({name: 1}).execAsync()
  albumsPromise.then((albums) => {
    if (albums.length === 0 || forceRefresh) {
      console.log('Re-indexing albums')
      return indexAlbums()
    } else {
      let resolves = Promise.resolve()
      albums.map(album => {
        resolves = resolves.then(() => {
          return db.find({ album: album.name }).execAsync().then((docs) => {
            docs.map(song => {
              if (!album.songs.includes(song['_id'])) {
                album.songs.push(song['_id'])
              }
              if (!album.colors && song.colors) {
                album.colors = song.colors
                album.art = song.albumArt
              }
              if (!album.art && song.albumArt) {
                album.art = song.albumArt
                if (!song.colors) {
                  resolves = resolves.then(() => {
                    getColors(album.art).then((colors) => {
                      album.colors = colors
                    }).catch(e => {
                      console.warn('Error getting colors for', song.filePath, e)
                      album.art = ''
                    })
                  })
                } else album.colors = song.colors
              }
              resolves = resolves.then(() => albumsDB.updateAsync({name: album.name}, album))
            })
          })
        })
      })
    }
  })
  // return albumsPromise.then(() => {
  //   return albumsDB.find({}).execAsync() // .then(albums => store.commit('UPDATE_ALBUMS', albums))
  // })
  return albumsDB
}
export function getColors (resource, forceLibrayItemCache = false) {
  // return Promise.resolve(null)
  return new Promise((resolve, reject) => {
    let buffer, resourceSum, path
    if (resource === 'file:///' || !resource) {
      resolve(null)
      return
    }
    if (typeof resource === 'string') {
      if (resource.startsWith('data')) {
        buffer = Buffer.from(resource.split(',')[1], 'base64')
        resourceSum = hashsum(buffer, 'md5')
      } else if (resource.startsWith('file://')) {
        if (process.platform === 'win32') {
          path = decodeURI(resource.replace('file:///', ''))
        } else {
          path = decodeURI(resource.replace('file://', ''))
        }
        buffer = null
        if (process.platform === 'win32') {
          resourceSum = win32.basename(path).replace('.jpg', '')
        } else {
          resourceSum = posix.basename(path).replace('.jpg', '')
        }
      } else {
        path = resource
        buffer = null
        if (process.platform === 'win32') {
          resourceSum = win32.basename(path).replace('.jpg', '')
        } else {
          resourceSum = posix.basename(path).replace('.jpg', '')
        }
        if (path.includes('albumart-placeholder.png')) {
          path = join(__static, 'albumart-placeholder.png')
        }
      }
    } else {
      buffer = resource
    }
    if (!path) resolve(null)
    if (colorCache[resourceSum]) {
      colorCache[resourceSum].push({resolve, reject})
      return
    }
    colorCache[resourceSum] = [{resolve, reject}]
    colorsDB.findOneAsync({ _id: resourceSum }).then((res) => {
      if (!res) {
        colorQueue.push(cb => {
          Promise.resolve()
            .then(() => {
              if (!buffer) {
                return readFilePromise(path)
              } else {
                return buffer
              }
            })
            .then((buffer) => {
              let v
              try {
                v = Vibrant.from(buffer).useQuantizer(WorkerQuantizer).getSwatches()
              } catch (e) {
                buffer = undefined
                resource = undefined
                colorCache[resourceSum].map(p => p.reject(e))
                colorCache[resourceSum] = null
                cb()
              }
              v.then((swatches) => {
                buffer = undefined
                resource = undefined
                let swatch = (swatches.Vibrant || swatches.DarkVibrant || swatches.Muted || swatches.DarkMuted)
                let c = swatch.getRgb().map(Math.floor)
                let background = Color.rgb(c)
                let foreground = Color(swatch.getTitleTextColor())
                // let foreground = background.isDark() ? Color.rgb(255, 255, 255) : Color.rgb(0, 0, 0)
                let backgroundText = background.rgb().string()
                let foregroundText = foreground.rgb().string()
                return {
                  background: backgroundText,
                  foreground: foregroundText
                }
              })
                .then((colors) => {
                  return colorsDB.updateAsync({
                    _id: resourceSum
                  },
                  {
                    $set: {
                      colors: colors
                    }
                  },
                  {
                    upsert: true
                  })
                    .then(() => db.updateAsync({ albumArt: path }, {
                      $set: { colors: colors }
                    }, { multi: true }))
                    .then(() => albumsDB.updateAsync({ art: path }, {
                      $set: { colors }
                    }))
                    .then(() => {
                      colorCache[resourceSum].map(p => p.resolve(colors))
                      colorCache[resourceSum] = null
                    })
                    .then(() => cb())
                })
                // .then(() => cb())
                .catch((e) => {
                  colorCache[resourceSum].map(p => p.reject(e))
                  colorCache[resourceSum] = null
                  cb()
                })
            })
        })
      } else {
        Promise.resolve()
          .then(() => {
            if (forceLibrayItemCache) {
              return db.updateAsync({ albumArt: path }, {
                $set: { colors: res.colors }
              }, { multi: true })
            }
          })
          .then(() => {
            colorCache[resourceSum].map(p => p.resolve(res.colors))
            colorCache[resourceSum] = null
          })
          // .then(() => cb())
      }
    })
    // })
  })
}
export function getBackgroundImageCSS (resource) {
  if (!resource || resource === 'file:///') resource = 'static/albumart-placeholder.png'
  return 'background-image: url(' + resource + ')'
}
export function cacheAlbumArt (filePath, force = false) {
  return new Promise((resolve, reject) => {
    if (artCache[filePath]) {
      artCache[filePath].push({resolve, reject})
      return
    }
    artCache[filePath] = [{resolve, reject}]
    parseFile(filePath, { native: false, duration: false }).then((metadata) => {
      if (metadata.common.picture) {
        let picture = metadata.common.picture[0]
        pureCacheAlbumArt(picture.format, picture.data)
          .then((cachePath) => {
            return db.updateAsync({filePath: filePath}, { $set: {albumArt: cachePath} })
              .then(() => {
                artCache[filePath].map(i => i.resolve(cachePath))
                artCache[filePath] = null
              })
          })
          .catch((e) => {
            artCache[filePath].map(i => i.reject(e))
            artCache[filePath] = null
          })
      } else {
        artCache[filePath].map(i => i.resolve(''))
        artCache[filePath] = null
      }
    })
  })
}

export function loadAlbumArt (filePath) {
  // return toFileURL(join(__static, 'albumart-placeholder.png'))
  return db.findOne({ filePath: filePath, albumArt: { $nin: [undefined, null, '', 'file:///', 'file://'] } }).execAsync().then((res) => {
    if (res) {
      // console.log('Using cached art', res[0].albumArt, 'for', filePath)
      return statAsync(res.albumArt)
        .then(() => {
          return toFileURL(res.albumArt)
        })
        .catch((err) => {
          if (err.code === 'ENOENT') return cacheAlbumArt(res.filePath).then(path => toFileURL(path))
          else throw err
        })
      // return toFileURL(res[0].albumArt) // we already have an album art
    } else {
      // console.log('Caching art for', filePath)
      return cacheAlbumArt(filePath)
        .then(path => toFileURL(path))
    }
  })
}
// window.getColors = getColors
// window.colorsDB = colorsDB
// window.getAlbums = getAlbums
// window.getLibrary = getLibrary

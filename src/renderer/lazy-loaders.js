import { parseFile } from 'music-metadata'
// import * as mime from 'mime'
// import Vibrant from 'node-vibrant'
// import { Quantizer, default as Vibrant } from 'node-vibrant'
import ImageColorWorker from './image-color.worker'
import { ipcRenderer } from 'electron'
import { join } from 'path'
import { stat, mkdir, writeFile } from 'fs'
import * as crypto from 'crypto'
import db from '@/library.db'
// import Color from 'color'

let userData = ipcRenderer.sendSync('sync-get-path', 'userData')
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
let hash = crypto.createHash('md5')
hash.update(artsCachePath)
console.log('album arts path hash', hash.digest('hex'))
let worker = new ImageColorWorker()
let works = {}
// let arts = {}
worker.onmessage = (msg) => {
  if (msg.data) {
    if (msg.data.id && works[msg.data.id].resolves) {
      if (msg.data.status === 'resolved') {
        works[msg.data.id].resolves.map(resolve => resolve(msg.data.result))
      } else {
        works[msg.data.id].rejects.map(reject => reject(msg.data.error))
      }
      console.log('Caching result for', msg.data.id, ':', msg.data.result)
      works[msg.data.id] = {
        result: msg.data.result
      }
    }
  }
}

export function loadAlbumArt (filePath) {
  return new Promise((resolve, reject) => {
    db.find({ filePath: filePath }, (err, res) => {
      if (err) {
        reject(err)
      } else {
        if (res && res.length > 0 && res[0].albumArt) {
          console.log('Using cached art', res[0].albumArt, 'for', filePath)
          resolve('file://' + res[0].albumArt) // we already have an album art
        } else {
          parseFile(filePath).then((metadata) => {
            if (metadata.common.picture) {
              let picture = metadata.common.picture[0]
              let hash = crypto.createHash('md5')
              hash.update(picture.data)
              let hashsum = hash.digest('hex')
              let cachePath = join(artsCachePath, hashsum)
              stat(cachePath, (err, res) => {
                if (err && err.code === 'ENOENT') {
                  writeFile(cachePath, picture.data, (err) => {
                    if (err) {
                      reject(err)
                    } else {
                      db.update({filePath: filePath}, { $set: {albumArt: cachePath} }, (err) => {
                        if (err) {
                          reject(err)
                        } else {
                          resolve('file://' + cachePath)
                        }
                      })
                    }
                  })
                } else if (err) {
                  reject(err)
                } else {
                  db.update({filePath: filePath}, { $set: {albumArt: cachePath} }, (err) => {
                    if (err) {
                      reject(err)
                    } else {
                      resolve('file://' + cachePath)
                    }
                  })
                }
              })
            } else {
              resolve('')
            }
          })
        }
      }
    })
    // stat(cachePath, (err, res) => {
    //   if (err && err.code === 'ENOENT') {
    //     parseFile(filePath).then((metadata) => {
    //       if (metadata.common.picture) {
    //         let picture = metadata.common.picture[0]
    //         writeFile(cachePath, picture.data, (err) => {
    //           if (err) reject(err)
    //           else resolve('file://' + cachePath)
    //         })
    //       } else {
    //         resolve('')
    //       }
    //     })
    //   } else if (err) {
    //     reject(err)
    //   } else {
    //     resolve('file://' + join(artsCachePath, hashsum))
    //   }
    // })
  })
}
export function computedImage (path) {
  // console.log(path)
  return function () {
    // console.log(path)
    return loadAlbumArt(path)
  }
}
export function computedImageStyle (image) {
  return function () {
    if (!image) {
      return Promise.resolve('')
    } else {
      // if (!image.startsWith('data')) image = 'file://' + image
      let cssString = 'background-image: url(' + image + ')'
      return Promise.resolve(cssString)
    }
  }
}
export function computedStyle (image, invertColors, id) {
  // console.log(this.mounted, this.image)
  // if (!this.mounted) return Promise.resolve('')
  if (!id) throw new Error('id must be specified')
  invertColors = false
  id = id || Date.now() + '-' + Math.random() * 30000
  return function () {
    if (!image) return Promise.resolve('')
    else {
      return new Promise((resolve, reject) => {
        // console.log(id, works)
        // let id = Date.now() + '-' + Math.random() * 30000
        if (!image.startsWith('data:') && image.startsWith('file://')) {
          let filePath = image.substr(7)
          console.log('Computing color for local file', filePath)
          db.find({albumArt: filePath}, (err, docs) => {
            console.log(err, docs)
            if (err) {
              reject(err)
            } else if (docs && docs.length > 0) {
              if (docs[0].colorCache) {
                console.log('Using cached color', docs[0].colorCache)
                resolve(docs[0].colorCache)
              } else {
                console.log('No cached color for', filePath)
                if (works[id] && works[id].resolves) {
                  works[id].resolves.push(resolve)
                  works[id].rejects.push(reject)
                } else {
                  works[id] = {
                    resolves: [(res) => {
                      db.update({albumArt: filePath}, { $set: {colorCache: res} }, (err) => {
                        if (err) {
                          reject(err)
                        } else {
                          console.log('Cached color for', filePath, 'in database')
                          resolve(res)
                        }
                      })
                    }],
                    rejects: [reject]
                  }
                  worker.postMessage({
                    command: 'get-swatches',
                    image: image,
                    id: id
                  })
                }
              }
            }
          })
        } else if (works[id] && works[id].result) {
          console.log('Using cached result for', id)
          resolve(works[id].result)
        } else if (works[id] && works[id].resolves) {
          works[id].resolves.push(resolve)
          works[id].rejects.push(reject)
        } else {
          works[id] = {
            resolves: [resolve],
            rejects: [reject]
          }
          worker.postMessage({
            command: 'get-swatches',
            image: image,
            id: id
          })
        }
      })
    }
  }
}

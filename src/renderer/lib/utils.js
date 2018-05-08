import * as fileURL from 'file-url'
import * as crypto from 'crypto'
import { artsCachePath } from '../lazy-loaders'
import { writeFile, stat } from 'fs'
import { join } from 'path'

export function caseInsensitiveSort (a, b) {
  if (!a && !b) return 0
  if (!a && b) return -1
  else if (a && !b) return 1
  else {
    let al = a.toLowerCase().trim()
    let bl = b.toLowerCase().trim()
    if (al < bl) {
      return -1
    } else if (al > bl) {
      return 1
    } else {
      return 0
    }
  }
}

export function fieldCaseInsensitiveSort (field) {
  return (a, b) => {
    return caseInsensitiveSort(a[field], b[field])
  }
}

export function toFileURL (path) {
  return fileURL(path, { resolve: false })
}

export function hashsum (item, algorithm) {
  let hash = crypto.createHash(algorithm)
  hash.update(item)
  let hashsum = hash.digest('hex')
  return hashsum
}

export function cacheAlbumArt (buffer) {
  return new Promise((resolve, reject) => {
    let artSum = hashsum(buffer, 'md5')
    let artPath = join(artsCachePath, artSum)
    stat(artPath, (err, stats) => {
      if (err && err.code === 'ENOENT') {
        writeFile(artPath, buffer, (err) => {
          if (err) reject(err)
          else resolve(artPath)
        })
      } else if (err) reject(err)
      else {
        resolve(artPath)
      }
    })
  })
}

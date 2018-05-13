import settings from './settings'
import { colorsDB, default as db } from '@/library.db'
import { join } from 'path'
import { indexAlbums, artsCachePath, getLibrary, getAlbums } from '../lazy-loaders'

export default function finishUpdate () {
  let p = Promise.resolve()
  if (settings.lastRunVersion < '0.5.0') {
    console.log('Re-indexing albums...')
    p = p.then(() => indexAlbums())
  }
  if (settings.lastRunVersion < '0.7.1') {
    console.log('Re-caching colors...')
    p = p.then(() => {
      return colorsDB.find({}).then(docs => {
        let resolves = Promise.resolve()
        for (const colorDoc of docs) {
          let albumArtPath = join(artsCachePath, colorDoc._id)
          resolves = resolves.then(() => {
            return db.update({ albumArt: albumArtPath }, { $set: { colors: colorDoc.colors } }, { multi: true })
          })
        }
        return resolves
      })
    })
  }
  if (settings.lastRunVersion < '0.8.1') {
    console.log('Updating store\'s library & albums...')
    p = p.then(() => getLibrary()).then(() => getAlbums())
  }
  return p
}

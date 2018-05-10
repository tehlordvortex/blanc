import settings from './settings'
// import { albumsDB, colorsDB, default as db } from '@/library.db'
import { indexAlbums } from '@/lazy-loaders'

export default function finishUpdate () {
  return new Promise((resolve, reject) => {
    if (settings.lastRunVersion < '0.5.0') {
      indexAlbums()
        .then(() => {
          resolve()
        })
    } else {
      resolve()
    }
  })
}

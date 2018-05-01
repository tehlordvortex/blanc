const Datastore = require('nedb-promise')
export const appDataPath = require('electron').ipcRenderer.sendSync('sync-get-path', 'userData')
const join = require('path').join
export const libraryDBPath = join(appDataPath, 'library.db')
export const albumsDBPath = join(appDataPath, 'albums.db')
console.log('Library db at', libraryDBPath)
console.log('Albums db at', albumsDBPath)
const db = new Datastore({
  filename: libraryDBPath,
  autoload: true
})
db.ensureIndex({
  fieldName: 'filePath',
  unique: true
})
export const albumsDB = new Datastore({
  filename: albumsDBPath,
  autoload: true
})
export default db

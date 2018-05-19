import Promise from 'bluebird'
// import store from '@/store'
// import { debounce } from 'underscore'
const LinvoDB = require('linvodb3')

LinvoDB.defaults.store = { db: require('level-js') }
export const appDataPath = require('electron').ipcRenderer.sendSync('sync-get-path', 'userData')
console.log('App database at', appDataPath)
LinvoDB.dbPath = appDataPath

const db = new LinvoDB('library')
db.ensureIndex({
  fieldName: 'filePath',
  unique: true
})
export const albumsDB = new LinvoDB('albums')
export const colorsDB = new LinvoDB('colors')
/* eslint-disable no-proto */
Promise.promisifyAll(db.find().__proto__)
Promise.promisifyAll(db)
Promise.promisifyAll(albumsDB.find().__proto__)
Promise.promisifyAll(albumsDB)
Promise.promisifyAll(colorsDB.find().__proto__)
Promise.promisifyAll(colorsDB)

// function handleUpdate (type = 'library') {
//   return debounce(() => {
//     store.commit('UPDATE_' + type.toUpperCase(), lives[type].res)
//   }, 500)
// }

// let lives = {
//   'library': db.find({}).live(),
//   'albums': albumsDB.find({}).live()
// }
// export const liveLibrary = lives.library
// export const liveAlbums = lives.albums

// db.on('liveQueryUpdate', handleUpdate('library'))
// albumsDB.on('liveQueryUpdate', handleUpdate('albums'))

// window.liveLibrary = liveLibrary
// window.liveAlbums = liveAlbums

export default db

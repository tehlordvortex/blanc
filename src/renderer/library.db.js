const Datastore = require('nedb')
const appDataPath = require('electron').ipcRenderer.sendSync('sync-get-path', 'userData')
const join = require('path').join
console.log('Library db at', join(appDataPath, 'library.db'))
const db = new Datastore({
  filename: join(appDataPath, 'library.db'),
  autoload: true
})

export default db

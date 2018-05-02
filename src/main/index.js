'use strict'

import { app, BrowserWindow, ipcMain as ipc, dialog } from 'electron'
// import { name } from '../../package.json'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
/**
 * Set app name to 'blanc' and ensure we get our own config and cache directory
 */
// app.setName(name)
// app.setPath('userData', app.getPath('userData').replace(/electron/i, name))

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: false,
    webPreferences: {
      nodeIntegrationInWorker: true,
      webSecurity: false
    },
    icon: require('path').join(__static, 'icon.png'),
    show: false
  })

  mainWindow.loadURL(winURL)
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * IPC Requests from Renderer Process
 */
ipc.on('sync-get-path', (event, path) => {
  try {
    let returnPath = app.getPath(path)
    event.returnValue = returnPath
  } catch (e) {
    event.returnValue = null
  }
})
ipc.on('dialog-select-folder', (event, arg) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (files) {
    if (files) event.sender.send('dialog-selected-folder', files) // TODO: Error checking
    else event.sender.send('dialog-selected-folder', undefined)
  })
})
ipc.on('set-progress', (event, progress) => {
  if (mainWindow) {
    mainWindow.setProgressBar(progress)
  }
})
ipc.on('close-app', (event) => {
  mainWindow.close()
})
ipc.on('minimize-app', (event) => {
  mainWindow.minimize()
})
ipc.on('open-dev-tools', (event) => {
  if (mainWindow) mainWindow.webContents.openDevTools()
})
ipc.on('close-dev-tools', (event) => {
  if (mainWindow) mainWindow.webContents.closeDevTools()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

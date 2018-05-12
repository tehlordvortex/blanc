'use strict'

import { app, BrowserWindow, ipcMain as ipc, dialog, globalShortcut, Menu, Tray } from 'electron'

import * as log from 'electron-log'

// import { name } from '../../package.json'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, tray
const defaultContextMenu = [
  {
    icon: require('path').join(__static, 'icon_small.png'),
    label: 'blanc',
    enabled: false
  },
  { type: 'separator' },
  {
    enabled: false,
    label: 'Nothing is playing'
  },
  {
    enabled: false,
    label: ''
  },
  {
    enabled: false,
    label: ''
  },
  { type: 'separator' },
  {
    label: 'Play',
    click: () => {
      mainWindow.webContents.send('music-play-pause')
    }
  },
  {
    label: 'Next',
    click: () => {
      mainWindow.webContents.send('music-next')
    }
  },
  {
    label: 'Previous',
    click: () => {
      mainWindow.webContents.send('music-previous')
    }
  },
  { 'type': 'separator' },
  {
    label: 'Show',
    click: () => {
      mainWindow.show()
    }
  },
  { role: 'quit' }
]
let currentMenu = [...defaultContextMenu]

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
    show: false,
    backgroundColor: '#3050ff',
    minWidth: 1000,
    minHeight: 563
  })

  mainWindow.loadURL(winURL)
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function registerShortcuts () {
  globalShortcut.register('MediaPlayPause', () => {
    mainWindow.webContents.send('music-play-pause')
  })
  globalShortcut.register('MediaPreviousTrack', () => {
    mainWindow.webContents.send('music-previous')
  })
  globalShortcut.register('MediaNextTrack', () => {
    mainWindow.webContents.send('music-next')
  })
}

function unregisterShortcuts () {
  globalShortcut.unregisterAll()
}

function createTrayIcon () {
  tray = new Tray(require('path').join(__static, 'icon_small.png'))
  let contextMenu = Menu.buildFromTemplate(currentMenu)
  tray.setContextMenu(contextMenu)
}

app.on('ready', createWindow)
app.on('ready', registerShortcuts)
app.on('ready', createTrayIcon)

app.on('will-quit', unregisterShortcuts)

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
  mainWindow.hide()
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

ipc.on('tray-play-song', (event, song) => {
  if (song) {
    currentMenu[2].label = song.title.replace(/&/g, '&&')
    currentMenu[3].label = (song.artists && song.artists.map(artist => artist.replace(/&/g, '&&')).join(', ')) || song.artist.replace(/&/g, '&&') || 'Unknown Artist(s)'
    currentMenu[4].label = (song.album && song.album.replace(/&/g, '&&')) || 'Unknown Album'
    currentMenu[6].label = 'Pause'
  }
  let contextMenu = Menu.buildFromTemplate(currentMenu)
  tray.setContextMenu(contextMenu)
})

ipc.on('tray-pause-song', (event) => {
  currentMenu[6].label = 'Play'
  let contextMenu = Menu.buildFromTemplate(currentMenu)
  tray.setContextMenu(contextMenu)
})

ipc.on('tray-resume-song', (event) => {
  currentMenu[6].label = 'Pause'
  let contextMenu = Menu.buildFromTemplate(currentMenu)
  tray.setContextMenu(contextMenu)
})

ipc.on('app-error', (event, details) => {
  log.error('Error at ' + new Date())
  log.error(details)
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

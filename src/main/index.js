'use strict'

import { app, BrowserWindow, remote, ipcMain } from 'electron'


const path = require("path")
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}


app.setName('量化机器人')

app.setAsDefaultProtocolClient('talkrun')

app.setAppUserModelId('www.evergreenstudio.robot')

app.setAboutPanelOptions({
    applicationName: '量化机器人',
    applicationVersion: '1.0',
    copyright: '2020',
    version: '1.0',
    credits: 'https://evergreenstudio.dev',
    authors: ['EverGreenStudio', 'Ted'],
    website: 'https://evergreenstudio.dev',
    iconPath: path.join(__dirname, 'static/icon/app.png')
})
/**
 * 共享全局参数
 * @type {{argv: (*|Array)}}
 */

global.sharedObject = {argv: process.argv}

/**
 * 加载IPC通道主进程文件
 */

require('./ipcMainRenderer')
/**
 * 渲染进程读取全局参数
 * require('electron').remote.getGlobal('sharedObject').argv
 */

console.log(process.type, app.getPath('userData'))

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9088`
  : `file://${__dirname}/index.html`

require('events').EventEmitter.prototype._maxListeners = 0

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 650,
    useContentSize: false,
    width: 300,
    transparent: true,
    frame: false,
    resizable: true,
    alwaysOnTop: true
  })

  mainWindow.loadURL(winURL)

  mainWindow.webContents.on("did-finish-load", function(){
        mainWindow.webContents.executeJavaScript(`
            const app = ${app};
            window.electron = app;
            console.info('--executeJavaScript export Object finish output -->', electron);
        `);
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

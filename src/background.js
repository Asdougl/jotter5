'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import { promises as fs } from 'fs'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 500,
    height: 650,
    frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
      icon: path.join(__static, 'icon.png')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

  win.on('blur', () => win.webContents.send('window-blur'))
  win.on('focus', () => win.webContents.send('window-focus'))

  const dataPath = path.join(app.getPath('userData'), 'data')
  const filesPath = path.join(app.getPath('userData'), 'data', 'files')
  const lookupPath = path.join(app.getPath('userData'), 'data', 'lookup.json')

  ipcMain.handle('fetch-lookup', async (evt) => {
    try {

      // Check directories exist:
      await fs.access(dataPath).catch(async (err) => {
        if (err.code === 'ENOENT') {
          await fs.mkdir(dataPath)
        } else {
          throw err;
        }
      })

      await fs.access(filesPath).catch(async err => {
        if (err.code === 'ENOENT') {
          await fs.mkdir(filesPath)
        } else {
          throw err;
        }
      })
      
      await fs.access(lookupPath).catch(async err => {
        if (err.code === 'ENOENT') {

          await fs.writeFile(lookupPath, JSON.stringify({ files: [], folders: []}), 'utf-8')
          
        } else {
          throw err;
        }
      }) 

      const lookupJSON = await fs.readFile(lookupPath, 'utf-8');

      return { status: 'success', data: lookupJSON }

    } catch (error) {

      // Otherwise some other error
      return { status: 'error', data: error }

    }
  })

  ipcMain.handle('write-lookup', async (evt, lookup) => {
    try {
      
      await fs.writeFile(lookupPath, lookup, 'utf-8');

      return { status: 'success' };

    } catch (error) {
      return { status: 'error', data: error }
    }
  })

  ipcMain.handle('fetch-file', async (evt, fileId) => {
    try {
      
      const fileContents = await fs.readFile(path.join(filesPath, `${fileId}.txt`), 'utf-8');

      return { status: 'success', data: fileContents }

    } catch (error) {
      return { status: 'error', data: error }
    }
  })

  ipcMain.handle('write-file', async (evt, fileId, body) => {
    try {
      
      await fs.writeFile(path.join(filesPath, `${fileId}.txt`), body, 'utf-8');

      return { status: 'success' };

    } catch (error) {
      return { status: 'error', data: error }
    }
  })

  ipcMain.handle('delete-file', async (evt, fileId) => {
    try {
      
      await fs.unlink(path.join(filesPath, `${fileId}.txt`));

      return { status: 'success' }

    } catch (error) {
      return { status: 'error', data: error }
    }
  })

  ipcMain.on('minimize', () => {
    win.minimize()
  })
  ipcMain.on('maximise', () => {
    if(win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })
  ipcMain.on('close-window', () => {
    win.close();
  })

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}


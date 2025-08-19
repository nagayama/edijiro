import { app, BrowserWindow, shell, ipcMain, Menu, clipboard, dialog, autoUpdater } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let mainWindow: BrowserWindow | null = null
let position: number[] | undefined
let size: number[] | undefined

function createWindow(): void {
  if (!size) {
    size = [600, 400]
  }
  
  mainWindow = new BrowserWindow({
    width: size[0],
    height: size[1],
    show: false,
    titleBarStyle: 'hidden',
    alwaysOnTop: false,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (position) {
    mainWindow.setPosition(position[0], position[1])
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('move', () => {
    if (mainWindow) {
      position = mainWindow.getPosition()
    }
  })

  mainWindow.on('resize', () => {
    if (mainWindow) {
      size = mainWindow.getSize()
    }
  })

  mainWindow.webContents.on('devtools-opened', () => {
    if (mainWindow) {
      mainWindow.focus()
      setImmediate(() => {
        mainWindow?.focus()
      })
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  // Create application menu
  createMenu()

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (process.platform === 'darwin') {
    app.show()
  }
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC handlers
ipcMain.on('alwaysOnTop', (_event, arg: boolean) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(arg)
  }
})

// Command|Ctrl + C でのコピー時に text/html のデータをクリップボードに書き込まないようにしたいため
// setTimeout を挟まないと、レンダラープロセス側のデータが採用されてしまう
ipcMain.on('copy', (_event, arg: string) => {
  setTimeout(() => {
    clipboard.writeText(arg)
  }, 200)
})

// Create application menu
function createMenu(): void {
  const menuTemplate: any[] = []

  menuTemplate.push(
    {
      label: app.getName(),
      submenu: [
        {
          label: 'Preferences',
          accelerator: 'CmdOrCtrl+,',
          click: (): void => {
            if (mainWindow) mainWindow.webContents.send('showPreferences')
          }
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: process.platform === 'darwin' ? 'Cmd+Shift+Z' : 'Ctrl+Y',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectAll'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: (): void => {
            if (mainWindow) mainWindow.reload()
          }
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          click: (): void => {
            app.hide()
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
          click: (): void => {
            if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen())
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click: (): void => {
            if (mainWindow) mainWindow.webContents.toggleDevTools()
          }
        },
        {
          label: 'Open Command Palette',
          accelerator: process.platform === 'darwin' ? 'Cmd+Shift+P' : 'Ctrl+Shift+P',
          click: (): void => {
            if (mainWindow) mainWindow.webContents.send('openCommandPalette')
          }
        }
      ]
    },
    {
      label: 'Text',
      submenu: [
        {
          label: 'Increase Font Size',
          accelerator: 'CmdOrCtrl+Plus',
          click: (): void => {
            if (mainWindow) mainWindow.webContents.send('increaseFontSize')
          }
        },
        {
          label: 'Decrease Font Size',
          accelerator: 'CmdOrCtrl+-',
          click: (): void => {
            if (mainWindow) mainWindow.webContents.send('decreaseFontSize')
          }
        }
      ]
    }
  )

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}

// Auto updater setup
function setupAutoUpdater(): void {
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    autoUpdater.on('error', (err) => console.log(err))
    autoUpdater.on('checking-for-update', () => console.log('checking-for-update'))
    autoUpdater.on('update-available', () => console.log('update-available'))
    autoUpdater.on('update-not-available', () => console.log('update-not-available'))
    
    autoUpdater.on('update-downloaded', () => {
      console.log('update-downloaded')
      const dialogIndex = dialog.showMessageBoxSync({
        message: 'アップデートあり',
        detail: '再起動してインストールできます。',
        buttons: ['再起動', '後で']
      })
      if (dialogIndex === 0) {
        autoUpdater.quitAndInstall()
      }
    })
    
    const server = 'https://hazel.editaro.com'
    const feed = `${server}/update/${process.platform}/${app.getVersion()}`
    autoUpdater.setFeedURL({ url: feed })
    autoUpdater.checkForUpdates()
  }
}

app.whenReady().then(() => {
  createWindow()
  setupAutoUpdater()
})
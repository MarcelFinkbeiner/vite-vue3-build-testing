import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';

import fs from 'fs';

app.commandLine.appendSwitch('ignore-certificate-errors');

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');

const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

const debug = process.env.NODE_ENV === 'development';

async function createWindow() {
  win = new BrowserWindow({
    height: 800,
    width: 1280,
    minHeight: 800,
    minWidth: 1280,
    enableLargerThanScreen: true,
    fullscreen: false,
    frame: false,
    resizable: true,
    alwaysOnTop: false,
    backgroundColor: '#000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    await win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    await win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow);

app
  .whenReady()
  .then(() => {
    if (debug)
      // replace with whatever you use to check for dev env
      import('electron-devtools-installer')
        .then((mymodule) => {
          const installExtension = mymodule.default; // Default export
          installExtension(mymodule.VUEJS_DEVTOOLS) // replace param with the ext ID of your choice
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
        })
        .catch((err) => console.log('An error occurred: ', err));
  })
  .catch((err) => console.log('An error occurred: ', err));

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
ipcMain.on('take-screenshot', (event, arg) => {
  const dir = debug ? './screenshots' : '/data/screenshots';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const name = 'screenshot_' + new Date().toISOString();
  win.webContents.capturePage().then((image) => {
    fs.writeFile(`${dir}/${name}.png`, image.toPNG(), (err) => {
      if (err) {
        event.returnValue = false;
      } else {
        event.returnValue = true;
      }
    });
  });
});

const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 640,
    resizable: false,
    maximizable: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: true,
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false // keep timer running accurately when backgrounded
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Ensure window is shown cleanly
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

// Window control IPC handlers
ipcMain.on('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window:toggle-always-on-top', () => {
  if (!mainWindow) return false;
  const newState = !mainWindow.isAlwaysOnTop();
  mainWindow.setAlwaysOnTop(newState, 'screen-saver');
  return newState;
});

ipcMain.handle('window:get-always-on-top', () => {
  return mainWindow ? mainWindow.isAlwaysOnTop() : false;
});

ipcMain.on('notification:send', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({
      title: title || 'Tiger Pomodoro',
      body: body || "Time's up! Roar!",
      silent: false
    }).show();
  }
});

app.whenReady().then(() => {
  // Set AppUserModelId for Windows toast notifications
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.tigerpomodoro.deskbuddy');
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

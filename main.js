/**
 * ============================================================================
 * TIGER & FRIENDS POMODORO - ELECTRON MAIN PROCESS
 * ============================================================================
 * Manages the native desktop window lifecycle, frameless window controls,
 * inter-process communication (IPC) for Always-on-Top pinning, and native
 * desktop system notifications.
 */

const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');

// Keep global reference of the window to prevent garbage collection
let mainWindow = null;

/**
 * Creates the primary application desktop window.
 * Configured as a compact, frameless, transparent widget with custom title bar.
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 640,
    resizable: false,            // Fixed compact widget dimensions
    maximizable: false,          // Desk widget style (no fullscreen maximize)
    frame: false,                // Custom modern frameless window
    transparent: true,           // Enables rounded corners and drop shadows
    backgroundColor: '#00000000',// Fully transparent base background
    hasShadow: true,             // Native OS drop shadow
    alwaysOnTop: false,          // Can be toggled on/off by user via pin button
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Secure preload bridge
      nodeIntegration: false,                      // Security: disable node in renderer
      contextIsolation: true,                      // Security: isolate context
      backgroundThrottling: false                  // CRITICAL: prevents timer lag when backgrounded
    }
  });

  // Load the desktop UI
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Smooth appearance: only show window once DOM and styles are fully ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

// ----------------------------------------------------------------------------
// IPC (INTER-PROCESS COMMUNICATION) HANDLERS
// ----------------------------------------------------------------------------

/**
 * Minimizes the window to the taskbar.
 */
ipcMain.on('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

/**
 * Closes and terminates the application window.
 */
ipcMain.on('window:close', () => {
  if (mainWindow) mainWindow.close();
});

/**
 * Toggles the "Always on Top" floating mode.
 * Returns the new boolean state back to the renderer so the UI pin icon updates.
 */
ipcMain.handle('window:toggle-always-on-top', () => {
  if (!mainWindow) return false;
  const newState = !mainWindow.isAlwaysOnTop();
  // 'screen-saver' level ensures it floats cleanly above fullscreen or regular windows
  mainWindow.setAlwaysOnTop(newState, 'screen-saver');
  return newState;
});

/**
 * Queries current "Always on Top" status on app startup.
 */
ipcMain.handle('window:get-always-on-top', () => {
  return mainWindow ? mainWindow.isAlwaysOnTop() : false;
});

/**
 * Displays a native desktop toast notification.
 */
ipcMain.on('notification:send', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({
      title: title || 'Tiger Pomodoro',
      body: body || "Time's up! Roar!",
      silent: false
    }).show();
  }
});

// ----------------------------------------------------------------------------
// APPLICATION LIFECYCLE
// ----------------------------------------------------------------------------

app.whenReady().then(() => {
  // Set AppUserModelId for Windows toast notifications to display proper app name
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.tigerpomodoro.deskbuddy');
  }

  createWindow();

  // macOS dock icon re-activation
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed (except on macOS where apps commonly stay open)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

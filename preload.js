/**
 * ============================================================================
 * PRELOAD SCRIPT (Context Bridge)
 * ============================================================================
 * Securely exposes specific Electron IPC methods to the renderer window
 * without enabling nodeIntegration, keeping the app safe from XSS risks.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  closeWindow: () => ipcRenderer.send('window:close'),

  // Always on top pinning
  toggleAlwaysOnTop: () => ipcRenderer.invoke('window:toggle-always-on-top'),
  getAlwaysOnTop: () => ipcRenderer.invoke('window:get-always-on-top'),

  // Native OS desktop notifications
  sendNotification: (title, body) => ipcRenderer.send('notification:send', { title, body })
});

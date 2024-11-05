const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('startupControl', {
    enable: () => ipcRenderer.invoke('toggle-startup', true),
    disable: () => ipcRenderer.invoke('toggle-startup', false),
    getStartupStatus: () => ipcRenderer.invoke('get-startup-status'),
    toggleStartup: (shouldEnable) => ipcRenderer.send('toggle-startup', shouldEnable)
});

contextBridge.exposeInMainWorld('electronAPI', {
    openSettingsWindow: () => ipcRenderer.send('open-settings-window'),
    send: (channel, data) => ipcRenderer.send(channel, data),
    openInElectronOrBrowser: (url) => ipcRenderer.invoke('openInElectronOrBrowser', url),
    toggleDefaultBrowser: (shouldUseDefaultBrowser) => ipcRenderer.send('toggle-default-browser', shouldUseDefaultBrowser)
});

contextBridge.exposeInMainWorld('api', {
    openInElectronWindow: (url) => ipcRenderer.invoke('openInElectronOrBrowser', url),
    openInDefaultBrowser: (url) => ipcRenderer.send('open-in-default-browser', url)  // 新しいメソッドを追加
});

contextBridge.exposeInMainWorld('appLauncher', {
    launchApp: (appName) => ipcRenderer.send('launch-app', appName)
});

console.log("preload.js has been loaded successfully and startupControl is exposed.");
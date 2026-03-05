const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pvApi', {
  isElectron: true,
  selectDataFolder: () => ipcRenderer.invoke('select-data-folder'),
  getDataPath: () => ipcRenderer.invoke('get-data-path'),
  readData: () => ipcRenderer.invoke('read-data'),
  writeData: (payload) => ipcRenderer.invoke('write-data', payload),
  savePdf: (relativePath, base64DataUrl) => ipcRenderer.invoke('save-pdf', relativePath, base64DataUrl),
  getPdfFileUrl: (relativePath) => ipcRenderer.invoke('get-pdf-file-url', relativePath),
  openPdfExternal: (relativePath) => ipcRenderer.invoke('open-pdf-external', relativePath),
  pdfExists: (relativePath) => ipcRenderer.invoke('pdf-exists', relativePath),
});

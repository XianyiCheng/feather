const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("__electronAPI", {
  saveCredentials: (creds) => ipcRenderer.invoke("save-credentials", creds),
});

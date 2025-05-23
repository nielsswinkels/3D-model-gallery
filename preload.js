// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('modelAPI', {
  getModels: (modelsPath) => {
    if (!fs.existsSync(modelsPath)) return [];
    return fs.readdirSync(modelsPath)
      .filter(f => f.endsWith('.glb') || f.endsWith('.gltf'))
      .map(f => path.join(modelsPath, f));
  },
});

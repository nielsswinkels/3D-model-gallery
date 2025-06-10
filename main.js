const path = require('path');
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      autoHideMenuBar: true,
      sandbox: false // ← this is the fix
    }
  });
  win.setMenuBarVisibility(false);

  // const modelsPath = path.join(process.resourcesPath, 'models'); // in production
  // In dev, fallback to __dirname
  const actualModelsPath = !app.isPackaged
    ? path.join(__dirname, 'models')
    : path.join(path.dirname(process.execPath), 'models');

  // Pass the path via query string or IPC
  win.loadFile('index.html', {
    query: { modelsPath: actualModelsPath }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

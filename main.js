const { app, BrowserWindow, ipcMain } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // allows ipcRenderer and require in HTML
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
});

// Listen for popup request from renderer and bring to front
ipcMain.on('bring-to-front', () => {
  if (win) {
    win.show();
    win.setAlwaysOnTop(true); // Force window to top
    win.focus();

    // Remove always-on-top after a few seconds
    setTimeout(() => {
      win.setAlwaysOnTop(false);
    }, 3000);
  }
});


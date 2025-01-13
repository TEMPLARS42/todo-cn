const { app, BrowserWindow } = require('electron');
const path = require('path');

// Create a function to create a browser window
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Optional
            nodeIntegration: true
        },
        icon: path.join(__dirname, 'assets/fav.png')
    });

    win.loadURL('http://localhost:5173'); // Your MERN app URL (React server)

    // Open the DevTools automatically to view console logs
    // win.webContents.openDevTools();
}

// Electron app is ready
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

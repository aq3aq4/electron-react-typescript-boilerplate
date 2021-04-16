import * as isDev from 'electron-is-dev';
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

import PingController from '../src/electron/PingController';

let mainWindow: BrowserWindow;


function createWindow() {
    mainWindow = new BrowserWindow({
        center: true,
        resizable: true,
        fullscreen: false,
        fullscreenable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    
    console.log("__dirname is " + __dirname);
    if(isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
    }

    // const startUrl = process.env.ELECTRON_START_URL || url.format({
    //     pathname: path.join(__dirname, '/../build/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    //   });
    
    // mainWindow.loadURL(startUrl);

    mainWindow.on('close', () => {
        mainWindow = undefined!;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if(mainWindow === null) createWindow();
});


app.whenReady().then(() => {
    const pingCon = new PingController();
    pingCon.ipcRegiste();
})
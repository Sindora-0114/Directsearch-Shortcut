console.log("main.js has started executing from", __dirname);

const { app, BrowserWindow, ipcMain, Menu, shell, globalShortcut, dialog } = require('electron');
const { autoUpdater } = require('electron-updater'); 
const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const { exec } = require('child_process');
let useDefaultBrowser = false;

const GITHUB_TOKEN = process.env.GH_TOKEN; 
let serverProcess;

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";  

const AutoLaunch = require('auto-launch');
const appAutoLauncher = new AutoLaunch({
    name: 'Directsearch-Shortcut',
    path: app.getPath('exe')
});

// スタートアップ設定の取得と切り替え
ipcMain.handle('get-startup-status', async () => {
    return await appAutoLauncher.isEnabled();
});
ipcMain.on('toggle-startup', async (event, shouldEnable) => {
    if (shouldEnable) {
        try {
            await appAutoLauncher.enable();
            console.log("スタートアップ設定が有効になりました");
        } catch (err) {
            console.error("スタートアップ設定の有効化に失敗しました:", err);
        }
    } else {
        try {
            await appAutoLauncher.disable();
            console.log("スタートアップ設定が無効になりました");
        } catch (err) {
            console.error("スタートアップ設定の無効化に失敗しました:", err);
        }
    }
});

// Express サーバーの設定
const serverApp = express();
serverApp.use(express.json());
serverApp.use(express.static(path.join(__dirname, 'public')));

// サーバーの起動と再起動
const PORT = process.env.PORT || 3000;
function startServer() {
    serverProcess = serverApp.listen(PORT, () => {
        console.log(`Express server is running on port ${PORT}`);
    });
}
function restartServer() {
    if (serverProcess) {
        serverProcess.close(() => {
            console.log('サーバーを再起動します...');
            startServer();
        });
    } else {
        startServer();
    }
}

// 設定変更を受け取るリスナー
ipcMain.on('toggle-default-browser', (event, shouldUseDefaultBrowser) => {
    useDefaultBrowser = shouldUseDefaultBrowser;
    console.log(`規定のブラウザで開く設定を受信しました: ${useDefaultBrowser}`);
    // デバッグ用に現在の設定を常に出力する
    console.log(`Updated useDefaultBrowser setting: ${useDefaultBrowser}`);
});


// 検索実行時にURLを開く関数
ipcMain.handle('openInElectronOrBrowser', (event, url) => {
    console.log(`openInElectronOrBrowser called with URL: ${url}`);
    console.log(`Current setting (useDefaultBrowser): ${useDefaultBrowser}`);

    if (useDefaultBrowser) {
        console.log(`Opening URL in default browser: ${url}`);
        shell.openExternal(url); // 規定のブラウザで開く
    } else {
        console.log(`Opening URL in Electron window: ${url}`);
        const searchWindow = new BrowserWindow({ width: 800, height: 600 });
        searchWindow.loadURL(url); // Electronウィンドウで開く
    }
});

// `open-in-default-browser`イベントのリスナー
ipcMain.on('open-in-default-browser', (event, url) => {
    console.log(`Opening URL in default browser directly: ${url}`);
    shell.openExternal(url);  // 規定のブラウザで直接開く
});

// 各アプリケーションのパス
const appPaths = {
    "Wallpaper Engine": "C:\\Path\\To\\Wallpaper Engine\\wallpaper32.exe",
    "Riot": "C:\\Path\\To\\Riot\\RiotClientServices.exe",
    "Discord": "C:\\Path\\To\\Discord\\Discord.exe",
    "Steam": "C:\\Path\\To\\Steam\\Steam.exe",
    "Epic Games Launcher": "C:\\Path\\To\\Epic Games\\Launcher\\Portal\\Binaries\\Win64\\EpicGamesLauncher.exe"
};

// アプリ起動イベント
ipcMain.on('launch-app', (event, appName) => {
    const appPath = appPaths[appName];
    if (appPath) {
        exec(`"${appPath}"`, (error) => {
            if (error) {
                console.error(`Failed to launch ${appName}:`, error);
            } else {
                console.log(`${appName} launched successfully.`);
            }
        });
    } else {
        console.error(`App path for ${appName} is not defined.`);
    }
});

// メインウィンドウの作成
function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, '/preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        },
        icon: path.join(__dirname, 'public/img/サイトアイコン_メイン.ico')
    });
    win.loadFile(path.join(__dirname, 'public/html/index.html'));

    /* win.webContents.openDevTools(); */

   /*  ipcMain.on('open-settings-window', createSettingsWindow); */
}

/* app.whenReady().then(createWindow); */
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// settings.htmlを開く関数
function createSettingsWindow() {
    const settingsWindow = new BrowserWindow({
        width: 600,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });
    settingsWindow.loadFile(path.join(__dirname, 'public/html/settings.html')); // パスを確認
}

// `open-settings-window`イベントをリッスンして`settings.html`を開く
ipcMain.on('open-settings-window', createSettingsWindow);

// アップデートチェックの関数
function checkForUpdates() {
    autoUpdater.checkForUpdatesAndNotify();
    autoUpdater.on('update-available', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'アップデートの確認',
            message: '新しいバージョンがあります。ダウンロードしますか？',
            buttons: ['今すぐダウンロード', '後で']
        }).then(result => {
            if (result.response === 0) { 
                autoUpdater.downloadUpdate();
            }
        });
    });

    autoUpdater.on('update-not-available', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'アップデートの確認',
            message: '最新バージョンを使用しています。',
        });
    });

    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'アップデート準備完了',
            message: 'アプリケーションを再起動してアップデートを適用します。',
            buttons: ['今すぐ再起動', '後で']
        }).then(result => {
            if (result.response === 0) { 
                autoUpdater.quitAndInstall();
            }
        });
    });
}

// メニュー設定
const menuTemplate = [
    {
        label: 'サポート',
        submenu: [
            {
                label: 'Discord',
                click: async () => {
                    await shell.openExternal('https://discord.gg/S34dMZbj');
                }
            },
            {
                label: `Version情報: ${app.getVersion()}`,
                enabled: false
            },
            {
                label: 'システム状態:β版',
                enabled: false
            },
            {
                label: 'License:有り',
                enabled: false
            }
        ],
    },
    {
        label: 'アップデート',
        click: () => {
            checkForUpdates();
        }
    },

    {
        label:'最終更新日時:',
        enabled:false
        
    }
    /* { role: 'editMenu', label: 'Edit' },
    { role: 'viewMenu', label: 'View' } */
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// アプリの起動とショートカット設定
app.whenReady().then(() => {
    globalShortcut.register('Control+R', () => {
        console.log('Ctrl+R を押してサーバーを再起動しました');
        restartServer();
    });
    
    createWindow();
    startServer();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (serverProcess) serverProcess.close();
        app.quit();
    }
});

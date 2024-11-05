const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

const appPaths = {
    wallpaper_engine: '"C:\\Program Files (x86)\\Steam\\steamapps\\common\\wallpaper_engine\\wallpaper32.exe"',
    riot: '"C:\\Riot Games\\Riot Client\\RiotClientServices.exe"',
    discord: '"C:\\Users\\YourUsername\\AppData\\Local\\Discord\\Update.exe" --processStart Discord.exe',
    steam: '"C:\\Program Files (x86)\\Steam\\Steam.exe"',
    epic_games_launcher: '"C:\\Program Files (x86)\\Epic Games\\Launcher\\Portal\\Binaries\\Win64\\EpicGamesLauncher.exe"',
};

app.get('/launch', (req, res) => {
    const appName = req.query.app;
    const appPath = appPaths[appName];

    if (appPath) {
        exec(appPath, (error) => {
            if (error) {
                console.error(`${appName} の起動に失敗しました: ${error.message}`);
                return res.json({ success: false, message: `${appName} の起動に失敗しました` });
            }
            console.log(`${appName} を起動しました`);
            res.json({ success: true, message: `${appName} を起動しました` });
        });
    } else {
        res.json({ success: false, message: `アプリケーション ${appName} が見つかりません` });
    }
});

app.listen(port, () => {
    console.log(`App launcher listening at http://localhost:${port}`);
});

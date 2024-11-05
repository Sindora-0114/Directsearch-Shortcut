const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config(); // .envファイルから環境変数をロード

const app = express();

// 'public' フォルダを静的ファイルの提供ディレクトリとして設定
app.use(express.static(path.join(__dirname, 'public')));

// JSONリクエストボディを解析できるように設定
app.use(express.json());

// ルート ('/') にアクセスがあった場合に、public/html/index.html を提供
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// Google Safe Browsing APIキーとGitHubトークンを環境変数から取得
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GITHUB_TOKEN = process.env.GH_TOKEN; // GitHubトークンを追加

// URLチェッカーのエンドポイントを設定
app.post('/check-url', async (req, res) => {
    const { url } = req.body;

    try {
        const response = await axios.post(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_API_KEY}`, {
            client: {
                clientId: "yourcompany",
                clientVersion: "1.0.0"
            },
            threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url }]
            }
        });

        if (response.data.matches) {
            res.json({ safe: false, threats: response.data.matches });
        } else {
            res.json({ safe: true });
        }
    } catch (error) {
        console.error('Error checking URL:', error);
        res.status(500).json({ error: 'Error checking URL' });
    }
});

// サーバーの起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

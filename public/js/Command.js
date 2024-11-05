// フォームの送信イベントを監視
document.getElementById('youtubeForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // 通常のフォーム送信を防止

    const searchInput = document.getElementById('YouTube').value.trim(); // 検索ボックスの値を取得し、前後の空白を削除

    // コマンド入力を判定 (大文字小文字を無視して判定)
    if (searchInput.toLowerCase() === '/command/lists') {
        // コマンドリストのリクエストをサーバーに送信
        try {
            const response = await fetch('http://localhost:3000/command-lists'); // localhostサーバーにリクエスト
            const data = await response.json();
            alert(data.message); // サーバーからのレスポンスをアラートで表示
        } catch (error) {
            console.error('Error fetching command lists:', error);
        }
    } else if (searchInput.toLowerCase() === '/command/playlists') {
        // 正しいコマンドの場合、YouTubeプレイリストに移動
        window.open('https://www.youtube.com/feed/playlists', '_blank'); // プレイリストページにリダイレクト
    } else if (searchInput.toLowerCase() === '/command/history') {
        // YouTube履歴ページに移動
        window.open('https://www.youtube.com/feed/history', '_blank'); // 履歴ページにリダイレクト
    } else {
        // 通常のYouTube検索
        const searchUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(searchInput);
        window.open(searchUrl, '_blank'); // 新しいタブで開く
    }
});

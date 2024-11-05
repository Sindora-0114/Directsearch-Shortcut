// Commandグループ
const commandGroups = {
    YouTube: ['/Command/YouTube/history', '/Command/YouTube/playlists', '/Command/YouTube/subscriptions', '/Command/YouTube/short', '/Command/YouTube/goodlist'], 
    YouTubeMusic: ['/Command/Music/goodlist', '/Command/Music/library', '/Command/Music/history', '/Command/Music/home'], 
    Google: ['/Command/Google/history', '/Command/Google/extensions', '/Command/Google/Secret', '/Command/Google/gmail', '/Command/Google/settings']
};

// コマンドリスト
const commandList = {
    '/Command/YouTube/history': 'https://www.youtube.com/feed/history',
    '/Command/YouTube/playlists': 'https://www.youtube.com/feed/playlists',
    '/Command/YouTube/subscriptions': 'https://www.youtube.com/feed/subscriptions',
    '/Command/YouTube/short': 'https://www.youtube.com/shorts/',
    '/Command/YouTube/goodlist': 'https://www.youtube.com/playlist?list=WL',

    '/Command/Music/goodlist': 'https://music.youtube.com/library/playlists',
    '/Command/Music/library': 'https://music.youtube.com/library',
    '/Command/Music/history': 'https://music.youtube.com/feed/history',
    '/Command/Music/home': 'https://music.youtube.com/',

    '/Command/Google/history': 'chrome://history/',
    '/Command/Google/extensions': 'chrome://extensions/',
    '/Command/Google/gmail': 'https://mail.google.com/mail/',
    '/Command/Google/settings': 'chrome://settings'
};

function showError(message) {
    alert(message);
}

// フォームのSubmit時にコマンドを処理する関数
function handleCommandSubmit(formId, inputId, validCommands) {
    const formElement = document.getElementById(formId);
    const inputElement = document.getElementById(inputId);

    formElement.addEventListener('submit', function(event) {
        const input = inputElement.value.trim();

        // "/Command/"で始まる場合はコマンドの判定を行う
        if (input.startsWith('/Command/')) {
            event.preventDefault(); // 通常のフォーム送信を防ぐ

            // コマンドが有効かどうかを確認
            if (commandList[input]) {
                // 入力されたコマンドが該当のサービスのものかを確認
                if (validCommands.includes(input)) {
                    window.open(commandList[input], '_blank'); // コマンドのページを新しいタブで開く
                    inputElement.value = ''; // フィールドをクリア
                } else {
                    showError(`このコマンドは、この検索ボックスでは使用できません。`);
                    inputElement.value = ''; // フィールドをクリア
                }
            } else {
                showError(`無効なコマンドです。コマンドを確認してください。`);
                inputElement.value = ''; // フィールドをクリア
            }
        }
        // 通常の検索機能を使用する場合
        else {
            // 何もしない場合はフォームが通常通り送信される（デフォルトの検索機能を利用）
        }
    });
}

// YouTubeのコマンドを処理
handleCommandSubmit('youtubeForm', 'YouTube', commandGroups.YouTube);

// YouTubeMusicのコマンドを処理
handleCommandSubmit('musicForm', 'YouTubeMusic', commandGroups.YouTubeMusic);

// Googleのコマンドを処理
handleCommandSubmit('googleForm', 'search', commandGroups.Google);

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 初期状態を取得してチェックボックスに反映
        const isEnabled = await window.startupControl.getStartupStatus();
        document.getElementById('startupToggle').checked = isEnabled;
    } catch (error) {
        console.error('スタートアップ設定の取得に失敗しました:', error);
    }

    // チェックボックスの変更でスタートアップのON/OFFを切り替え
    document.getElementById('startupToggle').addEventListener('change', (event) => {
        window.startupControl.toggleStartup(event.target.checked);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('defaultBrowserToggle');
    const savedSetting = localStorage.getItem('openInDefaultBrowser') === 'true';
    toggle.checked = savedSetting;

    toggle.addEventListener('change', (e) => {
        const isDefault = e.target.checked;
        localStorage.setItem('openInDefaultBrowser', isDefault);
        console.log(`Settings updated to open in default browser: ${isDefault}`);
        window.electronAPI.send('toggle-default-browser', isDefault); // イベント送信
    });
});

document.querySelectorAll('.search-form').forEach(form => {
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // フォームの通常送信を無効化

        const openInDefaultBrowser = localStorage.getItem('openInDefaultBrowser') === 'true';
        const actionUrl = event.target.action + '?' + new URLSearchParams(new FormData(event.target)).toString();

        console.log(`Submitting form with openInDefaultBrowser set to: ${openInDefaultBrowser}`);
        console.log(`Action URL: ${actionUrl}`);

        if (openInDefaultBrowser) {
            // 規定のブラウザで開く
            window.api.openInDefaultBrowser(actionUrl);  // mainプロセスにメッセージを送信
        } else {
            // Electronウィンドウで開く
            window.api.openInElectronWindow(actionUrl);
            console.log('Opening URL in Electron window via main process:', actionUrl);
        }
    });
});

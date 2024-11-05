document.querySelectorAll('.search-form').forEach(form => {
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // フォームの通常送信を無効化
        const actionUrl = event.target.action + '?' + new URLSearchParams(new FormData(event.target)).toString();
        window.electronAPI.openInElectronOrBrowser(actionUrl); // URL送信
    });
});
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    nav.classList.toggle('open');
});

async function checkForNewsUpdates() {
    try {
        // `News.html` ファイルを非同期で取得
        const response = await fetch('../html/News.html');
        const text = await response.text();
        
        // 新着情報があるかを確認
        const hasNewContent = text.includes('data-new="true"');
        
        // 新着情報があれば新着マークを表示
        const newsMark = document.getElementById('news-new-mark');
        if (hasNewContent) {
            newsMark.style.display = 'inline';
        } else {
            newsMark.style.display = 'none';
        }
    } catch (error) {
        console.error('Newsの更新確認中にエラーが発生しました:', error);
    }
}

// ページ読み込み時にチェック
document.addEventListener('DOMContentLoaded', checkForNewsUpdates);


document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const service = document.getElementById('serviceSelect').value;
    const keyword = document.getElementById('searchKeyword').value;

    let url;
    switch (service) {
      case 'amazon':
        url = `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&i=instant-video`;
        break;
      case 'unext':
        url = `https://video.unext.jp/freeword?query=${encodeURIComponent(keyword)}`;
        break;
      case 'hulu':
        url = `https://www.hulu.jp/search?q=${encodeURIComponent(keyword)}`;
        break;
      case 'netflix':
        url = `https://www.netflix.com/search?q=${encodeURIComponent(keyword)}`;
        break;
      case 'dmm':
        url = `https://tv.dmm.com/vod/list/?keyword=${encodeURIComponent(keyword)}`;
        break;
    }

    if (url) {
        window.open(url, '_blank'); 
    }
  });
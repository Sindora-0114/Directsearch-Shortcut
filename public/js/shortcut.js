// ショートカットの最大登録数
const MAX_SHORTCUT_COUNT = 6;

// ショートカットリスト
let shortcutList = [];

// ショートカット検索処理
// function searchShortcuts(searchText) {
//   const filteredShortcutList = shortcutList.filter(shortcut => {
//     return shortcut.name.toLowerCase().includes(searchText.toLowerCase()) ||
//       shortcut.url.toLowerCase().includes(searchText.toLowerCase());
//   });
//
//   displayShortcuts(filteredShortcutList);
// }

document.getElementById('registerButton').addEventListener('click', registerShortcut);

// ショートカット登録処理
function registerShortcut() {
  // 登録済みショートカット数を取得
  const currentShortcutCount = shortcutList.length;

  // 最大登録数を超えている場合はエラーを表示
  if (currentShortcutCount >= MAX_SHORTCUT_COUNT) {
    window.open('../html/error.html', '_blank', 'width=800,height=400');
    return;
  }

  // 新しいウィンドウを開く
  const shortcutRegistrationWindow = window.open(
    '../html/shortcut_registration.html',
    '_blank',
    'width=800,height=400'
  );

  // ウィンドウのサイズを固定する
  shortcutRegistrationWindow.resizeTo(800, 300);

  // 子ウィンドウからのメッセージを受け取るリスナー
  window.addEventListener('message', function(event) {
    if (event.data.shortcut) {
      // 同じ名前かつ同じURLのショートカットが存在するかどうかを確認
      const existingShortcutId =
        'shortcut-' + event.data.shortcut.name + '-' + event.data.shortcut.url;
      const existingShortcut = JSON.parse(localStorage.getItem(existingShortcutId));

      if (!existingShortcut) {
        // 存在しない場合は追加
        shortcutList.push(event.data.shortcut);

        try {
          localStorage.setItem(existingShortcutId, JSON.stringify(event.data.shortcut));
          console.info('ショートカットを登録しました:', event.data.shortcut);
        } catch (error) {
          console.error('ローカルストレージへの保存に失敗しました:', error);
          alert('ショートカットの保存に失敗しました。');
        }
      } else {
        // 存在する場合は更新
        const existingShortcutIndex = shortcutList.indexOf(existingShortcut);
        shortcutList[existingShortcutIndex] = event.data.shortcut;

        try {
          localStorage.setItem(existingShortcutId, JSON.stringify(event.data.shortcut));
          console.info('既存のショートカットを更新しました:', event.data.shortcut);
        } catch (error) {
          console.error('ローカルストレージへの保存に失敗しました:', error);
          alert('ショートカットの保存に失敗しました。');
        }
      }

      // ショートカットリストを更新
      displayShortcuts();
    }
  });
}

// ショートカットリスト表示処理
function displayShortcuts() {
  const shortcutListContainer = document.getElementById('shortcutList');
  shortcutListContainer.innerHTML = '';

  // 作成したショートカットリストをDOMに追加
  shortcutList.forEach(shortcut => {
    const shortcutItem = document.createElement('li');
    const shortcutLink = createShortcutLink(shortcut);
    const deleteButton = createDeleteButton(shortcut);
    shortcutItem.appendChild(shortcutLink);
    shortcutItem.appendChild(deleteButton);
    shortcutListContainer.appendChild(shortcutItem);
  });
}

// ページが読み込まれた際にlocalStorageからショートカットを読み込んで表示する
window.addEventListener('DOMContentLoaded', function() {
  loadShortcutsFromLocalStorage();
  displayShortcuts();
});

// ローカルストレージからショートカットを読み込む処理
function loadShortcutsFromLocalStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('shortcut-')) {
      const shortcut = JSON.parse(localStorage.getItem(key));
      shortcutList.push(shortcut);
    }
  }
}


// ショートカットリンク作成関数
function createShortcutLink(shortcut) {
  const linkElement = document.createElement('a');
  linkElement.href = shortcut.url;
  linkElement.textContent = shortcut.name;
  return linkElement;
}

// 削除ボタン作成関数
function createDeleteButton(shortcut) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = '削除';
  deleteButton.onclick = function() {
    deleteShortcut(shortcut);
  };

  // CSS クラスを設定
  deleteButton.classList.add('delete-button'); // 例

  // CSS
  deleteButton.style.marginLeft = '20px'
  deleteButton.style.border = '20px'
  deleteButton.style.borderRadius = '30px'


  return deleteButton;
}


// ショートカット削除処理
function deleteShortcut(shortcut) {
  // ショートカットリストから削除
  const index = shortcutList.findIndex(item => item.name === shortcut.name && item.url === shortcut.url);
  if (index !== -1) {
    shortcutList.splice(index, 1);
    console.info('ショートカットを削除しました:', shortcut);

    // ローカルストレージから削除
    removeShortcutFromLocalStorage(shortcut);

    // リストを更新
    displayShortcuts();
  } else {
    console.warn('削除しようとしたショートカットが見つかりません:', shortcut);
  }
}

// ローカルストレージからショートカットを削除
function removeShortcutFromLocalStorage(shortcut) {
  const existingShortcutId =
    'shortcut-' + shortcut.name + '-' + shortcut.url;

  try {
    localStorage.removeItem(existingShortcutId);
    console.info('ローカルストレージからショートカットを削除しました:', shortcut);
  } catch (error) {
    console.error('ローカルストレージからの削除に失敗しました:', error);
    // 適切なエラー処理を行う
  }
}

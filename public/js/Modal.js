 // モーダルの要素を取得
 var modal = document.getElementById("appModal");

 // モーダルを開くボタンを取得
 var btn = document.getElementById("app");

 // 閉じるボタンを取得
 var span = document.getElementsByClassName("close")[0];

 // ボタンがクリックされたときにモーダルを開く
 btn.onclick = function() {
     modal.style.display = "block";
 }

 // ×ボタンがクリックされたときにモーダルを閉じる
 span.onclick = function() {
     modal.style.display = "none";
 }

 // モーダルの外側をクリックしたときにモーダルを閉じる
 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
     }
    }
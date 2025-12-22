console.log('inventory.js loaded');

const GAS_URL =
  'https://script.google.com/macros/s/AKfycbx3IWyusB3uBFehNBDbWZIQQ8dPN4cqQbOji8qRRBQmz8K4eWQeYTAc50qm8UJ2vBwB/exec';

let componentData = [];

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  loadComponentList();

  setupAutocomplete('subtractName', 'autocompleteListSubtract');
  setupAutocomplete('addName', 'autocompleteListAdd');

  document.getElementById('subtractForm').onsubmit = e => {
    e.preventDefault();
    sendUpdateRequest('subtract', subtractName.value, subtractQuantity.value);
  };

  document.getElementById('addForm').onsubmit = e => {
    e.preventDefault();
    sendUpdateRequest('add', addName.value, addQuantity.value);
  };
});

// 一覧取得（JSONP）
function loadComponentList() {
  const cb = 'list_' + Date.now();

  window[cb] = data => {
    componentData = data;
    renderTable(data);
    delete window[cb];
    script.remove();
  };

  const script = document.createElement('script');
  script.src = `${GAS_URL}?callback=${cb}`;
  document.body.appendChild(script);
}

// テーブル描画
function renderTable(data) {
  const tbody = document.querySelector('#componentTable tbody');
  tbody.innerHTML = '';

  data.forEach(item => {
    const tr = tbody.insertRow();
    tr.insertCell().textContent = item.Category || '-';
    tr.insertCell().textContent = item.Name || '-';
    tr.insertCell().textContent = item.Value || '-';
    tr.insertCell().textContent = item['Shape(SMD/THD)'] || '-';

    const q = tr.insertCell();
    q.textContent = item.Quantity;
    if (item.Quantity === 0) q.style.color = 'red';

    const url = tr.insertCell();
    if (item.URL) {
      const a = document.createElement('a');
      a.href = item.URL;
      a.textContent = 'Link';
      a.target = '_blank';
      url.appendChild(a);
    } else {
      url.textContent = '-';
    }
  });
}

// 在庫更新
function sendUpdateRequest(action, name, quantity) {
  const msg = document.getElementById('messageArea');
  msg.textContent = '処理中...';

  const cb = 'update_' + Date.now();

  window[cb] = res => {
    msg.textContent = res.message;
    if (res.success) loadComponentList();
    delete window[cb];
    script.remove();
  };

  const script = document.createElement('script');
  script.src =
    `${GAS_URL}?callback=${cb}` +
    `&action=${action}&name=${encodeURIComponent(name)}&quantity=${quantity}`;
  document.body.appendChild(script);
}

// 検索補助（サジェスト）
function setupAutocomplete(inputId, listId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  input.addEventListener('input', () => {
    list.innerHTML = '';
    const q = input.value.toLowerCase();
    if (!q) return;

    componentData
      .filter(i => i.Name && i.Name.toLowerCase().includes(q))
      .slice(0, 10)
      .forEach(i => {
        const d = document.createElement('div');
        d.textContent = i.Name;
        d.onclick = () => {
          input.value = i.Name;
          list.innerHTML = '';
        };
        list.appendChild(d);
      });
  });
}

// モーダル
function openModal(id) {
  document.getElementById(id).style.display = 'block';
}
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

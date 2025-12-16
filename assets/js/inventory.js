console.log('inventory.js loaded');

// ===== 設定 =====
const GAS_URL =
  'https://script.google.com/macros/s/AKfycbxit-tYoneKhrh6lVvIveavBM0WMLsVshJaeIH7N1FXSVzlfV0Oy8UKdt3HsFG5R48H/exec';

let componentData = [];

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  loadComponentList();

  setupAutocomplete('subtractName', 'autocompleteListSubtract');
  setupAutocomplete('addName', 'autocompleteListAdd');

  document.getElementById('subtractForm').onsubmit = e => {
    e.preventDefault();
    sendUpdateRequest(
      'subtract',
      document.getElementById('subtractName').value,
      document.getElementById('subtractQuantity').value
    );
  };

  document.getElementById('addForm').onsubmit = e => {
    e.preventDefault();
    sendUpdateRequest(
      'add',
      document.getElementById('addName').value,
      document.getElementById('addQuantity').value
    );
  };
});

// ===== 一覧取得（JSONP）=====
function loadComponentList() {
  const cb = 'jsonp_list_' + Date.now();

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

// ===== 表描画 =====
function renderTable(data) {
  const tbody = document.querySelector('#componentTable tbody');
  tbody.innerHTML = '';

  if (!data || data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center;">データなし</td></tr>';
    return;
  }

  data.forEach(item => {
    const row = tbody.insertRow();

    row.insertCell().textContent = item.Category || '-';
    row.insertCell().textContent = item.Name || '-';
    row.insertCell().textContent = item.Value || '-';
    row.insertCell().textContent = item['Shape(SMD/THD)'] || '-';

    const q = row.insertCell();
    q.textContent = item.Quantity;
    if (item.Quantity === 0) {
      q.style.color = 'red';
      q.style.fontWeight = 'bold';
    }

    const url = row.insertCell();
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

// ===== 在庫更新（JSONP）=====
function sendUpdateRequest(action, name, quantity) {
  const msg = document.getElementById('messageArea');
  msg.textContent = '処理中...';
  msg.style.color = 'orange';

  const cb = 'jsonp_update_' + Date.now();

  window[cb] = result => {
    msg.textContent = result.message;
    msg.style.color = result.success ? 'green' : 'red';

    if (result.success) loadComponentList();

    delete window[cb];
    script.remove();
  };

  const url =
    `${GAS_URL}?callback=${cb}` +
    `&action=${encodeURIComponent(action)}` +
    `&name=${encodeURIComponent(name)}` +
    `&quantity=${encodeURIComponent(quantity)}`;

  const script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
}

// ===== オートコンプリート =====
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
        d.className = 'autocomplete-list-item';
        d.textContent = i.Name;
        d.onclick = () => {
          input.value = i.Name;
          list.innerHTML = '';
        };
        list.appendChild(d);
      });
  });

  input.addEventListener('blur', () => {
    setTimeout(() => (list.innerHTML = ''), 200);
  });
}

// ===== モーダル =====
function openModal(id) {
  document.getElementById(id).style.display = 'block';
}
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

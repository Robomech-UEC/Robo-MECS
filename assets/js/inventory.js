console.log('inventory.js loaded');

// ===== 設定 =====
const GAS_URL =
  'https://script.google.com/macros/s/AKfycbxit-tYoneKhrh6lVvIveavBM0WMLsVshJaeIH7N1FXSVzlfV0Oy8UKdt3HsFG5R48H/exec';

let componentData = [];

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  loadComponentList();

  document.getElementById('subtractForm').onsubmit = e => {
    e.preventDefault();
    sendUpdateRequest(
      'subtract',
      subtractName.value,
      subtractQuantity.value
    );
  };

  document.getElementById('addForm').onsubmit = e => {
    e.preventDefault();
    sendUpdateRequest(
      'add',
      addName.value,
      addQuantity.value
    );
  };

  // サジェスト設定
  setupAutocomplete(
    document.getElementById('subtractName'),
    document.getElementById('autocompleteListSubtract')
  );
  setupAutocomplete(
    document.getElementById('addName'),
    document.getElementById('autocompleteListAdd')
  );
});

// ===== 一覧取得(JSONP) =====
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

// ===== 在庫更新(JSONP) =====
function sendUpdateRequest(action, name, quantity) {
  const msg = document.getElementById('messageArea');
  msg.textContent = '処理中...';

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
function setupAutocomplete(input, list) {
  input.addEventListener('input', () => {
    const keyword = input.value.toLowerCase();
    list.innerHTML = '';

    if (!keyword) return;

    const names = [...new Set(componentData.map(c => c.Name))];

    names
      .filter(name => name && name.toLowerCase().includes(keyword))
      .slice(0, 10)
      .forEach(name => {
        const item = document.createElement('div');
        item.textContent = name;
        item.className = 'autocomplete-list-item';

        item.onclick = () => {
          input.value = name;
          list.innerHTML = '';
        };

        list.appendChild(item);
      });
  });

  document.addEventListener('click', e => {
    if (!list.contains(e.target) && e.target !== input) {
      list.innerHTML = '';
    }
  });
}

// ===== モーダル =====
function openModal(id) {
  document.getElementById(id).style.display = 'block';
}
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

console.log('inventory.js loaded');

// ===== 設定 =====
const GAS_URL =
  'https://script.google.com/macros/s/AKfycbzgO4x5xo4vEBe1NKnxkqHMT65PqSCFx6HBBXq5KtnNHWiIIVP95tOcTxhJESbUL21-/exec';

let componentData = [];

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  loadComponentList();

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

  const script = document.createElement('script');
  script.src =
    `${GAS_URL}?callback=${cb}` +
    `&action=${encodeURIComponent(action)}` +
    `&name=${encodeURIComponent(name)}` +
    `&quantity=${encodeURIComponent(quantity)}`;

  document.body.appendChild(script);
}

// ===== モーダル =====
function openModal(id) {
  document.getElementById(id).style.display = 'block';
}
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

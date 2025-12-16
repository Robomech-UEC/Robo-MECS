// ===== 設定 =====
const GAS_URL =
  'https://script.google.com/macros/s/AKfycbz2bdYi_k-RbdUuXzvly4QI1OAugs489jqGxe8ccSml1HtVe80mkscLa78_X8KxSq1h/exec';

let componentData = [];

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('inventory.js loaded');

    loadComponentList();
    setupAutocomplete('subtractName', 'autocompleteListSubtract');
    setupAutocomplete('addName', 'autocompleteListAdd');

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
});

// ===== データ取得 =====
async function loadComponentList() {
    const tbody = document.querySelector('#componentTable tbody');
    tbody.innerHTML = `<tr><td colspan="6">読み込み中...</td></tr>`;

    try {
        const res = await fetch(GAS_URL);
        componentData = await res.json();
        renderTable(componentData);
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="6" style="color:red;">取得失敗</td></tr>`;
        console.error(e);
    }
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
        q.textContent = item.Quantity ?? '-';
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

// ===== 在庫更新 =====
async function sendUpdateRequest(action, name, quantity) {
    const msg = document.getElementById('messageArea');
    msg.textContent = '処理中...';

    const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, name, quantity })
    });

    const result = await res.json();
    msg.textContent = result.message;

    if (result.success) loadComponentList();
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
            .filter(i => i.Name?.toLowerCase().includes(q))
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

// ===== モーダル =====
function openModal(id) {
    document.getElementById(id).style.display = 'block';
}
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

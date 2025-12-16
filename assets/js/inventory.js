console.log('inventory.js loaded');

const GAS_URL =
  'https://script.google.com/macros/s/AKfycbxit-tYoneKhrh6lVvIveavBM0WMLsVshJaeIH7N1FXSVzlfV0Oy8UKdt3HsFG5R48H/exec';

let componentData = [];

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
      a.ta

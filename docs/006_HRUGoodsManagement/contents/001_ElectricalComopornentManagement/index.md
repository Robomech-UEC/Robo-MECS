---
title: HRU-ElectricalCompornent
parent: 物品管理 ーGoodsManagement

nav_order: 10

author: 鎌田拓也
last_modified_at: true
state: notyet
---
# **物品管理システム**

Google スプレッドシートと連携し、在庫の確認、追加、使用が行えます。

<div class="container">
    <div class="controls">
        <button onclick="openModal('addModal')">部品を追加 (在庫増加)</button>
        <button onclick="openModal('subtractModal')">部品を使用 (在庫減算)</button>
    </div>

    <table id="componentTable" class="component-table">
        <thead>
            <tr>
                <th>種類 (Category)</th>
                <th>名称 (Name)</th>
                <th>値 (Value)</th>
                <th>実装 (Mount)</th>
                <th>**在庫数 (Quantity)**</th>
                <th>URL</th>
            </tr>
        </thead>
        <tbody>
            <tr><td colspan="6" style="text-align: center;">データを読み込み中です...</td></tr>
        </tbody>
    </table>
    <p id="messageArea" style="margin-top: 15px; font-weight: bold;"></p>

    <div id="subtractModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('subtractModal')">&times;</span>
            <h2>部品の使用 (在庫減算)</h2>
            <form id="subtractForm">
                <label for="subtractName">部品名 (Name):</label>
                <div class="input-container">
                    <input type="text" id="subtractName" name="name" required style="width: 100%; box-sizing: border-box; padding: 8px;">
                    <div id="autocompleteListSubtract" class="autocomplete-list"></div>
                </div>
                
                <label for="subtractQuantity" style="margin-top: 10px; display: block;">使用個数 (Quantity):</label>
                <input type="number" id="subtractQuantity" name="quantity" min="1" required style="width: 100%; box-sizing: border-box; padding: 8px;">
                
                <button type="submit" style="margin-top: 15px;">在庫を減らす</button>
            </form>
        </div>
    </div>

    <div id="addModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('addModal')">&times;</span>
            <h2>部品の追加 (在庫増加)</h2>
            <p>この機能は、既存部品の在庫数を増やすために使います。</p>

            <form id="addForm">
                <label for="addName">部品名 (Name):</label>
                <div class="input-container">
                    <input type="text" id="addName" name="name" required style="width: 100%; box-sizing: border-box; padding: 8px;">
                     <div id="autocompleteListAdd" class="autocomplete-list"></div>
                </div>

                <label for="addQuantity" style="margin-top: 10px; display: block;">追加個数 (Quantity):</label>
                <input type="number" id="addQuantity" name="quantity" min="1" required style="width: 100%; box-sizing: border-box; padding: 8px;">
                
                <button type="submit" style="margin-top: 15px; background-color: green;">在庫を追加する</button>
            </form>
        </div>
    </div>
</div>

<script>
    // ★★★ [重要] 手順 2 でコピーした「ウェブアプリの URL」を貼り付け（読み書き両用） ★★★
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbz2bdYi_k-RbdUuXzvly4QI1OAugs489jqGxe8ccSml1HtVe80mkscLa78_X8KxSq1h/exec'; 
    
    let componentData = [];

    // --- モーダル開閉関数などは省略 ---

    // --- 【loadComponentList: GASからJSONを取得】 ---
    /** 部品リストをGASから取得し、テーブルに表示する */
    async function loadComponentList() {
        document.getElementById('componentTable').getElementsByTagName('tbody')[0].innerHTML = 
            `<tr><td colspan="6" style="text-align: center;">データを読み込み中です... (GAS経由)</td></tr>`;
        try {
            // GETリクエストをGASに送信
            const response = await fetch(GAS_URL);
            if (!response.ok) throw new Error(`GASサーバー通信エラー: HTTPステータス ${response.status}`);
            
            componentData = await response.json();
            
            // GAS側で意図的にエラーを返した場合の処理 (デバッグ情報)
            if (componentData.error) {
                throw new Error(componentData.message);
            }

            renderTable(componentData);
            
        } catch (error) {
            document.getElementById('componentTable').getElementsByTagName('tbody')[0].innerHTML = 
                `<tr style="background-color: #fdd;"><td colspan="6" style="color: red; text-align: center;">データ取得エラー: ${error.message}</td></tr>`;
        }
    }

    // --- (renderTable および POST 処理関数は省略) ---
    function renderTable(data) {
        const tbody = document.getElementById('componentTable').getElementsByTagName('tbody')[0];
        tbody.innerHTML = ''; 
        
        if (data.length === 0) {
             tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">部品が登録されていません。</td></tr>`;
             return;
        }

        data.forEach(item => {
            const row = tbody.insertRow();
            
            row.insertCell().textContent = item.Category || '-';
            row.insertCell().textContent = item.Name || '-';
            row.insertCell().textContent = item.Value || '-';
            row.insertCell().textContent = item['Shape(SMD/THD)'] || '-';
            
            const quantityCell = row.insertCell();
            if (typeof item.Quantity === 'number') {
                quantityCell.textContent = item.Quantity;
                if (item.Quantity === 0) {
                    quantityCell.style.color = 'red';
                    quantityCell.style.fontWeight = 'bold';
                }
            } else {
                 quantityCell.textContent = '-';
            }
            
            const urlCell = row.insertCell();
            if (item.URL) {
                const link = document.createElement('a');
                link.href = item.URL;
                link.textContent = 'Link';
                link.target = '_blank';
                urlCell.appendChild(link);
            } else {
                urlCell.textContent = '-';
            }
        });
    }

    async function sendUpdateRequest(action, name, quantity) {
        const messageArea = document.getElementById('messageArea');
        messageArea.textContent = '処理中です...';
        messageArea.style.color = 'orange';

        try {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action, name, quantity }),
            });

            if (!response.ok) throw new Error('サーバーエラーが発生しました。');

            const result = await response.json();
            
            messageArea.textContent = result.message;
            messageArea.style.color = result.success ? 'green' : 'red';

            if (result.success) {
                loadComponentList();
                document.getElementById('subtractForm').reset();
                document.getElementById('addForm').reset();
                setTimeout(() => {
                    closeModal('subtractModal');
                    closeModal('addModal');
                }, 1000); 
            }

        } catch (error) {
            messageArea.textContent = `通信エラー: ${error.message}`;
            messageArea.style.color = 'red';
        }
    }
    
    // ... (フォーム処理とオートコンプリート処理は省略) ...
    document.getElementById('subtractForm').onsubmit = function(event) {
        event.preventDefault();
        const name = document.getElementById('subtractName').value.trim();
        const quantity = document.getElementById('subtractQuantity').value;
        if (name === '') {
            document.getElementById('messageArea').textContent = '部品名を入力してください。';
            document.getElementById('messageArea').style.color = 'red';
            return;
        }
        sendUpdateRequest('subtract', name, quantity);
    };

    document.getElementById('addForm').onsubmit = function(event) {
        event.preventDefault();
        const name = document.getElementById('addName').value.trim();
        const quantity = document.getElementById('addQuantity').value;
        if (name === '') {
            document.getElementById('messageArea').textContent = '部品名を入力してください。';
            document.getElementById('messageArea').style.color = 'red';
            return;
        }
        sendUpdateRequest('add', name, quantity);
    };

    function setupAutocomplete(inputId, listId) {
        const input = document.getElementById(inputId);
        const list = document.getElementById(listId);

        input.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            list.innerHTML = '';
            if (query.length < 1) return;

            const filtered = componentData.filter(item => 
                String(item.Name).toLowerCase().includes(query)
            );

            filtered.slice(0, 10).forEach(item => {
                const div = document.createElement('div');
                div.classList.add('autocomplete-list-item');
                div.textContent = item.Name;
                div.onclick = () => {
                    input.value = item.Name;
                    list.innerHTML = '';
                };
                list.appendChild(div);
            });
        });

        input.addEventListener('blur', function() {
            setTimeout(() => {
                list.innerHTML = '';
            }, 200);
        });
    }

    // 初期化
    document.addEventListener('DOMContentLoaded', () => {
        loadComponentList();
        setupAutocomplete('subtractName', 'autocompleteListSubtract');
        setupAutocomplete('addName', 'autocompleteListAdd');
    });

</script>
---
title: HRU-ElectricalCompornent
parent: 物品管理 ーGoodsManagement
nav_order: 10
author: 鎌田拓也
last_modified_at: true
state: active
---

# **物品管理システム**

Google スプレッドシートと連携し、  
部品の **在庫確認 / 追加 / 使用** が行えます。

---

<div class="container">

  <!-- 操作ボタン -->
  <div class="controls">
      <button onclick="openModal('addModal')">部品を追加（在庫増加）</button>
      <button onclick="openModal('subtractModal')">部品を使用（在庫減算）</button>
  </div>

  <!-- 一覧テーブル（縦スクロール） -->
  <div class="table-wrapper">
      <table id="componentTable" class="component-table">
          <thead>
              <tr>
                  <th>種類 (Category)</th>
                  <th>名称 (Name)</th>
                  <th>値 (Value)</th>
                  <th>実装 (Mount)</th>
                  <th>在庫数 (Quantity)</th>
                  <th>URL</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td colspan="6" style="text-align: center;">
                      データを読み込み中です...
                  </td>
              </tr>
          </tbody>
      </table>
  </div>

  <p id="messageArea" style="margin-top: 15px; font-weight: bold;"></p>

  <!-- 使用（減算）モーダル -->
  <div id="subtractModal" class="modal">
      <div class="modal-content">
          <span class="close" onclick="closeModal('subtractModal')">&times;</span>

          <h2>部品の使用（在庫減算）</h2>

          <form id="subtractForm">
              <label for="subtractName">部品名 (Name)</label>

              <div class="input-container">
                  <input
                      type="text"
                      id="subtractName"
                      required
                      autocomplete="off"
                  >
                  <div
                      id="autocompleteListSubtract"
                      class="autocomplete-list">
                  </div>
              </div>

              <label for="subtractQuantity" style="margin-top: 10px; display: block;">
                  使用個数 (Quantity)
              </label>

              <input
                  type="number"
                  id="subtractQuantity"
                  min="1"
                  required
              >

              <button type="submit" style="margin-top: 15px;">
                  在庫を減らす
              </button>
          </form>
      </div>
  </div>

  <!-- 追加（増加）モーダル -->
  <div id="addModal" class="modal">
      <div class="modal-content">
          <span class="close" onclick="closeModal('addModal')">&times;</span>

          <h2>部品の追加（在庫増加）</h2>

          <form id="addForm">
              <label for="addName">部品名 (Name)</label>

              <div class="input-container">
                  <input
                      type="text"
                      id="addName"
                      required
                      autocomplete="off"
                  >
                  <div
                      id="autocompleteListAdd"
                      class="autocomplete-list">
                  </div>
              </div>

              <label for="addQuantity" style="margin-top: 10px; display: block;">
                  追加個数 (Quantity)
              </label>

              <input
                  type="number"
                  id="addQuantity"
                  min="1"
                  required
              >

              <button
                  type="submit"
                  style="margin-top: 15px; background-color: green;">
                  在庫を追加する
              </button>
          </form>
      </div>
  </div>

</div>

<!-- JS 読み込み -->
<script src="{{ '/assets/js/inventory.js' | relative_url }}"></script>

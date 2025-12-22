---
title: HRU-ElectricalComponent
parent: 物品管理 ーGoodsManagement
nav_order: 10
author: 鎌田拓也
last_modified_at: true
state: notyet
---

# **物品管理システム**

Google スプレッドシートと連携し、  
在庫の確認・追加・使用が行えます。

<div class="container">

  <div class="controls">
    <button onclick="openModal('addModal')">部品を追加 (在庫増加)</button>
    <button onclick="openModal('subtractModal')">部品を使用 (在庫減算)</button>
  </div>

  <!-- ★ テーブルだけスクロールさせる -->
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
          <td colspan="6" style="text-align:center;">
            データを読み込み中です...
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <p id="messageArea" style="margin-top: 10px; font-weight: bold;"></p>

  <!-- 在庫減算 -->
  <div id="subtractModal" class="modal">
    <div class="modal-content">
      <span class="close" onclick="closeModal('subtractModal')">&times;</span>
      <h2>部品の使用 (在庫減算)</h2>

      <form id="subtractForm">
        <label>部品名 (Name)</label>
        <div class="input-container">
          <input type="text" id="subtractName" required>
          <div id="autocompleteListSubtract" class="autocomplete-list"></div>
        </div>

        <label>使用個数 (Quantity)</label>
        <input type="number" id="subtractQuantity" min="1" required>

        <button type="submit">在庫を減らす</button>
      </form>
    </div>
  </div>

  <!-- 在庫増加 -->
  <div id="addModal" class="modal">
    <div class="modal-content">
      <span class="close" onclick="closeModal('addModal')">&times;</span>
      <h2>部品の追加 (在庫増加)</h2>

      <form id="addForm">
        <label>部品名 (Name)</label>
        <div class="input-container">
          <input type="text" id="addName" required>
          <div id="autocompleteListAdd" class="autocomplete-list"></div>
        </div>

        <label>追加個数 (Quantity)</label>
        <input type="number" id="addQuantity" min="1" required>

        <button type="submit">在庫を追加する</button>
      </form>
    </div>
  </div>

</div>

<script src="{{ '/assets/js/inventory.js' | relative_url }}"></script>

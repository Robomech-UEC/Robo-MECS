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

  <div class="table-wrapper">
    <table id="componentTable" class="component-table">
      <thead>
        <tr>
          <th>種類</th>
          <th>名称</th>
          <th>値</th>
          <th>実装</th>
          <th>在庫数</th>
          <th>URL</th>
        </tr>
      </thead>
      <tbody>
        <tr><td colspan="6">読み込み中...</td></tr>
      </tbody>
    </table>
  </div>

  <p id="messageArea" style="margin-top:15px;font-weight:bold;"></p>

  <!-- 減算 -->
  <div id="subtractModal" class="modal">
    <div class="modal-content">
      <span class="close" onclick="closeModal('subtractModal')">&times;</span>
      <h2>部品の使用</h2>
      <form id="subtractForm">
        <label>部品名</label>
        <div class="input-container">
          <input id="subtractName" type="text" required>
          <div id="autocompleteListSubtract" class="autocomplete-list"></div>
        </div>

        <label>使用個数</label>
        <input id="subtractQuantity" type="number" min="1" required>

        <button type="submit">在庫を減らす</button>
      </form>
    </div>
  </div>

  <!-- 加算 -->
  <div id="addModal" class="modal">
    <div class="modal-content">
      <span class="close" onclick="closeModal('addModal')">&times;</span>
      <h2>部品の追加</h2>
      <form id="addForm">
        <label>部品名</label>
        <div class="input-container">
          <input id="addName" type="text" required>
          <div id="autocompleteListAdd" class="autocomplete-list"></div>
        </div>

        <label>追加個数</label>
        <input id="addQuantity" type="number" min="1" required>

        <button type="submit">在庫を追加する</button>
      </form>
    </div>
  </div>
</div>

<script src="{{ '/assets/js/inventory.js' | relative_url }}"></script>

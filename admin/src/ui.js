/**
 * Admin UI - HTML Template
 * v1.0.0 - 2026-01-13
 *
 * Clean, mobile-friendly admin interface
 */

export function renderAdminPage() {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin - Cose Vintage</title>
  <!-- Cropper.js CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css">
  <style>
    :root {
      --cream: #F7F3EB;
      --sage: #8B9A7A;
      --sage-dark: #6B7A5A;
      --rosa: #CB8587;
      --ink: #3D352E;
      --ink-light: #5C534A;
      --border: #E8E0D0;
      --white: #FFFFFF;
      --error: #B85C4C;
      --success: #7A9A6B;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--cream);
      color: var(--ink);
      line-height: 1.5;
    }

    /* Header */
    .header {
      background: var(--white);
      border-bottom: 1px solid var(--border);
      padding: 1rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header__inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header__logo {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--ink);
    }

    .header__logo span {
      color: var(--sage);
    }

    /* Main */
    .main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem 1rem;
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .tab {
      padding: 0.75rem 1.25rem;
      border: none;
      background: var(--white);
      color: var(--ink-light);
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .tab:hover {
      background: var(--border);
    }

    .tab.active {
      background: var(--sage);
      color: var(--white);
    }

    /* Cards */
    .card {
      background: var(--white);
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .card__title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--ink);
    }

    /* Form */
    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--ink-light);
      margin-bottom: 0.35rem;
    }

    .form-input,
    .form-select,
    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      font-size: 1rem;
      background: var(--white);
      transition: border-color 0.2s;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--sage);
    }

    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    /* Buttons */
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--sage);
      color: var(--white);
    }

    .btn-primary:hover {
      background: var(--sage-dark);
    }

    .btn-secondary {
      background: var(--border);
      color: var(--ink);
    }

    .btn-danger {
      background: var(--error);
      color: var(--white);
    }

    .btn-block {
      width: 100%;
    }

    /* File Upload */
    .upload-area {
      border: 2px dashed var(--border);
      border-radius: 0.5rem;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .upload-area:hover,
    .upload-area.dragover {
      border-color: var(--sage);
      background: rgba(139, 154, 122, 0.05);
    }

    .upload-area input {
      display: none;
    }

    .upload-area__icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .upload-area__text {
      color: var(--ink-light);
    }

    /* Image Preview */
    .image-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .image-preview__item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .image-preview__item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-preview__remove {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: var(--error);
      color: var(--white);
      border: none;
      cursor: pointer;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Existing Images Gallery */
    .existing-images {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
    }

    .existing-images__title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }

    .existing-images__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
    }

    .existing-image {
      position: relative;
      aspect-ratio: 1;
      border-radius: 0.5rem;
      overflow: hidden;
      background: var(--background);
      border: 2px solid transparent;
    }

    .existing-image.primary {
      border-color: var(--primary);
    }

    .existing-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
    }

    .existing-image__badge {
      position: absolute;
      top: 0.25rem;
      left: 0.25rem;
      background: var(--primary);
      color: var(--white);
      font-size: 0.625rem;
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-weight: 600;
    }

    .existing-image__actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      gap: 0.25rem;
      padding: 0.375rem;
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
      opacity: 0;
      transition: opacity 0.2s;
    }

    .existing-image:hover .existing-image__actions {
      opacity: 1;
    }

    .existing-image__btn {
      flex: 1;
      padding: 0.375rem;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.75rem;
      transition: background 0.2s;
    }

    .existing-image__btn--view {
      background: var(--white);
      color: var(--text);
    }

    .existing-image__btn--primary {
      background: var(--primary);
      color: var(--white);
    }

    .existing-image__btn--delete {
      background: var(--error);
      color: var(--white);
    }

    /* Image Modal */
    .modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.9);
      z-index: 1000;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .modal.active {
      display: flex;
    }

    .modal__content {
      max-width: 90vw;
      max-height: 90vh;
      position: relative;
    }

    .modal__image {
      max-width: 100%;
      max-height: 80vh;
      border-radius: 0.5rem;
    }

    .modal__close {
      position: absolute;
      top: -2rem;
      right: 0;
      background: none;
      border: none;
      color: var(--white);
      font-size: 1.5rem;
      cursor: pointer;
    }

    .modal__actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      justify-content: center;
    }

    /* Crop Container - Cropper.js */
    .crop-container {
      max-width: 100%;
      max-height: 60vh;
    }

    .crop-container img {
      display: block;
      max-width: 100%;
    }

    .crop-toolbar {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .crop-toolbar button {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border);
      background: var(--white);
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      transition: all 0.2s;
    }

    .crop-toolbar button:hover {
      background: var(--border);
    }

    .crop-toolbar button.active {
      background: var(--sage);
      color: var(--white);
      border-color: var(--sage);
    }

    .crop-toolbar .separator {
      width: 1px;
      background: var(--border);
      margin: 0 0.25rem;
    }

    /* Cropper.js customizations */
    .cropper-view-box,
    .cropper-face {
      border-radius: 0;
    }

    .cropper-line {
      background-color: var(--sage);
    }

    .cropper-point {
      background-color: var(--sage);
    }

    .cropper-modal {
      background-color: rgba(0, 0, 0, 0.6);
    }

    /* Products Table */
    .products-grid {
      display: grid;
      gap: 1rem;
    }

    .product-item {
      display: grid;
      grid-template-columns: 80px 1fr auto;
      gap: 1rem;
      align-items: center;
      background: var(--white);
      padding: 1rem;
      border-radius: 0.5rem;
    }

    .product-item__image {
      width: 80px;
      height: 80px;
      border-radius: 0.5rem;
      object-fit: cover;
      background: var(--border);
    }

    .product-item__info h3 {
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }

    .product-item__meta {
      font-size: 0.85rem;
      color: var(--ink-light);
    }

    .product-item__price {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--sage);
    }

    .product-item__actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
    }

    /* Toggle */
    .toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .toggle input {
      display: none;
    }

    .toggle__switch {
      width: 48px;
      height: 26px;
      background: var(--border);
      border-radius: 13px;
      position: relative;
      transition: background 0.2s;
    }

    .toggle__switch::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 20px;
      height: 20px;
      background: var(--white);
      border-radius: 50%;
      transition: transform 0.2s;
    }

    .toggle input:checked + .toggle__switch {
      background: var(--sage);
    }

    .toggle input:checked + .toggle__switch::after {
      transform: translateX(22px);
    }

    /* Alert */
    .alert {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .alert-success {
      background: rgba(122, 154, 107, 0.1);
      color: var(--success);
      border: 1px solid var(--success);
    }

    .alert-error {
      background: rgba(184, 92, 76, 0.1);
      color: var(--error);
      border: 1px solid var(--error);
    }

    /* Loading */
    .loading {
      text-align: center;
      padding: 2rem;
      color: var(--ink-light);
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--ink-light);
    }

    /* Responsive */
    @media (max-width: 600px) {
      .product-item {
        grid-template-columns: 60px 1fr;
      }

      .product-item__actions {
        grid-column: 1 / -1;
        justify-content: flex-end;
      }
    }

    /* Hidden utility */
    .hidden {
      display: none !important;
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header__inner">
      <div class="header__logo">Cose <span>Vintage</span> Admin</div>
      <button id="logout-btn" class="btn btn-secondary">Esci</button>
    </div>
  </header>

  <!-- Login Screen -->
  <div id="login-screen" class="main">
    <div class="card" style="max-width: 400px; margin: 2rem auto;">
      <h2 class="card__title">Accedi</h2>
      <div id="login-error" class="alert alert-error hidden"></div>
      <form id="login-form">
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" id="login-password" class="form-input" required>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Accedi</button>
      </form>
    </div>
  </div>

  <!-- Main App -->
  <main id="app-screen" class="main hidden">
    <div class="tabs">
      <button class="tab active" data-tab="products">Prodotti</button>
      <button class="tab" data-tab="new">+ Nuovo Prodotto</button>
    </div>

    <!-- Products List -->
    <section id="products-section">
      <div id="products-loading" class="loading">Caricamento...</div>
      <div id="products-empty" class="empty-state hidden">
        <p>Nessun prodotto ancora.</p>
        <button class="btn btn-primary" onclick="showTab('new')">Aggiungi il primo</button>
      </div>
      <div id="products-grid" class="products-grid"></div>
    </section>

    <!-- New/Edit Product -->
    <section id="new-section" class="hidden">
      <div class="card">
        <h2 class="card__title" id="form-title">Nuovo Prodotto</h2>
        <div id="form-alert" class="alert hidden"></div>

        <form id="product-form">
          <input type="hidden" id="product-id">

          <div class="form-group">
            <label class="form-label">Nome *</label>
            <input type="text" id="nome" class="form-input" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Prezzo (€) *</label>
              <input type="number" id="prezzo" class="form-input" step="0.01" min="0" required>
            </div>
            <div class="form-group">
              <label class="form-label">Taglia</label>
              <input type="text" id="taglia" class="form-input" placeholder="es. M, 42, Unica">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Descrizione</label>
            <textarea id="descrizione" class="form-textarea" placeholder="Racconta la storia di questo pezzo..."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Categoria *</label>
              <select id="categoria" class="form-select" required>
                <option value="">Seleziona...</option>
                <option value="giacche">Giacche</option>
                <option value="vestiti">Vestiti</option>
                <option value="camicie">Camicie</option>
                <option value="gonne">Gonne</option>
                <option value="maglieria">Maglieria</option>
                <option value="accessori">Accessori</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Genere *</label>
              <select id="genere" class="form-select" required>
                <option value="">Seleziona...</option>
                <option value="donna">Donna</option>
                <option value="uomo">Uomo</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Epoca</label>
              <select id="epoca" class="form-select">
                <option value="">Seleziona...</option>
                <option value="50">Anni '50</option>
                <option value="60">Anni '60</option>
                <option value="70">Anni '70</option>
                <option value="80">Anni '80</option>
                <option value="90">Anni '90</option>
                <option value="00">Anni 2000</option>
                <option value="10">Anni 2010</option>
                <option value="20">Anni 2020</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Condizione</label>
              <select id="condizione" class="form-select">
                <option value="eccellente">Eccellente</option>
                <option value="buona">Buona</option>
                <option value="usato">Usato</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="toggle">
              <input type="checkbox" id="disponibile" checked>
              <span class="toggle__switch"></span>
              <span>Disponibile</span>
            </label>
          </div>

          <div class="form-group">
            <label class="form-label">Foto</label>
            <div class="upload-area" id="upload-area">
              <input type="file" id="file-input" accept="image/*" multiple>
              <div class="upload-area__icon">📷</div>
              <div class="upload-area__text">Clicca o trascina le foto qui</div>
            </div>
            <div class="image-preview" id="image-preview"></div>

            <!-- Existing Images (shown when editing) -->
            <div class="existing-images" id="existing-images" style="display: none;">
              <div class="existing-images__title">Foto caricate</div>
              <div class="existing-images__grid" id="existing-images-grid"></div>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button type="submit" class="btn btn-primary" style="flex: 1;">Salva Prodotto</button>
            <button type="button" class="btn btn-secondary" onclick="resetForm()">Annulla</button>
          </div>
        </form>
      </div>
    </section>
  </main>

  <!-- Image Modal -->
  <div class="modal" id="image-modal">
    <div class="modal__content">
      <button class="modal__close" onclick="closeImageModal()">&times;</button>
      <div id="modal-view-mode">
        <img src="" alt="" class="modal__image" id="modal-image">
        <div class="modal__actions">
          <button class="btn btn-secondary" onclick="startCrop()">Ritaglia</button>
          <button class="btn btn-primary" onclick="closeImageModal()">Chiudi</button>
        </div>
      </div>
      <div id="modal-crop-mode" style="display: none;">
        <div class="crop-container" id="crop-container">
          <img id="crop-image" src="" alt="">
        </div>
        <div class="crop-toolbar">
          <button onclick="cropperZoom(0.1)" title="Zoom In">🔍+</button>
          <button onclick="cropperZoom(-0.1)" title="Zoom Out">🔍−</button>
          <span class="separator"></span>
          <button onclick="cropperRotate(-90)" title="Ruota sinistra">↺</button>
          <button onclick="cropperRotate(90)" title="Ruota destra">↻</button>
          <span class="separator"></span>
          <button onclick="cropperFlip('horizontal')" title="Specchia orizzontale">↔</button>
          <button onclick="cropperFlip('vertical')" title="Specchia verticale">↕</button>
          <span class="separator"></span>
          <button onclick="cropperReset()" title="Reset">⟲</button>
        </div>
        <div class="modal__actions">
          <button class="btn btn-secondary" onclick="cancelCrop()">Annulla</button>
          <button class="btn btn-primary" onclick="applyCrop()">Salva Ritaglio</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Cropper.js Script -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js"></script>

  <script>
    // State
    let authToken = localStorage.getItem('adminToken') || '';
    let products = [];
    let editingId = null;
    let uploadedImages = [];
    let existingImages = [];
    let currentImageForCrop = null;
    let cropper = null;

    // API helper
    async function api(endpoint, options = {}) {
      const response = await fetch('/api' + endpoint, {
        ...options,
        headers: {
          'Authorization': 'Basic ' + btoa(':' + authToken),
          ...(options.body && !(options.body instanceof FormData) ? {'Content-Type': 'application/json'} : {}),
          ...options.headers
        },
        body: options.body && !(options.body instanceof FormData) ? JSON.stringify(options.body) : options.body
      });

      if (response.status === 401) {
        logout();
        throw new Error('Unauthorized');
      }

      return response.json();
    }

    // Auth
    function login(password) {
      authToken = password;
      localStorage.setItem('adminToken', password);
    }

    function logout() {
      authToken = '';
      localStorage.removeItem('adminToken');
      document.getElementById('login-screen').classList.remove('hidden');
      document.getElementById('app-screen').classList.add('hidden');
    }

    async function checkAuth() {
      if (!authToken) return false;
      try {
        await api('/products');
        return true;
      } catch {
        return false;
      }
    }

    // UI
    function showTab(tab) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelector('[data-tab="' + tab + '"]').classList.add('active');

      document.getElementById('products-section').classList.toggle('hidden', tab !== 'products');
      document.getElementById('new-section').classList.toggle('hidden', tab !== 'new');

      if (tab === 'new' && !editingId) {
        resetForm();
      }
    }

    function showAlert(message, type = 'success') {
      const alert = document.getElementById('form-alert');
      alert.textContent = message;
      alert.className = 'alert alert-' + type;
      alert.classList.remove('hidden');
      setTimeout(() => alert.classList.add('hidden'), 5000);
    }

    // Products
    async function loadProducts() {
      document.getElementById('products-loading').classList.remove('hidden');
      document.getElementById('products-grid').innerHTML = '';

      try {
        const result = await api('/products');
        products = result.products || [];

        document.getElementById('products-loading').classList.add('hidden');

        if (products.length === 0) {
          document.getElementById('products-empty').classList.remove('hidden');
        } else {
          document.getElementById('products-empty').classList.add('hidden');
          renderProducts();
        }
      } catch (error) {
        document.getElementById('products-loading').textContent = 'Errore: ' + error.message;
      }
    }

    function renderProducts() {
      const grid = document.getElementById('products-grid');
      grid.innerHTML = products.map(p => \`
        <div class="product-item">
          <img src="\${p.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23E8E0D0%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'}" class="product-item__image" alt="">
          <div class="product-item__info">
            <h3>\${p.nome}</h3>
            <div class="product-item__meta">
              \${p.categoria} · \${p.genere} · \${p.taglia || '-'}
              \${p.disponibile ? '' : ' · <span style="color: var(--error);">Non disponibile</span>'}
            </div>
          </div>
          <div class="product-item__price">€\${p.prezzo}</div>
          <div class="product-item__actions">
            <button class="btn btn-secondary btn-icon" onclick="editProduct(\${p.id})" title="Modifica">✏️</button>
            <button class="btn btn-danger btn-icon" onclick="deleteProduct(\${p.id})" title="Elimina">🗑️</button>
          </div>
        </div>
      \`).join('');
    }

    async function editProduct(id) {
      const product = products.find(p => p.id === id);
      if (!product) return;

      editingId = id;
      document.getElementById('form-title').textContent = 'Modifica Prodotto';
      document.getElementById('product-id').value = id;
      document.getElementById('nome').value = product.nome;
      document.getElementById('prezzo').value = product.prezzo;
      document.getElementById('descrizione').value = product.descrizione || '';
      document.getElementById('categoria').value = product.categoria;
      document.getElementById('genere').value = product.genere;
      document.getElementById('taglia').value = product.taglia || '';
      document.getElementById('epoca').value = product.epoca || '';
      document.getElementById('condizione').value = product.condizione || 'buona';
      document.getElementById('disponibile').checked = !!product.disponibile;

      // Load existing images
      await loadExistingImages(id);

      showTab('new');
    }

    async function loadExistingImages(productId) {
      try {
        const result = await api('/products/' + productId + '/images');
        existingImages = result.images || [];
        renderExistingImages();
      } catch (error) {
        console.error('Error loading images:', error);
        existingImages = [];
        renderExistingImages();
      }
    }

    function renderExistingImages() {
      const container = document.getElementById('existing-images');
      const grid = document.getElementById('existing-images-grid');

      if (existingImages.length === 0) {
        container.style.display = 'none';
        return;
      }

      container.style.display = 'block';
      grid.innerHTML = existingImages.map(img => \`
        <div class="existing-image \${img.is_primary ? 'primary' : ''}" data-id="\${img.id}">
          \${img.is_primary ? '<span class="existing-image__badge">Principale</span>' : ''}
          <img src="\${img.url}" alt="" onclick="viewImage('\${img.url}', \${img.id})">
          <div class="existing-image__actions">
            <button class="existing-image__btn existing-image__btn--view" onclick="viewImage('\${img.url}', \${img.id})" title="Visualizza">👁</button>
            \${!img.is_primary ? \`<button class="existing-image__btn existing-image__btn--primary" onclick="setAsPrimary(\${img.id})" title="Imposta principale">⭐</button>\` : ''}
            <button class="existing-image__btn existing-image__btn--delete" onclick="deleteExistingImage(\${img.id})" title="Elimina">🗑</button>
          </div>
        </div>
      \`).join('');
    }

    function viewImage(url, imageId) {
      currentImageForCrop = { url, id: imageId };
      document.getElementById('modal-image').src = url;
      document.getElementById('modal-view-mode').style.display = 'block';
      document.getElementById('modal-crop-mode').style.display = 'none';
      document.getElementById('image-modal').classList.add('active');
    }

    function closeImageModal() {
      document.getElementById('image-modal').classList.remove('active');
      currentImageForCrop = null;
      if (cropper) {
        cropper.destroy();
        cropper = null;
      }
    }

    function startCrop() {
      if (!currentImageForCrop) return;

      document.getElementById('modal-view-mode').style.display = 'none';
      document.getElementById('modal-crop-mode').style.display = 'block';

      const cropImage = document.getElementById('crop-image');
      cropImage.src = currentImageForCrop.url;

      // Destroy existing cropper if any
      if (cropper) {
        cropper.destroy();
      }

      // Initialize Cropper.js
      cropper = new Cropper(cropImage, {
        aspectRatio: NaN, // Free aspect ratio
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.8,
        restore: false,
        guides: true,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: true,
        background: true,
        responsive: true,
        checkCrossOrigin: true,
        checkOrientation: true
      });
    }

    // Cropper.js helper functions
    function cropperZoom(ratio) {
      if (cropper) cropper.zoom(ratio);
    }

    function cropperRotate(degree) {
      if (cropper) cropper.rotate(degree);
    }

    function cropperFlip(direction) {
      if (!cropper) return;
      const data = cropper.getData();
      if (direction === 'horizontal') {
        cropper.scaleX(data.scaleX === -1 ? 1 : -1);
      } else {
        cropper.scaleY(data.scaleY === -1 ? 1 : -1);
      }
    }

    function cropperReset() {
      if (cropper) cropper.reset();
    }

    function cancelCrop() {
      document.getElementById('modal-view-mode').style.display = 'block';
      document.getElementById('modal-crop-mode').style.display = 'none';
      if (cropper) {
        cropper.destroy();
        cropper = null;
      }
    }

    async function applyCrop() {
      if (!cropper || !currentImageForCrop) return;

      try {
        // Get cropped canvas
        const canvas = cropper.getCroppedCanvas({
          maxWidth: 1200,
          maxHeight: 1200,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high'
        });

        if (!canvas) {
          showAlert('Errore nel ritaglio', 'error');
          return;
        }

        // Convert canvas to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.9));
        const formData = new FormData();
        formData.append('image', blob, 'cropped.webp');

        // Upload new cropped image
        const result = await api('/products/' + editingId + '/images', {
          method: 'POST',
          body: formData
        });

        if (result.success) {
          // Delete old image
          await deleteExistingImage(currentImageForCrop.id, false);
          closeImageModal();
          await loadExistingImages(editingId);
          showAlert('Immagine ritagliata salvata!');
        }
      } catch (error) {
        showAlert('Errore durante il salvataggio: ' + error.message, 'error');
      }
    }

    async function setAsPrimary(imageId) {
      try {
        await api('/products/' + editingId + '/images/' + imageId + '/primary', { method: 'PUT' });
        await loadExistingImages(editingId);
        loadProducts(); // Refresh product list to update thumbnails
      } catch (error) {
        showAlert('Errore: ' + error.message, 'error');
      }
    }

    async function deleteExistingImage(imageId, reload = true) {
      if (reload && !confirm('Eliminare questa immagine?')) return;

      try {
        await api('/images/' + imageId, { method: 'DELETE' });
        if (reload) {
          await loadExistingImages(editingId);
          loadProducts();
        }
      } catch (error) {
        if (reload) showAlert('Errore: ' + error.message, 'error');
      }
    }

    async function deleteProduct(id) {
      if (!confirm('Eliminare questo prodotto?')) return;

      try {
        await api('/products/' + id, { method: 'DELETE' });
        loadProducts();
      } catch (error) {
        alert('Errore: ' + error.message);
      }
    }

    function resetForm() {
      editingId = null;
      document.getElementById('form-title').textContent = 'Nuovo Prodotto';
      document.getElementById('product-form').reset();
      document.getElementById('product-id').value = '';
      document.getElementById('disponibile').checked = true;
      document.getElementById('image-preview').innerHTML = '';
      document.getElementById('existing-images').style.display = 'none';
      document.getElementById('existing-images-grid').innerHTML = '';
      uploadedImages = [];
      existingImages = [];
    }

    // Form submission
    document.getElementById('product-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        nome: document.getElementById('nome').value,
        prezzo: parseFloat(document.getElementById('prezzo').value),
        descrizione: document.getElementById('descrizione').value,
        categoria: document.getElementById('categoria').value,
        genere: document.getElementById('genere').value,
        taglia: document.getElementById('taglia').value,
        epoca: document.getElementById('epoca').value,
        condizione: document.getElementById('condizione').value,
        disponibile: document.getElementById('disponibile').checked
      };

      try {
        if (editingId) {
          await api('/products/' + editingId, { method: 'PUT', body: data });
          showAlert('Prodotto aggiornato!');
        } else {
          await api('/products', { method: 'POST', body: data });
          showAlert('Prodotto creato!');
        }

        resetForm();
        loadProducts();
        showTab('products');
      } catch (error) {
        showAlert('Errore: ' + error.message, 'error');
      }
    });

    // File upload
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', () => {
      handleFiles(fileInput.files);
    });

    function handleFiles(files) {
      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedImages.push({ file, preview: e.target.result });
          renderImagePreviews();
        };
        reader.readAsDataURL(file);
      });
    }

    function renderImagePreviews() {
      const preview = document.getElementById('image-preview');
      preview.innerHTML = uploadedImages.map((img, i) => \`
        <div class="image-preview__item">
          <img src="\${img.preview}" alt="">
          <button type="button" class="image-preview__remove" onclick="removeImage(\${i})">×</button>
        </div>
      \`).join('');
    }

    function removeImage(index) {
      uploadedImages.splice(index, 1);
      renderImagePreviews();
    }

    // Login form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('login-password').value;
      login(password);

      if (await checkAuth()) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');
        loadProducts();
      } else {
        document.getElementById('login-error').textContent = 'Password errata';
        document.getElementById('login-error').classList.remove('hidden');
        logout();
      }
    });

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Tab clicks
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => showTab(tab.dataset.tab));
    });

    // Init
    (async () => {
      if (await checkAuth()) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-screen').classList.remove('hidden');
        loadProducts();
      }
    })();
  </script>
</body>
</html>`;
}

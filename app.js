
const state = {
  apiBase: 'http://localhost:8000',
  connected: false,
  users: [],
  products: [],
  orders: [],
  loaded: false,
};


const DEMO = {
  users: [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith',     email: 'bob@example.com'   },
    { id: 3, name: 'Carol White',   email: 'carol@example.com' },
    { id: 4, name: 'David Lee',     email: 'david@example.com' },
  ],
  products: [
    { id: 1, name: 'Wireless Headphones', price: '129.99' },
    { id: 2, name: 'Mechanical Keyboard', price: '89.00'  },
    { id: 3, name: 'USB-C Hub',           price: '45.50'  },
    { id: 4, name: 'Laptop Stand',        price: '34.00'  },
  ],
  orders: [
    { id: 1, user: 1, product: 1, quantity: 2 },
    { id: 2, user: 2, product: 3, quantity: 1 },
    { id: 3, user: 1, product: 2, quantity: 1 },
    { id: 4, user: 3, product: 4, quantity: 3 },
  ],
};


async function apiFetch(path, opts = {}) {
  if (!state.connected) return null;
  const url = `${state.apiBase}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

async function connectAPI() {
  const base = document.getElementById('api-url').value.trim().replace(/\/$/, '');
  state.apiBase = base;
  const el = document.getElementById('api-status');
  el.textContent = '● Connecting…';
  el.className = 'api-status';
  try {
    const res = await fetch(`${base}/api/users/`);
    if (!res.ok) throw new Error();
    state.connected = true;
    el.textContent = '● Connected';
    el.className = 'api-status ok';
    toast('Connected to ' + base, 'success');
    await loadAll();
    route();
  } catch {
    state.connected = false;
    el.textContent = '● Failed – using demo';
    el.className = 'api-status err';
    toast('Connection failed, using demo data', 'error');
  }
}


async function loadAll() {
  if (state.connected) {
    const [u, p, o] = await Promise.all([
      apiFetch('/api/users/'),
      apiFetch('/api/products/'),
      apiFetch('/api/orders/'),
    ]);
    state.users    = u || DEMO.users;
    state.products = p || DEMO.products;
    state.orders   = o || DEMO.orders;
  } else {
    state.users    = [...DEMO.users];
    state.products = [...DEMO.products];
    state.orders   = [...DEMO.orders];
  }
  updateBadges();
}


async function refreshData() {
  state.loaded = false;
  await loadAll();
  state.loaded = true;
  toast('Data refreshed', 'success');
  route();
}

function updateBadges() {
  document.getElementById('badge-users').textContent    = state.users.length;
  document.getElementById('badge-products').textContent = state.products.length;
  document.getElementById('badge-orders').textContent   = state.orders.length;
}


function toast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function getPath() {
  return location.hash.slice(1) || '/';
}

/** Push a new hash route. */
function navigate(path) {
  location.hash = path;
}

function setActive(routeKey) {
  document.querySelectorAll('.nav-item').forEach(a => a.classList.remove('active'));
  const match = document.querySelector(`.nav-item[data-route="${routeKey}"]`);
  if (match) match.classList.add('active');

  ['users', 'products', 'orders'].forEach(r => {
    const sub = document.getElementById(`sub-${r}`);
    if (sub) sub.style.display = routeKey.startsWith(r) ? 'block' : 'none';
  });
}

function setBreadcrumb(parts) {
  const el = document.getElementById('breadcrumb');
  el.innerHTML = parts.map((p, i) =>
    i < parts.length - 1
      ? `<span style="color:var(--muted)">${p}</span><span class="sep"> / </span>`
      : `<span>${p}</span>`
  ).join('');
}


async function route() {
  const path     = getPath();
  const segments = path.split('/').filter(Boolean);
  const resource = segments[0] || '';
  const id       = segments[1];
  const action   = segments[2];
  const content  = document.getElementById('page-content');

  if (!state.loaded) {
    content.innerHTML = `<div class="loading"><div class="spinner"></div> Loading data…</div>`;
    await loadAll();
    state.loaded = true;
  }

  if (path === '/') return renderDashboard();

  if (resource === 'users') {
    if (!id)             return renderList('users');
    if (id === 'new')    return renderForm('users', null);
    if (action === 'edit') return renderForm('users', parseInt(id));
    return renderDetail('users', parseInt(id));
  }

  if (resource === 'products') {
    if (!id)             return renderList('products');
    if (id === 'new')    return renderForm('products', null);
    if (action === 'edit') return renderForm('products', parseInt(id));
    return renderDetail('products', parseInt(id));
  }

  if (resource === 'orders') {
    if (!id)             return renderList('orders');
    if (id === 'new')    return renderForm('orders', null);
    if (action === 'edit') return renderForm('orders', parseInt(id));
    return renderDetail('orders', parseInt(id));
  }

  renderDashboard();
}

window.addEventListener('hashchange', route);


function renderDashboard() {
  setActive('dashboard');
  setBreadcrumb(['Dashboard']);

  const revenue = state.orders.reduce((sum, o) => {
    const p = state.products.find(x => x.id === o.product);
    return sum + (p ? parseFloat(p.price) * o.quantity : 0);
  }, 0);

  const endpoints = [
    ['GET',    '/api/users/'],
    ['POST',   '/api/users/'],
    ['GET',    '/api/users/:id/'],
    ['PUT',    '/api/users/:id/'],
    ['DELETE', '/api/users/:id/'],
    ['GET',    '/api/products/'],
    ['POST',   '/api/products/'],
    ['GET',    '/api/products/:id/'],
    ['PUT',    '/api/products/:id/'],
    ['DELETE', '/api/products/:id/'],
    ['GET',    '/api/orders/'],
    ['POST',   '/api/orders/'],
    ['GET',    '/api/orders/:id/'],
    ['PUT',    '/api/orders/:id/'],
    ['DELETE', '/api/orders/:id/'],
  ];

  document.getElementById('page-content').innerHTML = `
    <div class="page-header">
      <div class="page-title"><small>Overview</small>Dashboard</div>
    </div>

    <!-- STAT CARDS -->
    <div class="stats-grid">
      <div class="stat-card a" data-icon="◎">
        <div class="stat-label">Total Users</div>
        <div class="stat-value">${state.users.length}</div>
        <div class="stat-sub">→ /api/users/</div>
      </div>
      <div class="stat-card b" data-icon="◫">
        <div class="stat-label">Total Products</div>
        <div class="stat-value">${state.products.length}</div>
        <div class="stat-sub">→ /api/products/</div>
      </div>
      <div class="stat-card c" data-icon="◳">
        <div class="stat-label">Total Orders</div>
        <div class="stat-value">${state.orders.length}</div>
        <div class="stat-sub">→ /api/orders/</div>
      </div>
      <div class="stat-card d" data-icon="$">
        <div class="stat-label">Total Revenue</div>
        <div class="stat-value">$${revenue.toFixed(0)}</div>
        <div class="stat-sub">Σ price × quantity</div>
      </div>
    </div>

    <!-- RECENT PANELS + ENDPOINTS -->
    <div class="dash-cols">

      <!-- Recent Users -->
      <div class="table-card">
        <div class="table-toolbar">
          <h3>Recent Users</h3>
          <a href="#/users" style="margin-left:auto;font-family:var(--font-mono);font-size:11px;color:var(--accent);text-decoration:none">View all →</a>
        </div>
        <ul class="recent-list" style="padding:0 20px">
          ${state.users.slice(-5).reverse().map(u => `
            <li class="recent-item">
              <div>
                <div style="font-weight:600">${u.name}</div>
                <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted)">${u.email}</div>
              </div>
              <span class="ri-id">#${u.id}</span>
            </li>`).join('')}
        </ul>
      </div>

      <!-- Recent Orders -->
      <div class="table-card">
        <div class="table-toolbar">
          <h3>Recent Orders</h3>
          <a href="#/orders" style="margin-left:auto;font-family:var(--font-mono);font-size:11px;color:var(--accent);text-decoration:none">View all →</a>
        </div>
        <ul class="recent-list" style="padding:0 20px">
          ${state.orders.slice(-5).reverse().map(o => {
            const u = state.users.find(x => x.id === o.user)    || { name: '—' };
            const p = state.products.find(x => x.id === o.product) || { name: '—', price: 0 };
            return `
            <li class="recent-item">
              <div>
                <div style="font-weight:600">${u.name}</div>
                <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted)">${p.name} × ${o.quantity}</div>
              </div>
              <span class="chip chip-green">$${(parseFloat(p.price) * o.quantity).toFixed(2)}</span>
            </li>`;
          }).join('')}
        </ul>
      </div>

      <!-- Endpoints List -->
      <div class="table-card" style="grid-column:1/-1">
        <div class="table-toolbar">
          <h3>API Endpoints</h3>
          <span style="margin-left:auto;font-family:var(--font-mono);font-size:10px;color:var(--muted)">${endpoints.length} routes registered</span>
        </div>
        <div style="padding:0 20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 32px">
          ${endpoints.map(([m, p]) => `
            <div class="endpoint-item">
              <span class="method ${m.toLowerCase() === 'delete' ? 'del' : m.toLowerCase()}">${m}</span>
              <span>${p}</span>
            </div>`).join('')}
        </div>
      </div>

    </div>
  `;
}


const CONFIGS = {
  users: {
    label: 'Users',
    icon: '◎',
    cols: ['ID', 'Name', 'Email', 'Actions'],
    row(u) {
      return `
        <td class="td-mono">#${u.id}</td>
        <td><strong>${u.name}</strong></td>
        <td class="td-mono">${u.email}</td>
      `;
    },
    searchFn(u, q) {
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    },
  },

  products: {
    label: 'Products',
    icon: '◫',
    cols: ['ID', 'Name', 'Price', 'Actions'],
    row(p) {
      return `
        <td class="td-mono">#${p.id}</td>
        <td><strong>${p.name}</strong></td>
        <td><span class="chip chip-green">$${parseFloat(p.price).toFixed(2)}</span></td>
      `;
    },
    searchFn(p, q) {
      return p.name.toLowerCase().includes(q);
    },
  },

  orders: {
    label: 'Orders',
    icon: '◳',
    cols: ['ID', 'User', 'Product', 'Qty', 'Total', 'Actions'],
    row(o) {
      const u     = state.users.find(x => x.id === o.user)       || { name: '—' };
      const p     = state.products.find(x => x.id === o.product) || { name: '—', price: 0 };
      const total = (parseFloat(p.price) * o.quantity).toFixed(2);
      return `
        <td class="td-mono">#${o.id}</td>
        <td><strong>${u.name}</strong></td>
        <td>${p.name}</td>
        <td><span class="chip chip-yellow">×${o.quantity}</span></td>
        <td><span class="chip chip-green">$${total}</span></td>
      `;
    },
    searchFn(o, q) {
      const u = state.users.find(x => x.id === o.user)       || { name: '' };
      const p = state.products.find(x => x.id === o.product) || { name: '' };
      return u.name.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
    },
  },
};

function renderList(resource) {
  const cfg   = CONFIGS[resource];
  const items = state[resource];
  setActive(resource);
  setBreadcrumb([cfg.label]);

  document.getElementById('page-content').innerHTML = `
    <div class="page-header">
      <div class="page-title"><small>${cfg.icon} Resource</small>${cfg.label}</div>
      <button class="btn btn-primary" onclick="navigate('#/${resource}/new')">
        ＋ New ${cfg.label.slice(0, -1)}
      </button>
    </div>
    <div class="table-card">
      <div class="table-toolbar">
        <h3>${items.length} records</h3>
        <input
          class="search-input"
          id="search-${resource}"
          placeholder="Search ${resource}…"
          oninput="filterTable('${resource}', this.value)"
        />
      </div>
      <table id="table-${resource}">
        <thead>
          <tr>${cfg.cols.map(c => `<th>${c}</th>`).join('')}</tr>
        </thead>
        <tbody id="tbody-${resource}">
          ${buildRows(resource, items)}
        </tbody>
      </table>
      ${items.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon">${cfg.icon}</div>
          <h3>No ${cfg.label} yet</h3>
          <p>Create your first one to get started.</p>
        </div>` : ''}
    </div>
  `;
}
function buildRows(resource, items) {
  const cfg = CONFIGS[resource];
  if (!items.length) {
    return `<tr><td colspan="10" style="text-align:center;padding:32px;color:var(--muted);font-family:var(--font-mono);font-size:12px">No results found</td></tr>`;
  }
  return items.map(item => `
    <tr>
      ${cfg.row(item)}
      <td>
        <div class="row-actions">
          <button class="btn-icon" title="View"   onclick="navigate('#/${resource}/${item.id}')">⊙</button>
          <button class="btn-icon" title="Edit"   onclick="navigate('#/${resource}/${item.id}/edit')">✎</button>
          <button class="btn-icon del" title="Delete" onclick="deleteItem('${resource}', ${item.id})">✕</button>
        </div>
      </td>
    </tr>`).join('');
}

function filterTable(resource, query) {
  const cfg      = CONFIGS[resource];
  const q        = query.toLowerCase();
  const filtered = state[resource].filter(i => cfg.searchFn(i, q));
  document.getElementById(`tbody-${resource}`).innerHTML = buildRows(resource, filtered);
}


function renderDetail(resource, id) {
  const item = state[resource].find(x => x.id === id);
  if (!item) { navigate('#/' + resource); return; }

  setActive(resource);
  setBreadcrumb([CONFIGS[resource].label, `#${id}`]);
  const content = document.getElementById('page-content');

  if (resource === 'users') {
    const userOrders = state.orders.filter(o => o.user === id);
    content.innerHTML = `
      <div class="page-header">
        <div class="page-title"><small>◎ User Detail</small>${item.name}</div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-ghost" onclick="navigate('#/users/${id}/edit')">✎ Edit</button>
          <button class="btn btn-danger" onclick="deleteItem('users', ${id})">✕ Delete</button>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-card">
          <div class="field-label">Full Name</div>
          <div class="field-value">${item.name}</div>
        </div>
        <div class="detail-card">
          <div class="field-label">Email Address</div>
          <div class="field-value mono">${item.email}</div>
        </div>
        <div class="detail-card">
          <div class="field-label">User ID</div>
          <div class="field-value mono">${item.id}</div>
        </div>
        <div class="detail-card">
          <div class="field-label">Total Orders</div>
          <div class="field-value">${userOrders.length}</div>
        </div>
        <div class="detail-card full">
          <div class="field-label" style="margin-bottom:14px">Orders by this user</div>
          <table style="width:100%">
            <thead><tr><th>Order ID</th><th>Product</th><th>Qty</th><th>Total</th></tr></thead>
            <tbody>
              ${userOrders.length === 0
                ? '<tr><td colspan="4" style="padding:20px;text-align:center;color:var(--muted);font-family:var(--font-mono);font-size:12px">No orders yet</td></tr>'
                : userOrders.map(o => {
                    const p = state.products.find(x => x.id === o.product) || { name: '—', price: 0 };
                    return `<tr>
                      <td class="td-mono">#${o.id}</td>
                      <td>${p.name}</td>
                      <td><span class="chip chip-yellow">×${o.quantity}</span></td>
                      <td><span class="chip chip-green">$${(parseFloat(p.price) * o.quantity).toFixed(2)}</span></td>
                    </tr>`;
                  }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  if (resource === 'products') {
    const prodOrders = state.orders.filter(o => o.product === id);
    const totalSold  = prodOrders.reduce((s, o) => s + o.quantity, 0);
    content.innerHTML = `
      <div class="page-header">
        <div class="page-title"><small>◫ Product Detail</small>${item.name}</div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-ghost" onclick="navigate('#/products/${id}/edit')">✎ Edit</button>
          <button class="btn btn-danger" onclick="deleteItem('products', ${id})">✕ Delete</button>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-card">
          <div class="field-label">Product Name</div>
          <div class="field-value">${item.name}</div>
        </div>
        <div class="detail-card">
          <div class="field-label">Unit Price</div>
          <div class="field-value" style="color:var(--accent3)">$${parseFloat(item.price).toFixed(2)}</div>
        </div>
        <div class="detail-card">
          <div class="field-label">Product ID</div>
          <div class="field-value mono">${item.id}</div>
        </div>
        <div class="detail-card">
          <div class="field-label">Units Sold</div>
          <div class="field-value">${totalSold}</div>
        </div>
        <div class="detail-card full">
          <div class="field-label" style="margin-bottom:14px">Orders containing this product</div>
          <table style="width:100%">
            <thead><tr><th>Order ID</th><th>User</th><th>Qty</th><th>Revenue</th></tr></thead>
            <tbody>
              ${prodOrders.length === 0
                ? '<tr><td colspan="4" style="padding:20px;text-align:center;color:var(--muted);font-family:var(--font-mono);font-size:12px">No orders yet</td></tr>'
                : prodOrders.map(o => {
                    const u = state.users.find(x => x.id === o.user) || { name: '—' };
                    return `<tr>
                      <td class="td-mono">#${o.id}</td>
                      <td>${u.name}</td>
                      <td><span class="chip chip-yellow">×${o.quantity}</span></td>
                      <td><span class="chip chip-green">$${(parseFloat(item.price) * o.quantity).toFixed(2)}</span></td>
                    </tr>`;
                  }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  if (resource === 'orders') {
    const u     = state.users.find(x => x.id === item.user)       || { name: '—', email: '—' };
    const p     = state.products.find(x => x.id === item.product) || { name: '—', price: 0 };
    const total = (parseFloat(p.price) * item.quantity).toFixed(2);
    content.innerHTML = `
      <div class="page-header">
        <div class="page-title"><small>◳ Order Detail</small>Order #${item.id}</div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-ghost" onclick="navigate('#/orders/${id}/edit')">✎ Edit</button>
          <button class="btn btn-danger" onclick="deleteItem('orders', ${id})">✕ Delete</button>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-card">
          <div class="field-label">Order ID</div>
          <div class="field-value mono">${item.id}</div>
        </div>
        <div class="detail-card">
          <div class="field-label">Order Total</div>
          <div class="field-value" style="color:var(--accent3)">$${total}</div>
        </div>
        <div class="detail-card">
          <div class="field-label">Customer</div>
          <div class="field-value">${u.name}</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);margin-top:4px">${u.email}</div>
        </div>
        <div class="detail-card">
          <div class="field-label">Product</div>
          <div class="field-value">${p.name}</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);margin-top:4px">Unit price: $${parseFloat(p.price).toFixed(2)}</div>
        </div>
        <div class="detail-card">
          <div class="field-label">Quantity</div>
          <div class="field-value">${item.quantity}</div>
        </div>
        <div class="detail-card">
          <div class="field-label">Calculation</div>
          <div class="field-value mono" style="font-size:13px">
            $${parseFloat(p.price).toFixed(2)} × ${item.quantity} = $${total}
          </div>
        </div>
      </div>
    `;
  }
}

function renderForm(resource, id) {
  const isEdit   = id !== null;
  const item     = isEdit ? state[resource].find(x => x.id === id) : null;
  const label    = CONFIGS[resource].label;
  const singular = label.slice(0, -1);

  setActive(resource);
  setBreadcrumb([label, isEdit ? `Edit #${id}` : `New ${singular}`]);

  let fields = '';

  if (resource === 'users') {
    fields = `
      <div class="form-group">
        <label class="form-label">Full Name *</label>
        <input class="form-control" id="f-name" type="text"
          value="${item ? item.name : ''}" placeholder="e.g. Alice Johnson"/>
      </div>
      <div class="form-group">
        <label class="form-label">Email Address *</label>
        <input class="form-control" id="f-email" type="email"
          value="${item ? item.email : ''}" placeholder="alice@example.com"/>
        <div class="form-hint">Sent to POST/PUT /api/users/</div>
      </div>
    `;
  }

  if (resource === 'products') {
    fields = `
      <div class="form-group">
        <label class="form-label">Product Name *</label>
        <input class="form-control" id="f-name" type="text"
          value="${item ? item.name : ''}" placeholder="e.g. Wireless Headphones"/>
      </div>
      <div class="form-group">
        <label class="form-label">Price (USD) *</label>
        <input class="form-control" id="f-price" type="number" step="0.01" min="0"
          value="${item ? item.price : ''}" placeholder="0.00"/>
        <div class="form-hint">Decimal. Sent to POST/PUT /api/products/</div>
      </div>
    `;
  }

  if (resource === 'orders') {
    fields = `
      <div class="form-group">
        <label class="form-label">User (FK → users.id) *</label>
        <select class="form-control" id="f-user">
          <option value="">— Select user —</option>
          ${state.users.map(u =>
            `<option value="${u.id}" ${item && item.user === u.id ? 'selected' : ''}>
              ${u.name} (${u.email})
            </option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Product (FK → products.id) *</label>
        <select class="form-control" id="f-product">
          <option value="">— Select product —</option>
          ${state.products.map(p =>
            `<option value="${p.id}" ${item && item.product === p.id ? 'selected' : ''}>
              ${p.name} — $${parseFloat(p.price).toFixed(2)}
            </option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Quantity *</label>
        <input class="form-control" id="f-quantity" type="number" min="1"
          value="${item ? item.quantity : 1}" placeholder="1"/>
        <div class="form-hint">Sent to POST/PUT /api/orders/</div>
      </div>
    `;
  }

  document.getElementById('page-content').innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <small>${isEdit ? '✎ Edit' : '＋ Create'}</small>
        ${isEdit ? `Edit ${singular} #${id}` : `New ${singular}`}
      </div>
    </div>
    <div class="form-card">
      ${fields}
      <div class="form-actions">
        <button class="btn btn-primary" onclick="submitForm('${resource}', ${id})">
          ${isEdit ? '✓ Save Changes' : '＋ Create ' + singular}
        </button>
        <button class="btn btn-ghost" onclick="navigate('#/${resource}')">Cancel</button>
      </div>
    </div>
  `;
}


async function submitForm(resource, id) {
  const isEdit = id !== null;
  let payload  = {};

  if (resource === 'users') {
    const name  = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    if (!name || !email) { toast('Name and email are required', 'error'); return; }
    payload = { name, email };
  }

  if (resource === 'products') {
    const name  = document.getElementById('f-name').value.trim();
    const price = document.getElementById('f-price').value.trim();
    if (!name || !price) { toast('Name and price are required', 'error'); return; }
    payload = { name, price: parseFloat(price).toFixed(2) };
  }

  if (resource === 'orders') {
    const user     = document.getElementById('f-user').value;
    const product  = document.getElementById('f-product').value;
    const quantity = document.getElementById('f-quantity').value;
    if (!user || !product || !quantity) { toast('All fields are required', 'error'); return; }
    payload = { user: parseInt(user), product: parseInt(product), quantity: parseInt(quantity) };
  }

  if (state.connected) {
    try {
      const path   = isEdit ? `/api/${resource}/${id}/` : `/api/${resource}/`;
      const method = isEdit ? 'PUT' : 'POST';
      const result = await apiFetch(path, { method, body: JSON.stringify(payload) });

      if (isEdit) {
        const idx = state[resource].findIndex(x => x.id === id);
        state[resource][idx] = result;
      } else {
        state[resource].push(result);
      }
      updateBadges();
      toast(`${singular(resource)} ${isEdit ? 'updated' : 'created'}!`, 'success');
      navigate(`#/${resource}`);
    } catch (e) {
      toast('API error: ' + e.message, 'error');
    }

  } else {
    if (isEdit) {
      const idx = state[resource].findIndex(x => x.id === id);
      state[resource][idx] = { id, ...payload };
    } else {
      const newId = Math.max(0, ...state[resource].map(x => x.id)) + 1;
      state[resource].push({ id: newId, ...payload });
    }
    updateBadges();
    toast(`[Demo] ${singular(resource)} ${isEdit ? 'updated' : 'created'}!`, 'success');
    navigate(`#/${resource}`);
  }
}

function singular(resource) {
  return CONFIGS[resource].label.slice(0, -1);
}


async function deleteItem(resource, id) {
  if (!confirm(`Delete ${singular(resource)} #${id}? This cannot be undone.`)) return;

  if (state.connected) {
    try {
      await apiFetch(`/api/${resource}/${id}/`, { method: 'DELETE' });
    } catch (e) {
      toast('Delete failed: ' + e.message, 'error');
      return;
    }
  }

  state[resource] = state[resource].filter(x => x.id !== id);
  updateBadges();
  toast(`Deleted ${singular(resource)} #${id}`, 'success');
  navigate(`#/${resource}`);
}


(async () => {
  await loadAll();
  state.loaded = true;
  route();
})();

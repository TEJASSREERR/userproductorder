// ==========================================
// MOCK DATA
// ==========================================

const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" }
];

const mockProducts = [
    { id: 1, name: "Laptop", price: 999.99 },
    { id: 2, name: "Phone", price: 599.99 },
    { id: 3, name: "Tablet", price: 399.99 },
    { id: 4, name: "Headphones", price: 199.99 }
];

const mockOrders = [
    { id: 1, user: 1, product: 1, quantity: 2 },
    { id: 2, user: 2, product: 3, quantity: 1 },
    { id: 3, user: 3, product: 2, quantity: 3 }
];

// ==========================================
// API FUNCTIONS
// ==========================================

async function apiGet(endpoint) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (endpoint === '/users/') return mockUsers;
    if (endpoint === '/products/') return mockProducts;
    if (endpoint === '/orders/') return mockOrders;
    
    const parts = endpoint.split('/');
    const id = parseInt(parts[2]);
    
    if (endpoint.includes('/users/')) return mockUsers.find(u => u.id === id);
    if (endpoint.includes('/products/')) return mockProducts.find(p => p.id === id);
    if (endpoint.includes('/orders/')) return mockOrders.find(o => o.id === id);
    
    return null;
}

async function apiPost(endpoint, data) {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (endpoint === '/users/') { mockUsers.push({ ...data, id: mockUsers.length + 1 }); return data; }
    if (endpoint === '/products/') { mockProducts.push({ ...data, id: mockProducts.length + 1 }); return data; }
    if (endpoint === '/orders/') { mockOrders.push({ ...data, id: mockOrders.length + 1 }); return data; }
}

async function apiPut(endpoint, data) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const parts = endpoint.split('/');
    const id = parseInt(parts[2]);
    const type = parts[1];
    
    if (type === 'users') { const i = mockUsers.findIndex(u => u.id === id); if (i !== -1) mockUsers[i] = { ...data, id }; }
    if (type === 'products') { const i = mockProducts.findIndex(p => p.id === id); if (i !== -1) mockProducts[i] = { ...data, id }; }
    if (type === 'orders') { const i = mockOrders.findIndex(o => o.id === id); if (i !== -1) mockOrders[i] = { ...data, id }; }
}

async function apiDelete(endpoint) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const parts = endpoint.split('/');
    const id = parseInt(parts[2]);
    const type = parts[1];
    
    if (type === 'users') { const i = mockUsers.findIndex(u => u.id === id); if (i !== -1) mockUsers.splice(i, 1); }
    if (type === 'products') { const i = mockProducts.findIndex(p => p.id === id); if (i !== -1) mockProducts.splice(i, 1); }
    if (type === 'orders') { const i = mockOrders.findIndex(o => o.id === id); if (i !== -1) mockOrders.splice(i, 1); }
    return true;
}

// ==========================================
// UI HELPERS
// ==========================================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    
    const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-gray-800' };
    toast.className = `fixed bottom-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${colors[type] || colors.info}`;
    toast.classList.remove('translate-y-20');
    
    setTimeout(() => { toast.classList.add('translate-y-20'); }, 3000);
}

function renderBreadcrumb(items) {
    return `
        <nav class="mb-6">
            <ol class="flex items-center space-x-2 text-sm text-gray-600">
                <li><a href="#/" class="hover:text-blue-600"><i class="fas fa-home"></i></a></li>
                ${items.map((item, index) => `
                    <li><i class="fas fa-chevron-right text-xs"></i></li>
                    <li class="${index === items.length - 1 ? 'text-blue-600 font-semibold' : ''}">
                        ${item.link ? `<a href="#${item.link}" class="hover:text-blue-600">${item.text}</a>` : item.text}
                    </li>
                `).join('')}
            </ol>
        </nav>
    `;
}

function renderPageHeader(title, actionButton = '') {
    return `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">${title}</h1>
            ${actionButton}
        </div>
    `;
}

function navigateTo(hash) {
    window.location.hash = hash;
}

// ==========================================
// DASHBOARD
// ==========================================

async function renderDashboard() {
    const [users, products, orders] = await Promise.all([
        apiGet('/users/'),
        apiGet('/products/'),
        apiGet('/orders/')
    ]);
    
    const stats = [
        { title: 'Users', count: users?.length || 0, icon: 'users', color: 'blue', link: '#/users' },
        { title: 'Products', count: products?.length || 0, icon: 'box', color: 'green', link: '#/products' },
        { title: 'Orders', count: orders?.length || 0, icon: 'shopping-cart', color: 'purple', link: '#/orders' }
    ];
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        ${renderBreadcrumb([{ text: 'Dashboard' }])}
        ${renderPageHeader('Dashboard Overview')}
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            ${stats.map(stat => `
                <a href="${stat.link}" class="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 mb-1">${stat.title}</p>
                            <p class="text-3xl font-bold text-${stat.color}-600">${stat.count}</p>
                        </div>
                        <div class="w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-${stat.icon} text-${stat.color}-600 text-xl"></i>
                        </div>
                    </div>
                </a>
            `).join('')}
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-bold text-gray-800 mb-4">Recent Users</h2>
                <div class="space-y-3">
                    ${(users?.slice(0, 5) || []).map(user => `
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-user text-blue-600"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-800">${user.name}</p>
                                    <p class="text-sm text-gray-500">${user.email}</p>
                                </div>
                            </div>
                            <a href="#/users/${user.id}" class="text-blue-600 hover:text-blue-800">
                                <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    `).join('') || '<p class="text-gray-500">No users yet</p>'}
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
                <div class="space-y-3">
                    ${(orders?.slice(0, 5) || []).map(order => {
                        const user = users?.find(u => u.id == order.user);
                        return `
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-shopping-cart text-purple-600"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-800">Order #${order.id}</p>
                                    <p class="text-sm text-gray-500">by ${user?.name || 'Unknown'} - Qty: ${order.quantity}</p>
                                </div>
                            </div>
                            <a href="#/orders/${order.id}" class="text-purple-600 hover:text-purple-800">
                                <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    `}).join('') || '<p class="text-gray-500">No orders yet</p>'}
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// USERS
// ==========================================

async function renderUsers() {
    const users = await apiGet('/users/');
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        ${renderBreadcrumb([{ text: 'Users', link: '/users' }])}
        ${renderPageHeader('Users', `
            <a href="#/users/new" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <i class="fas fa-plus mr-2"></i> Add User
            </a>
        `)}
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${(users || []).map(user => `
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-4 text-sm text-gray-900">${user.id}</td>
                                <td class="px-4 py-4">
                                    <div class="flex items-center">
                                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <i class="fas fa-user text-blue-600 text-sm"></i>
                                        </div>
                                        <span class="text-sm font-medium text-gray-900">${user.name}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm text-gray-500">${user.email}</td>
                                <td class="px-4 py-4 text-right space-x-2">
                                    <a href="#/users/${user.id}" class="text-blue-600 hover:text-blue-800 text-sm"><i class="fas fa-eye"></i></a>
                                    <a href="#/users/${user.id}/edit" class="text-green-600 hover:text-green-800 text-sm"><i class="fas fa-edit"></i></a>
                                    <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-800 text-sm"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="4" class="px-4 py-8 text-center text-gray-500">No users found</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

async function renderUserForm(params = {}) {
    const isEdit = window.location.hash.includes('/edit');
    const userId = params.id;
    let user = { name: '', email: '' };
    
    if (isEdit && userId) {
        user = await apiGet(`/users/${userId}/`) || user;
    }
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        ${renderBreadcrumb([
            { text: 'Users', link: '/users' },
            { text: isEdit ? 'Edit User' : 'New User' }
        ])}
        ${renderPageHeader(isEdit ? 'Edit User' : 'Create New User')}
        
        <div class="max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <form id="user-form" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" name="name" value="${user.name}" required
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter user name">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" name="email" value="${user.email}" required
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter email address">
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3 pt-4">
                    <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm">
                        <i class="fas fa-save mr-2"></i> ${isEdit ? 'Update' : 'Create'} User
                    </button>
                    <a href="#/users" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-center">
                        <i class="fas fa-times mr-2"></i> Cancel
                    </a>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = { name: formData.get('name'), email: formData.get('email') };
        
        if (isEdit) await apiPut(`/users/${userId}/`, data);
        else await apiPost('/users/', data);
        
        navigateTo('#/users');
    });
}

async function renderUserDetail(params) {
    const user = await apiGet(`/users/${params.id}/`);
    const mainContent = document.getElementById('main-content');
    
    if (!user) {
        mainContent.innerHTML = '<div class="text-center py-12 text-gray-500">User not found</div>';
        return;
    }
    
    mainContent.innerHTML = `
        ${renderBreadcrumb([
            { text: 'Users', link: '/users' },
            { text: user.name }
        ])}
        ${renderPageHeader(user.name, `
            <div class="flex gap-2">
                <a href="#/users/${user.id}/edit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <i class="fas fa-edit mr-2"></i> Edit
                </a>
                <button onclick="deleteUser(${user.id})" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <i class="fas fa-trash mr-2"></i> Delete
                </button>
            </div>
        `)}
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-blue-600 text-2xl"></i>
                </div>
                <div>
                    <h2 class="text-xl font-bold text-gray-800">${user.name}</h2>
                    <p class="text-gray-500">${user.email}</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-6">
                <div>
                    <p class="text-sm text-gray-500">User ID</p>
                    <p class="text-lg font-semibold text-gray-800">#${user.id}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">Email Verified</p>
                    <p class="text-lg font-semibold text-green-600"><i class="fas fa-check-circle mr-1"></i> Yes</p>
                </div>
            </div>
        </div>
    `;
}

async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        await apiDelete(`/users/${id}/`);
        router();
    }
}

// ==========================================
// PRODUCTS
// ==========================================

async function renderProducts() {
    const products = await apiGet('/products/');
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        ${renderBreadcrumb([{ text: 'Products', link: '/products' }])}
        ${renderPageHeader('Products', `
            <a href="#/products/new" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                <i class="fas fa-plus mr-2"></i> Add Product
            </a>
        `)}
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            ${(products || []).map(product => `
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div class="h-32 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <i class="fas fa-box text-white text-4xl"></i>
                    </div>
                    <div class="p-4 sm:p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-2">${product.name}</h3>
                        <p class="text-2xl font-bold text-green-600 mb-4">$${product.price}</p>
                        <div class="flex justify-between items-center">
                            <a href="#/products/${product.id}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details <i class="fas fa-arrow-right ml-1"></i></a>
                            <div class="space-x-2">
                                <a href="#/products/${product.id}/edit" class="text-green-600 hover:text-green-800"><i class="fas fa-edit"></i></a>
                                <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('') || '<div class="col-span-full text-center py-12 text-gray-500">No products found</div>'}
        </div>
    `;
}

async function renderProductForm(params = {}) {
    const isEdit = window.location.hash.includes('/edit');
    const productId = params.id;
    let product = { name: '', price: '' };
    
    if (isEdit && productId) {
        product = await apiGet(`/products/${productId}/`) || product;
    }
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        ${renderBreadcrumb([
            { text: 'Products', link: '/products' },
            { text: isEdit ? 'Edit Product' : 'New Product' }
        ])}
        ${renderPageHeader(isEdit ? 'Edit Product' : 'Create New Product')}
        
        <div class="max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <form id="product-form" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input type="text" name="name" value="${product.name}" required
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter product name">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input type="number" name="price" value="${product.price}" required step="0.01"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter price">
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3 pt-4">
                    <button type="submit" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm">
                        <i class="fas fa-save mr-2"></i> ${isEdit ? 'Update' : 'Create'} Product
                    </button>
                    <a href="#/products" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-center">
                        <i class="fas fa-times mr-2"></i> Cancel
                    </a>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = { name: formData.get('name'), price: parseFloat(formData.get('price')) };
        
        if (isEdit) await apiPut(`/products/${productId}/`, data);
        else await apiPost('/products/', data);
        
        navigateTo('#/products');
    });
}

async function renderProductDetail(params) {
    const product = await apiGet(`/products/${params.id}/`);
    const mainContent = document.getElementById('main-content');
    
    if (!product) {
        mainContent.innerHTML = '<div class="text-center py-12 text-gray-500">Product not found</div>';
        return;
    }
    
    mainContent.innerHTML = `
        ${renderBreadcrumb([
            { text: 'Products', link: '/products' },
            { text: product.name }
        ])}
        ${renderPageHeader(product.name, `
            <div class="flex gap-2">
                <a href="#/products/${product.id}/edit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <i class="fas fa-edit mr-2"></i> Edit
                </a>
                <button onclick="deleteProduct(${product.id})" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <i class="fas fa-trash mr-2"></i> Delete
                </button>
            </div>
        `)}
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i class="fas fa-box text-white text-4xl"></i>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">${product.name}</h2>
                    <p class="text-3xl font-bold text-green-600 mt-2">$${product.price}</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200 pt-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-500">Product ID</p>
                    <p class="text-lg font-semibold text-gray-800">#${product.id}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-500">Price</p>
                    <p class="text-lg font-semibold text-green-600">$${product.price}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-500">Status</p>
                    <p class="text-lg font-semibold text-green-600"><i class="fas fa-check-circle mr-1"></i> Active</p>
                </div>
            </div>
        </div>
    `;
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        await apiDelete(`/products/${id}/`);
        router();
    }
}

// ==========================================
// ORDERS
// ==========================================

async function renderOrders() {
    const [orders, users, products] = await Promise.all([
        apiGet('/orders/'),
        apiGet('/users/'),
        apiGet('/products/')
    ]);
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        ${renderBreadcrumb([{ text: 'Orders', link: '/orders' }])}
        ${renderPageHeader('Orders', `
            <a href="#/orders/new" class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                <i class="fas fa-plus mr-2"></i> New Order
            </a>
        `)}
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${(orders || []).map(order => {
                            const user = users?.find(u => u.id == order.user);
                            const product = products?.find(p => p.id == order.product);
                            return `
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-4 py-4 text-sm font-semibold text-gray-900">#${order.id}</td>
                                    <td class="px-4 py-4">
                                        <div class="flex items-center gap-2">
                                            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <i class="fas fa-user text-blue-600 text-sm"></i>
                                            </div>
                                            <span class="text-sm text-gray-800">${user?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm text-gray-600">${product?.name || 'Unknown'}</td>
                                    <td class="px-4 py-4">
                                        <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">${order.quantity}</span>
                                    </td>
                                    <td class="px-4 py-4 text-right space-x-2">
                                        <a href="#/orders/${order.id}" class="text-blue-600 hover:text-blue-800 text-sm"><i class="fas fa-eye"></i></a>
                                        <a href="#/orders/${order.id}/edit" class="text-green-600 hover:text-green-800 text-sm"><i class="fas fa-edit"></i></a>
                                        <button onclick="deleteOrder(${order.id})" class="text-red-600 hover:text-red-800 text-sm"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `;
                        }).join('') || '<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">No orders found</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

async function renderOrderForm(params = {}) {
    const isEdit = window.location.hash.includes('/edit');
    const orderId = params.id;
    let order = { user: '', product: '', quantity: 1 };
    
    const [users, products] = await Promise.all([
        apiGet('/users/'),
        apiGet('/products/')
    ]);
    
    if (isEdit && orderId) {
        order = await apiGet(`/orders/${orderId}/`) || order;
    }
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        ${renderBreadcrumb([
            { text: 'Orders', link: '/orders' },
            { text: isEdit ? 'Edit Order' : 'New Order' }
        ])}
        ${renderPageHeader(isEdit ? 'Edit Order' : 'Create New Order')}
        
        <div class="max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <form id="order-form" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                    <select name="user" required
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white">
                        <option value="">Choose a user...</option>
                        ${(users || []).map(u => `
                            <option value="${u.id}" ${order.user == u.id ? 'selected' : ''}>${u.name} (${u.email})</option>
                        `).join('')}
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                    <select name="product" required
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white">
                        <option value="">Choose a product...</option>
                        ${(products || []).map(p => `
                            <option value="${p.id}" ${order.product == p.id ? 'selected' : ''}>${p.name} - $${p.price}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input type="number" name="quantity" value="${order.quantity}" required min="1"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter quantity">
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3 pt-4">
                    <button type="submit" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-sm">
                        <i class="fas fa-save mr-2"></i> ${isEdit ? 'Update' : 'Create'} Order
                    </button>
                    <a href="#/orders" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-center">
                        <i class="fas fa-times mr-2"></i> Cancel
                    </a>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('order-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            user: parseInt(formData.get('user')),
            product: parseInt(formData.get('product')),
            quantity: parseInt(formData.get('quantity'))
        };
        
        if (isEdit) await apiPut(`/orders/${orderId}/`, data);
        else await apiPost('/orders/', data);
        
        navigateTo('#/orders');
    });
}

async function renderOrderDetail(params) {
    const [orders, users, products] = await Promise.all([
        apiGet('/orders/'),
        apiGet('/users/'),
        apiGet('/products/')
    ]);
    
    const order = orders?.find(o => o.id == params.id);
    const user = users?.find(u => u.id == order?.user);
    const product = products?.find(p => p.id == order?.product);
    
    const mainContent = document.getElementById('main-content');
    
    if (!order) {
        mainContent.innerHTML = '<div class="text-center py-12 text-gray-500">Order not found</div>';
        return;
    }
    
    mainContent.innerHTML = `
        ${renderBreadcrumb([
            { text: 'Orders', link: '/orders' },
            { text: `Order #${order.id}` }
        ])}
        ${renderPageHeader(`Order #${order.id}`, `
            <div class="flex gap-2">
                <a href="#/orders/${order.id}/edit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <i class="fas fa-edit mr-2"></i> Edit
                </a>
                <button onclick="deleteOrder(${order.id})" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <i class="fas fa-trash mr-2"></i> Delete
                </button>
            </div>
        `)}
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Order Details</h3>
                
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-user text-blue-600"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Customer</p>
                                <p class="font-semibold text-gray-800">${user?.name || 'Unknown'}</p>
                                <p class="text-sm text-gray-500">${user?.email || ''}</p>
                            </div>
                        </div>
                        <a href="#/users/${user?.id}" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                    
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-box text-green-600"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Product</p>
                                <p class="font-semibold text-gray-800">${product?.name || 'Unknown'}</p>
                                <p class="text-sm text-gray-500">$${product?.price || '0'} each</p>
                            </div>
                        </div>
                        <a href="#/products/${product?.id}" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Summary</h3>
                
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Quantity</span>
                        <span class="font-semibold">${order.quantity}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Unit Price</span>
                        <span class="font-semibold">$${product?.price || '0'}</span>
                    </div>
                    <div class="border-t border-gray-200 pt-3 flex justify-between">
                        <span class="text-lg font-bold text-gray-800">Total</span>
                        <span class="text-lg font-bold text-purple-600">$${((product?.price || 0) * order.quantity).toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="mt-6 p-3 bg-green-50 rounded-lg text-center">
                    <span class="text-green-700 font-semibold"><i class="fas fa-check-circle mr-2"></i> Order Confirmed</span>
                </div>
            </div>
        </div>
    `;
}

async function deleteOrder(id) {
    if (confirm('Are you sure you want to delete this order?')) {
        await apiDelete(`/orders/${id}/`);
        router();
    }
}

// ==========================================
// ROUTER
// ==========================================

const routes = {
    '/': { handler: () => renderDashboard() },
    '/users': { handler: () => renderUsers() },
    '/users/new': { handler: () => renderUserForm() },
    '/users/:id': { handler: (params) => renderUserDetail(params) },
    '/users/:id/edit': { handler: (params) => renderUserForm(params) },
    '/products': { handler: () => renderProducts() },
    '/products/new': { handler: () => renderProductForm() },
    '/products/:id': { handler: (params) => renderProductDetail(params) },
    '/products/:id/edit': { handler: (params) => renderProductForm(params) },
    '/orders': { handler: () => renderOrders() },
    '/orders/new': { handler: () => renderOrderForm() },
    '/orders/:id': { handler: (params) => renderOrderDetail(params) },
    '/orders/:id/edit': { handler: (params) => renderOrderForm(params) }
};

function parseRoute(hash) {
    const path = hash.replace('#', '') || '/';
    if (routes[path]) return { route: routes[path], params: {} };
    
    for (const [pattern, route] of Object.entries(routes)) {
        if (pattern.includes(':id')) {
            const regex = new RegExp('^' + pattern.replace(':id', '(\\d+)') + '$');
            const match = path.match(regex);
            if (match) return { route, params: { id: match[1] } };
        }
    }
    return { route: routes['/'], params: {} };
}

function router() {
    const hash = window.location.hash;
    const { route, params } = parseRoute(hash);
    
    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-blue-600', 'text-white');
        link.classList.add('hover:bg-gray-800');
        
        const linkRoute = link.dataset.route;
        const currentPath = hash.replace('#', '').split('/')[1] || '';
        const linkPath = linkRoute.replace('/', '');
        
        if ((currentPath === '' && linkRoute === '/') || currentPath === linkPath) {
            link.classList.add('bg-blue-600', 'text-white');
            link.classList.remove('hover:bg-gray-800');
        }
    });
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<div class="flex items-center justify-center h-64"><i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i></div>';
    
    setTimeout(() => {
        try {
            route.handler(params);
        } catch (error) {
            console.error('Router error:', error);
            mainContent.innerHTML = `<div class="text-center py-12 text-red-500">Error: ${error.message}</div>`;
        }
    }, 100);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }
});
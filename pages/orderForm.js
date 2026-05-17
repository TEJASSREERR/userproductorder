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
        
        if (isEdit) {
            await apiPut(`/orders/${orderId}/`, data);
        } else {
            await apiPost('/orders/', data);
        }
        navigateTo('#/orders');
    });
}
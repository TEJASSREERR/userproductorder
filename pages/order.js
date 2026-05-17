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

async function deleteOrder(id) {
    if (confirm('Are you sure you want to delete this order?')) {
        await apiDelete(`/orders/${id}/`);
        router();
    }
}
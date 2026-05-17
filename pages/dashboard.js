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
                                    <p class="text-sm text-gray-500">by ${user?.name || 'Unknown'} • Qty: ${order.quantity}</p>
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
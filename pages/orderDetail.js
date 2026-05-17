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
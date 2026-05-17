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
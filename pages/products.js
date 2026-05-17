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
                            <a href="#/products/${product.id}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View Details <i class="fas fa-arrow-right ml-1"></i>
                            </a>
                            <div class="space-x-2">
                                <a href="#/products/${product.id}/edit" class="text-green-600 hover:text-green-800">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-800">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('') || '<div class="col-span-full text-center py-12 text-gray-500">No products found</div>'}
        </div>
    `;
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        await apiDelete(`/products/${id}/`);
        router();
    }
}
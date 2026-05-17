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
        const data = {
            name: formData.get('name'),
            price: parseFloat(formData.get('price'))
        };
        
        if (isEdit) {
            await apiPut(`/products/${productId}/`, data);
        } else {
            await apiPost('/products/', data);
        }
        navigateTo('#/products');
    });
}
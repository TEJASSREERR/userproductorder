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
        const data = {
            name: formData.get('name'),
            email: formData.get('email')
        };
        
        if (isEdit) {
            await apiPut(`/users/${userId}/`, data);
        } else {
            await apiPost('/users/', data);
        }
        navigateTo('#/users');
    });
}
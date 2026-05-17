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
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
                                    <a href="#/users/${user.id}" class="text-blue-600 hover:text-blue-800 text-sm">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <a href="#/users/${user.id}/edit" class="text-green-600 hover:text-green-800 text-sm">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-800 text-sm">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="4" class="px-4 py-8 text-center text-gray-500">No users found</td></tr>'}
                    </tbody>
                </table>
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
const routes = {
    '/': { handler: () => renderDashboard() },
    '/users': { handler: () => renderUsers() },
    '/users/new': { handler: () => renderUserForm() },
    '/users/:id': { handler: (params) => renderUserDetail(params) },
    '/users/:id/edit': { handler: (params) => renderUserForm(params) },
    '/products': { handler: () => renderProducts() },
    '/products/new': { handler: () => renderProductForm() },
    '/products/:id': { handler: (params) => renderProductDetail(params) },
    '/products/:id/edit': { handler: (params) => renderProductForm(params) },
    '/orders': { handler: () => renderOrders() },
    '/orders/new': { handler: () => renderOrderForm() },
    '/orders/:id': { handler: (params) => renderOrderDetail(params) },
    '/orders/:id/edit': { handler: (params) => renderOrderForm(params) }
};

function parseRoute(hash) {
    const path = hash.replace('#', '') || '/';
    if (routes[path]) return { route: routes[path], params: {} };
    
    for (const [pattern, route] of Object.entries(routes)) {
        if (pattern.includes(':id')) {
            const regex = new RegExp('^' + pattern.replace(':id', '(\\d+)') + '$');
            const match = path.match(regex);
            if (match) return { route, params: { id: match[1] } };
        }
    }
    return { route: routes['/'], params: {} };
}

function router() {
    const hash = window.location.hash;
    const { route, params } = parseRoute(hash);
    
    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-blue-600', 'text-white');
        link.classList.add('hover:bg-gray-800');
    });
    
    const currentPath = hash.replace('#', '').split('/')[1] || '';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkRoute = link.dataset.route.replace('/', '');
        if ((currentPath === '' && link.dataset.route === '/') || currentPath === linkRoute) {
            link.classList.add('bg-blue-600', 'text-white');
            link.classList.remove('hover:bg-gray-800');
        }
    });
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<div class="flex items-center justify-center h-64"><i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i></div>';
    
    setTimeout(() => route.handler(params), 100);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('menu-btn')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('-translate-x-full');
    });
});
function parseJwt(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(decodeURIComponent(window.atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')));
    } catch (e) { return null; }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast--${type}`;
    setTimeout(() => toast.classList.add('hidden-toast'), 3200);
}

// --- INIT ---
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    if (!token) { window.location.href = 'login.html'; return; }

    const decoded = parseJwt(token);
    if (!decoded || decoded.role !== 'entregador') {
        alert('Acesso negado. Apenas entregadores podem acessar esta página.');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('entregador-nome').textContent =
        decoded.nome || `Entregador ${decoded.sub}`;

    carregarPedidos();
});

// --- CARREGAR PEDIDOS DISPONÍVEIS ---
async function carregarPedidos() {
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = '<div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i> Buscando pedidos...</div>';

    try {
        const res = await fetch('/api/pedidos/disponiveis-entrega', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            lista.innerHTML = '<div class="empty-state">Erro ao carregar pedidos.</div>';
            return;
        }

        const pedidos = await res.json();

        if (pedidos.length === 0) {
            lista.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-motorcycle"></i>
                    Nenhum pedido em rota de entrega no momento.
                </div>`;
            return;
        }

        lista.innerHTML = pedidos.map(p => `
            <article class="order-admin-card" id="card-${p.cdPedido}">
                <div class="order-admin-top">
                    <div class="order-admin-header-info">
                        <h3><i class="fa-solid fa-receipt"></i> Pedido #${p.cdPedido}</h3>
                        <div class="order-admin-meta">
                            <span><i class="fa-regular fa-user"></i> ${p.cpfCliente}</span>
                            <span class="bullet">•</span>
                            <span><i class="fa-regular fa-calendar"></i> ${p.data}</span>
                            <span class="bullet">•</span>
                            <span class="order-value">${formatCurrency(p.valorTotal)}</span>
                        </div>
                    </div>
                    <span class="status-badge status-saiu-para-entrega">Em rota</span>
                </div>
                <div class="order-action-row">
                    <button type="button"
                            class="order-action-btn order-action-btn--accept"
                            onclick="confirmarEntrega(${p.cdPedido})"
                            style="background: #1a9c59;">
                        <i class="fa-solid fa-circle-check"></i> Confirmar entrega
                    </button>
                </div>
            </article>
        `).join('');

    } catch (err) {
        lista.innerHTML = '<div class="empty-state">Erro de conexão com o servidor.</div>';
        console.error(err);
    }
}

// --- CONFIRMAR ENTREGA ---
async function confirmarEntrega(cdPedido) {
    const btn = document.querySelector(`#card-${cdPedido} .order-action-btn`);
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Confirmando...'; }

    try {
        const res = await fetch(`/api/pedidos/${cdPedido}/confirmar-entrega`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            showToast(`Pedido #${cdPedido} entregue com sucesso! ✅`, 'success');
            document.getElementById(`card-${cdPedido}`)?.remove();

            const lista = document.getElementById('lista-pedidos');
            if (!lista.querySelector('.order-admin-card')) {
                lista.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-motorcycle"></i>
                        Nenhum pedido em rota de entrega no momento.
                    </div>`;
            }
        } else {
            const msg = await res.text();
            showToast(`Erro ${res.status}: ${msg || 'Falha ao confirmar'}`, 'error');
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Confirmar entrega'; }
        }
    } catch (err) {
        showToast('Erro de conexão com o servidor.', 'error');
        console.error(err);
    }
}
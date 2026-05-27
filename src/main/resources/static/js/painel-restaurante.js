// =============================================================
//  Dev-livery — Painel do Restaurante (Parceiro)
//  Fluxo de status: Pendente → Em preparo → Saiu para entrega
// =============================================================

// --- UTILITÁRIOS ---
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(jsonPayload);
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

// --- ESTADO GLOBAL ---
const tokenPainel = localStorage.getItem('token');
let cdRestauranteLogado = null;
let dadosRestauranteAtual = null;
let pendingDeliveryOrderId = null;
let qtdPedidosPendentes = 0;
let faturamentoTotal = 0;
let totalProdutosAtivos = 0;
let abaAtiva = 'Pendente';

// Contadores por aba
const contadores = { 'Pendente': 0, 'Em preparo': 0, 'Saiu para entrega': 0 };

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', async () => {
    if (!tokenPainel) { window.location.href = 'login.html'; return; }

    const decoded = parseJwt(tokenPainel);
    if (!decoded || decoded.role !== 'parceiro') {
        alert('Acesso negado. Apenas parceiros podem acessar esta página.');
        window.location.href = 'index.html';
        return;
    }

    const cpfParceiro = decoded.sub;

    try {
        const params = new URLSearchParams(window.location.search);
        const cdRestauranteParam = params.get('cdRestaurante');

        const urlRestaurante = cdRestauranteParam
            ? `/api/restaurantes/cd/${cdRestauranteParam}`
            : `/api/restaurantes/${cpfParceiro}`;

        const resRestaurante = await fetch(urlRestaurante, {
            headers: { 'Authorization': `Bearer ${tokenPainel}` }
        });

        if (resRestaurante.ok) {
            const restaurante = await resRestaurante.json();
            cdRestauranteLogado = restaurante.cdRestaurante;
            dadosRestauranteAtual = restaurante;
            preencherHero(restaurante);

            await Promise.all([
                carregarFaturamento(),
                carregarTodosPedidos(),
                carregarProdutos()
            ]);

            renderMetrics();
            bindFormEvents();
            bindDeliveryModal();
        } else {
            alert('Você ainda não cadastrou um restaurante!');
            window.location.href = 'criar-restaurante.html';
        }
    } catch (error) {
        console.error('Erro ao inicializar:', error);
    }
});

// --- HERO ---
function preencherHero(restaurante) {
    document.getElementById('admin-restaurant-name').textContent = restaurante.nome;
    document.getElementById('admin-restaurant-description').textContent =
        restaurante.descricao || 'Gerencie produtos, pedidos e operação do seu restaurante.';
    document.getElementById('admin-restaurant-rating').textContent =
        restaurante.nota ? restaurante.nota.toFixed(1) : '5.0';
    document.getElementById('admin-restaurant-category').textContent = restaurante.categoria || 'Geral';
    document.getElementById('admin-restaurant-time').textContent = restaurante.tempoEntrega || '30-45 min';
}

// --- MÉTRICAS ---
async function carregarFaturamento() {
    try {
        const response = await fetch(`/api/pedidos/restaurante/${cdRestauranteLogado}/faturamento`, {
            headers: { 'Authorization': `Bearer ${tokenPainel}` }
        });
        if (response.ok) faturamentoTotal = await response.json();
    } catch (error) {
        console.error('Erro ao carregar faturamento:', error);
    }
}

function renderMetrics() {
    document.getElementById('admin-metrics').innerHTML = `
        <article class="metric-card">
            <span class="metric-icon metric-icon--green"><i class="fa-solid fa-sack-dollar"></i></span>
            <span class="metric-label">Faturamento total</span>
            <strong>${formatCurrency(faturamentoTotal)}</strong>
            <span class="metric-note">Pedidos concluídos</span>
        </article>
        <article class="metric-card">
            <span class="metric-icon metric-icon--orange"><i class="fa-solid fa-clock"></i></span>
            <span class="metric-label">Pedidos pendentes</span>
            <strong>${contadores['Pendente']}</strong>
            <span class="metric-note">Aguardando confirmação</span>
        </article>
        <article class="metric-card">
            <span class="metric-icon metric-icon--red"><i class="fa-solid fa-fire-burner"></i></span>
            <span class="metric-label">Em preparo</span>
            <strong>${contadores['Em preparo']}</strong>
            <span class="metric-note">Na cozinha agora</span>
        </article>
        <article class="metric-card">
            <span class="metric-icon metric-icon--blue"><i class="fa-solid fa-boxes-stacked"></i></span>
            <span class="metric-label">Produtos no cardápio</span>
            <strong>${totalProdutosAtivos}</strong>
            <span class="metric-note">Itens ativos</span>
        </article>
    `;

    document.getElementById('finance-summary').innerHTML = `
        <div class="finance-summary-row">
            <span class="finance-label">Total faturado</span>
            <span class="finance-value">${formatCurrency(faturamentoTotal)}</span>
        </div>
        <div class="finance-summary-row">
            <span class="finance-label">Pedidos pendentes</span>
            <span class="finance-value">${contadores['Pendente']}</span>
        </div>
        <div class="finance-summary-row">
            <span class="finance-label">Em preparo</span>
            <span class="finance-value">${contadores['Em preparo']}</span>
        </div>
        <div class="finance-summary-row">
            <span class="finance-label">Saiu para entrega</span>
            <span class="finance-value">${contadores['Saiu para entrega']}</span>
        </div>
        <div style="margin-top: 20px;">
            <button onclick="recalcularNotas()" class="admin-primary-btn" style="width: 100%; background: var(--admin-warning);">
                <i class="fa-solid fa-star"></i> Recalcular Notas
            </button>
        </div>
    `;
}

// --- KANBAN DE PEDIDOS ---

async function carregarTodosPedidos() {
    // Carrega os três painéis em paralelo
    await Promise.all([
        carregarPedidosPorStatus('Pendente'),
        carregarPedidosPorStatus('Em preparo'),
        carregarPedidosPorStatus('Saiu para entrega')
    ]);
    renderMetrics();
}

async function carregarPedidosPorStatus(status) {
    const statusEncoded = encodeURIComponent(status);
    try {
        const response = await fetch(
            `/api/pedidos/restaurante/${cdRestauranteLogado}/status/${statusEncoded}`,
            { headers: { 'Authorization': `Bearer ${tokenPainel}` } }
        );

        // Fallback: usa endpoint legado de pendentes se a rota nova não existir
        let pedidos = [];
        if (response.ok) {
            pedidos = await response.json();
        } else if (status === 'Pendente') {
            const fallback = await fetch(
                `/api/pedidos/restaurante/${cdRestauranteLogado}/pendentes`,
                { headers: { 'Authorization': `Bearer ${tokenPainel}` } }
            );
            if (fallback.ok) pedidos = await fallback.json();
        }

        contadores[status] = pedidos.length;
        atualizarBadgeAba(status, pedidos.length);
        renderPedidos(status, pedidos);

    } catch (error) {
        console.error(`Erro ao buscar pedidos (${status}):`, error);
    }
}

function atualizarBadgeAba(status, count) {
    const badgeMap = {
        'Pendente': 'badge-pendente',
        'Em preparo': 'badge-preparo',
        'Saiu para entrega': 'badge-entrega'
    };
    const badge = document.getElementById(badgeMap[status]);
    if (badge) badge.textContent = count;
}

function renderPedidos(status, pedidos) {
    const container = document.getElementById(`list-${status}`);
    if (!container) return;

    if (pedidos.length === 0) {
        const emptyMessages = {
            'Pendente': '<i class="fa-regular fa-clock"></i> Nenhum pedido pendente no momento.',
            'Em preparo': '<i class="fa-solid fa-fire-burner"></i> Nenhum pedido em preparo.',
            'Saiu para entrega': '<i class="fa-solid fa-motorcycle"></i> Nenhum pedido em rota de entrega.'
        };
        container.innerHTML = `<div class="empty-state">${emptyMessages[status] || 'Nenhum pedido.'}</div>`;
        return;
    }

    container.innerHTML = pedidos.map(pedido => buildOrderCard(pedido, status)).join('');
}

function buildOrderCard(pedido, status) {
    const badgeClass = {
        'Pendente': 'status-pendente',
        'Em preparo': 'status-em-preparo',
        'Saiu para entrega': 'status-saiu-para-entrega'
    }[status] || '';

    const actionBtn = buildActionButton(pedido.cdPedido, status);

    return `
        <article class="order-admin-card" id="order-card-${pedido.cdPedido}">
            <div class="order-admin-top">
                <div class="order-admin-header-info">
                    <h3><i class="fa-solid fa-receipt"></i> Pedido #${pedido.cdPedido}</h3>
                    <div class="order-admin-meta">
                        <span><i class="fa-regular fa-user"></i> ${pedido.cpfCliente}</span>
                        <span class="bullet">•</span>
                        <span><i class="fa-regular fa-calendar"></i> ${pedido.data}</span>
                        <span class="bullet">•</span>
                        <span class="order-value">${formatCurrency(pedido.valorTotal)}</span>
                    </div>
                </div>
                <span class="status-badge ${badgeClass}">${status}</span>
            </div>
            ${actionBtn ? `<div class="order-action-row">${actionBtn}</div>` : ''}
        </article>
    `;
}

function buildActionButton(cdPedido, status) {
    if (status === 'Pendente') {
        return `
            <button type="button" class="order-action-btn order-action-btn--accept"
                    onclick="aceitarPedido(${cdPedido})">
                <i class="fa-solid fa-fire-burner"></i> Aceitar e iniciar preparo
            </button>
        `;
    }
    if (status === 'Em preparo') {
        return `
            <button type="button" class="order-action-btn order-action-btn--deliver"
                    onclick="abrirModalEntrega(${cdPedido})">
                <i class="fa-solid fa-motorcycle"></i> Enviar para entrega
            </button>
        `;
    }
    // Saiu para entrega — sem ação do restaurante
    return `<span class="order-tracking-note"><i class="fa-solid fa-location-dot fa-beat"></i> Pedido a caminho do cliente</span>`;
}

// --- AÇÕES DE STATUS ---

async function aceitarPedido(cdPedido) {
    const btn = document.querySelector(`#order-card-${cdPedido} .order-action-btn`);
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...'; }

    try {
        const response = await fetch(`/api/pedidos/${cdPedido}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenPainel}`
            },
            body: JSON.stringify({ status: 'Em preparo' })
        });

        if (response.ok) {
            showToast(`Pedido #${cdPedido} aceito! Agora está em preparo.`, 'success');
            await carregarTodosPedidos();
            mudarAba(document.querySelector('[data-status="Em preparo"]'), 'Em preparo');
        } else {
            const msg = await response.text();
            showToast(`Erro: ${msg}`, 'error');
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-fire-burner"></i> Aceitar e iniciar preparo'; }
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro de conexão com o servidor.', 'error');
    }
}

function abrirModalEntrega(cdPedido) {
    pendingDeliveryOrderId = cdPedido;
    document.getElementById('delivery-confirm-modal').classList.remove('hidden-modal');
}

async function confirmarEnvioEntrega() {
    if (!pendingDeliveryOrderId) return;

    const cdPedido = pendingDeliveryOrderId;
    fecharModalEntrega();

    try {
        const response = await fetch(`/api/pedidos/${cdPedido}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenPainel}`
            },
            body: JSON.stringify({ status: 'Saiu para entrega' })
        });

        if (response.ok) {
            showToast(`Pedido #${cdPedido} saiu para entrega! 🛵`, 'success');
            await carregarTodosPedidos();
            mudarAba(document.querySelector('[data-status="Saiu para entrega"]'), 'Saiu para entrega');
        } else {
            const msg = await response.text();
            showToast(`Erro: ${msg}`, 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast('Erro de conexão com o servidor.', 'error');
    }
}

function fecharModalEntrega() {
    pendingDeliveryOrderId = null;
    document.getElementById('delivery-confirm-modal').classList.add('hidden-modal');
}

function bindDeliveryModal() {
    document.getElementById('confirm-delivery-btn')?.addEventListener('click', confirmarEnvioEntrega);
    document.getElementById('cancel-delivery-btn')?.addEventListener('click', fecharModalEntrega);
}

// --- ABAS KANBAN ---
function mudarAba(tabEl, status) {
    if (!tabEl) return;

    document.querySelectorAll('.kanban-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.kanban-panel').forEach(p => p.classList.remove('active'));

    tabEl.classList.add('active');
    abaAtiva = status;

    const panel = document.getElementById(`panel-${status}`);
    if (panel) panel.classList.add('active');
}

// --- RECALCULAR NOTAS ---
async function recalcularNotas() {
    if (!confirm('Deseja recalcular a nota de todos os produtos usando a Procedure do Banco?')) return;

    try {
        const response = await fetch(`/api/restaurantes/${cdRestauranteLogado}/recalcular-notas`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${tokenPainel}` }
        });

        if (response.ok) {
            showToast('Notas recalculadas com sucesso!', 'success');
            carregarProdutos();
        } else {
            showToast('Erro ao executar a Procedure.', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// --- PRODUTOS ---
async function carregarProdutos() {
    try {
        const response = await fetch(`/api/produtos/restaurante/${cdRestauranteLogado}`, {
            headers: { 'Authorization': `Bearer ${tokenPainel}` }
        });

        const container = document.getElementById('products-admin-grid');

        if (response.ok) {
            const produtos = await response.json();
            totalProdutosAtivos = produtos.length;
            renderMetrics();

            if (produtos.length === 0) {
                container.innerHTML = '<div class="empty-state">O seu cardápio está vazio. Adicione novos produtos acima!</div>';
                return;
            }


            container.innerHTML = produtos.map(prod => {
                const nomeImagem = prod.nomeImagem;
                const imgSrc = nomeImagem ? `/images/prod/${nomeImagem}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';

                return `
                <article class="product-admin-card">
                    <img src="${imgSrc}" alt="${prod.nome}">
                    <div class="product-admin-body">
                        <div class="product-admin-title-row">
                            <h3>${prod.nome}</h3>
                            <strong>${formatCurrency(prod.preco)}</strong>
                        </div>
                        <p class="product-admin-desc">${prod.descricao}</p>
                        <p class="product-admin-rating"><i class="fa-solid fa-star"></i> ${prod.nota ? prod.nota.toFixed(1) : '0.0'}</p>
                        <div class="product-admin-actions">
                            <button type="button" class="product-edit-btn"
                                    onclick="editarProduto(${prod.cdProduto}, '${prod.nome.replace(/'/g, "\\'")}', '${prod.descricao.replace(/'/g, "\\'")}', ${prod.preco})">
                                <i class="fa-solid fa-pen"></i> Editar
                            </button>
                            <button type="button" class="product-delete-btn"
                                    onclick="apagarProduto(${prod.cdProduto})">
                                <i class="fa-solid fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                </article>
            `;}).join('');
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

function resetProductForm() {
    document.getElementById('product-form').reset();
    document.getElementById('editing-product-id').value = '';
    document.getElementById('product-submit-btn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salvar produto';
    document.getElementById('product-form-feedback').textContent = '';
    document.getElementById('product-form-feedback').className = 'form-feedback';
    document.getElementById('product-image-preview').classList.add('hidden-preview');
}

function editarProduto(id, nome, desc, preco) {
    document.getElementById('editing-product-id').value = id;
    document.getElementById('product-name').value = nome;
    document.getElementById('product-description').value = desc;
    document.getElementById('product-price').value = preco;
    document.getElementById('product-submit-btn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Atualizar produto';
    window.scrollTo({ top: document.getElementById('product-form').offsetTop - 100, behavior: 'smooth' });
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const precoInput = parseFloat(document.getElementById('product-price').value);
    const feedback = document.getElementById('product-form-feedback');

    if (precoInput < 0) {
        feedback.textContent = 'O preço não pode ser negativo.';
        feedback.className = 'form-feedback error';
        return;
    }

    if (!cdRestauranteLogado) {
        feedback.textContent = 'Erro: Restaurante não carregado.';
        feedback.className = 'form-feedback error';
        return;
    }

    const id = document.getElementById('editing-product-id').value;
    const produtoDTO = {
        nome: document.getElementById('product-name').value,
        descricao: document.getElementById('product-description').value,
        preco: precoInput,
        cdRestaurante: cdRestauranteLogado,
        nota: 0.0
    };

    const isEdicao = id !== '';
    const url = isEdicao ? `/api/produtos/${id}` : '/api/produtos';
    const method = isEdicao ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenPainel}`
            },
            body: JSON.stringify(produtoDTO)
        });

        if (response.ok) {
            const produtoId = isEdicao ? id : await response.text();

            const imagemFile = document.getElementById('product-image-file').files[0];
            if (imagemFile) {
                const formData = new FormData();
                formData.append('imagem', imagemFile);

                await fetch(`/api/produtos/${produtoId}/imagem`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${tokenPainel}` },
                    body: formData
                });
            }

            resetProductForm();
            await carregarProdutos();
            feedback.textContent = isEdicao ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!';
            feedback.className = 'form-feedback success';
            showToast(isEdicao ? 'Produto atualizado!' : 'Produto cadastrado!', 'success');
        } else {
            const erroMensagem = await response.text();
            feedback.textContent = `Erro: ${erroMensagem}`;
            feedback.className = 'form-feedback error';
        }
    } catch (error) {
        feedback.textContent = 'Erro de conexão com o servidor.';
        feedback.className = 'form-feedback error';
    }
}

async function apagarProduto(id) {
    if (!confirm('Tem certeza que deseja apagar este produto?')) return;

    try {
        const response = await fetch(`/api/produtos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${tokenPainel}` }
        });

        if (response.ok) {
            showToast('Produto excluído.', 'success');
            carregarProdutos();
        } else {
            showToast('Erro ao excluir. O produto pode estar em um pedido ativo.', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// --- MODAL EDIÇÃO DO RESTAURANTE ---
async function carregarCategoriasModal() {
    try {
        const response = await fetch('/api/categorias');
        if (response.ok) {
            const categorias = await response.json();
            const select = document.getElementById('edit-rest-categoria');
            select.innerHTML = '<option value="" disabled selected>Selecione uma categoria...</option>';
            categorias.forEach(cat => {
                select.innerHTML += `<option value="${cat.cdCategoria}">${cat.nome}</option>`;
            });
        }
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

async function abrirModalEdicao() {
    await carregarCategoriasModal();

    document.getElementById('edit-rest-nome').value = dadosRestauranteAtual?.nome || '';
    document.getElementById('edit-rest-telefone').value = dadosRestauranteAtual?.telefoneRestaurante || '';
    document.getElementById('edit-rest-tempo').value = dadosRestauranteAtual?.tempoEntrega || '';
    if (dadosRestauranteAtual?.cdCategoria) {
        document.getElementById('edit-rest-categoria').value = dadosRestauranteAtual.cdCategoria;
    }

    const telInput = document.getElementById('edit-rest-telefone');
    telInput.addEventListener('input', () => {
        const digits = telInput.value.replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 2) telInput.value = digits.length ? `(${digits}` : '';
        else if (digits.length <= 7) telInput.value = `(${digits.slice(0,2)}) ${digits.slice(2)}`;
        else telInput.value = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
    });

    document.getElementById('edit-restaurant-modal').classList.remove('hidden-modal');
}

function fecharModalEdicao() {
    document.getElementById('edit-restaurant-modal').classList.add('hidden-modal');
}

document.getElementById('edit-restaurant-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {};
    const nome = document.getElementById('edit-rest-nome').value.trim();
    const telefone = document.getElementById('edit-rest-telefone').value.trim();
    const tempo = document.getElementById('edit-rest-tempo').value.trim();
    const categoria = document.getElementById('edit-rest-categoria').value;

    // Captura o arquivo de imagem
    const imagemFile = document.getElementById('edit-rest-imagem').files[0];

    if (nome) dados.nome = nome;
    if (telefone) dados.telefoneRestaurante = telefone;
    if (tempo) dados.tempoEntrega = parseInt(tempo);
    if (categoria) dados.cdCategoria = parseInt(categoria);

    if (Object.keys(dados).length === 0 && !imagemFile) {
        showToast('Preencha ao menos um campo ou envie uma foto para atualizar.', 'error');
        return;
    }

    try {
        // 1. Atualiza os dados de texto, se houver alteração
        if (Object.keys(dados).length > 0) {
            const responseText = await fetch(`/api/restaurantes/${cdRestauranteLogado}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenPainel}`
                },
                body: JSON.stringify(dados)
            });
            if (!responseText.ok) {
                const msg = await responseText.text();
                showToast('Erro ao atualizar dados: ' + msg, 'error');
                return;
            }
        }

        // 2. Faz o upload da nova imagem se o usuário escolheu um arquivo
        if (imagemFile) {
            const formData = new FormData();
            formData.append('imagem', imagemFile);
            const responseImg = await fetch(`/api/restaurantes/${cdRestauranteLogado}/imagem`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${tokenPainel}` },
                body: formData
            });
            if (!responseImg.ok) {
                showToast('Erro ao atualizar a foto de capa.', 'error');
                return;
            }
        }

        showToast('Restaurante atualizado com sucesso!', 'success');
        fecharModalEdicao();

        // Recarrega a página forçando limpeza do cache após um segundo para a nova imagem carregar
        setTimeout(() => location.reload(true), 1000);

    } catch (error) {
        console.error('Erro ao editar restaurante:', error);
        showToast('Erro de conexão com o servidor.', 'error');
    }
});

// Adicione esta nova função em qualquer lugar no final do arquivo:
async function apagarRestaurante() {
    if (!confirm("Tem certeza absoluta? O restaurante será apagado do sistema se não houver pedidos no histórico.")) return;

    try {
        const res = await fetch(`/api/restaurantes/${cdRestauranteLogado}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${tokenPainel}` }
        });

        if (res.ok) {
            alert("Restaurante excluído com sucesso.");
            window.location.href = "meus-restaurantes.html";
        } else {
            const msg = await res.text();
            showToast(msg, 'error'); // Mostra a mensagem gerada pela proteção do Banco de Dados
            fecharModalEdicao();
        }
    } catch (error) {
        showToast("Erro ao tentar excluir.", 'error');
    }
}

function bindFormEvents() {
    document.getElementById('product-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('reset-form-btn').addEventListener('click', resetProductForm);
    document.getElementById('cancel-edit-btn').addEventListener('click', resetProductForm);
}
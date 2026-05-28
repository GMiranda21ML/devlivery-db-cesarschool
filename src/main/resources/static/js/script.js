let listaRestaurantesOriginal = [];
let currentCategory = 'todos';
let currentFilter = 'Todos';
let currentSearch = '';
let currentQuickFilter = 'todos';
let advancedFilters = { minNota: 0, maxFrete: 999 };

async function carregarCategorias() {
    try {
        const response = await fetch('/api/categorias');
        if (response.ok) {
            const categoriasDB = await response.json();
            renderCategories(categoriasDB);
        }
    } catch (error) {
        console.error('Erro ao buscar categorias do banco:', error);
    }
}

function renderCategories(categorias) {
    const container = document.getElementById('categories-container');
    if (!container) return;
    container.innerHTML = '';

    categorias.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.style.cursor = 'pointer';

        const bgImage = `/images/cat/cat_${category.cdCategoria}.jpg`;

        card.onclick = () => {
            currentSearch = '';
            const searchInput = document.querySelector('.search-bar input');
            if(searchInput) searchInput.value = '';

            // Tira a seleção dos botões de filtro e volta para o "Todos"
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            const btnTodos = document.querySelector('.quick-filter[data-filter="todos"]');
            if(btnTodos) btnTodos.classList.add('active');
            currentQuickFilter = 'todos';

            // SALVA O NOME E BUSCA DIRETO DA API!
            currentCategory = category.nome;
            carregarRestaurantes(currentCategory);
        };

        card.innerHTML = `
            <img src="${bgImage}" alt="${category.nome}" class="category-img" onerror="this.src='https://via.placeholder.com/200?text=Sem+Foto'">
            <span class="category-name">${category.nome}</span>
        `;
        container.appendChild(card);
    });
}

// AGORA A FUNÇÃO SABE BUSCAR POR CATEGORIA NO BACKEND
async function carregarRestaurantes(categoriaBusca = 'todos') {
    try {
        // Se for 'todos' chama a rota geral, se tiver categoria chama a rota específica!
        const url = (categoriaBusca === 'todos')
            ? '/api/restaurantes'
            : `/api/restaurantes/categoria/${encodeURIComponent(categoriaBusca)}`;

        const response = await fetch(url);
        if (response.ok) {
            listaRestaurantesOriginal = await response.json();
            applyFilters(); // Desenha na tela mantendo filtros rápidos (ex: grátis) se houver
        }
    } catch (error) {
        console.error("Erro ao carregar restaurantes:", error);
    }
}

function renderRestaurants(restaurantes) {
    const container = document.getElementById('restaurants-container');
    if (!container) return;
    container.innerHTML = '';

    if (!restaurantes || restaurantes.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Nenhum restaurante encontrado.</p>';
        return;
    }

    restaurantes.forEach((restaurant) => {
        const id = restaurant.cdRestaurante;
        const nomeImagemDoBanco = restaurant.nomeImagem;
        const bgImage = nomeImagemDoBanco ? `/images/rest/${nomeImagemDoBanco}` : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop';
        const nomeSeguro = restaurant.nome || 'Restaurante';
        const sigla = nomeSeguro.substring(0, 2).toUpperCase();

        const notaFormatada = restaurant.nota ? restaurant.nota.toFixed(1) : '5.0';
        const tempoFormatado = restaurant.tempoEntrega ? `${restaurant.tempoEntrega} min` : '30-40 min';

        let freteTexto = restaurant.taxaEntrega > 0 ? `R$ ${restaurant.taxaEntrega.toFixed(2).replace('.', ',')}` : 'Grátis';
        let freteStyle = restaurant.taxaEntrega > 0 ? 'color: var(--text-color); font-weight: 500' : 'color: #1da55a; font-weight: 600';

        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.onclick = () => window.location.href = `restaurante.html?cdRestaurante=${id}`;
        card.innerHTML = `
            <img src="${bgImage}" class="restaurant-cover" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop'">
            <div class="restaurant-info">
                <div class="restaurant-logo" style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--primary-color), #ff6b6b); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-weight: 700; font-size: 18px;">${sigla}</span>
                </div>
                <div class="restaurant-details">
                    <div class="restaurant-header">
                        <h4>${nomeSeguro}</h4>
                        <div class="rating"><i class="fa-solid fa-star"></i> <span>${notaFormatada}</span></div>
                    </div>
                    <div class="restaurant-meta">
                        <span>${restaurant.bairro || 'Delivery'}</span>
                        <i class="fa-solid fa-circle bullet"></i>
                        <span>${tempoFormatado}</span>
                        <i class="fa-solid fa-circle bullet"></i>
                        <span style="${freteStyle}">${freteTexto}</span>
                    </div>
                </div>
            </div>`;
        container.appendChild(card);
    });
}

function initFilters() {
    const quickBtns = document.querySelectorAll('.quick-filter');
    const searchInput = document.querySelector('.search-bar input');

    quickBtns.forEach(btn => {
        // A função precisa ser 'async' para esperar a resposta do banco de dados
        btn.addEventListener('click', async () => {
            quickBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Pega o filtro clicado (ex: "super", "premium") e converte para minúsculo
            currentQuickFilter = btn.dataset.filter.toLowerCase();

            if (currentQuickFilter === 'todos' && currentCategory !== 'todos') {
                currentCategory = 'todos';
                carregarRestaurantes('todos');
            }
                        else if (currentQuickFilter === 'super') {
                            try {
                                const res = await fetch('/api/relatorios/super-restaurantes');
                                if (res.ok) {
                                    const idsSuper = await res.json();
                                    // Compara exatamente pelo ID do restaurante!
                                    const filtrados = listaRestaurantesOriginal.filter(r => idsSuper.includes(r.cdRestaurante));
                                    renderRestaurants(filtrados);
                                }
                            } catch (e) { console.error("Erro ao buscar Query 1:", e); }
                        }
                        else if (currentQuickFilter === 'premium') {
                            try {
                                const token = localStorage.getItem('token');
                                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

                                const res = await fetch('/api/relatorios/produtos-premium', { headers });
                                if (res.ok) {
                                    const produtosPremium = await res.json();
                                    renderProdutosPremium(produtosPremium);
                                } else {
                                     console.error("Bloqueado pelo Spring Security (403)");
                                }
                            } catch (e) { console.error("Erro ao buscar Query 4:", e); }
                        }
            else {
                applyFilters(); // Aplica filtros simples da tela (grátis, rápidos)
            }
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            applyFilters();
        });
    }

    // Modal de Filtros Avançados
    const modal = document.getElementById('modal-filtros');
    const btnOpen = document.getElementById('btn-filtros-avancados');
    const btnClose = document.querySelector('.close-modal');
    const btnApply = document.getElementById('aplicar-filtros-avancados');
    const rangeNota = document.getElementById('filtro-nota');
    const labelNota = document.getElementById('valor-nota');
    const rangeFrete = document.getElementById('filtro-frete');
    const labelFrete = document.getElementById('valor-frete');

    if(btnOpen && modal) {
        btnOpen.onclick = () => modal.style.display = 'flex';
        btnClose.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };

        rangeNota.oninput = () => labelNota.textContent = rangeNota.value > 0 ? `Acima de ${rangeNota.value}` : 'Todas';
        rangeFrete.oninput = () => labelFrete.textContent = rangeFrete.value < 30 ? `Até R$ ${rangeFrete.value},00` : 'Qualquer valor';

        btnApply.onclick = () => {
            advancedFilters.minNota = parseFloat(rangeNota.value);
            advancedFilters.maxFrete = parseFloat(rangeFrete.value);
            quickBtns.forEach(b => b.classList.remove('active'));
            currentQuickFilter = 'todos';
            modal.style.display = 'none';
            applyFilters();
        };
    }
}

// =================================================================
// FUNÇÃO PARA EXIBIR A QUERY 4 (Adicione no final do arquivo)
// =================================================================
function renderProdutosPremium(produtos) {
    const container = document.getElementById('restaurants-container');
    if (!container) return;
    container.innerHTML = '';

    if (!produtos || produtos.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px 0;">Nenhum produto superou a média de preços.</p>';
        return;
    }

    produtos.forEach((prod) => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.padding = '20px';
        card.style.gap = '15px';

        card.style.cursor = 'pointer';
        card.onclick = () => window.location.href = `restaurante.html?cdRestaurante=${prod.cdRestaurante}`;

        card.innerHTML = `
            <div style="width: 50px; height: 50px; background: #e8f8f5; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #2ecc71; font-size: 20px;">
                <i class="fa-solid fa-crown"></i>
            </div>
            <div style="flex: 1;">
                <h4 style="margin: 0; font-size: 1.1rem; color: #333;">${prod.nome}</h4>
                <span style="color: #ea1d2c; font-weight: bold; display: block; margin-top: 5px;">
                    R$ ${prod.preco.toFixed(2).replace('.', ',')}
                </span>
            </div>
            <i class="fa-solid fa-chevron-right" style="color: #ccc;"></i>
        `;
        container.appendChild(card);
    });
}

function applyFilters() {
    let filtrados = listaRestaurantesOriginal;

    // O filtro local de categoria foi removido porque a API já envia a lista correta!

    if (currentSearch) {
        filtrados = filtrados.filter(rest =>
            rest.nome && rest.nome.toLowerCase().includes(currentSearch)
        );
    }

    if (currentQuickFilter === 'gratis') {
        filtrados = filtrados.filter(rest => rest.taxaEntrega === 0);
    } else if (currentQuickFilter === 'avaliados' || currentQuickFilter === 'melhores') {
        filtrados = [...filtrados].sort((a, b) => b.nota - a.nota);
    } else if (currentQuickFilter === 'rapidos') {
        filtrados = [...filtrados].sort((a, b) => parseInt(a.tempoEntrega || 999) - parseInt(b.tempoEntrega || 999));
    }

    if (advancedFilters.minNota > 0) {
        filtrados = filtrados.filter(rest => rest.nota >= advancedFilters.minNota);
    }
    if (advancedFilters.maxFrete < 999) {
        filtrados = filtrados.filter(rest => rest.taxaEntrega <= advancedFilters.maxFrete);
    }

    renderRestaurants(filtrados);
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    window.location.reload();
}

function checkAuthAndUpdateUI() {
    const token = localStorage.getItem('token');
    const navActions = document.getElementById('nav-actions');
    const addressSelector = document.getElementById('address-selector');

    if (!token) {
        if (addressSelector) addressSelector.style.display = 'none';

        if (navActions) {
            navActions.innerHTML = `
                <a href="login.html" class="btn-icon" aria-label="Entrar" style="text-decoration: none;">
                    <i class="fa-regular fa-user"></i>
                    <span>Entrar</span>
                </a>
                <button class="btn-icon cart-btn" onclick="openCart()" aria-label="Carrinho">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="cart-badge">0</span>
                </button>
            `;
        }
        return;
    }

    const decoded = parseJwt(token);
    if (!decoded) {
        logout();
        return;
    }

    const cpfDoUsuario = decoded.sub;
    const role = decoded.role;

    if (navActions) {
            let navContent = '';

            if (role === 'parceiro') {
                navContent += `
                    <a href="meus-restaurantes.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-right: 15px;">
                        <i class="fa-solid fa-store" style="color: #ea1d2c;"></i>
                        <span>Meus Restaurantes</span>
                    </a>
                `;
            }

            if (role === 'entregador') {
                navContent += `
                    <a href="painel-entregador.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-right: 15px;">
                        <i class="fa-solid fa-motorcycle" style="color: #ea1d2c;"></i>
                        <span>Entregas</span>
                    </a>
                `;
            }

            if (role === 'cliente' || role === 'parceiro' || role === 'entregador') {
                navContent += `
                    <button class="btn-icon cart-btn" onclick="openCart()" aria-label="Carrinho" style="margin-right: 15px; background: none; border: none; cursor: pointer; color: inherit; font-size: 1rem; display: flex; align-items: center; gap: 5px;">
                        <i class="fa-solid fa-cart-shopping" style="color: #ea1d2c;"></i>
                        <span>Carrinho</span>
                        <span class="cart-badge" style="background: #ea1d2c; color: white; border-radius: 50%; padding: 2px 6px; font-size: 0.8rem; margin-left: 5px;">${getCartCount()}</span>
                    </button>
                `;
            }

            navContent += `
                <a href="meus-pedidos.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-right: 15px;">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <span>Meus Pedidos</span>
                </a>
                <a href="perfil.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-right: 15px;">
                    <i class="fa-regular fa-circle-user"></i>
                    <span>Perfil</span>
                </a>
                <button class="btn-icon" onclick="logout()" style="background:none; border:none; color: var(--primary-color); cursor:pointer; font-size: 1.2rem;">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
            `;

            navActions.innerHTML = navContent;
        }

    if (addressSelector) {
        const addressInfo = addressSelector.querySelector('.address');

        if (role === 'cliente') {
            addressSelector.style.display = 'flex';

            fetch(`/api/clientes/buscar-endereco/${cpfDoUsuario}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar endereço");
                return res.json();
            })
            .then(endereco => {
                if (addressInfo && endereco.rua) {
                    addressInfo.textContent = `${endereco.rua}, ${endereco.numero || 'S/N'} - ${endereco.cidade}`;
                }
            })
            .catch(err => {
                console.error("Falha na busca:", err);
                if (addressInfo) addressInfo.textContent = "Endereço não encontrado";
            });

        } else if (role === 'entregador') {
            addressSelector.style.display = 'none';
        }
    }
}

function initCategoryScroll() {
    const container = document.getElementById('categories-container');
    const leftBtn = document.getElementById('scroll-left');
    const rightBtn = document.getElementById('scroll-right');

    if (!container || !leftBtn || !rightBtn) return;

    const scrollAmount = 350;

    leftBtn.addEventListener('click', () => {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    container.addEventListener('scroll', () => {
        if (container.scrollLeft > 10) {
            leftBtn.style.display = 'flex';
        } else {
            leftBtn.style.display = 'none';
        }
    });

    leftBtn.style.display = 'none';
}

async function carregarEntregadoresDestaque() {
    try {
        const response = await fetch('/api/entregadores/destaques');
        if (response.ok) {
            const entregadores = await response.json();
            const container = document.getElementById('entregadores-container');
            if(!container) return;

            container.innerHTML = '';

            if(entregadores.length === 0) {
                 container.innerHTML = '<p style="color: #666; padding: 20px;">Nenhum destaque no momento.</p>';
                 return;
            }

            entregadores.forEach(ent => {
                container.innerHTML += `
                    <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); min-width: 200px; text-align: center;">
                        <div style="width: 60px; height: 60px; background: #ffe4e4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: var(--primary-color); font-size: 24px;">
                            <i class="fa-solid fa-helmet-safety"></i>
                        </div>
                        <h4 style="margin: 0 0 5px 0;">${ent.nome}</h4>
                        <p style="margin: 0; font-size: 14px; color: #666;">${ent.veiculo}</p>
                        <div style="margin-top: 10px; font-weight: bold; color: #f1c40f;">
                            <i class="fa-solid fa-star"></i> ${ent.nota.toFixed(1)}
                        </div>
                        <div style="margin-top: 4px; font-size: 12px; color: #1a9c59; font-weight: 600;">
                            ${ent.classificacao || ''}
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Erro ao carregar entregadores:', error);
    }
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function getCartCount() {
    const carrinhoAtual = JSON.parse(localStorage.getItem('carrinho')) || [];
        return carrinhoAtual.reduce((sum, item) => sum + (item.quantidade || 1), 0);
}

function openCart() {
    window.location.href = 'carrinho.html';
}

async function finalizarPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho'));

    if (!carrinho || carrinho.length === 0) {
        alert("O seu carrinho está vazio!");
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const cpfDoCliente = payload.sub;

    const pedidoDTO = {
        cpfCliente: cpfDoCliente,
        cdRestaurante: carrinho[0].cdRestaurante,
        items: carrinho.map(item => ({
            cdProduto: item.cdProduto,
            quantidade: item.quantidade || 1
        }))
    };

    try {
        const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(pedidoDTO)
        });

        if (response.ok) {
            localStorage.removeItem('carrinho'); // Limpa o carrinho após sucesso
            alert("Pedido realizado com sucesso!");
            window.location.href = 'meus-pedidos.html'; // Redireciona
        } else {
            const msgErro = await response.text();
            alert("Erro ao finalizar pedido: " + msgErro);
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("Erro de conexão com o servidor.");
    }
}
function adicionarAoCarrinhoReal(cdProduto, nome, preco, cdRestaurante) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const item = {
        cdProduto: parseInt(cdProduto),
        nome: nome,
        preco: parseFloat(preco),
        cdRestaurante: parseInt(cdRestaurante),
        quantidade: 1
    };

    carrinho.push(item);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    alert(`${nome} adicionado ao carrinho com sucesso!`);
}
let todosOsPedidosDoCliente = [];
async function carregarMeusPedidos() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const cpfCliente = payload.sub;

    try {
        const response = await fetch(`/api/pedidos/cliente/${cpfCliente}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            todosOsPedidosDoCliente = await response.json();

            // Preenche as estatísticas do topo
            const pendentes = todosOsPedidosDoCliente.filter(p => p.status !== 'Entregue' && p.status !== 'Concluido').length;
            const concluidos = todosOsPedidosDoCliente.filter(p => p.status === 'Entregue' || p.status === 'Concluido').length;

            const statsContainer = document.getElementById('orders-stats');
            if(statsContainer) {
                statsContainer.innerHTML = `
                    <article class="stat-card"><h3>${todosOsPedidosDoCliente.length}</h3><p>Pedidos totais</p></article>
                    <article class="stat-card"><h3>${pendentes}</h3><p>Em andamento</p></article>
                    <article class="stat-card"><h3>${concluidos}</h3><p>Entregues</p></article>
                `;
            }

            renderizarListaFiltrada(todosOsPedidosDoCliente);
        }
    } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
    }
}

function renderizarListaFiltrada(listaPedidos) {
    const container = document.getElementById('orders-list');
    if (!container) return;

    if (listaPedidos.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum pedido encontrado para esta categoria.</div>';
        return;
    }

    container.innerHTML = listaPedidos.map(p => {
        let badgeClass = "status-em-preparo";
        if(p.status === 'Pendente') badgeClass = "status-pendente";
        if(p.status === 'Entregue' || p.status === 'Concluido') badgeClass = "status-entregue";

        return `
            <article class="order-admin-card" style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #eee;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div>
                        <span style="font-size: 11px; color: #ea1d2c; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Pedido #${p.cdPedido}</span>
                        <h3 style="margin: 3px 0 0 0; color: #2d3748; font-size: 18px;">Dev-livery Delivery</h3>
                        <p style="margin: 5px 0 0 0; font-size: 13px; color: #718096;"><i class="fa-regular fa-calendar"></i> Feito em: ${p.data}</p>
                    </div>
                    <span class="status-badge ${badgeClass}" style="padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 600;">
                        ${p.status}
                    </span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #edf2f7; padding-top: 15px; margin-top: 15px;">
                    <span style="color: #4a5568; font-size: 14px;">Total pago</span>
                    <strong style="font-size: 20px; color: #ea1d2c;">R$ ${p.valorTotal.toFixed(2).replace('.', ',')}</strong>
                </div>
            </article>
        `;
    }).join('');
}

function filtrarStatus(statusAlvo) {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');

    if (statusAlvo === 'Todos') {
        renderizarListaFiltrada(todosOsPedidosDoCliente);
    } else {
        const filtrados = todosOsPedidosDoCliente.filter(p => p.status === statusAlvo);
        renderizarListaFiltrada(filtrados);
    }
}
// --- SISTEMA INTERNO DE GESTÃO DO CARRINHO ---
let subtotalGlobal = 0;
let totalComDescontoGlobal = 0;

function renderizarTelaCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itemsList = document.getElementById('cart-items-list');
    const summaryList = document.getElementById('cart-summary');

    if (!itemsList) return; // Só roda se estiver na página de carrinho

    if (carrinho.length === 0) {
        itemsList.innerHTML = '<div class="empty-state">Seu carrinho está vazio. Adicione itens na página inicial!</div>';
        if(summaryList) summaryList.innerHTML = '';
        document.getElementById('cart-confirm-btn').disabled = true;
        return;
    }

    document.getElementById('cart-confirm-btn').disabled = false;
    subtotalGlobal = 0;

    // Renderiza a lista de itens escolhidos pelo cliente usando a estrutura do novo CSS
    itemsList.innerHTML = carrinho.map((item, idx) => {
        const itemTotal = item.preco * (item.quantidade || 1);
        subtotalGlobal += itemTotal;
        return `
            <div class="cart-item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #edf2f7;">
                <div>
                    <h4 style="margin: 0; font-size: 16px; color: #2d3748;">${item.nome}</h4>
                    <span style="font-size: 13px; color: #718096;">Quantidade: ${item.quantidade || 1}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 20px;">
                    <strong style="color: #2d3748;">R$ ${itemTotal.toFixed(2).replace('.', ',')}</strong>
                    <button onclick="removerDoCarrinhoReal(${idx})" style="background: transparent; border: none; color: #e53e3e; cursor: pointer; font-size: 14px;"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `;
    }).join('');

    totalComDescontoGlobal = subtotalGlobal;
    atualizarResumoValores(subtotalGlobal, 0);
}

function atualizarResumoValores(subtotal, desconto) {
    const summaryList = document.getElementById('cart-summary');
    if(!summaryList) return;

    summaryList.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #718096;">
            <span>Subtotal</span>
            <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #38a169; font-weight: 600;">
            <span>Desconto (Banco Function)</span>
            <span>- R$ ${desconto.toFixed(2).replace('.', ',')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px dashed #edf2f7; font-size: 18px; font-weight: 700; color: #1a202c;">
            <span>Total final</span>
            <span style="color: #ea1d2c;">R$ ${(subtotal - desconto).toFixed(2).replace('.', ',')}</span>
        </div>
    `;
}

function removerDoCarrinhoReal(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    renderizarTelaCarrinho();
}

// Chamar a FUNCTION do seu MySQL usando a rota do Spring Boot (Ponto 9 resolvido)
async function calcularCupomBanco() {
    const cupomTexto = document.getElementById('coupon-code').value.trim();
    const msgElement = document.getElementById('coupon-message');

    if(!cupomTexto) {
        msgElement.textContent = "Digite um código de cupom.";
        msgElement.style.color = "#e53e3e";
        return;
    }

    // Configuração simulada baseada nas regras da sua Function calcular_desconto_cupom
    let tipoCupom = "FIXO";
    let valorDesconto = 10.00; // R$ 10 de desconto padrão para cupons ativos

    if(cupomTexto.toLowerCase() === 'dev15') {
        tipoCupom = "PERCENTUAL";
        valorDesconto = 15.00; // 15% de desconto
    }

    try {
        const token = localStorage.getItem('token');
        // Faz a chamada passando os parâmetros esperados pelo @RequestParam do PedidoController
        const response = await fetch(`/api/pedidos/simular-desconto?valorPedido=${subtotalGlobal}&tipoCupom=${tipoCupom}&valorDesconto=${valorDesconto}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if(response.ok) {
            const valorFinalComDesconto = await response.json();
            const descontoCalculado = subtotalGlobal - valorFinalComDesconto;

            totalComDescontoGlobal = valorFinalComDesconto;
            atualizarResumoValores(subtotalGlobal, descontoCalculado);

            msgElement.textContent = `Cupom '${cupomTexto}' aplicado com sucesso via Function do MySQL!`;
            msgElement.style.color = "#38a169";
        } else {
            msgElement.textContent = "Cupom inválido ou expirado.";
            msgElement.style.color = "#e53e3e";
        }
    } catch (error) {
        console.error("Erro na Function:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if(document.body.getAttribute('data-page') === 'carrinho') {
        renderizarTelaCarrinho();
    }
});

function atualizarNavbarPorRole() {
    const navActions = document.getElementById('nav-actions');
    if (!navActions) return;

    const token = localStorage.getItem('token');
    if (!token) {
        navActions.innerHTML = `
            <a href="login.html" class="btn-icon" style="text-decoration: none;">
                <i class="fa-regular fa-user"></i>
                <span>Entrar</span>
            </a>
        `;
        return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role;

    if (role === 'parceiro') {
        navActions.innerHTML = `
            <a href="meus-restaurantes.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-right: 15px;">
                <i class="fa-solid fa-store" style="color: #ea1d2c;"></i>
                <span>Restaurantes</span>
            </a>
            <a href="perfil.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500;">
                <i class="fa-regular fa-circle-user"></i>
                <span>Perfil</span>
            </a>
            <button class="btn-icon" onclick="logout()" style="color: var(--primary-color); display: flex; align-items: center; gap: 8px; font-weight: 500;">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sair</span>
            </button>
        `;
    } else if (role === 'entregador') {
        navActions.innerHTML = `
            <a href="painel-entregador.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-right: 15px;">
                <i class="fa-solid fa-motorcycle" style="color: #ea1d2c;"></i>
                <span>Entregas</span>
            </a>
            <a href="carrinho.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-right: 15px;">
                <i class="fa-solid fa-basket-shopping" style="color: #ea1d2c;"></i>
                <span>Carrinho</span>
            </a>
            <a href="meus-pedidos.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-right: 15px;">
                <i class="fa-solid fa-bag-shopping"></i>
                <span>Meus Pedidos</span>
            </a>
            <a href="perfil.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-right: 15px;">
                <i class="fa-regular fa-circle-user"></i>
                <span>Perfil</span>
            </a>
            <button class="btn-icon" onclick="logout()" style="background:none; border:none; cursor:pointer; color: var(--primary-color); display: flex; align-items: center; gap: 8px; font-weight: 500;">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sair</span>
            </button>
        `;
    } else {
        navActions.innerHTML = `
            <a href="carrinho.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-right: 15px;">
                <i class="fa-solid fa-basket-shopping" style="color: #ea1d2c;"></i>
                <span>Carrinho</span>
            </a>
            <a href="meus-pedidos.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-right: 15px;">
                <i class="fa-solid fa-bag-shopping"></i>
                <span>Meus Pedidos</span>
            </a>
            <a href="perfil.html" class="btn-icon" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px; font-weight: 500; margin-right: 15px;">
                <i class="fa-regular fa-circle-user"></i>
                <span>Perfil</span>
            </a>
            <button class="btn-icon" onclick="logout()" style="background:none; border:none; cursor:pointer; color: var(--primary-color); display: flex; align-items: center; gap: 8px; font-weight: 500;">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sair</span>
            </button>
        `;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias();
    carregarRestaurantes();
    initFilters();
    initCategoryScroll();
    carregarEntregadoresDestaque();
    atualizarNavbarPorRole();
    if(document.body.getAttribute('data-page') === 'pedidos') {
        carregarMeusPedidos();
    }
});
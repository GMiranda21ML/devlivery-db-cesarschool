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
        const bgImage = `/images/rest/rest_${id}.jpg`;
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
            // =================================================================
            // INTERAÇÃO PURA COM O BANCO: QUERY 1 (Super Restaurantes)
            // =================================================================
            // =================================================================
                        // INTERAÇÃO PURA COM O BANCO: QUERY 1 (Super Restaurantes)
                        // =================================================================
                        else if (currentQuickFilter === 'super') {
                            try {
                                const token = localStorage.getItem('token');
                                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

                                const res = await fetch('/api/relatorios/super-restaurantes', { headers });
                                if (res.ok) {
                                    const nomesSuper = await res.json();
                                    const filtrados = listaRestaurantesOriginal.filter(r => nomesSuper.includes(r.nome));
                                    renderRestaurants(filtrados);
                                } else {
                                    console.error("Bloqueado pelo Spring Security (403)");
                                }
                            } catch (e) { console.error("Erro ao buscar Query 1:", e); }
                        }
                        // =================================================================
                        // INTERAÇÃO PURA COM O BANCO: QUERY 4 (Produtos Premium)
                        // =================================================================
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
                <a href="painel-restaurante.html" class="btn-icon" style="text-decoration: none; color: #1da55a;">
                    <i class="fa-solid fa-store"></i>
                    <span>Painel Loja</span>
                </a>
            `;
        }

        navContent += `
            <a href="perfil.html" class="btn-icon" style="text-decoration: none;">
                <i class="fa-solid fa-user"></i>
                <span>Perfil</span>
            </a>
            <button class="btn-icon" onclick="logout()" style="color: var(--primary-color);">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sair</span>
            </button>
        `;

        if (role === 'cliente') {
            navContent += `
                <button class="btn-icon cart-btn" onclick="openCart()" aria-label="Carrinho">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="cart-badge">${getCartCount()}</span>
                </button>
            `;
        }

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
    return cart.reduce((sum, item) => sum + item.quantidade, 0);
}

function openCart() {
    window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias();
    carregarRestaurantes(); // Inicia sem categoria = busca todos
    initFilters();
    checkAuthAndUpdateUI();
    initCategoryScroll();
    carregarEntregadoresDestaque();
});
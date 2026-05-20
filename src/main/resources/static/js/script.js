let allRestaurants = [];
let currentFilter = 'Todos';
let currentSearch = '';
let currentQuickFilter = 'todos';
let advancedFilters = { minNota: 0, maxFrete: 999 };

async function carregarCategorias() {
    try {
        const response = await fetch('/api/categorias');
        if (response.ok) {
            const categoriasDB = await response.json();
            renderCategories(categoriasDB); // <-- Corrigido aqui (estava renderFilterButtons)
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

        // Puxa a imagem local baseada no ID (ex: cat_1.jpg, cat_2.jpg)
        const bgImage = `/images/cat/cat_${category.cdCategoria}.jpg`;

        card.onclick = () => {
            currentSearch = '';
            const searchInput = document.querySelector('.search-bar input');
            if(searchInput) searchInput.value = '';

            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if(btn.textContent.trim() === category.nome) btn.classList.add('active');
            });

            carregarRestaurantes(category.nome);
        };

        // O 'onerror' garante que se não achar a foto na pasta, carrega uma cinza padrão
        card.innerHTML = `
            <img src="${bgImage}" alt="${category.nome}" class="category-img" onerror="this.src='https://via.placeholder.com/200?text=Sem+Foto'">
            <span class="category-name">${category.nome}</span>
        `;
        container.appendChild(card);
    });
}

async function carregarRestaurantes(categoria = 'Todos') {
    try {
        // Decide qual rota do Spring Boot chamar
        let url = '/api/restaurantes';
        if (categoria !== 'Todos') {
            url = `/api/restaurantes/categoria/${categoria}`;
        }

        const response = await fetch(url);

        if (response.ok) {
            allRestaurants = await response.json(); // Salva os dados na memória
            applyFilters(); // Aplica a filtragem da barra de pesquisa por cima
        } else {
            renderRestaurants([]);
        }
    } catch (error) {
        console.error('Erro de conexão com o backend:', error);
        renderRestaurants([]);
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

    // 1. Filtros Rápidos (Entrega Grátis, Melhores Avaliados)
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            quickBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Pega o que está escrito no 'data-filter' do HTML (ex: "gratis")
            currentQuickFilter = btn.dataset.filter;
            applyFilters();
        });
    });

    // 2. Barra de Pesquisa
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            applyFilters();
        });
    }

    // 3. Lógica do Modal de Filtros Avançados
    const modal = document.getElementById('modal-filtros');
    const btnOpen = document.getElementById('btn-filtros-avancados');
    const btnClose = document.querySelector('.close-modal');
    const btnApply = document.getElementById('aplicar-filtros-avancados');

    const rangeNota = document.getElementById('filtro-nota');
    const labelNota = document.getElementById('valor-nota');
    const rangeFrete = document.getElementById('filtro-frete');
    const labelFrete = document.getElementById('valor-frete');

    if(btnOpen && modal) {
        // Abrir/Fechar Modal
        btnOpen.onclick = () => modal.style.display = 'flex';
        btnClose.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };

        // Atualizar textos dos sliders em tempo real
        rangeNota.oninput = () => labelNota.textContent = rangeNota.value > 0 ? `Acima de ${rangeNota.value}` : 'Todas';
        rangeFrete.oninput = () => labelFrete.textContent = rangeFrete.value < 30 ? `Até R$ ${rangeFrete.value},00` : 'Qualquer valor';

        // Aplicar botão do modal
        btnApply.onclick = () => {
            advancedFilters.minNota = parseFloat(rangeNota.value);
            advancedFilters.maxFrete = parseFloat(rangeFrete.value);

            // Se usou filtro avançado, tira o highlight dos filtros rápidos para não confundir
            quickBtns.forEach(b => b.classList.remove('active'));
            currentQuickFilter = 'todos';

            modal.style.display = 'none';
            applyFilters();
        };
    }
}

function applyFilters() {
    let filtrados = allRestaurants;

    // 1. Filtro da Barra de Pesquisa (Texto)
    if (currentSearch) {
        filtrados = filtrados.filter(rest =>
            rest.nome && rest.nome.toLowerCase().includes(currentSearch)
        );
    }

    // 2. Filtros Rápidos (Botões)
    if (currentQuickFilter === 'gratis') {
        filtrados = filtrados.filter(rest => rest.taxaEntrega === 0);
    } else if (currentQuickFilter === 'melhores') {
        // Supondo que "melhores" seja nota >= 4.5
        filtrados = filtrados.filter(rest => rest.nota >= 4.5);
    }

    // 3. Filtros Avançados (Modal)
    if (advancedFilters.minNota > 0) {
        filtrados = filtrados.filter(rest => rest.nota >= advancedFilters.minNota);
    }
    if (advancedFilters.maxFrete < 999) {
        filtrados = filtrados.filter(rest => rest.taxaEntrega <= advancedFilters.maxFrete);
    }

    // Após filtrar a lista, atualiza a tela
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

// Função para deslogar
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
        // --- USUÁRIO DESLOGADO ---
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

    // --- USUÁRIO LOGADO ---
    const decoded = parseJwt(token);
    if (!decoded) {
        logout();
        return;
    }

    // 2. Lida com o bloco de endereço
    const cpfDoUsuario = decoded.sub;
    const role = decoded.role;

    // 1. Atualiza a Navbar: Tira o "Entrar", coloca "Perfil" e "Sair" (Aparece para AMBOS)
    if (navActions) {
        let navContent = '';
        
        if (role === 'parceiro') {
            navContent += `
                <a href="criar-restaurante.html" class="btn-icon" style="text-decoration: none; color: #1da55a;">
                    <i class="fa-solid fa-store"></i>
                    <span>Criar Restaurante</span>
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
            // MOSTRA o endereço se for cliente
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
            // ESCONDE o endereço se for entregador
            addressSelector.style.display = 'none';
        }
    }
}

function initCategoryScroll() {
    const container = document.getElementById('categories-container');
    const leftBtn = document.getElementById('scroll-left');
    const rightBtn = document.getElementById('scroll-right');

    if (!container || !leftBtn || !rightBtn) return;

    // Quantidade de pixels que a tela vai pular a cada clique
    const scrollAmount = 350;

    leftBtn.addEventListener('click', () => {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Mostra/Esconde a seta da esquerda dependendo de onde o scroll está
    container.addEventListener('scroll', () => {
        if (container.scrollLeft > 10) {
            leftBtn.style.display = 'flex';
        } else {
            leftBtn.style.display = 'none';
        }
    });

    // Inicia escondendo a seta da esquerda (já que começa no pixel 0)
    leftBtn.style.display = 'none';
}

// Cart functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantidade, 0);
}

function openCart() {
    window.location.href = 'checkout.html';
}


document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias();
    carregarRestaurantes();
    initFilters();
    checkAuthAndUpdateUI();
    initCategoryScroll();
});

// Mock Data: Categorias
const categories = [
    { id: 1, name: "Lanches", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=200&auto=format&fit=crop" },
    { id: 2, name: "Pizzas", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop" },
    { id: 3, name: "Japonesa", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=200&auto=format&fit=crop" },
    { id: 4, name: "Brasileira", img: "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?q=80&w=200&auto=format&fit=crop" },
    { id: 5, name: "Saudável", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop" },
    { id: 6, name: "Bebidas", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=200&auto=format&fit=crop" },
    { id: 7, name: "Sobremesas", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=200&auto=format&fit=crop" }
];

// Mock Data: Restaurantes
const restaurants = [
    {
        id: 1,
        cnpj: "12.345.678/0001-90",
        name: "Byte Burguer",
        category: "Lanches",
        rating: 4.8,
        time: "30-40 min",
        fee: "Grátis",
        logo: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 2,
        cnpj: "98.765.432/0001-10",
        name: "Pizza do Dev",
        category: "Pizzas",
        rating: 4.6,
        time: "40-50 min",
        fee: "R$ 5,99",
        logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 3,
        cnpj: "11.222.333/0001-44",
        name: "Sushi Array",
        category: "Japonesa",
        rating: 4.9,
        time: "45-60 min",
        fee: "R$ 8,00",
        logo: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 4,
        cnpj: "55.666.777/0001-88",
        name: "Commit Café & Lanches",
        category: "Lanches",
        rating: 4.5,
        time: "20-30 min",
        fee: "R$ 3,50",
        logo: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 5,
        cnpj: "99.888.777/0001-66",
        name: "Sintaxe Saudável",
        category: "Saudável",
        rating: 4.7,
        time: "25-35 min",
        fee: "Grátis",
        logo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 6,
        cnpj: "33.444.555/0001-22",
        name: "Churrasco Orientado a Objetos",
        category: "Brasileira",
        rating: 4.8,
        time: "50-70 min",
        fee: "R$ 10,00",
        logo: "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop"
    }
];

// Função para renderizar as categorias
function renderCategories() {
    const container = document.getElementById('categories-container');
    
    categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <img src="${category.img}" alt="${category.name}" class="category-img">
            <span class="category-name">${category.name}</span>
        `;
        container.appendChild(card);
    });
}

// Função para renderizar os restaurantes
function renderRestaurants(data = restaurants) {
    const container = document.getElementById('restaurants-container');
    container.innerHTML = ''; // Limpa antes de renderizar
    
    if (data.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Nenhum restaurante encontrado.</p>';
        return;
    }

    data.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.innerHTML = `
            <img src="${restaurant.cover}" alt="Capa ${restaurant.name}" class="restaurant-cover">
            <div class="restaurant-info">
                <img src="${restaurant.logo}" alt="Logo ${restaurant.name}" class="restaurant-logo">
                <div class="restaurant-details">
                    <div class="restaurant-header">
                        <h4>${restaurant.name}</h4>
                        <div class="rating">
                            <i class="fa-solid fa-star"></i>
                            <span>${restaurant.rating}</span>
                        </div>
                    </div>
                    <div class="restaurant-meta">
                        <span>${restaurant.category}</span>
                        <i class="fa-solid fa-circle bullet"></i>
                        <span>${restaurant.time}</span>
                        <i class="fa-solid fa-circle bullet"></i>
                        <span style="color: ${restaurant.fee === 'Grátis' ? '#1da55a' : 'inherit'}; font-weight: ${restaurant.fee === 'Grátis' ? '600' : 'normal'}">
                            ${restaurant.fee}
                        </span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Lógica de Filtros e Busca
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.querySelector('.search-bar input');

    // Estado atual do filtro
    let currentFilter = 'Todos';
    let currentSearch = '';

    function applyFilters() {
        let filteredData = restaurants;

        // Filtro por botões
        if (currentFilter === 'Entrega Grátis') {
            filteredData = filteredData.filter(r => r.fee === 'Grátis');
        } else if (currentFilter === 'Melhor Avaliados') {
            filteredData = filteredData.filter(r => r.rating >= 4.8);
        } else if (currentFilter === 'Mais Rápidos') {
            filteredData = filteredData.filter(r => parseInt(r.time.split('-')[0]) <= 30);
        }

        // Filtro por texto (Busca)
        if (currentSearch.trim() !== '') {
            const searchTerm = currentSearch.toLowerCase();
            filteredData = filteredData.filter(r => 
                r.name.toLowerCase().includes(searchTerm) || 
                r.category.toLowerCase().includes(searchTerm)
            );
        }

        renderRestaurants(filteredData);
    }

    // Eventos de clique nos botões
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.textContent.trim();
            applyFilters();
        });
    });

    // Evento de digitação na busca
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            applyFilters();
        });
    }
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
                <button class="btn-icon cart-btn" aria-label="Carrinho">
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

    // 1. Atualiza a Navbar: Tira o "Entrar", coloca "Perfil" e "Sair" (Aparece para AMBOS)
    if (navActions) {
        navActions.innerHTML = `
            <a href="perfil.html" class="btn-icon" style="text-decoration: none;">
                <i class="fa-solid fa-user"></i>
                <span>Perfil</span>
            </a>
            <button class="btn-icon" onclick="logout()" style="color: var(--primary-color);">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sair</span>
            </button>
            <button class="btn-icon cart-btn" aria-label="Carrinho">
                <i class="fa-solid fa-cart-shopping"></i>
                <span class="cart-badge">0</span>
            </button>
        `;
    }

    // 2. Lida com o bloco de endereço
    const cpfDoUsuario = decoded.sub;
    const role = decoded.role;

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


document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderRestaurants();
    initFilters();
    checkAuthAndUpdateUI();
});
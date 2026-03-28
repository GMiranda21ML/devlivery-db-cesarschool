// Mock Data: Categorias
const categories = [
    { id: 1, name: "Lanches", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=200&auto=format&fit=crop" },
    { id: 2, name: "Pizzas", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=200&auto=format&fit=crop" },
    { id: 3, name: "Japonesa", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=200&auto=format&fit=crop" },
    { id: 4, name: "Brasileira", img: "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?q=80&w=200&auto=format&fit=crop" },
    { id: 5, name: "Saudável", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop" },
    { id: 6, name: "Bebidas", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=200&auto=format&fit=crop" },
    { id: 7, name: "Sobremesas", img: "https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?q=80&w=200&auto=format&fit=crop" }
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
        logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1604381536136-24a27c503adf?q=80&w=600&auto=format&fit=crop"
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
function renderRestaurants() {
    const container = document.getElementById('restaurants-container');
    
    restaurants.forEach(restaurant => {
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

// Inicializar a renderização quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderRestaurants();
    
    // Simular interatividade nos botões de filtro
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});
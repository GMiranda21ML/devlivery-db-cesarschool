const seedRestaurantData = [
    {
        id: 1,
        name: "Byte Burguer",
        category: "Lanches",
        rating: 4.8,
        time: "30-40 min",
        fee: "Grátis",
        logo: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=1200&auto=format&fit=crop",
        description: "Hamburgueres artesanais, combos generosos e entregas rápidas para quem quer matar a fome sem sair do teclado."
    },
    {
        id: 2,
        name: "Pizza do Dev",
        category: "Pizzas",
        rating: 4.6,
        time: "40-50 min",
        fee: "R$ 5,99",
        logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1200&auto=format&fit=crop",
        description: "Pizzas com massa leve, borda recheada e sabores pensados para longas noites de deploy."
    },
    {
        id: 3,
        name: "Sushi Array",
        category: "Japonesa",
        rating: 4.9,
        time: "45-60 min",
        fee: "R$ 8,00",
        logo: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
        description: "Combinados frescos, sashimis e temakis com apresentação caprichada e ótima avaliação."
    },
    {
        id: 4,
        name: "Commit Café & Lanches",
        category: "Lanches",
        rating: 4.5,
        time: "20-30 min",
        fee: "R$ 3,50",
        logo: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
        description: "Cafés especiais, salgados, brunch e lanches para acompanhar pair programming e reuniões."
    },
    {
        id: 5,
        name: "Sintaxe Saudável",
        category: "Saudável",
        rating: 4.7,
        time: "25-35 min",
        fee: "Grátis",
        logo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop",
        description: "Bowls, saladas, wraps e pratos leves para manter a produtividade sem pesar."
    },
    {
        id: 6,
        name: "Churrasco Orientado a Objetos",
        category: "Brasileira",
        rating: 4.8,
        time: "50-70 min",
        fee: "R$ 10,00",
        logo: "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
        description: "Carnes na brasa, acompanhamentos clássicos e porções fartas para compartilhar."
    }
];

const seedProductsData = [
    { id: 101, restaurantId: 1, name: "Burger Full Stack", description: "Pão brioche, burger 180g, cheddar, bacon e molho especial.", price: 32.9, rating: 4.8, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop" },
    { id: 102, restaurantId: 1, name: "Batata Deploy", description: "Batata crocante com páprica defumada e maionese da casa.", price: 18.5, rating: 4.7, image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800&auto=format&fit=crop" },
    { id: 201, restaurantId: 2, name: "Pizza PepperNode", description: "Molho italiano, mussarela premium e pepperoni crocante.", price: 54.9, rating: 4.6, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop" },
    { id: 202, restaurantId: 2, name: "Pizza Quatro Queijos Cloud", description: "Mussarela, provolone, parmesão e gorgonzola.", price: 57.9, rating: 4.8, image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=800&auto=format&fit=crop" },
    { id: 301, restaurantId: 3, name: "Combo Sashimi Pro", description: "Seleção especial de salmão, atum e peixe branco.", price: 68.0, rating: 4.9, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=800&auto=format&fit=crop" },
    { id: 302, restaurantId: 3, name: "Temaki Data Roll", description: "Temaki de salmão com cream cheese e cebolinha.", price: 24.9, rating: 4.8, image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=800&auto=format&fit=crop" },
    { id: 401, restaurantId: 4, name: "Brunch Sprint", description: "Croissant, ovos mexidos, café filtrado e frutas.", price: 29.9, rating: 4.5, image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=800&auto=format&fit=crop" },
    { id: 402, restaurantId: 4, name: "Sanduíche Merge", description: "Pão artesanal, frango desfiado, queijo e tomate confit.", price: 26.9, rating: 4.6, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop" },
    { id: 501, restaurantId: 5, name: "Bowl Clean Code", description: "Arroz integral, frango grelhado, legumes e molho leve.", price: 34.5, rating: 4.7, image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop" },
    { id: 502, restaurantId: 5, name: "Wrap Fit Commit", description: "Wrap com peito de peru, folhas frescas e homus.", price: 27.9, rating: 4.6, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop" },
    { id: 601, restaurantId: 6, name: "Picanha Legacy", description: "Picanha fatiada com arroz, vinagrete e farofa.", price: 64.9, rating: 4.9, image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop" },
    { id: 602, restaurantId: 6, name: "Costela Pattern", description: "Costela assada lentamente com batatas rústicas.", price: 59.9, rating: 4.8, image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=800&auto=format&fit=crop" }
];

const reviewsData = [
    { id: 1, restaurantId: 1, author: "Gabriel", rating: 5, comment: "Chegou rápido e o hambúrguer veio muito bem montado.", date: "Hoje" },
    { id: 2, restaurantId: 1, author: "Marina", rating: 4, comment: "Batata sequinha e sanduíche bem servido.", date: "Ontem" },
    { id: 3, restaurantId: 2, author: "Caio", rating: 5, comment: "Massa excelente e recheio muito caprichado.", date: "Hoje" },
    { id: 4, restaurantId: 2, author: "Livia", rating: 4, comment: "Borda muito boa e pizza chegou quente.", date: "2 dias atrás" },
    { id: 5, restaurantId: 3, author: "Renata", rating: 5, comment: "Peixe fresco e apresentação impecável.", date: "Hoje" },
    { id: 6, restaurantId: 3, author: "Bruno", rating: 5, comment: "Temaki enorme e muito saboroso.", date: "Ontem" },
    { id: 7, restaurantId: 4, author: "Nina", rating: 4, comment: "Ótimo café e sanduíche bem leve.", date: "3 dias atrás" },
    { id: 8, restaurantId: 5, author: "Sofia", rating: 5, comment: "Opção saudável que realmente sustenta.", date: "Hoje" },
    { id: 9, restaurantId: 6, author: "Pedro", rating: 5, comment: "Carne no ponto certo e porção generosa.", date: "Ontem" }
];

const couponsData = {
    DEV10: { type: "percent", value: 10, label: "10% de desconto no subtotal" },
    PRIMEIRA15: { type: "percent", value: 15, label: "15% de desconto no subtotal" },
    FRETEGRATIS: { type: "shipping", value: 100, label: "Frete grátis" },
    OFF5: { type: "fixed", value: 5, label: "R$ 5,00 de desconto" }
};

const seedOrders = [
    {
        id: 9001,
        restaurantId: 2,
        restaurantName: "Pizza do Dev",
        items: [
            { productId: 201, productName: "Pizza PepperNode", quantity: 1, unitPrice: 54.9 }
        ],
        total: 60.89,
        discount: 0,
        status: "Entregue",
        date: "20/05/2026, 20:15",
        note: "Sem cebola",
        coupon: "",
        deliveryPerson: ""
    },
    {
        id: 9002,
        restaurantId: 5,
        restaurantName: "Sintaxe Saudável",
        items: [
            { productId: 501, productName: "Bowl Clean Code", quantity: 2, unitPrice: 34.5 }
        ],
        total: 69.0,
        discount: 0,
        status: "Saiu para entrega",
        date: "24/05/2026, 12:40",
        note: "Molho separado",
        coupon: "",
        deliveryPerson: "João Matos"
    }
];

function formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getQueryParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}

function getStoredRestaurants() {
    const raw = localStorage.getItem("devlivery-restaurants");

    if (!raw) {
        return [...seedRestaurantData];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.length ? parsed : [...seedRestaurantData];
    } catch (error) {
        return [...seedRestaurantData];
    }
}

function getRestaurantById(id) {
    const restaurants = getStoredRestaurants();
    return restaurants.find((restaurant) => restaurant.id === Number(id)) || restaurants[0];
}

function getProductById(id) {
    const products = getStoredProducts();
    return products.find((product) => product.id === Number(id)) || products[0];
}

function getStoredProducts() {
    const raw = localStorage.getItem("devlivery-products");

    if (!raw) {
        return [...seedProductsData];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.length ? parsed : [...seedProductsData];
    } catch (error) {
        return [...seedProductsData];
    }
}

function saveProducts(products) {
    localStorage.setItem("devlivery-products", JSON.stringify(products));
}

function parseDeliveryFee(fee) {
    if (!fee || fee === "Grátis") {
        return 0;
    }

    return Number(fee.replace("R$", "").replace(".", "").replace(",", ".").trim()) || 0;
}

function getStoredCart() {
    const raw = localStorage.getItem("devlivery-cart");

    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("devlivery-cart", JSON.stringify(cart));
}

function getStoredCoupon() {
    return localStorage.getItem("devlivery-coupon") || "";
}

function ensureSeedProducts() {
    if (!localStorage.getItem("devlivery-products")) {
        saveProducts(seedProductsData);
    }
}

function ensureSeedRestaurants() {
    if (!localStorage.getItem("devlivery-restaurants")) {
        localStorage.setItem("devlivery-restaurants", JSON.stringify(seedRestaurantData));
    }
}

function saveCoupon(couponCode) {
    if (couponCode) {
        localStorage.setItem("devlivery-coupon", couponCode);
    } else {
        localStorage.removeItem("devlivery-coupon");
    }
}

function normalizeOrder(order) {
    if (Array.isArray(order.items)) {
        return order;
    }

    return {
        id: order.id,
        restaurantId: order.restaurantId,
        restaurantName: order.restaurantName,
        items: [
            {
                productId: order.productId || Date.now(),
                productName: order.productName || "Produto",
                quantity: order.quantity || 1,
                unitPrice: order.total && order.quantity ? Number(order.total) / Number(order.quantity) : 0
            }
        ],
        total: Number(order.total || 0),
        discount: Number(order.discount || 0),
        status: order.status || "Em preparo",
        date: order.date || "",
        note: order.note || "Sem observacoes",
        coupon: order.coupon || "",
        deliveryPerson: order.deliveryPerson || ""
    };
}

function getStoredOrders() {
    const raw = localStorage.getItem("devlivery-orders");
    const baseOrders = raw ? JSON.parse(raw) : seedOrders;

    if (!Array.isArray(baseOrders)) {
        return [...seedOrders];
    }

    return baseOrders.map(normalizeOrder);
}

function saveOrders(orders) {
    localStorage.setItem("devlivery-orders", JSON.stringify(orders));
}

function addItemToCart(cartItem) {
    const cart = getStoredCart();
    const existingItem = cart.find((item) =>
        item.productId === cartItem.productId &&
        item.restaurantId === cartItem.restaurantId &&
        item.note === cartItem.note
    );

    if (existingItem) {
        existingItem.quantity += cartItem.quantity;
    } else {
        cart.push(cartItem);
    }

    saveCart(cart);
}

function updateCartItemQuantity(itemId, quantity) {
    const cart = getStoredCart()
        .map((item) => item.id === itemId ? { ...item, quantity } : item)
        .filter((item) => item.quantity > 0);

    saveCart(cart);
}

function removeCartItem(itemId) {
    const cart = getStoredCart().filter((item) => item.id !== itemId);
    saveCart(cart);
}

function getCartTotals(cart, couponCode) {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const restaurantIds = [...new Set(cart.map((item) => item.restaurantId))];
    const shipping = restaurantIds.reduce((sum, restaurantId) => {
        const restaurant = getRestaurantById(restaurantId);
        return sum + parseDeliveryFee(restaurant.fee);
    }, 0);

    let discount = 0;
    const normalizedCoupon = couponCode ? couponCode.toUpperCase() : "";
    const coupon = couponsData[normalizedCoupon];

    if (coupon) {
        if (coupon.type === "percent") {
            discount = subtotal * (coupon.value / 100);
        }

        if (coupon.type === "fixed") {
            discount = coupon.value;
        }

        if (coupon.type === "shipping") {
            discount = shipping;
        }
    }

    discount = Math.min(discount, subtotal + shipping);

    return {
        subtotal,
        shipping,
        discount,
        total: Math.max(0, subtotal + shipping - discount),
        coupon: normalizedCoupon,
        couponInfo: coupon || null
    };
}

function getStatusClass(status) {
    if (status === "Em preparo") return "status-em-preparo";
    if (status === "Saiu para entrega") return "status-saiu-para-entrega";
    return "status-entregue";
}

function buildStars(rating) {
    const rounded = Math.round(rating);
    return Array.from({ length: 5 }, (_, index) =>
        `<i class="${index < rounded ? "fa-solid" : "fa-regular"} fa-star"></i>`
    ).join("");
}

function renderCartBadge() {
    const badges = document.querySelectorAll("[data-cart-count]");
    const count = getStoredCart().reduce((sum, item) => sum + item.quantity, 0);
    badges.forEach((badge) => {
        badge.textContent = String(count);
    });
}

function initRestaurantPage() {
    const restaurant = getRestaurantById(getQueryParam("id"));
    const products = getStoredProducts().filter((product) => product.restaurantId === restaurant.id);
    const reviews = reviewsData.filter((review) => review.restaurantId === restaurant.id);

    document.title = `${restaurant.name} - Dev-livery`;

    const hero = document.getElementById("restaurant-hero");
    hero.style.backgroundImage = `url('${restaurant.cover}')`;
    hero.innerHTML = `
        <div class="restaurant-hero-content">
            <div>
                <div class="restaurant-identity">
                    <img src="${restaurant.logo}" alt="Logo ${restaurant.name}">
                    <div>
                        <div class="restaurant-badges">
                            <span class="badge-soft">${restaurant.category}</span>
                            <span class="badge-soft"><i class="fa-solid fa-star"></i> ${restaurant.rating}</span>
                        </div>
                        <h2>${restaurant.name}</h2>
                    </div>
                </div>
                <p class="restaurant-description">${restaurant.description}</p>
            </div>
            <div class="restaurant-stats">
                <span class="stat-pill"><i class="fa-regular fa-clock"></i> ${restaurant.time}</span>
                <span class="stat-pill"><i class="fa-solid fa-motorcycle"></i> ${restaurant.fee}</span>
                <span class="stat-pill"><i class="fa-regular fa-message"></i> ${reviews.length} avaliacoes</span>
            </div>
        </div>
    `;

    const productList = document.getElementById("product-list");
    productList.innerHTML = products.map((product) => `
        <article class="product-card" data-product-id="${product.id}" tabindex="0" role="button">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-body">
                <div class="product-topline">
                    <div>
                        <h3>${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                    </div>
                    <div class="star-line">
                        <i class="fa-solid fa-star"></i>
                        <span>${product.rating.toFixed(1)}</span>
                    </div>
                </div>
                <div class="product-footer">
                    <span class="price-tag">${formatCurrency(product.price)}</span>
                    <span class="mini-cta">Ver produto</span>
                </div>
            </div>
        </article>
    `).join("");

    productList.querySelectorAll(".product-card").forEach((card) => {
        const openProduct = () => {
            const productId = card.getAttribute("data-product-id");
            window.location.href = `pedido.html?restaurant=${restaurant.id}&product=${productId}`;
        };

        card.addEventListener("click", openProduct);
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProduct();
            }
        });
    });

    const summary = document.getElementById("rating-summary");
    summary.innerHTML = `
        <div class="rating-row">
            <strong>${restaurant.rating.toFixed(1)}</strong>
            <div>${buildStars(restaurant.rating)}</div>
        </div>
        <p class="product-desc">${reviews.length} clientes avaliaram esta loja recentemente.</p>
    `;

    const reviewList = document.getElementById("review-list");
    reviewList.innerHTML = reviews.map((review) => `
        <article class="review-card">
            <div class="review-topline">
                <div>
                    <div class="review-author">${review.author}</div>
                    <div class="review-date">${review.date}</div>
                </div>
                <div class="review-stars">${buildStars(review.rating)}</div>
            </div>
            <p class="review-comment">${review.comment}</p>
        </article>
    `).join("");
}

function initOrderPage() {
    const restaurant = getRestaurantById(getQueryParam("restaurant"));
    const product = getProductById(getQueryParam("product"));
    let quantity = 1;

    document.title = `${product.name} - Dev-livery`;

    const backLink = document.getElementById("pedido-back-link");
    backLink.href = `restaurante.html?id=${restaurant.id}`;

    const details = document.getElementById("order-product-details");
    details.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div>
            <p class="eyebrow">${restaurant.name}</p>
            <h2>${product.name}</h2>
            <div class="product-meta-list">
                <span class="meta-chip"><i class="fa-solid fa-star"></i> ${product.rating.toFixed(1)}</span>
                <span class="meta-chip"><i class="fa-regular fa-clock"></i> ${restaurant.time}</span>
                <span class="meta-chip"><i class="fa-solid fa-motorcycle"></i> ${restaurant.fee}</span>
            </div>
            <p>${product.description}</p>
            <div class="product-footer">
                <span class="price-tag">${formatCurrency(product.price)}</span>
                <span class="mini-cta">Adicione e finalize depois no carrinho</span>
            </div>
        </div>
    `;

    const quantityValue = document.getElementById("quantity-value");
    const priceBreakdown = document.getElementById("price-breakdown");
    const noteInput = document.getElementById("order-note");

    function renderSummary() {
        const subtotal = product.price * quantity;
        quantityValue.textContent = String(quantity);
        priceBreakdown.innerHTML = `
            <div class="price-row">
                <span>Subtotal do item</span>
                <strong>${formatCurrency(subtotal)}</strong>
            </div>
            <div class="price-row">
                <span>Entrega da loja</span>
                <strong>${restaurant.fee}</strong>
            </div>
            <div class="price-row total">
                <span>Total estimado</span>
                <strong>${formatCurrency(subtotal + parseDeliveryFee(restaurant.fee))}</strong>
            </div>
        `;
    }

    document.getElementById("decrease-qty").addEventListener("click", () => {
        quantity = Math.max(1, quantity - 1);
        renderSummary();
    });

    document.getElementById("increase-qty").addEventListener("click", () => {
        quantity += 1;
        renderSummary();
    });

    document.getElementById("confirm-order-btn").addEventListener("click", () => {
        addItemToCart({
            id: Date.now(),
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            quantity,
            unitPrice: product.price,
            note: noteInput.value.trim() || ""
        });

        renderCartBadge();
        window.location.href = "carrinho.html";
    });

    renderSummary();
}

function renderCartItems(cart) {
    const list = document.getElementById("cart-items-list");

    if (!cart.length) {
        list.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <h2>Seu carrinho esta vazio</h2>
                <p>Adicione produtos de um restaurante para montar o pedido completo.</p>
                <a href="index.html" class="btn-primary text-link">Explorar restaurantes</a>
            </div>
        `;
        return;
    }

    list.innerHTML = cart.map((item) => `
        <article class="cart-item-card" data-cart-item-id="${item.id}">
            <img src="${item.productImage}" alt="${item.productName}" class="cart-item-image">
            <div class="cart-item-body">
                <div class="cart-item-top">
                    <div>
                        <p class="cart-item-restaurant">${item.restaurantName}</p>
                        <h3>${item.productName}</h3>
                        <p class="product-desc">${item.note || "Sem observacoes neste item."}</p>
                    </div>
                    <button class="cart-remove-btn" data-remove-id="${item.id}" aria-label="Remover item">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-footer">
                    <div class="qty-actions">
                        <button type="button" class="qty-btn" data-qty-action="decrease" data-item-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button type="button" class="qty-btn" data-qty-action="increase" data-item-id="${item.id}">+</button>
                    </div>
                    <strong class="price-tag">${formatCurrency(item.unitPrice * item.quantity)}</strong>
                </div>
            </div>
        </article>
    `).join("");

    list.querySelectorAll("[data-qty-action]").forEach((button) => {
        button.addEventListener("click", () => {
            const itemId = Number(button.getAttribute("data-item-id"));
            const action = button.getAttribute("data-qty-action");
            const currentItem = getStoredCart().find((item) => item.id === itemId);

            if (!currentItem) {
                return;
            }

            updateCartItemQuantity(itemId, currentItem.quantity + (action === "increase" ? 1 : -1));
            initCartPage();
        });
    });

    list.querySelectorAll("[data-remove-id]").forEach((button) => {
        button.addEventListener("click", () => {
            removeCartItem(Number(button.getAttribute("data-remove-id")));
            initCartPage();
        });
    });
}

function initCartPage() {
    const cart = getStoredCart();
    const couponInput = document.getElementById("coupon-code");
    const couponMessage = document.getElementById("coupon-message");
    const summary = document.getElementById("cart-summary");
    const confirmButton = document.getElementById("cart-confirm-btn");
    const currentCoupon = getStoredCoupon();

    renderCartItems(cart);
    renderCartBadge();

    if (couponInput) {
        couponInput.value = currentCoupon;
    }

    const totals = getCartTotals(cart, currentCoupon);

    summary.innerHTML = `
        <div class="price-row">
            <span>Subtotal</span>
            <strong>${formatCurrency(totals.subtotal)}</strong>
        </div>
        <div class="price-row">
            <span>Entrega</span>
            <strong>${totals.shipping === 0 ? "Grátis" : formatCurrency(totals.shipping)}</strong>
        </div>
        <div class="price-row">
            <span>Desconto</span>
            <strong>${totals.discount === 0 ? "-" : `- ${formatCurrency(totals.discount)}`}</strong>
        </div>
        <div class="price-row total">
            <span>Total</span>
            <strong>${formatCurrency(totals.total)}</strong>
        </div>
    `;

    if (couponMessage) {
        couponMessage.textContent = totals.couponInfo ? `Cupom aplicado: ${totals.couponInfo.label}` : "Cupons disponíveis: DEV10, PRIMEIRA15, FRETEGRATIS, OFF5";
        couponMessage.className = `coupon-message ${totals.couponInfo ? "success" : ""}`;
    }

    confirmButton.disabled = cart.length === 0;

    document.getElementById("apply-coupon-btn").onclick = () => {
        const normalized = couponInput.value.trim().toUpperCase();
        if (!normalized) {
            saveCoupon("");
            initCartPage();
            return;
        }

        if (!couponsData[normalized]) {
            couponMessage.textContent = "Cupom invalido. Tente DEV10, PRIMEIRA15, FRETEGRATIS ou OFF5.";
            couponMessage.className = "coupon-message error";
            return;
        }

        saveCoupon(normalized);
        initCartPage();
    };

    confirmButton.onclick = () => {
        if (!cart.length) {
            return;
        }

        const freshCoupon = getStoredCoupon();
        const freshTotals = getCartTotals(cart, freshCoupon);
        const uniqueRestaurants = [...new Set(cart.map((item) => item.restaurantName))];
        const notes = cart.filter((item) => item.note).map((item) => `${item.productName}: ${item.note}`).join(" | ");

        const newOrder = {
            id: Date.now(),
            restaurantId: cart[0].restaurantId,
            restaurantName: uniqueRestaurants.length === 1 ? uniqueRestaurants[0] : `${uniqueRestaurants.length} restaurantes`,
            items: cart.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            })),
            total: Number(freshTotals.total.toFixed(2)),
            discount: Number(freshTotals.discount.toFixed(2)),
            status: "Em preparo",
            date: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
            note: notes || "Sem observacoes",
            coupon: freshCoupon,
            deliveryPerson: ""
        };

        const orders = getStoredOrders();
        orders.unshift(newOrder);
        saveOrders(orders);
        saveCart([]);
        saveCoupon("");
        renderCartBadge();
        window.location.href = "meus-pedidos.html";
    };
}

function renderOrdersOverview(orders) {
    const stats = document.getElementById("orders-stats");

    if (!stats) {
        return;
    }

    const totalOrders = orders.length;
    const preparing = orders.filter((order) => order.status === "Em preparo").length;
    const onTheWay = orders.filter((order) => order.status === "Saiu para entrega").length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

    stats.innerHTML = `
        <div class="orders-stat-card">
            <span class="orders-stat-label">Pedidos</span>
            <strong>${totalOrders}</strong>
        </div>
        <div class="orders-stat-card">
            <span class="orders-stat-label">Em preparo</span>
            <strong>${preparing}</strong>
        </div>
        <div class="orders-stat-card">
            <span class="orders-stat-label">Na rota</span>
            <strong>${onTheWay}</strong>
        </div>
        <div class="orders-stat-card">
            <span class="orders-stat-label">Total gasto</span>
            <strong>${formatCurrency(totalSpent)}</strong>
        </div>
    `;
}

function renderOrders(status = "Todos") {
    const ordersList = document.getElementById("orders-list");
    const orders = getStoredOrders();
    const filtered = status === "Todos" ? orders : orders.filter((order) => order.status === status);
    renderOrdersOverview(orders);

    if (!filtered.length) {
        ordersList.innerHTML = `
            <div class="section-card empty-orders">
                <i class="fa-solid fa-bag-shopping"></i>
                <h2>Nenhum pedido encontrado</h2>
                <p>Experimente mudar o filtro ou fazer um novo pedido na home.</p>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = filtered.map((order) => {
        const itemsMarkup = order.items.map((item) => `
            <div class="order-item-pill">
                <span>${item.quantity}x ${item.productName}</span>
                <strong>${formatCurrency(item.unitPrice * item.quantity)}</strong>
            </div>
        `).join("");

        const deliveryMarkup = order.status === "Saiu para entrega" && order.deliveryPerson
            ? `<div class="delivery-highlight"><i class="fa-solid fa-motorcycle"></i> Entregador: <strong>${order.deliveryPerson}</strong></div>`
            : "";

        const couponMarkup = order.coupon
            ? `<span class="order-tag"><i class="fa-solid fa-ticket"></i> Cupom ${order.coupon}</span>`
            : "";

        return `
            <article class="order-card order-card-modern">
                <div class="order-card-top">
                    <div>
                        <div class="order-card-title">${order.restaurantName}</div>
                        <div class="order-meta">${order.date}</div>
                    </div>
                    <span class="status-pill ${getStatusClass(order.status)}">${order.status}</span>
                </div>
                <div class="order-card-middle">
                    <div class="order-items-stack">
                        ${itemsMarkup}
                    </div>
                    <div class="order-side-summary">
                        <div class="order-total-big">${formatCurrency(order.total)}</div>
                        <div class="order-tags">
                            ${couponMarkup}
                            ${order.discount > 0 ? `<span class="order-tag success"><i class="fa-solid fa-badge-percent"></i> Desconto ${formatCurrency(order.discount)}</span>` : ""}
                        </div>
                    </div>
                </div>
                <div class="order-bottom-line">
                    <div class="order-note-box">
                        <span class="detail-label">Observacoes</span>
                        <span class="detail-value">${order.note || "Sem observacoes"}</span>
                    </div>
                    ${deliveryMarkup}
                </div>
            </article>
        `;
    }).join("");
}

function initOrdersPage() {
    renderOrders();

    document.querySelectorAll(".filter-chip").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
            button.classList.add("active");
            renderOrders(button.dataset.status || "Todos");
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    ensureSeedRestaurants();
    ensureSeedProducts();
    renderCartBadge();

    if (page === "restaurante") {
        initRestaurantPage();
    }

    if (page === "pedido") {
        initOrderPage();
    }

    if (page === "carrinho") {
        initCartPage();
    }

    if (page === "pedidos") {
        initOrdersPage();
    }
});

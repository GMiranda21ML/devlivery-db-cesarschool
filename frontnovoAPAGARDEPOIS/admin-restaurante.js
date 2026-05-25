const seedRestaurantData = [
    {
        id: 1,
        name: "Byte Burguer",
        category: "Lanches",
        rating: 4.8,
        time: "30-40 min",
        description: "Hamburgueres artesanais, combos generosos e entregas rápidas para quem quer matar a fome sem sair do teclado."
    },
    {
        id: 2,
        name: "Pizza do Dev",
        category: "Pizzas",
        rating: 4.6,
        time: "40-50 min",
        description: "Pizzas com massa leve, borda recheada e sabores pensados para longas noites de deploy."
    },
    {
        id: 3,
        name: "Sushi Array",
        category: "Japonesa",
        rating: 4.9,
        time: "45-60 min",
        description: "Combinados frescos, sashimis e temakis com apresentação caprichada e ótima avaliação."
    },
    {
        id: 4,
        name: "Commit Café & Lanches",
        category: "Lanches",
        rating: 4.5,
        time: "20-30 min",
        description: "Cafés especiais, salgados, brunch e lanches para acompanhar pair programming e reuniões."
    },
    {
        id: 5,
        name: "Sintaxe Saudável",
        category: "Saudável",
        rating: 4.7,
        time: "25-35 min",
        description: "Bowls, saladas, wraps e pratos leves para manter a produtividade sem pesar."
    },
    {
        id: 6,
        name: "Churrasco Orientado a Objetos",
        category: "Brasileira",
        rating: 4.8,
        time: "50-70 min",
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

let currentRestaurantId = 1;
let uploadedImageData = "";
let pendingDeliveryOrderId = null;

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

function ensureBaseData() {
    if (!localStorage.getItem("devlivery-restaurants")) {
        localStorage.setItem("devlivery-restaurants", JSON.stringify(seedRestaurantData));
    }

    if (!localStorage.getItem("devlivery-products")) {
        localStorage.setItem("devlivery-products", JSON.stringify(seedProductsData));
    }

    if (!localStorage.getItem("devlivery-orders")) {
        localStorage.setItem("devlivery-orders", JSON.stringify(seedOrders));
    }
}

function getStoredProducts() {
    ensureBaseData();

    try {
        const parsed = JSON.parse(localStorage.getItem("devlivery-products") || "[]");
        return Array.isArray(parsed) ? parsed : [...seedProductsData];
    } catch (error) {
        return [...seedProductsData];
    }
}

function saveProducts(products) {
    localStorage.setItem("devlivery-products", JSON.stringify(products));
}

function getStoredOrders() {
    ensureBaseData();

    try {
        const parsed = JSON.parse(localStorage.getItem("devlivery-orders") || "[]");
        return Array.isArray(parsed) ? parsed.map(normalizeOrder) : [...seedOrders];
    } catch (error) {
        return [...seedOrders];
    }
}

function saveOrders(orders) {
    localStorage.setItem("devlivery-orders", JSON.stringify(orders));
}

function getStatusClass(status) {
    if (status === "Em preparo") return "status-em-preparo";
    if (status === "Saiu para entrega") return "status-saiu-para-entrega";
    return "status-entregue";
}

function setPreviewImage(src) {
    const preview = document.getElementById("product-image-preview");
    if (src) {
        preview.src = src;
        preview.classList.remove("hidden-preview");
    } else {
        preview.src = "";
        preview.classList.add("hidden-preview");
    }
}

function resetProductForm() {
    document.getElementById("product-form").reset();
    document.getElementById("editing-product-id").value = "";
    document.getElementById("product-submit-btn").textContent = "Salvar produto";
    document.getElementById("product-form-feedback").textContent = "";
    document.getElementById("product-form-feedback").className = "form-feedback";
    uploadedImageData = "";
    setPreviewImage("");
}

function fillProductForm(product) {
    document.getElementById("editing-product-id").value = String(product.id);
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-description").value = product.description;
    document.getElementById("product-price").value = String(product.price);
    document.getElementById("product-image-url").value = product.image || "";
    document.getElementById("product-submit-btn").textContent = "Atualizar produto";
    uploadedImageData = product.image || "";
    setPreviewImage(product.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAdminHero() {
    const restaurant = getRestaurantById(currentRestaurantId);
    document.getElementById("admin-restaurant-name").textContent = restaurant.name;
    document.getElementById("admin-restaurant-description").textContent = restaurant.description;
    document.getElementById("admin-restaurant-rating").textContent = restaurant.rating.toFixed(1);
    document.getElementById("admin-restaurant-category").textContent = restaurant.category;
    document.getElementById("admin-restaurant-time").textContent = restaurant.time;
    document.getElementById("admin-view-restaurant-link").href = `restaurante.html?id=${restaurant.id}`;
    document.title = `Admin ${restaurant.name} - Dev-livery`;
}

function getRestaurantProducts() {
    return getStoredProducts().filter((product) => product.restaurantId === currentRestaurantId);
}

function getRestaurantOrders() {
    return getStoredOrders()
        .filter((order) => order.restaurantId === currentRestaurantId)
        .sort((a, b) => b.id - a.id);
}

function renderMetrics() {
    const products = getRestaurantProducts();
    const orders = getRestaurantOrders();
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const queueOrders = orders.filter((order) => order.status === "Em preparo").length;
    const deliveringOrders = orders.filter((order) => order.status === "Saiu para entrega").length;
    const completedOrders = orders.filter((order) => order.status === "Entregue").length;

    document.getElementById("admin-metrics").innerHTML = `
        <article class="metric-card">
            <span class="metric-label">Faturamento total</span>
            <strong>${formatCurrency(revenue)}</strong>
            <span class="metric-note">Soma de todos os pedidos registrados para a loja.</span>
        </article>
        <article class="metric-card">
            <span class="metric-label">Pedidos na fila</span>
            <strong>${queueOrders}</strong>
            <span class="metric-note">Pedidos ainda em preparo e aguardando despacho.</span>
        </article>
        <article class="metric-card">
            <span class="metric-label">Em entrega</span>
            <strong>${deliveringOrders}</strong>
            <span class="metric-note">Pedidos que ja sairam para entrega.</span>
        </article>
        <article class="metric-card">
            <span class="metric-label">Produtos ativos</span>
            <strong>${products.length}</strong>
            <span class="metric-note">${completedOrders} pedidos ja concluidos no historico da loja.</span>
        </article>
    `;

    const averageTicket = orders.length ? revenue / orders.length : 0;
    document.getElementById("finance-summary").innerHTML = `
        <div class="finance-summary-row">
            <span class="finance-label">Total faturado</span>
            <span class="finance-value">${formatCurrency(revenue)}</span>
        </div>
        <div class="finance-summary-row">
            <span class="finance-label">Ticket medio</span>
            <span class="finance-value">${formatCurrency(averageTicket)}</span>
        </div>
        <div class="finance-summary-row">
            <span class="finance-label">Pedidos no painel</span>
            <span class="finance-value">${orders.length}</span>
        </div>
        <div class="finance-summary-row">
            <span class="finance-label">Pedidos entregues</span>
            <span class="finance-value">${completedOrders}</span>
        </div>
    `;
}

function renderProducts() {
    const products = getRestaurantProducts();
    const container = document.getElementById("products-admin-grid");

    if (!products.length) {
        container.innerHTML = `<div class="empty-state">Nenhum produto cadastrado para este restaurante ainda.</div>`;
        return;
    }

    container.innerHTML = products.map((product) => `
        <article class="product-admin-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-admin-body">
                <div class="product-admin-title-row">
                    <h3>${product.name}</h3>
                    <strong>${formatCurrency(product.price)}</strong>
                </div>
                <p class="product-admin-desc">${product.description}</p>
                <div class="product-admin-actions">
                    <button type="button" class="product-edit-btn" data-edit-product="${product.id}">Editar</button>
                    <button type="button" class="product-delete-btn" data-delete-product="${product.id}">Excluir</button>
                </div>
            </div>
        </article>
    `).join("");

    container.querySelectorAll("[data-edit-product]").forEach((button) => {
        button.addEventListener("click", () => {
            const productId = Number(button.getAttribute("data-edit-product"));
            const product = getStoredProducts().find((item) => item.id === productId);
            if (product) {
                fillProductForm(product);
            }
        });
    });

    container.querySelectorAll("[data-delete-product]").forEach((button) => {
        button.addEventListener("click", () => {
            const productId = Number(button.getAttribute("data-delete-product"));
            const product = getStoredProducts().find((item) => item.id === productId);

            if (!product) {
                return;
            }

            if (!window.confirm(`Deseja excluir o produto "${product.name}"?`)) {
                return;
            }

            const updatedProducts = getStoredProducts().filter((item) => item.id !== productId);
            saveProducts(updatedProducts);
            renderProducts();
            renderMetrics();
        });
    });
}

function renderOrders() {
    const orders = getRestaurantOrders();
    const container = document.getElementById("orders-admin-list");

    if (!orders.length) {
        container.innerHTML = `<div class="empty-state">Ainda nao ha pedidos para este restaurante.</div>`;
        return;
    }

    container.innerHTML = orders.map((order) => `
        <article class="order-admin-card">
            <div class="order-admin-top">
                <div>
                    <h3>Pedido #${order.id}</h3>
                    <div class="order-admin-meta">${order.restaurantName} • ${order.date} • ${formatCurrency(order.total)}</div>
                </div>
                <span class="status-badge ${getStatusClass(order.status)}">${order.status}</span>
            </div>
            <div class="order-items-list">
                ${order.items.map((item) => `
                    <div class="order-item-row">
                        <span>${item.quantity}x ${item.productName}</span>
                        <strong>${formatCurrency(item.unitPrice * item.quantity)}</strong>
                    </div>
                `).join("")}
            </div>
            <div class="order-admin-bottom">
                <div class="order-admin-note">
                    <strong>Observacoes:</strong> ${order.note || "Sem observacoes"}
                    ${order.coupon ? `<br><strong>Cupom:</strong> ${order.coupon}` : ""}
                </div>
            </div>
            ${order.status === "Em preparo" ? `
                <div class="status-form-row">
                    <div class="status-form-controls single-action">
                        <button type="button" class="order-action-btn" data-send-order="${order.id}">Enviar para entrega</button>
                    </div>
                </div>
            ` : ""}
        </article>
    `).join("");

    container.querySelectorAll("[data-send-order]").forEach((button) => {
        button.addEventListener("click", () => {
            pendingDeliveryOrderId = Number(button.getAttribute("data-send-order"));
            document.getElementById("delivery-confirm-modal").classList.remove("hidden-modal");
        });
    });
}

function closeDeliveryModal() {
    pendingDeliveryOrderId = null;
    document.getElementById("delivery-confirm-modal").classList.add("hidden-modal");
}

function confirmSendToDelivery() {
    if (!pendingDeliveryOrderId) {
        closeDeliveryModal();
        return;
    }

    const ordersData = getStoredOrders().map((order) => {
        if (order.id !== pendingDeliveryOrderId) {
            return order;
        }

        return {
            ...order,
            status: "Saiu para entrega",
            deliveryPerson: ""
        };
    });

    saveOrders(ordersData);
    closeDeliveryModal();
    renderOrders();
    renderMetrics();
}

function handleFormSubmit(event) {
    event.preventDefault();

    const editingId = Number(document.getElementById("editing-product-id").value);
    const name = document.getElementById("product-name").value.trim();
    const description = document.getElementById("product-description").value.trim();
    const price = Number(document.getElementById("product-price").value);
    const imageUrl = document.getElementById("product-image-url").value.trim();
    const feedback = document.getElementById("product-form-feedback");

    const products = getStoredProducts();

    if (price < 0) {
        feedback.textContent = "O preco nao pode ser negativo.";
        feedback.className = "form-feedback error";
        return;
    }

    const finalImage = uploadedImageData || imageUrl;

    if (!finalImage) {
        feedback.textContent = "Informe uma imagem por URL ou envie um arquivo.";
        feedback.className = "form-feedback error";
        return;
    }

    const newProduct = {
        id: editingId || Math.max(0, ...products.map((product) => Number(product.id) || 0)) + 1,
        restaurantId: currentRestaurantId,
        name,
        description,
        rating: editingId
            ? (products.find((product) => product.id === editingId)?.rating ?? 4.8)
            : 4.8,
        price,
        image: finalImage
    };

    const updatedProducts = editingId
        ? products.map((product) => product.id === editingId ? newProduct : product)
        : [newProduct, ...products];

    saveProducts(updatedProducts);
    const successMessage = editingId ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.";
    renderProducts();
    renderMetrics();
    resetProductForm();
    feedback.textContent = successMessage;
    feedback.className = "form-feedback success";
}

function bindFormEvents() {
    document.getElementById("product-form").addEventListener("submit", handleFormSubmit);
    document.getElementById("reset-form-btn").addEventListener("click", resetProductForm);
    document.getElementById("cancel-edit-btn").addEventListener("click", resetProductForm);

    document.getElementById("product-image-url").addEventListener("input", (event) => {
        const value = event.target.value.trim();
        if (value) {
            uploadedImageData = value;
            setPreviewImage(value);
        }
    });

    document.getElementById("product-image-file").addEventListener("change", (event) => {
        const [file] = event.target.files || [];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            uploadedImageData = String(reader.result || "");
            setPreviewImage(uploadedImageData);
        };
        reader.readAsDataURL(file);
    });

    document.getElementById("cancel-delivery-btn").addEventListener("click", closeDeliveryModal);
    document.getElementById("confirm-delivery-btn").addEventListener("click", confirmSendToDelivery);
    document.getElementById("delivery-confirm-modal").addEventListener("click", (event) => {
        if (event.target.id === "delivery-confirm-modal") {
            closeDeliveryModal();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    ensureBaseData();
    currentRestaurantId = Number(getQueryParam("id")) || 1;
    renderAdminHero();
    bindFormEvents();
    renderMetrics();
    renderProducts();
    renderOrders();
});

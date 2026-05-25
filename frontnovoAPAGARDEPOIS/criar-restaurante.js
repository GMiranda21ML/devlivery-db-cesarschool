const seedRestaurants = [
    {
        id: 1,
        cnpj: "12.345.678/0001-90",
        name: "Byte Burguer",
        telefoneRestaurante: "(81) 99876-1001",
        numero: "120",
        cep: "50000-000",
        bairro: "Boa Vista",
        rua: "Rua do Burger",
        cidade: "Recife",
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
        cnpj: "98.765.432/0001-10",
        name: "Pizza do Dev",
        telefoneRestaurante: "(81) 99876-1002",
        numero: "77",
        cep: "50000-001",
        bairro: "Recife Antigo",
        rua: "Rua da Pizza",
        cidade: "Recife",
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
        cnpj: "11.222.333/0001-44",
        name: "Sushi Array",
        telefoneRestaurante: "(81) 99876-1003",
        numero: "45",
        cep: "50000-002",
        bairro: "Casa Forte",
        rua: "Rua do Sushi",
        cidade: "Recife",
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
        cnpj: "55.666.777/0001-88",
        name: "Commit Café & Lanches",
        telefoneRestaurante: "(81) 99876-1004",
        numero: "201",
        cep: "50000-003",
        bairro: "Madalena",
        rua: "Rua do Café",
        cidade: "Recife",
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
        cnpj: "99.888.777/0001-66",
        name: "Sintaxe Saudável",
        telefoneRestaurante: "(81) 99876-1005",
        numero: "18",
        cep: "50000-004",
        bairro: "Graças",
        rua: "Rua da Salada",
        cidade: "Recife",
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
        cnpj: "33.444.555/0001-22",
        name: "Churrasco Orientado a Objetos",
        telefoneRestaurante: "(81) 99876-1006",
        numero: "66",
        cep: "50000-005",
        bairro: "Espinheiro",
        rua: "Rua da Brasa",
        cidade: "Recife",
        category: "Brasileira",
        rating: 4.8,
        time: "50-70 min",
        fee: "R$ 10,00",
        logo: "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?q=80&w=100&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
        description: "Carnes na brasa, acompanhamentos clássicos e porções fartas para compartilhar."
    }
];

let uploadedRestaurantImage = "";
let latestCreatedRestaurantId = null;

function digitsOnly(value) {
    return value.replace(/\D/g, "");
}

function applyCnpjMask(value) {
    const digits = digitsOnly(value).slice(0, 14);

    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function applyPhoneMask(value) {
    const digits = digitsOnly(value).slice(0, 11);

    if (digits.length <= 2) return digits.length ? `(${digits}` : "";
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function ensureRestaurantsSeed() {
    if (!localStorage.getItem("devlivery-restaurants")) {
        localStorage.setItem("devlivery-restaurants", JSON.stringify(seedRestaurants));
    }
}

function getStoredRestaurants() {
    ensureRestaurantsSeed();

    try {
        const parsed = JSON.parse(localStorage.getItem("devlivery-restaurants") || "[]");
        return Array.isArray(parsed) && parsed.length ? parsed : [...seedRestaurants];
    } catch (error) {
        return [...seedRestaurants];
    }
}

function saveRestaurants(restaurants) {
    localStorage.setItem("devlivery-restaurants", JSON.stringify(restaurants));
}

function setPreviewImage(src) {
    const image = document.getElementById("restaurant-preview-image");
    if (src) {
        image.src = src;
        image.classList.remove("hidden-preview");
    } else {
        image.src = "";
        image.classList.add("hidden-preview");
    }
}

function updatePreview() {
    const name = document.getElementById("restaurant-name").value.trim() || "Nome do restaurante";
    const cnpj = document.getElementById("restaurant-cnpj").value.trim() || "CNPJ";
    const phone = document.getElementById("restaurant-phone").value.trim() || "Telefone";
    const rua = document.getElementById("restaurant-rua").value.trim() || "Rua";
    const numero = document.getElementById("restaurant-number").value.trim() || "numero";
    const bairro = document.getElementById("restaurant-bairro").value.trim() || "bairro";
    const cidade = document.getElementById("restaurant-city").value.trim() || "cidade";
    const imageUrl = document.getElementById("restaurant-image-url").value.trim();

    document.getElementById("preview-name").textContent = name;
    document.getElementById("preview-cnpj").textContent = cnpj;
    document.getElementById("preview-phone").textContent = phone;
    document.getElementById("preview-address").textContent = `${rua}, ${numero} - ${bairro}, ${cidade}`;

    if (uploadedRestaurantImage) {
        setPreviewImage(uploadedRestaurantImage);
    } else if (imageUrl) {
        setPreviewImage(imageUrl);
    } else {
        setPreviewImage("");
    }
}

function resetRestaurantForm() {
    document.getElementById("restaurant-form").reset();
    document.getElementById("restaurant-form-feedback").textContent = "";
    document.getElementById("restaurant-form-feedback").className = "form-feedback";
    document.getElementById("preview-success-links").classList.add("hidden-links");
    uploadedRestaurantImage = "";
    latestCreatedRestaurantId = null;
    updatePreview();
}

function handleRestaurantSubmit(event) {
    event.preventDefault();

    const cnpj = document.getElementById("restaurant-cnpj").value.trim();
    const name = document.getElementById("restaurant-name").value.trim();
    const telefoneRestaurante = document.getElementById("restaurant-phone").value.trim();
    const numero = document.getElementById("restaurant-number").value.trim();
    const cep = document.getElementById("restaurant-cep").value.trim();
    const bairro = document.getElementById("restaurant-bairro").value.trim();
    const rua = document.getElementById("restaurant-rua").value.trim();
    const cidade = document.getElementById("restaurant-city").value.trim();
    const imageUrl = document.getElementById("restaurant-image-url").value.trim();
    const feedback = document.getElementById("restaurant-form-feedback");

    const restaurants = getStoredRestaurants();
    const duplicatedCnpj = restaurants.some((restaurant) => restaurant.cnpj === cnpj);

    if (duplicatedCnpj) {
        feedback.textContent = "Ja existe um restaurante com esse CNPJ.";
        feedback.className = "form-feedback error";
        return;
    }

    const finalImage = uploadedRestaurantImage || imageUrl;

    if (!finalImage) {
        feedback.textContent = "Informe uma imagem por URL ou envie um arquivo.";
        feedback.className = "form-feedback error";
        return;
    }

    const nextId = Math.max(0, ...restaurants.map((restaurant) => Number(restaurant.id) || 0)) + 1;
    const newRestaurant = {
        id: nextId,
        cnpj,
        name,
        telefoneRestaurante,
        numero,
        cep,
        bairro,
        rua,
        cidade,
        category: "Restaurante",
        rating: 4.5,
        time: "35-45 min",
        fee: "Grátis",
        logo: finalImage,
        cover: finalImage,
        description: `${rua}, ${numero} - ${bairro}, ${cidade}`
    };

    saveRestaurants([newRestaurant, ...restaurants]);
    latestCreatedRestaurantId = nextId;
    document.getElementById("open-admin-link").href = `admin-restaurante.html?id=${nextId}`;
    document.getElementById("preview-success-links").classList.remove("hidden-links");
    feedback.textContent = "Restaurante criado com sucesso. Agora voce ja pode abrir o painel admin da loja.";
    feedback.className = "form-feedback success";
}

function bindEvents() {
    const form = document.getElementById("restaurant-form");
    const resetButton = document.getElementById("reset-restaurant-form");
    const cnpjInput = document.getElementById("restaurant-cnpj");
    const phoneInput = document.getElementById("restaurant-phone");
    const fieldsToPreview = [
        "restaurant-cnpj",
        "restaurant-name",
        "restaurant-phone",
        "restaurant-number",
        "restaurant-bairro",
        "restaurant-rua",
        "restaurant-city",
        "restaurant-image-url"
    ];

    form.addEventListener("submit", handleRestaurantSubmit);
    resetButton.addEventListener("click", resetRestaurantForm);

    cnpjInput.addEventListener("input", () => {
        cnpjInput.value = applyCnpjMask(cnpjInput.value);
        updatePreview();
    });

    phoneInput.addEventListener("input", () => {
        phoneInput.value = applyPhoneMask(phoneInput.value);
        updatePreview();
    });

    fieldsToPreview.forEach((fieldId) => {
        if (fieldId !== "restaurant-cnpj" && fieldId !== "restaurant-phone") {
            document.getElementById(fieldId).addEventListener("input", updatePreview);
        }
    });

    document.getElementById("restaurant-image-file").addEventListener("change", (event) => {
        const [file] = event.target.files || [];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            uploadedRestaurantImage = String(reader.result || "");
            updatePreview();
        };
        reader.readAsDataURL(file);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    ensureRestaurantsSeed();
    bindEvents();
    updatePreview();
});

let uploadedRestaurantImageFile = null;

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

    if (uploadedRestaurantImageFile) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target.result);
        reader.readAsDataURL(uploadedRestaurantImageFile);
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
    uploadedRestaurantImageFile = null;
    updatePreview();
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

async function handleRestaurantSubmit(event) {
    event.preventDefault();
    const feedback = document.getElementById("restaurant-form-feedback");
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const decoded = parseJwt(token);
    if (decoded.role !== 'parceiro') {
        window.location.href = 'index.html';
        return;
    }

    const cnpj = document.getElementById("restaurant-cnpj").value.trim();
    const name = document.getElementById("restaurant-name").value.trim();
    const telefoneRestaurante = document.getElementById("restaurant-phone").value.trim();
    const numero = document.getElementById("restaurant-number").value.trim();
    const cep = document.getElementById("restaurant-cep").value.trim();
    const bairro = document.getElementById("restaurant-bairro").value.trim();
    const rua = document.getElementById("restaurant-rua").value.trim();
    const cidade = document.getElementById("restaurant-city").value.trim();
    const cdCategoria = document.getElementById("restaurant-category").value;
    const tempoEntrega = document.getElementById("restaurant-delivery-time").value.trim();

    const restauranteDTO = {
        cnpj: cnpj,
        cpf: decoded.sub,
        nome: name,
        telefoneRestaurante: telefoneRestaurante,
        cep: cep,
        rua: rua,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        cdCategoria: parseInt(cdCategoria),
        tempoEntrega: tempoEntrega
    };

    try {
        const response = await fetch('/api/restaurantes/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(restauranteDTO)
        });

        if (response.ok) {
            const cdRestaurante = await response.text();
            
            if (uploadedRestaurantImageFile) {
                const formData = new FormData();
                formData.append('imagem', uploadedRestaurantImageFile);
                
                await fetch(`/api/restaurantes/${cdRestaurante}/imagem`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
            }

            document.getElementById("open-admin-link").href = `painel-restaurante.html?cdRestaurante=${cdRestaurante}`;
            document.getElementById("preview-success-links").classList.remove("hidden-links");
            feedback.textContent = "Restaurante criado com sucesso! Agora você já pode abrir o painel admin da loja.";
            feedback.className = "form-feedback success";
        } else {
            const msgErro = await response.text();
            feedback.textContent = "Erro ao criar restaurante: " + msgErro;
            feedback.className = "form-feedback error";
        }
    } catch (error) {
        console.error("Erro:", error);
        feedback.textContent = "Erro de conexão com o servidor.";
        feedback.className = "form-feedback error";
    }
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
        if (file) {
            uploadedRestaurantImageFile = file;
            updatePreview();
        }
    });
}

async function carregarCategoriasSelect() {
    try {
        const response = await fetch('/api/categorias');
        if (response.ok) {
            const categorias = await response.json();
            const select = document.getElementById('restaurant-category');
            select.innerHTML = '<option value="" disabled selected>Selecione uma categoria...</option>';

            categorias.forEach(cat => {
                select.innerHTML += `<option value="${cat.cdCategoria}">${cat.nome}</option>`;
            });
        }
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    const decoded = parseJwt(token);
    if (decoded.role !== 'parceiro') {
        window.location.href = 'index.html';
        return;
    }

    bindEvents();
    updatePreview();
    carregarCategoriasSelect();
});

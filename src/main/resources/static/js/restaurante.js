let currentRestauranteCd = null;
    let currentRestauranteNome = null;

    // --- JWT PARSER ---
    function parseJwt(token) {
        try {
            const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(decodeURIComponent(window.atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')));
        } catch (e) { return null; }
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('carrinho');
        window.location.reload();
    }

    function openCart() { window.location.href = 'carrinho.html'; }

    function getCartCount() {
        return (JSON.parse(localStorage.getItem('carrinho')) || [])
            .reduce((s, i) => s + (i.quantidade || 1), 0);
    }

    function updateCartUI() {
        const count = getCartCount();
        const fab = document.getElementById('cart-fab');
        const fabCount = document.getElementById('cart-fab-count');
        const badge = document.querySelector('.cart-badge');

        if (fab) {
            fab.style.display = count > 0 ? 'flex' : 'none';
            if (fabCount) fabCount.textContent = count;
        }
        if (badge) badge.textContent = count;
    }

    // --- INICIALIZAÇÃO ---
    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        currentRestauranteCd = parseInt(params.get('cdRestaurante'));
        if (!currentRestauranteCd) { window.location.href = 'index.html'; return; }

        // Navbar dinâmica
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = parseJwt(token);
            const role = decoded?.role;
            const navActions = document.getElementById('nav-actions');
            let navContent = '';

            if (role === 'parceiro') {
                navContent += `<a href="criar-restaurante.html" class="btn-icon" style="text-decoration:none;color:#1da55a;"><i class="fa-solid fa-store"></i><span>Criar Restaurante</span></a>`;
            }
            navContent += `
                <a href="perfil.html" class="btn-icon" style="text-decoration:none;"><i class="fa-solid fa-user"></i><span>Perfil</span></a>
                <button class="btn-icon" onclick="logout()" style="color:var(--primary-color);"><i class="fa-solid fa-arrow-right-from-bracket"></i><span>Sair</span></button>
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

        // Dados do restaurante
        try {
            const res = await fetch(`/api/restaurantes/cd/${currentRestauranteCd}`);
            if (res.ok) {
                const r = await res.json();
                currentRestauranteNome = r.nome;
                preencherHero(r);
                document.title = `${r.nome} — Dev-livery`;
            }
        } catch (e) { console.error('Erro:', e); }

        // Produtos
        try {
            const res = await fetch(`/api/produtos/restaurante/${currentRestauranteCd}`);
            if (res.ok) {
                const produtos = await res.json();
                renderProdutos(produtos);
            } else {
                document.getElementById('produtos-container').innerHTML =
                    '<p style="color:#888;text-align:center;padding:32px 0;">Nenhum produto encontrado.</p>';
            }
        } catch (e) {
            console.error('Erro:', e);
            document.getElementById('produtos-container').innerHTML =
                '<p style="color:#888;text-align:center;padding:32px 0;">Erro ao carregar o cardápio.</p>';
        }

        updateCartUI();
    });

// --- HERO ---
function preencherHero(r) {
    document.getElementById('restaurante-nome').textContent = r.nome;
    document.getElementById('rest-tempo').textContent = r.tempoEntrega ? `${r.tempoEntrega} min` : '—';
    document.getElementById('rest-nota').textContent = r.nota ? r.nota.toFixed(1) : '—';

    const cover = document.getElementById('rest-cover');
    const nomeImagemDoBanco = r.nomeImagem;
    const bgImage = nomeImagemDoBanco ? `/images/rest/${nomeImagemDoBanco}` : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop';

    cover.style.backgroundImage = `url('${bgImage}')`;
    cover.style.backgroundSize = 'cover';
    cover.style.backgroundPosition = 'center';

    const avatar = document.getElementById('rest-avatar');
    avatar.innerHTML = `<img src="${bgImage}"
        alt="${r.nome}"
        style="width:100%;height:100%;object-fit:cover;border-radius:15px;"
        onerror="this.parentElement.innerHTML='<i class=\\'fa-solid fa-store\\'></i>'"
    >`;

    const meta = document.getElementById('rest-meta');
    meta.innerHTML = `
        <span class="rest-hero__rating">
            <i class="fa-solid fa-star"></i>
            ${r.nota ? r.nota.toFixed(1) : '—'}
        </span>
        <span class="rest-hero__pill">
            <i class="fa-solid fa-tag"></i>
            ${r.categoria || 'Geral'}
        </span>
        <span class="rest-hero__pill">
            <i class="fa-regular fa-clock"></i>
            ${r.tempoEntrega ? `${r.tempoEntrega} min` : '—'}
        </span>
        <span class="rest-hero__pill rest-hero__pill--open">
            <i class="fa-solid fa-circle fa-xs"></i>
            Aberto agora
        </span>
    `;

    const token = localStorage.getItem('token');
    if (token) {
        const decoded = parseJwt(token);
        if (decoded?.role === 'parceiro') {
            const actionsEl = document.getElementById('rest-actions');
            actionsEl.innerHTML = `
                <a href="painel-restaurante.html" class="rest-hero__btn rest-hero__btn--ghost">
                    <i class="fa-solid fa-chart-line"></i> Painel Admin
                </a>
            `;
        }
    }
}

    // --- RENDER PRODUTOS ---
    function renderProdutos(produtos) {
        const container = document.getElementById('produtos-container');
        const countEl = document.getElementById('produtos-count');

        container.className = '';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '14px';

        if (countEl) countEl.textContent = `${produtos.length} ${produtos.length === 1 ? 'item' : 'itens'}`;

        if (produtos.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:48px 0;color:#888;">
                    <i class="fa-solid fa-bowl-food" style="font-size:2rem;margin-bottom:12px;opacity:.4;display:block;"></i>
                    Este cardápio ainda não tem produtos.
                </div>`;
            return;
        }

        container.innerHTML = '';
        produtos.forEach(produto => {
            const imagemSrc = `/images/prod/prod_${produto.cdProduto}.jpg`;
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-card__info">
                    <img class="product-card__img"
                         src="${imagemSrc}"
                         alt="${produto.nome}"
                         onerror="this.style.display='none'">
                    <div class="product-card__text">
                        <h3 class="product-card__name">${produto.nome}</h3>
                        <p class="product-card__desc">${produto.descricao}</p>
                        <span class="product-card__price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
                <button class="product-card__add" onclick='addToCart(${JSON.stringify(produto)})'>
                    <i class="fa-solid fa-plus"></i> Adicionar
                </button>
            `;
            container.appendChild(card);
        });
    }

    // --- CARRINHO ---
    function addToCart(produto) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        if (carrinho.length > 0 && carrinho[0].cdRestaurante !== produto.cdRestaurante) {
            if (!confirm('Seu carrinho tem itens de outro restaurante. Deseja limpá-lo e continuar?')) return;
            carrinho = [];
        }

        const existing = carrinho.find(i => i.cdProduto === produto.cdProduto);
        if (existing) {
            existing.quantidade = (existing.quantidade || 1) + 1;
        } else {
            carrinho.push({ ...produto, quantidade: 1 });
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        updateCartUI();

        // Mini feedback visual no botão
        const btns = document.querySelectorAll('.product-card__add');
        btns.forEach(btn => {
            if (btn.closest('.product-card')?.querySelector('.product-card__name')?.textContent === produto.nome) {
                const original = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Adicionado!';
                btn.style.background = '#1a9c59';
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.style.background = '';
                }, 1200);
            }
        });
    }
// --- UTILITÁRIOS E AUTENTICAÇÃO ---
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
    window.location.href = 'login.html';
}

function formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const tokenPainel = localStorage.getItem('token');
let cdRestauranteLogado = null;
let pendingDeliveryOrderId = null;
let qtdPedidosPendentes = 0;
let faturamentoTotal = 0;
let totalProdutosAtivos = 0;

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', async () => {
    if (!tokenPainel) {
        window.location.href = 'login.html';
        return;
    }

    const decoded = parseJwt(tokenPainel);
    if(decoded.role !== 'parceiro') {
        alert('Acesso negado. Apenas parceiros podem acessar esta página.');
        window.location.href = 'index.html';
        return;
    }

    const cpfParceiro = decoded.sub;

    try {
        // Busca os dados reais do restaurante no backend
        const resRestaurante = await fetch(`/api/restaurantes/${cpfParceiro}`, {
            headers: { 'Authorization': `Bearer ${tokenPainel}` }
        });

        if (resRestaurante.ok) {
            const restaurante = await resRestaurante.json();
            cdRestauranteLogado = restaurante.cdRestaurante;
            
            // Preenche o Hero (Topo)
            document.getElementById('admin-restaurant-name').textContent = restaurante.nome;
            document.getElementById('admin-restaurant-description').textContent = restaurante.descricao || "O seu restaurante no Dev-livery.";
            document.getElementById('admin-restaurant-rating').textContent = restaurante.nota ? restaurante.nota.toFixed(1) : "5.0";
            document.getElementById('admin-restaurant-category').textContent = restaurante.categoria || "Geral";
            document.getElementById('admin-restaurant-time').textContent = "30-45 min"; // Fixo por agora
            
            // Carrega os dados reais das outras tabelas
            await carregarFaturamento();
            await carregarPedidosPendentes();
            await carregarProdutos();
            
            renderMetrics();
            bindFormEvents();
        } else {
            alert('Você ainda não cadastrou um restaurante!');
            window.location.href = 'criar-restaurante.html';
        }
    } catch (error) {
        console.error("Erro ao inicializar:", error);
    }
});

// --- MÉTRICAS ---
async function carregarFaturamento() {
    try {
        const response = await fetch(`/api/pedidos/restaurante/${cdRestauranteLogado}/faturamento`, {
            headers: { 'Authorization': `Bearer ${tokenPainel}` }
        });
        if(response.ok) {
            faturamentoTotal = await response.json();
        }
    } catch (error) {
        console.error("Erro ao carregar faturamento:", error);
    }
}

function renderMetrics() {
    document.getElementById("admin-metrics").innerHTML = `
        <article class="metric-card">
            <span class="metric-label">Faturamento total</span>
            <strong>${formatCurrency(faturamentoTotal)}</strong>
            <span class="metric-note">Pedidos concluídos</span>
        </article>
        <article class="metric-card">
            <span class="metric-label">Pedidos na fila</span>
            <strong>${qtdPedidosPendentes}</strong>
            <span class="metric-note">Aguardando preparo</span>
        </article>
        <article class="metric-card">
            <span class="metric-label">Produtos ativos</span>
            <strong>${totalProdutosAtivos}</strong>
            <span class="metric-note">No seu cardápio</span>
        </article>
    `;

    document.getElementById("finance-summary").innerHTML = `
        <div class="finance-summary-row">
            <span class="finance-label">Total faturado</span>
            <span class="finance-value">${formatCurrency(faturamentoTotal)}</span>
        </div>
        <div class="finance-summary-row">
            <span class="finance-label">Pedidos na fila</span>
            <span class="finance-value">${qtdPedidosPendentes}</span>
        </div>
        <div style="margin-top: 20px;">
            <button onclick="recalcularNotas()" class="admin-primary-btn" style="width: 100%; background-color: #f39c12;"><i class="fa-solid fa-star"></i> Recalcular Notas (Procedure)</button>
        </div>
    `;
}

// --- PEDIDOS ---
async function carregarPedidosPendentes() {
    try {
        const response = await fetch(`/api/pedidos/restaurante/${cdRestauranteLogado}/pendentes`, {
            headers: { 'Authorization': `Bearer ${tokenPainel}` }
        });

        const container = document.getElementById('orders-admin-list');

        if (response.ok) {
            const pedidos = await response.json();
            qtdPedidosPendentes = pedidos.length;

            if (pedidos.length === 0) {
                container.innerHTML = '<div class="empty-state">Nenhum pedido pendente no momento.</div>';
                return;
            }

            container.innerHTML = pedidos.map(pedido => `
                <article class="order-admin-card">
                    <div class="order-admin-top">
                        <div>
                            <h3>Pedido #${pedido.cdPedido}</h3>
                            <div class="order-admin-meta">CPF Cliente: ${pedido.cpfCliente} • ${pedido.data} • ${formatCurrency(pedido.valorTotal)}</div>
                        </div>
                        <span class="status-badge status-em-preparo">Pendente</span>
                    </div>
                    <div class="order-admin-bottom">
                        <div class="order-admin-note">
                            <strong>Atenção:</strong> Verifique os itens e inicie o preparo.
                        </div>
                    </div>
                    <div class="status-form-row">
                        <div class="status-form-controls single-action">
                            <button type="button" class="order-action-btn" onclick="aceitarPedido(${pedido.cdPedido})"><i class="fa-solid fa-fire-burner"></i> Aceitar e Preparar</button>
                        </div>
                    </div>
                </article>
            `).join("");
        }
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
    }
}

async function aceitarPedido(cdPedido) {
    if(!confirm('Deseja mover este pedido para "Em preparo"?')) return;

    try {
        const response = await fetch(`/api/pedidos/${cdPedido}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenPainel}`
            },
            body: JSON.stringify({ status: 'Em preparo' })
        });

        if (response.ok) {
            alert('Pedido aceito! O status foi atualizado com sucesso no banco de dados.');
            await carregarPedidosPendentes();
            renderMetrics();
        } else {
            alert('Erro ao atualizar o status do pedido no banco de dados.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function recalcularNotas() {
    if(!confirm('Deseja recalcular a nota de todos os produtos usando a Procedure do Banco?')) return;

    try {
        const response = await fetch(`/api/restaurantes/${cdRestauranteLogado}/recalcular-notas`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${tokenPainel}` }
        });

        if (response.ok) {
            alert('Sucesso! As notas foram recalculadas.');
            carregarProdutos();
        } else {
            alert('Erro ao executar a Procedure.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// --- PRODUTOS ---
async function carregarProdutos() {
    try {
        const response = await fetch(`/api/produtos/restaurante/${cdRestauranteLogado}`, {
            headers: { 'Authorization': `Bearer ${tokenPainel}` }
        });
        
        const container = document.getElementById('products-admin-grid');
        
        if (response.ok) {
            const produtos = await response.json();
            totalProdutosAtivos = produtos.length;
            renderMetrics(); // Atualiza contador
            
            if (produtos.length === 0) {
                container.innerHTML = '<div class="empty-state">O seu cardápio está vazio. Adicione novos produtos acima!</div>';
                return;
            }
            
            // Imagem genérica já que não temos no DB
            const imagemPadrao = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

            container.innerHTML = produtos.map(prod => `
                <article class="product-admin-card">
                    <img src="${imagemPadrao}" alt="${prod.nome}">
                    <div class="product-admin-body">
                        <div class="product-admin-title-row">
                            <h3>${prod.nome}</h3>
                            <strong>${formatCurrency(prod.preco)}</strong>
                        </div>
                        <p class="product-admin-desc">${prod.descricao}</p>
                        <p style="font-size: 12px; color: #f39c12; margin-top: 5px;"><i class="fa-solid fa-star"></i> ${prod.nota ? prod.nota.toFixed(1) : '0.0'}</p>
                        <div class="product-admin-actions">
                            <button type="button" class="product-edit-btn" onclick="editarProduto(${prod.cdProduto}, '${prod.nome.replace(/'/g, "\\'")}', '${prod.descricao.replace(/'/g, "\\'")}', ${prod.preco})">Editar</button>
                            <button type="button" class="product-delete-btn" onclick="apagarProduto(${prod.cdProduto})">Excluir</button>
                        </div>
                    </div>
                </article>
            `).join("");
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

function resetProductForm() {
    document.getElementById("product-form").reset();
    document.getElementById("editing-product-id").value = "";
    document.getElementById("product-submit-btn").textContent = "Salvar produto";
    document.getElementById("product-form-feedback").textContent = "";
    document.getElementById("product-form-feedback").className = "form-feedback";
    document.getElementById("product-image-preview").classList.add("hidden-preview");
}

function editarProduto(id, nome, desc, preco) {
    document.getElementById('editing-product-id').value = id;
    document.getElementById('product-name').value = nome;
    document.getElementById('product-description').value = desc;
    document.getElementById('product-price').value = preco;
    document.getElementById("product-submit-btn").textContent = "Atualizar produto";
    window.scrollTo({ top: document.getElementById('product-form').offsetTop - 100, behavior: "smooth" });
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const precoInput = parseFloat(document.getElementById('product-price').value);
    const feedback = document.getElementById("product-form-feedback");

    if (precoInput < 0) {
        feedback.textContent = "O preço não pode ser negativo.";
        feedback.className = "form-feedback error";
        return;
    }

    if (!cdRestauranteLogado) {
        feedback.textContent = "Erro: Restaurante não carregado.";
        feedback.className = "form-feedback error";
        return;
    }
    
    const id = document.getElementById('editing-product-id').value;
    const produtoDTO = {
        nome: document.getElementById('product-name').value,
        descricao: document.getElementById('product-description').value,
        preco: precoInput,
        cdRestaurante: cdRestauranteLogado,
        nota: 0.0 // O DB pode gerenciar ou atualizar por procedure
    };

    const isEdicao = id !== '';
    const url = isEdicao ? `/api/produtos/${id}` : '/api/produtos';
    const method = isEdicao ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenPainel}`
            },
            body: JSON.stringify(produtoDTO)
        });

        if (response.ok) {
            resetProductForm();
            await carregarProdutos(); // Atualiza a grid
            feedback.textContent = isEdicao ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!";
            feedback.className = "form-feedback success";
        } else {
            const erroMensagem = await response.text();
            feedback.textContent = `Erro do Servidor: ${erroMensagem}`;
            feedback.className = "form-feedback error";
        }
    } catch (error) {
        feedback.textContent = "Erro de conexão com o servidor.";
        feedback.className = "form-feedback error";
    }
}

async function apagarProduto(id) {
    if(!confirm('Tem a certeza que deseja apagar este produto?')) return;

    try {
        const response = await fetch(`/api/produtos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${tokenPainel}` }
        });

        if (response.ok) {
            carregarProdutos();
        } else {
            alert('Erro ao apagar o produto. Talvez ele já esteja num pedido em andamento.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

function bindFormEvents() {
    document.getElementById("product-form").addEventListener("submit", handleFormSubmit);
    document.getElementById("reset-form-btn").addEventListener("click", resetProductForm);
    document.getElementById("cancel-edit-btn").addEventListener("click", resetProductForm);
}
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

async function carregarRestaurantesParceiro() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const decoded = parseJwt(token);
    const role = decoded.role;
    if (role !== 'parceiro') {
        window.location.href = 'index.html';
        return;
    }

    const cpfDoUsuario = decoded.sub;
    const container = document.getElementById('restaurantes-lista');

    try {
        const response = await fetch(`/api/restaurantes/parceiro/${cpfDoUsuario}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const restaurantes = await response.json();
            if (restaurantes.length === 0) {
                container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Você ainda não tem restaurantes cadastrados.</p>';
                return;
            }
            container.innerHTML = '';
            restaurantes.forEach(restaurant => {
                const id = restaurant.cdRestaurante;
                const nomeImagemDoBanco = restaurant.nomeImagem;
                const bgImage = nomeImagemDoBanco ? `/images/rest/${nomeImagemDoBanco}` : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop';
                const nomeSeguro = restaurant.nome || 'Restaurante';
                const sigla = nomeSeguro.substring(0, 2).toUpperCase();

                const notaFormatada = restaurant.nota ? restaurant.nota.toFixed(1) : '5.0';
                const tempoFormatado = restaurant.tempoEntrega ? `${restaurant.tempoEntrega} min` : '30-40 min';

                let freteTexto = restaurant.taxaEntrega > 0 ? `R$ ${restaurant.taxaEntrega.toFixed(2).replace('.', ',')}` : 'Grátis';
                let freteStyle = restaurant.taxaEntrega > 0 ? 'color: var(--text-color); font-weight: 500' : 'color: #1da55a; font-weight: 600';

                const card = document.createElement('div');
                card.className = 'restaurant-card';
                card.style.cursor = 'pointer';
                card.onclick = () => window.location.href = `painel-restaurante.html?cdRestaurante=${id}`;
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
        } else {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Erro ao carregar restaurantes.</p>';
        }
    } catch (error) {
        console.error('Erro:', error);
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Erro ao carregar restaurantes.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarRestaurantesParceiro();
});

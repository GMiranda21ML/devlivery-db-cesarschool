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
    window.location.href = 'login.html';
}

// Variáveis globais para controle de tela
let currentRole = '';
let isEditMode = false;

const maskPhone = (value) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
};

const maskCEP = (value) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
};


// Função principal que roda quando a página carrega
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const decoded = parseJwt(token);
    if (!decoded) {
        logout();
        return;
    }

    const cpf = decoded.sub; 
    currentRole = decoded.role;

    const btnCliente = document.getElementById('btn-cliente');
    const btnEntregador = document.getElementById('btn-entregador');
    const divToggle = document.querySelector('.dev-toggle-view span');
    
    if (divToggle) divToggle.textContent = "Seu Perfil: ";

    if (currentRole === 'cliente') {
        if (btnEntregador) btnEntregador.style.display = 'none';
        if (btnCliente) {
            btnCliente.classList.add('active');
            btnCliente.onclick = null;
            btnCliente.style.cursor = 'default';
        }
    } else if (currentRole === 'entregador') {
        if (btnCliente) btnCliente.style.display = 'none';
        if (btnEntregador) {
            btnEntregador.classList.add('active');
            btnEntregador.onclick = null;
            btnEntregador.style.cursor = 'default';
        }
    }

    try {
        const endpoint = currentRole === 'cliente' ? `/api/clientes/${cpf}` : `/api/entregadores/${cpf}`;
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            renderRealData(data, currentRole);
        } else {
            alert('Sua sessão expirou ou os dados não foram encontrados.');
            logout();
        }
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        alert('Erro de comunicação com o servidor.');
    }

    const inputTelefone = document.getElementById('input-telefone');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    }

    const inputCep = document.getElementById('input-cep');
    if (inputCep) {
        inputCep.addEventListener('input', (e) => {
            e.target.value = maskCEP(e.target.value);
        });
    }
});

function renderRealData(data, role) {
    document.getElementById('display-nome').textContent = data.nome;
    
    const roleBadge = document.getElementById('display-role');
    roleBadge.textContent = role === 'cliente' ? 'Cliente' : 'Entregador';
    roleBadge.style.backgroundColor = role === 'cliente' ? 'rgba(234, 29, 44, 0.1)' : 'rgba(33, 150, 243, 0.1)';
    roleBadge.style.color = role === 'cliente' ? 'var(--primary-color)' : '#2196f3';

    document.getElementById('display-nome-val').textContent = data.nome;

    const cpfFormatado = data.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    document.getElementById('display-cpf').textContent = cpfFormatado;
    
    document.getElementById('display-email').textContent = data.email;
    document.getElementById('display-telefone').textContent = data.telefone || 'Não informado';

    const cardCliente = document.getElementById('card-cliente');
    const cardEntregador = document.getElementById('card-entregador');

    if (role === 'cliente') {
        cardCliente.classList.remove('hidden');
        cardEntregador.classList.add('hidden');

        document.getElementById('display-cep').textContent = data.cep || '-';
        document.getElementById('display-rua').textContent = data.rua || '-';
        document.getElementById('display-numero').textContent = data.numero || '-';
        document.getElementById('display-bairro').textContent = data.bairro || '-';
        document.getElementById('display-cidade').textContent = data.cidade || '-';
        document.getElementById('display-convidado').textContent = data.convidado || "Nenhum";

    } else if (role === 'entregador') {
        cardCliente.classList.add('hidden');
        cardEntregador.classList.remove('hidden');

        document.getElementById('display-veiculo').textContent = data.veiculo || '-';
        document.getElementById('display-placa').textContent = data.placa || 'Sem placa';
        document.getElementById('display-nota').textContent = data.nota ? data.nota.toFixed(1) : '5.0';
    }
}

function toggleEditMode() {
    isEditMode = !isEditMode;

    document.querySelectorAll('.view-data').forEach(el => el.classList.toggle('hidden', isEditMode));
    document.querySelectorAll('.edit-data').forEach(el => el.classList.toggle('hidden', !isEditMode));

    document.getElementById('btn-edit').classList.toggle('hidden', isEditMode);
    document.getElementById('btn-delete').classList.toggle('hidden', isEditMode);
    document.getElementById('btn-save').classList.toggle('hidden', !isEditMode);
    document.getElementById('btn-cancel').classList.toggle('hidden', !isEditMode);

    if (isEditMode) {
        document.getElementById('input-nome').value = document.getElementById('display-nome-val').textContent;

        document.getElementById('input-cpf').value = document.getElementById('display-cpf').textContent;

        document.getElementById('input-email').value = document.getElementById('display-email').textContent;
        document.getElementById('input-telefone').value = document.getElementById('display-telefone').textContent !== 'Não informado' ? document.getElementById('display-telefone').textContent : '';

        if (currentRole === 'cliente') {
            document.getElementById('input-cep').value = document.getElementById('display-cep').textContent;
            document.getElementById('input-rua').value = document.getElementById('display-rua').textContent;
            document.getElementById('input-numero').value = document.getElementById('display-numero').textContent;
            document.getElementById('input-bairro').value = document.getElementById('display-bairro').textContent;
            document.getElementById('input-cidade').value = document.getElementById('display-cidade').textContent;
        } else {
            document.getElementById('input-veiculo').value = document.getElementById('display-veiculo').textContent;
            document.getElementById('input-placa').value = document.getElementById('display-placa').textContent !== 'Sem placa' ? document.getElementById('display-placa').textContent : '';
        }
    }
}

async function saveProfile() {
    const token = localStorage.getItem('token');
    const decoded = parseJwt(token);

    const data = {
        cpf: decoded.sub,
        nome: document.getElementById('input-nome').value,
        email: document.getElementById('input-email').value,
        telefone: document.getElementById('input-telefone').value
    };

    if (currentRole === 'cliente') {
        data.cep = document.getElementById('input-cep').value;
        data.rua = document.getElementById('input-rua').value;
        data.numero = document.getElementById('input-numero').value;
        data.bairro = document.getElementById('input-bairro').value;
        data.cidade = document.getElementById('input-cidade').value;
    } else {
        data.veiculo = document.getElementById('input-veiculo').value;
        data.placa = document.getElementById('input-placa').value;
    }

    const endpoint = currentRole === 'cliente' ? '/api/clientes/atualizar' : '/api/entregadores/atualizar';

    try {
        const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Perfil atualizado com sucesso!");
            location.reload(); // Recarrega para buscar do banco
        } else {
            const msg = await response.text();
            alert("Erro ao atualizar: " + msg);
        }
    } catch (error) {
        console.error("Erro no PATCH:", error);
    }
}

function openDeleteModal() {
    document.getElementById('delete-modal').classList.add('show');
}

function closeModal() {
    document.getElementById('delete-modal').classList.remove('show');
}

async function deleteAccount() {
    const token = localStorage.getItem('token');
    const decoded = parseJwt(token);
    const cpf = decoded.sub;

    const endpoint = currentRole === 'cliente' ? `/api/clientes/${cpf}` : `/api/entregadores/${cpf}`;

    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert("Sua conta foi excluída permanentemente.");
            logout(); // Remove o token e atira pro login
        } else {
            const msg = await response.text();
            alert("Erro ao excluir conta: " + msg);
        }
    } catch (error) {
        console.error("Erro no DELETE:", error);
    }
}
function setRole(role) {
    // 1. Verifica se o input escondido existe antes de tentar mudar o valor
    const roleInput = document.getElementById('role');
    if (roleInput) {
        roleInput.value = role;
    }

    // 2. Atualiza os botões visuais
    const btnCliente = document.getElementById('btn-cliente');
    const btnEntregador = document.getElementById('btn-entregador');

    if (btnCliente && btnEntregador) {
        if (role === 'cliente') {
            btnCliente.classList.add('active');
            btnEntregador.classList.remove('active');
        } else {
            btnEntregador.classList.add('active');
            btnCliente.classList.remove('active');
        }
    }
}

function switchForm(role) {
    setRole(role);
    const clienteFields = document.getElementById('cliente-fields');
    const entregadorFields = document.getElementById('entregador-fields');

    if (clienteFields && entregadorFields) {
        if (role === 'cliente') {
            clienteFields.classList.remove('hidden');
            entregadorFields.classList.add('hidden');
        } else {
            entregadorFields.classList.remove('hidden');
            clienteFields.classList.add('hidden');
        }
    }
}

// --- FUNÇÕES DE MÁSCARA ---
const maskCPF = (value) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

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

document.addEventListener('DOMContentLoaded', () => {
    // --- APLICANDO MÁSCARAS NOS CAMPOS ---
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) cpfInput.addEventListener('input', (e) => e.target.value = maskCPF(e.target.value));

    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) telefoneInput.addEventListener('input', (e) => e.target.value = maskPhone(e.target.value));

    const convidadoInput = document.getElementById('convidado');
    if (convidadoInput) convidadoInput.addEventListener('input', (e) => e.target.value = maskCPF(e.target.value));

    const cepInput = document.getElementById('cep');
    if (cepInput) cepInput.addEventListener('input', (e) => e.target.value = maskCEP(e.target.value));

    // --- LÓGICA DE LOGIN ---
    const loginForm = document.querySelector('.auth-form:not(#cadastro-form)');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const role = document.getElementById('role').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha, role })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    window.location.href = 'index.html';
                } else {
                    alert('Falha no login. Verifique suas credenciais.');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao conectar com o servidor.');
            }
        });
    }

    // --- LÓGICA DE CADASTRO ---
    const cadastroForm = document.getElementById('cadastro-form');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isCliente = !document.getElementById('cliente-fields').classList.contains('hidden');

            const data = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                cpf: document.getElementById('cpf').value,
                telefone: document.getElementById('telefone').value,
                senha: document.getElementById('senha').value
            };

            let endpoint = '';

            if (isCliente) {
                endpoint = '/api/clientes/cadastro';
                data.cep = document.getElementById('cep').value;
                data.rua = document.getElementById('rua').value;
                data.numero = document.getElementById('numero').value;
                data.bairro = document.getElementById('bairro').value;
                data.cidade = document.getElementById('cidade').value;
                data.convidado = document.getElementById('convidado').value;
            } else {
                endpoint = '/api/entregadores/cadastro';
                data.veiculo = document.getElementById('veiculo').value;
                data.placa = document.getElementById('placa').value;
            }

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Cadastro realizado com sucesso!');
                    window.location.href = 'login.html';
                } else {
                    const errorMsg = await response.text();
                    alert('Erro ao cadastrar: ' + errorMsg);
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao conectar com o servidor.');
            }
        });
    }
});
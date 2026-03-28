// Alternar abas no Login
function setRole(role) {
    // Atualiza os botões
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Atualiza o input hidden
    const roleInput = document.getElementById('role');
    if (roleInput) {
        roleInput.value = role;
    }
}

// Alternar formulários no Cadastro
function switchForm(type) {
    // Atualiza os botões
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Mostra/esconde seções específicas
    const clienteFields = document.getElementById('cliente-fields');
    const entregadorFields = document.getElementById('entregador-fields');

    if (type === 'cliente') {
        clienteFields.classList.remove('hidden');
        entregadorFields.classList.add('hidden');
        
        // Remove 'required' dos campos de entregador
        const veiculo = document.getElementById('veiculo');
        if (veiculo) veiculo.required = false;
        
    } else if (type === 'entregador') {
        clienteFields.classList.add('hidden');
        entregadorFields.classList.remove('hidden');
        
        // Adiciona 'required' no campo de veículo
        const veiculo = document.getElementById('veiculo');
        if (veiculo) veiculo.required = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {

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
                cpf: document.getElementById('cpf').value.replace(/\D/g, ''), // Remove pontuação do CPF
                telefone: document.getElementById('telefone').value,
                senha: document.getElementById('senha').value
            };

            let endpoint = '';

            // Adiciona campos específicos
            if (isCliente) {
                endpoint = '/api/clientes/cadastro';
                data.cep = document.getElementById('cep').value;
                data.rua = document.getElementById('rua').value;
                data.numero = document.getElementById('numero').value;
                data.bairro = document.getElementById('bairro').value;
                data.cidade = document.getElementById('cidade').value;
                data.convidado = document.getElementById('convidado').value.replace(/\D/g, '');
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
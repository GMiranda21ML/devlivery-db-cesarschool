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
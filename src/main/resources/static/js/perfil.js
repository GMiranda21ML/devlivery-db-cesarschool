// Mock de dados para simular as respostas do Banco de Dados

let mockCliente = {
    cpf: "111.222.333-44",
    nome: "Alan Turing",
    email: "alan.turing@dev.com",
    telefone: "(81) 98765-4321",
    cep: "50000-000",
    rua: "Avenida Cais do Apolo",
    numero: "77",
    bairro: "Bairro do Recife",
    cidade: "Recife",
    convidado: "Nenhum" // ou o CPF de quem convidou
};

let mockEntregador = {
    cpf: "999.888.777-66",
    nome: "Ada Lovelace",
    email: "ada.speed@delivery.com",
    telefone: "(81) 91234-5678",
    veiculo: "Moto",
    placa: "DEV-2024",
    nota: 4.9
};

let currentRole = 'cliente';
let isEditMode = false;

// Função para renderizar os dados na tela (Modo Visualização)
function renderData() {
    const data = currentRole === 'cliente' ? mockCliente : mockEntregador;

    // Atualiza nome e badge da sidebar
    document.getElementById('display-nome').textContent = data.nome;
    
    const roleBadge = document.getElementById('display-role');
    roleBadge.textContent = currentRole === 'cliente' ? 'Cliente' : 'Entregador';
    roleBadge.style.backgroundColor = currentRole === 'cliente' ? 'rgba(234, 29, 44, 0.1)' : 'rgba(33, 150, 243, 0.1)';
    roleBadge.style.color = currentRole === 'cliente' ? 'var(--primary-color)' : '#2196f3';

    // Dados Gerais (Spans)
    document.getElementById('display-nome-val').textContent = data.nome;
    document.getElementById('display-cpf').textContent = data.cpf;
    document.getElementById('display-email').textContent = data.email;
    document.getElementById('display-telefone').textContent = data.telefone;

    // Mostra/esconde cards específicos e preenche os dados
    const cardCliente = document.getElementById('card-cliente');
    const cardEntregador = document.getElementById('card-entregador');

    if (currentRole === 'cliente') {
        cardCliente.classList.remove('hidden');
        cardEntregador.classList.add('hidden');

        document.getElementById('display-cep').textContent = data.cep;
        document.getElementById('display-rua').textContent = data.rua;
        document.getElementById('display-numero').textContent = data.numero;
        document.getElementById('display-bairro').textContent = data.bairro;
        document.getElementById('display-cidade').textContent = data.cidade;
        document.getElementById('display-convidado').textContent = data.convidado || "Nenhum";

    } else if (currentRole === 'entregador') {
        cardCliente.classList.add('hidden');
        cardEntregador.classList.remove('hidden');

        document.getElementById('display-veiculo').textContent = data.veiculo;
        document.getElementById('display-placa').textContent = data.placa;
        document.getElementById('display-nota').textContent = data.nota.toFixed(1);
    }
}

// Alternar entre modo de Visualização e Edição
function toggleEditMode() {
    isEditMode = !isEditMode;

    // Alternar botões da sidebar
    document.getElementById('btn-edit').classList.toggle('hidden', isEditMode);
    document.getElementById('btn-delete').classList.toggle('hidden', isEditMode);
    document.getElementById('btn-save').classList.toggle('hidden', !isEditMode);
    document.getElementById('btn-cancel').classList.toggle('hidden', !isEditMode);

    // Alternar visibilidade de Spans (view) e Inputs (edit)
    document.querySelectorAll('.view-data').forEach(el => el.classList.toggle('hidden', isEditMode));
    document.querySelectorAll('.edit-data').forEach(el => el.classList.toggle('hidden', !isEditMode));

    // Se entrou em modo de edição, preencher os inputs com os dados atuais
    if (isEditMode) {
        const data = currentRole === 'cliente' ? mockCliente : mockEntregador;
        
        document.getElementById('input-nome').value = data.nome;
        document.getElementById('input-cpf').value = data.cpf;
        document.getElementById('input-email').value = data.email;
        document.getElementById('input-telefone').value = data.telefone;

        if (currentRole === 'cliente') {
            document.getElementById('input-cep').value = data.cep;
            document.getElementById('input-rua').value = data.rua;
            document.getElementById('input-numero').value = data.numero;
            document.getElementById('input-bairro').value = data.bairro;
            document.getElementById('input-cidade').value = data.cidade;
        } else {
            // Select de veículo
            const veiculoSelect = document.getElementById('input-veiculo');
            for(let i=0; i < veiculoSelect.options.length; i++) {
                if(veiculoSelect.options[i].value === data.veiculo) {
                    veiculoSelect.selectedIndex = i;
                    break;
                }
            }
            document.getElementById('input-placa').value = data.placa;
        }
    }
}

// Salvar as alterações feitas nos inputs
function saveProfile() {
    const data = currentRole === 'cliente' ? mockCliente : mockEntregador;

    // Atualizar objeto mock com os valores dos inputs
    data.nome = document.getElementById('input-nome').value;
    data.cpf = document.getElementById('input-cpf').value;
    data.email = document.getElementById('input-email').value;
    data.telefone = document.getElementById('input-telefone').value;

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

    // Voltar para o modo de visualização e renderizar os novos dados
    toggleEditMode();
    renderData();
    
    // Alerta simulando sucesso do banco
    alert("Dados atualizados com sucesso!");
}

// Modal de Deleção de Conta
function openDeleteModal() {
    document.getElementById('delete-modal').classList.add('show');
}

function closeModal() {
    document.getElementById('delete-modal').classList.remove('show');
}

function deleteAccount() {
    // Simulação de deleção
    closeModal();
    alert("Sua conta foi deletada permanentemente.");
    window.location.href = 'index.html'; // Redireciona para a home
}

// Função para o Toggle de desenvolvimento (Simular Cliente/Entregador)
function loadProfile(role) {
    if (isEditMode) {
        toggleEditMode(); // Cancela edição se trocar de view
    }

    currentRole = role;

    // Atualiza botões do toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${role}`).classList.add('active');

    renderData();
}

// Inicializa a página carregando o perfil de cliente por padrão
document.addEventListener('DOMContentLoaded', () => {
    loadProfile('cliente');
});
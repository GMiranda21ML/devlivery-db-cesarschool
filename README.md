# 🍔 DevLivery

Uma **Aplicação Web** desenvolvida para o gerenciamento de um sistema de delivery, conectando clientes e entregadores. 

O projeto integra uma API no backend com uma interface interativa no frontend, tendo como objetivo, mostrar as diversas interações com o banco de dados.

## ⚙️ Configuração e Execução

### 1. Pré-requisitos
Antes de rodar a aplicação, certifique-se de ter instalado na sua máquina:
* **Java Development Kit (JDK)** 
* **MySQL** rodando localmente.

### 2. Configuração das Variáveis de Ambiente
A aplicação utiliza variáveis de ambiente para gerenciar as credenciais do banco de dados e a segurança. 

Crie um arquivo chamado `.env` na raiz do projeto e preencha com as suas informações locais, seguindo o modelo abaixo:

```env
# Configurações do Banco de Dados (MySQL)
DB_URL=jdbc:mysql://localhost:{trocar pela porta}/DEVLIVERY?createDatabaseIfNotExist=true&serverTimezone=UTC
DB_USERNAME={seu-usuario-mysql}
SENHA_DEVLIVERY={sua-senha-mysql}

# Configuração de Autenticação
SENHA_JWT={sua-chave-secreta-jwt}

```
### 3. Rodar a aplicação
Depois de realizar as mudanças corretamente no arquivo .env, você deve rodar o arquivo DevLiveryApplication.java
que possui o caminho devlivery-db-cesarschool/src/main/java/DevLiveryApplication.java.

Agora basta rodar localmente o site:

<img width="1903" height="979" alt="image" src="https://github.com/user-attachments/assets/d2909cc8-6217-4596-8a32-6af94b4e81bc" />

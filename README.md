# 🍔 DevLivery

Uma **Aplicação Web** desenvolvida para o gerenciamento de um sistema de delivery, conectando clientes e entregadores. 

O projeto integra uma API no backend com uma interface interativa no frontend, tendo como objetivo, mostrar as diversas interações com o banco de dados.

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

**Backend:**
* **Java & Spring Boot** (Web, Data JPA, Security)
* **MySQL** (Banco de Dados Relacional)
* **Flyway** (Migrations para versionamento do banco)
* **JWT (JSON Web Token)** (Autenticação e segurança)
* **Swagger / OpenAPI** (Documentação dos endpoints)
* **Maven** (Gerenciamento de dependências)

**Frontend:**
* **HTML5, CSS3 e JavaScript** (Interfaces dinâmicas e responsivas)
* **Integração assíncrona** (Consumo da API via Fetch/AJAX)

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
Depois de realizar as mudanças corretamente no arquivo .env, agora basta rodar o arquivo DevLiveryApplication.java
que possui o caminho devlivery-db-cesarschool/src/main/java/DevLiveryApplication.java.

Depois disso basta rodar localmente o site:

<img width="1903" height="979" alt="image" src="https://github.com/user-attachments/assets/d2909cc8-6217-4596-8a32-6af94b4e81bc" />

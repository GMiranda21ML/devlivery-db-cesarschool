# 🍔 DevLivery

O **DevLivery** é uma aplicação web para gerenciamento de um sistema de delivery, conectando clientes, restaurantes, parceiros e entregadores. O projeto integra um backend em **Spring Boot**, uma interface web servida pelo próprio backend e um **dashboard estatístico em Streamlit**, todos conectados ao banco de dados **MySQL**.

O objetivo do sistema é demonstrar, na prática, operações completas de banco de dados em uma aplicação real, incluindo CRUD, autenticação, relatórios, procedures, functions, views, índices e triggers.

---

## 🔗 Links locais da aplicação

Depois de subir o projeto, acesse:

| Serviço | Link |
|---|---|
| Aplicação principal | `http://localhost:8080` |
| Dashboard estatístico | `http://localhost:8501` |
| Swagger / documentação da API | `http://localhost:8080/swagger-ui/index.html` |

---

## 📌 O que a aplicação entrega

### Aplicação principal

- Cadastro e login de usuários.
- Cadastro de clientes, entregadores, parceiros e restaurantes.
- Listagem de restaurantes e produtos.
- Fluxo de carrinho, checkout e criação de pedidos.
- Painel do restaurante para acompanhar pedidos e faturamento.
- Painel do entregador para visualizar pedidos disponíveis e confirmar entregas.
- Área de perfil e acompanhamento de pedidos do cliente.
- Tela de avaliação de pedido/entregador.
- Tela para visualizar logs de pedidos gerados por trigger.
- Relatórios baseados em consultas SQL, functions, procedures, views e índices.

### Dashboard estatístico

O dashboard fica na pasta `dashboard` e é uma aplicação separada feita com **Python + Streamlit**.

Ele apresenta:

- Indicadores resumidos integrados ao banco.
- Filtros por período, cidade, restaurante, categoria, status e tipo de pagamento.
- Gráficos dinâmicos com Plotly.
- Estatísticas como média, mediana, moda, variância e desvio padrão.
- Visual interativo inspirado em aplicações de delivery.

---

## 🧱 Tecnologias utilizadas

- **Java 21**
- **Spring Boot**
- **Spring Security**
- **JWT**
- **JDBC**
- **Flyway**
- **MySQL**
- **HTML, CSS e JavaScript**
- **Python**
- **Streamlit**
- **Pandas**
- **Plotly**
- **SQLAlchemy**

---

## 📂 Estrutura principal do projeto

```text
devlivery-db-cesarschool/
├── src/
│   └── main/
│       ├── java/br/com/dev_livery/
│       │   ├── controller/
│       │   ├── dao/
│       │   ├── dto/
│       │   ├── security/
│       │   └── DevLiveryApplication.java
│       └── resources/
│           ├── db/migration/
│           ├── static/
│           └── application.properties
├── dashboard/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── start.sh
├── start.bat
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

---

## ⚙️ Pré-requisitos

Antes de executar o projeto, instale:

- **Java JDK 21** ou superior.
- **MySQL** rodando localmente.
- **Python 3.10+** para o dashboard.
- **pip** para instalar as dependências Python.
- Git Bash, WSL ou terminal compatível com Bash, caso esteja no Windows e queira usar `start.sh`.

---

## 🔐 Configuração das variáveis de ambiente

Na raiz do projeto, crie um arquivo chamado `.env` com as credenciais do banco e a chave JWT:

```env
DB_URL=jdbc:mysql://localhost:3306/DEVLIVERY?createDatabaseIfNotExist=true&serverTimezone=UTC
DB_USERNAME=root
SENHA_DEVLIVERY=sua_senha_mysql
SENHA_JWT=sua_chave_secreta_jwt
```

A aplicação Spring Boot lê esse arquivo para configurar a conexão com o MySQL.

O dashboard também pode usar as mesmas variáveis. Dentro da pasta `dashboard`, existe um arquivo `.env.example` que pode ser usado como referência.

---

## ▶️ Como executar o projeto completo

Existem duas formas de rodar o projeto:

1. Rodar tudo automaticamente usando os scripts `start.sh` ou `start.bat`.
2. Rodar o backend e o dashboard separadamente em dois terminais diferentes.

---

## Opção 1 — Rodar tudo com o script de inicialização

Essa é a forma mais simples. O script sobe os dois serviços:

- Backend Spring Boot em `http://localhost:8080`.
- Dashboard Streamlit em `http://localhost:8501`.

### Linux / macOS

Na pasta raiz do projeto, execute:

```bash
./start.sh
```

Caso o terminal informe erro de permissão, rode antes:

```bash
chmod +x start.sh
./start.sh
```

### Windows
### Antes de mais nada, faça esses comandos na pasta do dashboar para funcionar:

Entre na pasta `dashboard` e crie o ambiente virtual antes:

```bat
cd dashboard
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Na pasta raiz do projeto, execute:

```bat
.\start.bat
```
O script abrirá janelas separadas para o backend e para o dashboard.

---

## Opção 2 — Rodar as aplicações separadamente

Use esta opção caso queira acompanhar os logs de cada aplicação manualmente ou caso algum script não funcione no seu sistema operacional.

### Terminal 1 — Backend Spring Boot

Entre na pasta raiz do projeto e execute:

#### Linux / macOS

```bash
./mvnw spring-boot:run
```

#### Windows

```bat
.\mvnw.cmd spring-boot:run
```

Quando o backend iniciar, acesse:

```text
http://localhost:8080
```

---

### Terminal 2 — Dashboard Streamlit

Entre na pasta do dashboard:

```bash
cd dashboard
```

Crie e ative um ambiente virtual Python.

#### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

#### Windows

```bat
python -m venv .venv
.venv\Scripts\activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Rode o dashboard:

```bash
streamlit run app.py
```

Depois acesse:

```text
http://localhost:8501
```

---

## 🗄️ Banco de dados

O banco utilizado é o **MySQL**. As tabelas, dados iniciais e objetos de banco são criados automaticamente pelo **Flyway** ao iniciar o backend.

As migrations ficam em:

```text
src/main/resources/db/migration/
```

Arquivos principais:

- `V1__create_tables.sql` — criação das tabelas.
- `V2__insert_initial_data.sql` — carga inicial de dados.
- `V3__create_functions.sql` — criação de functions.
- `V4__create_procedures.sql` — criação de procedures.
- `V5__create_triggers.sql` — criação de triggers.
- `V6__create_view_index.sql` — criação de views e índices.

---

## 🧪 Recursos de banco demonstrados

O projeto demonstra os seguintes recursos de banco de dados:

- Criação de tabelas relacionais.
- Chaves primárias e estrangeiras.
- Inserts de dados iniciais.
- Consultas com joins.
- Functions.
- Stored procedures.
- Triggers.
- Views.
- Índices.
- Relatórios SQL integrados ao backend.

### Triggers visíveis na interface

O sistema possui integração visual com triggers, permitindo observar seus efeitos pelo frontend:

- `trg_log_novo_pedido`: ao criar um pedido, o banco registra automaticamente um log na tabela `LOG_PEDIDOS`. Os registros podem ser visualizados na tela de logs de pedidos.
- `trg_atualizar_nota_entregador`: ao inserir uma avaliação na tabela `AVALIA`, o banco recalcula automaticamente a nota do entregador.

---

## 📊 Dashboard

O dashboard usa as tabelas do banco para gerar análises estatísticas e visuais.

Tabelas utilizadas:

- `PEDIDO`
- `RESTAURANTE`
- `CLIENTE`
- `ENTREGADOR`
- `PRODUTO`
- `CONTEM`
- `PAGAMENTO`
- `AVALIA`
- `PERTENCE`
- `CATEGORIA`

Link local do dashboard:

```text
http://localhost:8501
```

Para executar apenas o dashboard:

```bash
cd dashboard
streamlit run app.py
```

---

## 📡 Principais endpoints da API

Alguns endpoints disponíveis:

| Recurso | Endpoint |
|---|---|
| Login | `POST /api/auth/login` |
| Cadastro de cliente | `POST /api/clientes/cadastro` |
| Cadastro de entregador | `POST /api/entregadores/cadastro` |
| Cadastro de parceiro | `POST /api/parceiros/cadastro` |
| Cadastro de restaurante | `POST /api/restaurantes/cadastro` |
| Listar restaurantes | `GET /api/restaurantes` |
| Produtos por restaurante | `GET /api/produtos/restaurante/{cdRestaurante}` |
| Criar pedido | `POST /api/pedidos` |
| Pedidos do cliente | `GET /api/pedidos/cliente/{cpf}` |
| Pedidos disponíveis para entrega | `GET /api/pedidos/disponiveis-entrega` |
| Confirmar entrega | `PUT /api/pedidos/{cdPedido}/confirmar-entrega` |
| Criar avaliação | `POST /api/avaliacoes` |
| Logs de pedidos | `GET /api/logs/pedidos` |
| Relatórios | `GET /api/relatorios/...` |

A documentação completa pode ser acessada pelo Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

---

## 🧭 Fluxo recomendado de uso

1. Configure o `.env` na raiz do projeto.
2. Inicie o MySQL.
3. Rode o projeto com `./start.sh` ou `.\start.bat`.
4. Acesse a aplicação principal em `http://localhost:8080`.
5. Cadastre ou faça login com um usuário.
6. Crie restaurantes, produtos e pedidos.
7. Acompanhe os pedidos nos painéis.
8. Acesse o dashboard em `http://localhost:8501` para visualizar os indicadores.
9. Use a tela de logs para verificar os efeitos da trigger de pedidos.
10. Use a tela de avaliação para disparar a atualização automática da nota do entregador.

---

## 🧯 Possíveis problemas

### O backend não conecta ao banco

Verifique:

- Se o MySQL está rodando.
- Se o usuário e senha do `.env` estão corretos.
- Se a porta do MySQL está correta, normalmente `3306`.
- Se o banco informado na URL é `DEVLIVERY`.

### O dashboard não abre

Verifique:

- Se você instalou as dependências com `pip install -r requirements.txt`.
- Se o ambiente virtual está ativado.
- Se o comando `streamlit` está disponível.
- Se o backend e o banco estão rodando.

### O script `start.sh` não executa

Dê permissão de execução:

```bash
chmod +x start.sh
./start.sh
```

### O `start.bat` não encontra o ambiente virtual

Entre na pasta `dashboard` e crie o ambiente virtual antes:

```bat
cd dashboard
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Depois volte para a raiz e rode:

```bat
cd ..
.\start.bat
```

---


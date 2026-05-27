# Dashboard DevLivery

Dashboard estatistico em Python com Streamlit, conectado ao MySQL e com identidade visual em branco e vermelho.

## O que o dashboard entrega

- indicadores resumidos integrados ao banco
- filtros por periodo, cidade, restaurante, categoria, status e tipo de pagamento
- mais de 5 graficos dinamicos com Plotly
- estatisticas como media, mediana, moda, variancia e desvio padrao
- visual interativo inspirado no iFood

## Tabelas usadas

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

## Como executar

1. Entre na pasta `dashboard`
2. Crie um ambiente virtual Python
3. Instale as dependencias
4. Configure a conexao com o MySQL
5. Rode o Streamlit

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
streamlit run app.py
```

## Configuracao do banco

Voce pode usar as variaveis abaixo no `.env`:

```env
DB_URL=jdbc:mysql://localhost:3306/devlivery
DB_USERNAME=root
SENHA_DEVLIVERY=sua_senha_aqui
```

Ou preencher direto na barra lateral do app:

- host
- porta
- banco
- usuario
- senha

## Observacoes

- o app tenta ler primeiro as configuracoes carregadas do ambiente
- se nao conseguir conectar, ele mostra a mensagem de erro na tela
- os dados sao recarregados pelo botao `Atualizar dados`

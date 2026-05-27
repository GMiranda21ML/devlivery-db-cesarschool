import os
from datetime import date, timedelta
from typing import Any
from urllib.parse import quote_plus, urlparse

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine


load_dotenv()

IFOOD_RED = "#ea1d2c"
IFOOD_RED_DARK = "#b1111d"
IFOOD_BG = "#fff5f5"
CARD_BG = "#ffffff"
TEXT_DARK = "#2b2b2b"
TEXT_MUTED = "#6b7280"
GRID = "#f3d4d7"


st.set_page_config(
    page_title="Dashboard DevLivery",
    page_icon=":bar_chart:",
    layout="wide",
)


def inject_styles() -> None:
    st.markdown(
        f"""
        <style>
            :root {{
                --ifood-red: {IFOOD_RED};
                --ifood-red-dark: {IFOOD_RED_DARK};
                --ifood-border: #f3d7db;
                --ifood-surface: {CARD_BG};
                --ifood-muted: {TEXT_MUTED};
                --ifood-shadow: 0 16px 40px rgba(17, 24, 39, 0.06);
            }}
            .stApp {{
                background: linear-gradient(180deg, #ffffff 0%, {IFOOD_BG} 100%);
                color: {TEXT_DARK};
            }}
            .block-container {{
                max-width: 1420px;
                padding-top: 2.4rem;
                padding-bottom: 2.5rem;
            }}
            [data-testid="stSidebar"],
            [data-testid="collapsedControl"] {{
                display: none !important;
            }}
            .hero {{
                background: linear-gradient(135deg, {IFOOD_RED} 0%, {IFOOD_RED_DARK} 100%);
                border-radius: 28px;
                padding: 30px 34px;
                color: white;
                margin-top: 0.75rem;
                margin-bottom: 1.2rem;
                box-shadow: 0 20px 48px rgba(234, 29, 44, 0.22);
            }}
            .hero h1 {{
                margin: 0;
                font-size: 2.2rem;
                letter-spacing: -0.02em;
            }}
            .hero p {{
                margin: 0.55rem 0 0 0;
                color: rgba(255,255,255,0.92);
                font-size: 1rem;
            }}
            .hero-meta {{
                display: flex;
                flex-wrap: wrap;
                gap: 0.6rem;
                margin-top: 1rem;
            }}
            .hero-badge {{
                display: inline-flex;
                align-items: center;
                gap: 0.35rem;
                padding: 0.45rem 0.8rem;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.14);
                border: 1px solid rgba(255, 255, 255, 0.18);
                font-size: 0.88rem;
            }}
            .section-title {{
                font-weight: 700;
                color: {IFOOD_RED_DARK};
                margin: 1.35rem 0 0.3rem 0;
                font-size: 1.12rem;
            }}
            .section-subtitle {{
                color: {TEXT_MUTED};
                margin-bottom: 0.85rem;
                font-size: 0.94rem;
            }}
            .panel {{
                background: rgba(255,255,255,0.86);
                border: 1px solid var(--ifood-border);
                border-radius: 24px;
                padding: 1rem 1rem 0.4rem 1rem;
                box-shadow: var(--ifood-shadow);
                margin-bottom: 1rem;
                backdrop-filter: blur(8px);
            }}
            .filter-feedback {{
                background: linear-gradient(180deg, #fffafa 0%, #fff1f2 100%);
                border: 1px solid var(--ifood-border);
                border-radius: 18px;
                padding: 0.85rem 1rem;
                margin: 0.5rem 0 0.75rem 0;
                color: {TEXT_DARK};
                font-size: 0.94rem;
            }}
            .filter-hint {{
                color: {TEXT_MUTED};
                font-size: 0.82rem;
                margin: -0.2rem 0 0.55rem 0.1rem;
            }}
            .stat-box {{
                background: {CARD_BG};
                border: 1px solid var(--ifood-border);
                border-radius: 22px;
                padding: 18px 18px;
                height: 100%;
                box-shadow: var(--ifood-shadow);
            }}
            .stat-box .label {{
                color: {TEXT_MUTED};
                font-size: 0.88rem;
            }}
            .stat-box .value {{
                color: {IFOOD_RED};
                font-size: 1.5rem;
                font-weight: 700;
                margin-top: 0.3rem;
            }}
            .stat-box .caption {{
                color: {TEXT_MUTED};
                font-size: 0.83rem;
                margin-top: 0.5rem;
            }}
            .kpi-card {{
                background: linear-gradient(180deg, #ffffff 0%, #fff8f8 100%);
                border: 1px solid var(--ifood-border);
                border-radius: 24px;
                padding: 18px 18px 16px 18px;
                min-height: 132px;
                box-shadow: var(--ifood-shadow);
                position: relative;
                overflow: hidden;
            }}
            .kpi-card::after {{
                content: "";
                position: absolute;
                inset: auto -20px -20px auto;
                width: 92px;
                height: 92px;
                border-radius: 50%;
                background: rgba(234, 29, 44, 0.06);
            }}
            .kpi-label {{
                color: {TEXT_MUTED};
                font-size: 0.88rem;
                margin-bottom: 0.55rem;
            }}
            .kpi-value {{
                color: {TEXT_DARK};
                font-size: 1.7rem;
                font-weight: 800;
                line-height: 1.1;
                letter-spacing: -0.02em;
            }}
            .kpi-caption {{
                margin-top: 0.7rem;
                color: {TEXT_MUTED};
                font-size: 0.84rem;
            }}
            .kpi-accent {{
                display: inline-block;
                width: 42px;
                height: 4px;
                border-radius: 999px;
                background: {IFOOD_RED};
                margin-bottom: 0.85rem;
            }}
            [data-testid="stPlotlyChart"] {{
                background: rgba(255,255,255,0.95);
                border: 1px solid var(--ifood-border);
                border-radius: 24px;
                padding: 0.6rem;
                box-shadow: var(--ifood-shadow);
                margin-bottom: 0.85rem;
            }}
            div[data-testid="stDataFrame"] {{
                background: white;
                border-radius: 22px;
                border: 1px solid var(--ifood-border);
                padding: 0.45rem;
                box-shadow: var(--ifood-shadow);
            }}
            .stMultiSelect > label,
            .stDateInput > label,
            .stSelectbox > label {{
                font-weight: 600;
                color: {TEXT_DARK};
            }}
            [data-baseweb="input"] > div,
            [data-baseweb="select"] > div {{
                border-radius: 16px !important;
                border-color: #efc9cf !important;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
            }}
            [data-baseweb="input"] > div:focus-within,
            [data-baseweb="select"] > div:focus-within {{
                border-color: {IFOOD_RED} !important;
                box-shadow: 0 0 0 3px rgba(234, 29, 44, 0.12);
            }}
            .stDateInput input {{
                cursor: pointer;
            }}
            .stAlert {{
                border-radius: 18px;
            }}
            @media (max-width: 900px) {{
                .hero {{
                    padding: 24px 22px;
                    margin-top: 1rem;
                }}
                .hero h1 {{
                    font-size: 1.8rem;
                }}
                .block-container {{
                    padding-left: 1rem;
                    padding-right: 1rem;
                }}
            }}
        </style>
        """,
        unsafe_allow_html=True,
    )


def get_env_defaults() -> dict[str, Any]:
    jdbc_url = os.getenv("DB_URL", "").strip()
    user = os.getenv("DB_USERNAME", os.getenv("MYSQL_USER", "root")).strip()
    password = os.getenv("SENHA_DEVLIVERY", os.getenv("MYSQL_PASSWORD", "")).strip()
    host = os.getenv("MYSQL_HOST", "localhost").strip()
    port = int(os.getenv("MYSQL_PORT", "3306"))
    database = os.getenv("MYSQL_DATABASE", "devlivery").strip()

    if jdbc_url.startswith("jdbc:mysql://"):
        parsed = urlparse(jdbc_url.replace("jdbc:", "", 1))
        host = parsed.hostname or host
        port = parsed.port or port
        database = parsed.path.lstrip("/") or database

    return {
        "host": host,
        "port": port,
        "database": database,
        "user": user,
        "password": password,
    }


def build_connection_uri(config: dict[str, Any]) -> str:
    user = quote_plus(str(config["user"]))
    password = quote_plus(str(config["password"]))
    host = config["host"]
    port = config["port"]
    database = config["database"]
    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}?charset=utf8mb4"


@st.cache_resource(show_spinner=False)
def get_engine(connection_uri: str) -> Engine:
    return create_engine(connection_uri, pool_pre_ping=True)


@st.cache_data(ttl=300, show_spinner=False)
def load_data(connection_uri: str) -> dict[str, pd.DataFrame]:
    engine = get_engine(connection_uri)

    category_subquery = """
        SELECT
            pe.CD_RESTAURANTE,
            MIN(c.NOME) AS CATEGORIA
        FROM PERTENCE pe
        JOIN CATEGORIA c ON c.CD_CATEGORIA = pe.CD_CATEGORIA
        GROUP BY pe.CD_RESTAURANTE
    """

    orders_sql = f"""
        SELECT
            p.CD_PEDIDO,
            p.DATA,
            p.STATUS,
            p.VALOR_TOTAL,
            p.CPF_CLIENTE,
            p.CPF_ENTREGADOR,
            p.CD_CUPOM,
            r.CD_RESTAURANTE,
            r.NOME AS RESTAURANTE,
            r.CIDADE AS CIDADE_RESTAURANTE,
            r.NOTA AS NOTA_RESTAURANTE,
            r.TAXA_ENTREGA,
            r.TEMPO_ENTREGA,
            COALESCE(cat.CATEGORIA, 'Sem Categoria') AS CATEGORIA,
            pg.TIPO AS TIPO_PAGAMENTO,
            pg.SUBTIPO_CARTAO,
            pg.DATA_HORA AS DATA_PAGAMENTO
        FROM PEDIDO p
        JOIN RESTAURANTE r ON r.CD_RESTAURANTE = p.CD_RESTAURANTE
        LEFT JOIN ({category_subquery}) cat ON cat.CD_RESTAURANTE = r.CD_RESTAURANTE
        LEFT JOIN PAGAMENTO pg ON pg.CD_PEDIDO = p.CD_PEDIDO
    """

    items_sql = f"""
        SELECT
            ct.CD_PEDIDO,
            ct.CD_PRODUTO,
            ct.QUANTIDADE,
            pr.NOME AS PRODUTO,
            pr.PRECO,
            pr.NOTA AS NOTA_PRODUTO,
            r.NOME AS RESTAURANTE,
            r.CIDADE AS CIDADE_RESTAURANTE,
            COALESCE(cat.CATEGORIA, 'Sem Categoria') AS CATEGORIA
        FROM CONTEM ct
        JOIN PRODUTO pr ON pr.CD_PRODUTO = ct.CD_PRODUTO
        JOIN PEDIDO p ON p.CD_PEDIDO = ct.CD_PEDIDO
        JOIN RESTAURANTE r ON r.CD_RESTAURANTE = p.CD_RESTAURANTE
        LEFT JOIN ({category_subquery}) cat ON cat.CD_RESTAURANTE = r.CD_RESTAURANTE
    """

    reviews_sql = f"""
        SELECT
            a.CD_AVALIACAO,
            a.CD_PEDIDO,
            a.CD_PRODUTO,
            a.NOTA AS NOTA_AVALIACAO,
            a.DATA AS DATA_AVALIACAO,
            pr.NOME AS PRODUTO,
            r.NOME AS RESTAURANTE,
            r.CIDADE AS CIDADE_RESTAURANTE,
            COALESCE(cat.CATEGORIA, 'Sem Categoria') AS CATEGORIA
        FROM AVALIA a
        JOIN PRODUTO pr ON pr.CD_PRODUTO = a.CD_PRODUTO
        JOIN PEDIDO p ON p.CD_PEDIDO = a.CD_PEDIDO
        JOIN RESTAURANTE r ON r.CD_RESTAURANTE = p.CD_RESTAURANTE
        LEFT JOIN ({category_subquery}) cat ON cat.CD_RESTAURANTE = r.CD_RESTAURANTE
    """

    totals_sql = """
        SELECT
            (SELECT COUNT(*) FROM CLIENTE) AS TOTAL_CLIENTES,
            (SELECT COUNT(*) FROM RESTAURANTE) AS TOTAL_RESTAURANTES,
            (SELECT COUNT(*) FROM ENTREGADOR) AS TOTAL_ENTREGADORES,
            (SELECT COUNT(*) FROM PRODUTO) AS TOTAL_PRODUTOS,
            (SELECT COUNT(*) FROM PEDIDO) AS TOTAL_PEDIDOS
    """

    couriers_sql = """
        SELECT
            CPF,
            NOTA,
            VEICULO,
            PLACA
        FROM ENTREGADOR
    """

    with engine.connect() as connection:
        orders = pd.read_sql(text(orders_sql), connection)
        items = pd.read_sql(text(items_sql), connection)
        reviews = pd.read_sql(text(reviews_sql), connection)
        totals = pd.read_sql(text(totals_sql), connection)
        couriers = pd.read_sql(text(couriers_sql), connection)

    orders["DATA"] = pd.to_datetime(orders["DATA"])
    if "DATA_PAGAMENTO" in orders:
        orders["DATA_PAGAMENTO"] = pd.to_datetime(orders["DATA_PAGAMENTO"], errors="coerce")
    reviews["DATA_AVALIACAO"] = pd.to_datetime(reviews["DATA_AVALIACAO"], errors="coerce")

    return {
        "orders": orders,
        "items": items,
        "reviews": reviews,
        "totals": totals,
        "couriers": couriers,
    }


def format_currency(value: float) -> str:
    return f"R$ {value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def format_number(value: float) -> str:
    return f"{value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def series_mode(series: pd.Series) -> float:
    valid = series.dropna()
    if valid.empty:
        return 0.0
    mode_values = valid.mode()
    return float(mode_values.iloc[0]) if not mode_values.empty else float(valid.iloc[0])


def safe_variance(series: pd.Series) -> float:
    valid = series.dropna()
    return float(valid.var()) if len(valid) > 1 else 0.0


def safe_std(series: pd.Series) -> float:
    valid = series.dropna()
    return float(valid.std()) if len(valid) > 1 else 0.0


def compute_growth(daily_series: pd.Series) -> float:
    if len(daily_series) < 2:
        return 0.0
    midpoint = len(daily_series) // 2
    first_half = daily_series.iloc[:midpoint].sum()
    second_half = daily_series.iloc[midpoint:].sum()
    if first_half == 0:
        return 100.0 if second_half > 0 else 0.0
    return ((second_half - first_half) / first_half) * 100


def filter_data(
    datasets: dict[str, pd.DataFrame],
    start_date: date,
    end_date: date,
    cities: list[str],
    restaurants: list[str],
    categories: list[str],
    statuses: list[str],
    payment_types: list[str],
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    orders = datasets["orders"].copy()

    orders = orders[
        (orders["DATA"].dt.date >= start_date)
        & (orders["DATA"].dt.date <= end_date)
    ]

    if cities:
        orders = orders[orders["CIDADE_RESTAURANTE"].isin(cities)]
    if restaurants:
        orders = orders[orders["RESTAURANTE"].isin(restaurants)]
    if categories:
        orders = orders[orders["CATEGORIA"].isin(categories)]
    if statuses:
        orders = orders[orders["STATUS"].isin(statuses)]
    if payment_types:
        orders = orders[orders["TIPO_PAGAMENTO"].fillna("Sem pagamento").isin(payment_types)]

    items = datasets["items"].merge(
        orders[["CD_PEDIDO", "STATUS", "DATA"]],
        on="CD_PEDIDO",
        how="inner",
    )

    reviews = datasets["reviews"].merge(
        orders[["CD_PEDIDO", "STATUS", "DATA"]],
        on="CD_PEDIDO",
        how="inner",
    )

    return orders, items, reviews


def make_figure_layout(fig: go.Figure) -> go.Figure:
    fig.update_layout(
        paper_bgcolor=CARD_BG,
        plot_bgcolor=CARD_BG,
        font_color=TEXT_DARK,
        title_font_color=IFOOD_RED_DARK,
        legend_title_text="",
        margin=dict(l=20, r=20, t=50, b=20),
    )
    fig.update_xaxes(
        showgrid=True,
        gridcolor=GRID,
        zeroline=False,
        tickfont=dict(color=IFOOD_RED_DARK, size=12),
        title_font=dict(color=IFOOD_RED_DARK, size=13),
    )
    fig.update_yaxes(
        showgrid=True,
        gridcolor=GRID,
        zeroline=False,
        tickfont=dict(color=IFOOD_RED_DARK, size=12),
        title_font=dict(color=IFOOD_RED_DARK, size=13),
    )
    return fig


def render_stat_box(label: str, value: str, caption: str = "") -> None:
    st.markdown(
        f"""
        <div class="stat-box">
            <div class="label">{label}</div>
            <div class="value">{value}</div>
            <div class="caption">{caption}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_kpi_card(label: str, value: str, caption: str) -> None:
    st.markdown(
        f"""
        <div class="kpi-card">
            <div class="kpi-accent"></div>
            <div class="kpi-label">{label}</div>
            <div class="kpi-value">{value}</div>
            <div class="kpi-caption">{caption}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def get_period_presets(min_date: date, max_date: date) -> dict[str, tuple[date, date]]:
    reference_end = max_date
    year_start = date(reference_end.year, 1, 1)

    presets = {
        "Todo o período": (min_date, max_date),
        "Últimos 7 dias": (reference_end - timedelta(days=6), reference_end),
        "Último mês": (reference_end - timedelta(days=29), reference_end),
        "Último trimestre": (reference_end - timedelta(days=89), reference_end),
        "Ano atual": (year_start, reference_end),
        "Personalizado": (min_date, max_date),
    }

    normalized: dict[str, tuple[date, date]] = {}
    for label, (start, end) in presets.items():
        normalized[label] = (max(start, min_date), min(end, max_date))
    return normalized


def main() -> None:
    inject_styles()
    defaults = get_env_defaults()

    st.markdown(
        f"""
        <div class="hero">
            <h1>Dashboard Estatístico Integrado</h1>
            <p>Visão analítica do DevLivery conectada ao MySQL com KPIs e filtros inteligentes.</p>
            <div class="hero-meta">
                <span class="hero-badge">Dados reais do banco</span>
                <span class="hero-badge">Filtros responsivos</span>
                <span class="hero-badge">Mais de 5 gráficos dinâmicos</span>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    host = defaults["host"]
    port = defaults["port"]
    database = defaults["database"]
    user = defaults["user"]
    password = defaults["password"]

    if not all([host, port, database, user]):
        st.error("As credenciais do MySQL nao foram encontradas nas variaveis de ambiente do projeto.")
        st.info("Configure `DB_URL`, `DB_USERNAME` e `SENHA_DEVLIVERY` no arquivo `.env` para carregar o dashboard.")
        st.stop()

    connection_uri = build_connection_uri(
        {
            "host": host,
            "port": port,
            "database": database,
            "user": user,
            "password": password,
        }
    )

    try:
        datasets = load_data(connection_uri)
    except Exception as exc:
        st.error("Nao foi possivel conectar ao MySQL ou consultar as tabelas do dashboard.")
        st.code(str(exc))
        st.info("Revise as variaveis `DB_URL`, `DB_USERNAME` e `SENHA_DEVLIVERY` no ambiente antes de tentar novamente.")
        st.stop()

    orders_full = datasets["orders"]
    totals_row = datasets["totals"].iloc[0]
    min_date = orders_full["DATA"].min().date()
    max_date = orders_full["DATA"].max().date()
    presets = get_period_presets(min_date, max_date)

    st.markdown('<div class="section-title">Filtros Interativos</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="section-subtitle">Selecione rapidamente períodos comuns ou personalize o intervalo para explorar os indicadores.</div>',
        unsafe_allow_html=True,
    )
    st.markdown('<div class="panel">', unsafe_allow_html=True)

    preset = st.selectbox(
        "Filtro de período",
        list(presets.keys()),
        index=0,
        help="Define rapidamente o intervalo de datas usado em todos os gráficos e indicadores.",
    )
    st.markdown(
        '<div class="filter-hint">Escolha um período pronto ou selecione "Personalizado" para definir as datas manualmente.</div>',
        unsafe_allow_html=True,
    )

    preset_start, preset_end = presets[preset]
    date_col_1, date_col_2, date_col_3 = st.columns([1, 1, 2])
    with date_col_1:
        start_date = st.date_input(
            "Filtro de data inicial",
            value=preset_start,
            min_value=min_date,
            max_value=max_date,
            disabled=preset != "Personalizado",
            help="Determina o primeiro dia considerado nas consultas do dashboard.",
        )
        st.markdown(
            '<div class="filter-hint">Início do período analisado.</div>',
            unsafe_allow_html=True,
        )
    with date_col_2:
        end_date = st.date_input(
            "Filtro de data final",
            value=preset_end,
            min_value=min_date,
            max_value=max_date,
            disabled=preset != "Personalizado",
            help="Determina o último dia considerado nas consultas do dashboard.",
        )
        st.markdown(
            '<div class="filter-hint">Fim do período analisado.</div>',
            unsafe_allow_html=True,
        )
    with date_col_3:
        st.markdown(
            f"""
            <div class="filter-feedback">
                <strong>Período ativo:</strong> {start_date.strftime("%d/%m/%Y")} até {end_date.strftime("%d/%m/%Y")}<br/>
                <span style="color:{TEXT_MUTED};">Referência de dados carregados: {min_date.strftime("%d/%m/%Y")} até {max_date.strftime("%d/%m/%Y")}</span>
            </div>
            """,
            unsafe_allow_html=True,
        )

    if end_date < start_date:
        st.error("A data final nao pode ser anterior a data inicial.")
        st.markdown("</div>", unsafe_allow_html=True)
        st.stop()

    filter_row_1 = st.columns(3)
    with filter_row_1[0]:
        cities = st.multiselect(
            "Filtro por cidade",
            sorted(orders_full["CIDADE_RESTAURANTE"].dropna().unique().tolist()),
            placeholder="Todas as cidades",
            help="Mostra apenas pedidos e métricas dos restaurantes localizados nas cidades selecionadas.",
        )
        st.markdown(
            '<div class="filter-hint">Restringe os dados pela cidade do restaurante.</div>',
            unsafe_allow_html=True,
        )
    with filter_row_1[1]:
        restaurants = st.multiselect(
            "Filtro por restaurante",
            sorted(orders_full["RESTAURANTE"].dropna().unique().tolist()),
            placeholder="Todos os restaurantes",
            help="Exibe somente os dados dos restaurantes selecionados.",
        )
        st.markdown(
            '<div class="filter-hint">Permite analisar um ou mais restaurantes específicos.</div>',
            unsafe_allow_html=True,
        )
    with filter_row_1[2]:
        categories = st.multiselect(
            "Filtro por categoria",
            sorted(orders_full["CATEGORIA"].dropna().unique().tolist()),
            placeholder="Todas as categorias",
            help="Filtra os dados pela categoria principal associada ao restaurante.",
        )
        st.markdown(
            '<div class="filter-hint">Agrupa a análise por tipo de cozinha ou segmento.</div>',
            unsafe_allow_html=True,
        )

    filter_row_2 = st.columns(3)
    with filter_row_2[0]:
        statuses = st.multiselect(
            "Filtro por status do pedido",
            sorted(orders_full["STATUS"].dropna().unique().tolist()),
            placeholder="Todos os status",
            help="Limita os pedidos por situação, como Entregue, Em Rota ou Cancelado.",
        )
        st.markdown(
            '<div class="filter-hint">Útil para separar concluídos, em rota e cancelados.</div>',
            unsafe_allow_html=True,
        )
    with filter_row_2[1]:
        payment_types = st.multiselect(
            "Filtro por forma de pagamento",
            sorted(orders_full["TIPO_PAGAMENTO"].fillna("Sem pagamento").unique().tolist()),
            placeholder="Todos os meios",
            help="Mostra apenas pedidos pagos com os meios selecionados, como PIX, Cartão ou Dinheiro.",
        )
        st.markdown(
            '<div class="filter-hint">Compara o comportamento por meio de pagamento.</div>',
            unsafe_allow_html=True,
        )
    with filter_row_2[2]:
        st.markdown(
            f"""
            <div class="filter-feedback">
                <strong>Filtros ativos:</strong> {len(cities) + len(restaurants) + len(categories) + len(statuses) + len(payment_types)} seleções adicionais<br/>
                <span style="color:{TEXT_MUTED};">Cada filtro acima altera todos os KPIs, gráficos e a tabela de pedidos.</span>
            </div>
            """,
            unsafe_allow_html=True,
        )
    st.markdown("</div>", unsafe_allow_html=True)

    orders, items, reviews = filter_data(
        datasets,
        start_date,
        end_date,
        cities,
        restaurants,
        categories,
        statuses,
        payment_types,
    )

    if orders.empty:
        st.warning("Nenhum dado encontrado para os filtros selecionados.")
        st.stop()

    delivered_orders = orders[orders["STATUS"].str.lower() == "entregue".lower()]
    cancelled_orders = orders[orders["STATUS"].str.lower().str.contains("cancel", na=False)]
    daily_revenue = (
        delivered_orders.groupby(delivered_orders["DATA"].dt.date)["VALOR_TOTAL"].sum().reset_index()
    )
    daily_revenue.columns = ["DATA", "FATURAMENTO"]
    growth_pct = compute_growth(daily_revenue["FATURAMENTO"]) if not daily_revenue.empty else 0.0

    total_faturamento = float(delivered_orders["VALOR_TOTAL"].sum())
    total_pedidos = int(len(orders))
    ticket_medio = float(delivered_orders["VALOR_TOTAL"].mean()) if not delivered_orders.empty else 0.0
    taxa_cancelamento = (len(cancelled_orders) / len(orders)) * 100 if len(orders) else 0.0
    taxa_conclusao = (len(delivered_orders) / len(orders)) * 100 if len(orders) else 0.0
    media_nota = float(reviews["NOTA_AVALIACAO"].mean()) if not reviews.empty else 0.0

    kpi_1, kpi_2, kpi_3, kpi_4, kpi_5, kpi_6 = st.columns(6)
    with kpi_1:
        render_kpi_card("Pedidos filtrados", f"{total_pedidos}", "Volume total no recorte selecionado")
    with kpi_2:
        render_kpi_card("Faturamento entregue", format_currency(total_faturamento), "Receita apenas de pedidos concluídos")
    with kpi_3:
        render_kpi_card("Ticket médio", format_currency(ticket_medio), "Valor médio por pedido entregue")
    with kpi_4:
        render_kpi_card("Taxa de conclusão", f"{taxa_conclusao:.1f}%", "Percentual de pedidos entregues")
    with kpi_5:
        render_kpi_card("Taxa de cancelamento", f"{taxa_cancelamento:.1f}%", "Pedidos cancelados no período")
    with kpi_6:
        render_kpi_card("Tendência", f"{growth_pct:+.1f}%", "Comparação entre primeira e segunda metade")

    st.markdown('<div class="section-title">Base Resumida do Banco</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="section-subtitle">Indicadores estruturais do banco para contextualizar os gráficos e as estatísticas.</div>',
        unsafe_allow_html=True,
    )
    summary_1, summary_2, summary_3, summary_4 = st.columns(4)
    with summary_1:
        render_stat_box("Total de clientes", str(int(totals_row["TOTAL_CLIENTES"])), "Base cadastrada")
    with summary_2:
        render_stat_box("Total de restaurantes", str(int(totals_row["TOTAL_RESTAURANTES"])), "Operações monitoradas")
    with summary_3:
        render_stat_box("Total de entregadores", str(int(totals_row["TOTAL_ENTREGADORES"])), "Rede logística disponível")
    with summary_4:
        render_stat_box("Média das avaliações", format_number(media_nota), "Percepção média dos clientes")

    base_stats = delivered_orders["VALOR_TOTAL"] if not delivered_orders.empty else orders["VALOR_TOTAL"]
    stat_labels = ["Media", "Mediana", "Moda", "Variancia", "Desvio padrao"]
    stat_values = [
        float(base_stats.mean()) if not base_stats.empty else 0.0,
        float(base_stats.median()) if not base_stats.empty else 0.0,
        series_mode(base_stats),
        safe_variance(base_stats),
        safe_std(base_stats),
    ]
    max_stat = max(stat_values) if stat_values and max(stat_values) > 0 else 1.0
    radar_values = [value / max_stat for value in stat_values]

    fig_line = px.line(
        daily_revenue,
        x="DATA",
        y="FATURAMENTO",
        markers=True,
        title="Faturamento por periodo",
        color_discrete_sequence=[IFOOD_RED],
    )
    fig_line.update_traces(line=dict(width=4))
    fig_line = make_figure_layout(fig_line)

    status_distribution = orders["STATUS"].value_counts().reset_index()
    status_distribution.columns = ["STATUS", "TOTAL"]
    fig_pie = px.pie(
        status_distribution,
        names="STATUS",
        values="TOTAL",
        title="Distribuicao de status dos pedidos",
        hole=0.58,
        color_discrete_sequence=[IFOOD_RED, "#ff6b81", "#ffb3ba", "#ffd6d9", "#a11a25"],
    )
    fig_pie = make_figure_layout(fig_pie)

    top_products = (
        items.groupby("PRODUTO", as_index=False)["QUANTIDADE"]
        .sum()
        .sort_values("QUANTIDADE", ascending=False)
        .head(10)
    )
    fig_bar_products = px.bar(
        top_products,
        x="QUANTIDADE",
        y="PRODUTO",
        orientation="h",
        title="Produtos mais vendidos",
        color="QUANTIDADE",
        color_continuous_scale=["#ffd6d9", "#ff6b81", IFOOD_RED],
    )
    fig_bar_products = make_figure_layout(fig_bar_products)
    fig_bar_products.update_coloraxes(showscale=False)

    city_orders = (
        orders.groupby("CIDADE_RESTAURANTE", as_index=False)["CD_PEDIDO"]
        .count()
        .rename(columns={"CD_PEDIDO": "PEDIDOS"})
        .sort_values("PEDIDOS", ascending=False)
    )
    fig_city = px.bar(
        city_orders,
        x="CIDADE_RESTAURANTE",
        y="PEDIDOS",
        title="Pedidos por cidade",
        color="PEDIDOS",
        color_continuous_scale=["#ffe5e8", "#ff8a98", IFOOD_RED],
    )
    fig_city = make_figure_layout(fig_city)
    fig_city.update_coloraxes(showscale=False)

    fig_stats = px.bar(
        x=stat_labels,
        y=stat_values,
        title="Estatisticas dos valores dos pedidos",
        color=stat_labels,
        color_discrete_sequence=[IFOOD_RED, "#ff5668", "#ff8091", "#ffb5bd", "#ffd6d9"],
    )
    fig_stats = make_figure_layout(fig_stats)

    fig_radar = go.Figure()
    fig_radar.add_trace(
        go.Scatterpolar(
            r=radar_values + [radar_values[0]],
            theta=stat_labels + [stat_labels[0]],
            fill="toself",
            line=dict(color=IFOOD_RED, width=3),
            fillcolor="rgba(234, 29, 44, 0.25)",
            name="Perfil estatistico",
        )
    )
    fig_radar.update_layout(
        title="Radar estatistico normalizado",
        paper_bgcolor=CARD_BG,
        polar=dict(
            bgcolor=CARD_BG,
            radialaxis=dict(visible=True, range=[0, 1], gridcolor=GRID),
            angularaxis=dict(gridcolor=GRID),
        ),
        font_color=TEXT_DARK,
        margin=dict(l=20, r=20, t=50, b=20),
        showlegend=False,
    )

    scatter_source = (
        orders.groupby(["RESTAURANTE", "NOTA_RESTAURANTE"], as_index=False)
        .agg(VALOR_MEDIO=("VALOR_TOTAL", "mean"), PEDIDOS=("CD_PEDIDO", "count"))
    )
    fig_scatter = px.scatter(
        scatter_source,
        x="NOTA_RESTAURANTE",
        y="VALOR_MEDIO",
        size="PEDIDOS",
        color="PEDIDOS",
        hover_name="RESTAURANTE",
        title="Correlacao entre nota do restaurante e ticket medio",
        color_continuous_scale=["#ffd6d9", "#ff6b81", IFOOD_RED],
    )
    fig_scatter = make_figure_layout(fig_scatter)
    fig_scatter.update_coloraxes(showscale=False)

    chart_col_1, chart_col_2 = st.columns(2)
    with chart_col_1:
        st.plotly_chart(fig_line, use_container_width=True)
    with chart_col_2:
        st.plotly_chart(fig_pie, use_container_width=True)

    chart_col_3, chart_col_4 = st.columns(2)
    with chart_col_3:
        st.plotly_chart(fig_bar_products, use_container_width=True)
    with chart_col_4:
        st.plotly_chart(fig_city, use_container_width=True)

    chart_col_5, chart_col_6 = st.columns(2)
    with chart_col_5:
        st.plotly_chart(fig_stats, use_container_width=True)
    with chart_col_6:
        st.plotly_chart(fig_radar, use_container_width=True)

    st.plotly_chart(fig_scatter, use_container_width=True)

    st.markdown('<div class="section-title">Resumo Estatístico</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="section-subtitle">Medidas descritivas calculadas a partir dos valores dos pedidos do período filtrado.</div>',
        unsafe_allow_html=True,
    )
    stats_col_1, stats_col_2, stats_col_3, stats_col_4, stats_col_5 = st.columns(5)
    with stats_col_1:
        render_stat_box("Média", format_currency(stat_values[0]), "Tendência central")
    with stats_col_2:
        render_stat_box("Mediana", format_currency(stat_values[1]), "Valor central ordenado")
    with stats_col_3:
        render_stat_box("Moda", format_currency(stat_values[2]), "Valor mais recorrente")
    with stats_col_4:
        render_stat_box("Variância", format_number(stat_values[3]), "Dispersão ao quadrado")
    with stats_col_5:
        render_stat_box("Desvio padrão", format_number(stat_values[4]), "Oscilação média")

    st.markdown('<div class="section-title">Pedidos Recentes</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="section-subtitle">Tabela operacional com os pedidos mais recentes dentro do recorte atual.</div>',
        unsafe_allow_html=True,
    )
    recent_orders = (
        orders.sort_values("DATA", ascending=False)[
            [
                "CD_PEDIDO",
                "DATA",
                "RESTAURANTE",
                "CIDADE_RESTAURANTE",
                "CATEGORIA",
                "STATUS",
                "VALOR_TOTAL",
                "TIPO_PAGAMENTO",
            ]
        ]
        .head(15)
        .copy()
    )
    recent_orders["DATA"] = recent_orders["DATA"].dt.strftime("%d/%m/%Y")
    recent_orders["VALOR_TOTAL"] = recent_orders["VALOR_TOTAL"].map(format_currency)
    recent_orders = recent_orders.rename(
        columns={
            "CD_PEDIDO": "Pedido",
            "DATA": "Data",
            "RESTAURANTE": "Restaurante",
            "CIDADE_RESTAURANTE": "Cidade",
            "CATEGORIA": "Categoria",
            "STATUS": "Status",
            "VALOR_TOTAL": "Valor total",
            "TIPO_PAGAMENTO": "Pagamento",
        }
    )
    st.dataframe(recent_orders, use_container_width=True, hide_index=True)

    with st.expander("Consultas e tabelas usadas no dashboard"):
        st.write(
            "Tabelas principais: `PEDIDO`, `RESTAURANTE`, `CLIENTE`, `ENTREGADOR`, "
            "`PRODUTO`, `CONTEM`, `PAGAMENTO`, `AVALIA`, `PERTENCE` e `CATEGORIA`."
        )
        st.write(
            "Filtros disponiveis: periodo, cidade, restaurante, categoria, status e tipo de pagamento."
        )


if __name__ == "__main__":
    main()

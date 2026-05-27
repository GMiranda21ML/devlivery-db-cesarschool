SET GLOBAL LOG_BIN_TRUST_FUNCTION_CREATORS = 1;

DELIMITER $$
CREATE FUNCTION calcular_desconto_cupom (
    valor_pedido  FLOAT,
    tipo_cupom    VARCHAR(255),
    valor_desconto FLOAT
)
RETURNS FLOAT
BEGIN
    DECLARE valor_final FLOAT;

    IF tipo_cupom = 'PERCENTUAL' THEN
        SET valor_final = valor_pedido - (valor_pedido * valor_desconto / 100);
    ELSEIF tipo_cupom = 'FIXO' THEN
        SET valor_final = valor_pedido - valor_desconto;
    ELSE
        SET valor_final = valor_pedido;
    END IF;

    IF valor_final < 0 THEN
        SET valor_final = 0;
    END IF;

    RETURN valor_final;
END $$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION classificar_entregador (nota FLOAT)
RETURNS VARCHAR(20)
BEGIN
    DECLARE classificacao VARCHAR(20);

    IF nota IS NULL THEN
        SET classificacao = 'Sem avaliação';
    ELSEIF nota >= 4.5 THEN
        SET classificacao = 'Excelente';
    ELSEIF nota >= 3.5 THEN
        SET classificacao = 'Bom';
    ELSEIF nota >= 2.5 THEN
        SET classificacao = 'Regular';
    ELSE
        SET classificacao = 'Ruim';
    END IF;

    RETURN classificacao;
END $$
DELIMITER ;
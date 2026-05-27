DELIMITER $$
CREATE PROCEDURE atualizar_status_pedido (
    IN p_cd_pedido  INT,
    IN p_novo_status VARCHAR(255)
)
BEGIN
    DECLARE status_atual VARCHAR(255);

    SELECT STATUS INTO status_atual
    FROM PEDIDO
    WHERE CD_PEDIDO = p_cd_pedido;

    UPDATE PEDIDO
    SET STATUS = p_novo_status
    WHERE CD_PEDIDO = p_cd_pedido;

    INSERT INTO HISTORICO_STATUS (CD_PEDIDO, DESCRICAO, DATA_HORA)
    VALUES (
        p_cd_pedido,
        CONCAT('Status alterado de "', status_atual, '" para "', p_novo_status, '"'),
        NOW()
    );

END $$
DELIMITER ;

ALTER TABLE HISTORICO_STATUS MODIFY CD_HISTORICO INT AUTO_INCREMENT;

DELIMITER $$
CREATE PROCEDURE recalcular_nota_produtos_restaurante (
    IN p_cd_restaurante INT
)
BEGIN
    DECLARE done        INT DEFAULT FALSE;
    DECLARE v_cd_produto INT;
    DECLARE v_media      FLOAT;
    DECLARE v_total_aval INT;

    DECLARE cur_produtos CURSOR FOR
        SELECT CD_PRODUTO
        FROM PRODUTO
        WHERE CD_RESTAURANTE = p_cd_restaurante;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur_produtos;

    loop_produtos: LOOP
        FETCH cur_produtos INTO v_cd_produto;

        IF done THEN
            LEAVE loop_produtos;
        END IF;

        SELECT COUNT(*), AVG(NOTA)
        INTO v_total_aval, v_media
        FROM AVALIA
        WHERE CD_PRODUTO = v_cd_produto;

        IF v_total_aval = 0 THEN
            UPDATE PRODUTO
            SET NOTA = NULL
            WHERE CD_PRODUTO = v_cd_produto;
        ELSE
            UPDATE PRODUTO
            SET NOTA = ROUND(v_media, 2)
            WHERE CD_PRODUTO = v_cd_produto;
        END IF;

    END LOOP;

    CLOSE cur_produtos;

END $$
DELIMITER ;

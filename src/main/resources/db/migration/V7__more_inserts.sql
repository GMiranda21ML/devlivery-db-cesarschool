INSERT INTO USUARIO (CPF, NOME, EMAIL, SENHA) VALUES
    -- Clientes
    ('10000000091', 'Isabela Fontes',      'isabela.fontes@email.com',    '$2a$10$dummyhash.cliente91'),
    ('10000000092', 'Henrique Azevedo',    'henrique.azevedo@email.com',  '$2a$10$dummyhash.cliente92'),
    ('10000000093', 'Larissa Queiroz',     'larissa.queiroz@email.com',   '$2a$10$dummyhash.cliente93'),
    ('10000000094', 'Gustavo Cavalcante',  'gustavo.cavalcante@email.com','$2a$10$dummyhash.cliente94'),
    ('10000000095', 'Nathalia Barbosa',    'nathalia.barbosa@email.com',  '$2a$10$dummyhash.cliente95'),
    ('10000000096', 'Vinícius Nogueira',   'vinicius.nogueira@email.com', '$2a$10$dummyhash.cliente96'),
    ('10000000097', 'Débora Sampaio',      'debora.sampaio@email.com',    '$2a$10$dummyhash.cliente97'),
    ('10000000098', 'Rodrigo Leal',        'rodrigo.leal@email.com',      '$2a$10$dummyhash.cliente98'),
    ('10000000099', 'Aline Correia',       'aline.correia@email.com',     '$2a$10$dummyhash.cliente99'),
    ('10000000100', 'Fábio Monteiro',      'fabio.monteiro@email.com',    '$2a$10$dummyhash.cliente100'),
    -- Entregadores
    ('10000000101', 'Jonatan Paes',        'jonatan.paes@email.com',      '$2a$10$dummyhash.ent101'),
    ('10000000102', 'Cristiane Melo',      'cristiane.melo@email.com',    '$2a$10$dummyhash.ent102'),
    ('10000000103', 'Wesley Aragão',       'wesley.aragao@email.com',     '$2a$10$dummyhash.ent103'),
    ('10000000104', 'Pamela Siqueira',     'pamela.siqueira@email.com',   '$2a$10$dummyhash.ent104'),
    ('10000000105', 'Caio Drummond',       'caio.drummond@email.com',     '$2a$10$dummyhash.ent105'),
    -- Parceiros (donos de restaurante)
    ('10000000106', 'Dono Crepe Express',  'dono31@email.com',            '$2a$10$dummyhash.parc106'),
    ('10000000107', 'Dono Temakeria 10',   'dono32@email.com',            '$2a$10$dummyhash.parc107'),
    ('10000000108', 'Dono Bistrô do Chef', 'dono33@email.com',            '$2a$10$dummyhash.parc108'),
    ('10000000109', 'Dono Poke House',     'dono34@email.com',            '$2a$10$dummyhash.parc109'),
    ('10000000110', 'Dono Smash Burguer',  'dono35@email.com',            '$2a$10$dummyhash.parc110');

-- ============================================================
-- TELEFONES DOS NOVOS CLIENTES
-- ============================================================
INSERT INTO TELEFONE (CPF, NUMERO) VALUES
    ('10000000091', '81988880091'), ('10000000092', '81988880092'),
    ('10000000093', '81988880093'), ('10000000094', '81988880094'),
    ('10000000095', '81988880095'), ('10000000096', '81988880096'),
    ('10000000097', '81988880097'), ('10000000098', '81988880098'),
    ('10000000099', '81988880099'), ('10000000100', '81988880100');

-- ============================================================
-- NOVOS CLIENTES
-- ============================================================
INSERT INTO CLIENTE (CPF, RUA, CIDADE, NUMERO, BAIRRO, CEP, CONVIDADO) VALUES
    ('10000000091', 'Av. Boa Viagem',   'Recife',          '91',  'Boa Viagem',   '51011000', '10000000010'),
    ('10000000092', 'Rua do Futuro',    'Recife',          '92',  'Aflitos',      '52050000', NULL),
    ('10000000093', 'Rua Frei Matias',  'Olinda',          '93',  'Amparo',       '53020000', '10000000091'),
    ('10000000094', 'Av. Caxangá',      'Recife',          '94',  'Caxangá',      '52280000', NULL),
    ('10000000095', 'Rua da Aurora',    'Recife',          '95',  'Boa Vista',    '50050000', '10000000092'),
    ('10000000096', 'Av. Agamenon',     'Recife',          '96',  'Derby',        '52010000', NULL),
    ('10000000097', 'Rua Sete de Set.', 'Caruaru',         '97',  'Centro',       '55000000', NULL),
    ('10000000098', 'Av. João de Barros','Recife',         '98',  'Ilha do Leite','50070000', NULL),
    ('10000000099', 'Rua Padre Inglês', 'Recife',          '99',  'Soledade',     '51210000', '10000000094'),
    ('10000000100', 'Rua Nova',         'João Pessoa',     '100', 'Tambaú',       '58039000', NULL);

-- ============================================================
-- NOVOS ENTREGADORES
-- ============================================================
INSERT INTO ENTREGADOR (CPF, NOTA, VEICULO, PLACA) VALUES
    ('10000000101', 4.7, 'Moto',      'XYZ1101'),
    ('10000000102', 5.0, 'Bicicleta', NULL),
    ('10000000103', 4.3, 'Moto',      'XYZ1103'),
    ('10000000104', 4.9, 'Carro',     'XYZ1104'),
    ('10000000105', 4.6, 'Moto',      'XYZ1105');

-- ============================================================
-- NOVOS PARCEIROS
-- ============================================================
INSERT INTO PARCEIRO (CPF) VALUES
    ('10000000106'), ('10000000107'), ('10000000108'),
    ('10000000109'), ('10000000110');

-- ============================================================
-- NOVOS RESTAURANTES (31-35)
-- ============================================================
INSERT INTO RESTAURANTE (CD_RESTAURANTE, CNPJ, CPF_PARCEIRO, NOME, TELEFONE_RESTAURANTE, NUMERO, CEP, BAIRRO, RUA, CIDADE, NOTA, TAXA_ENTREGA, TEMPO_ENTREGA, NOME_IMAGEM) VALUES
    (31, '12345678000131', '10000000106', 'Crepe Express',  '81999990031', '31', '51011001', 'Boa Viagem',  'Av. Boa Viagem',    'Recife',       4.6, 3.00, 25, 'rest_31.jpg'),
    (32, '12345678000132', '10000000107', 'Temakeria 10',   '81999990032', '32', '51021001', 'Pina',        'Rua Antônio Goes',  'Recife',       4.8, 8.00, 50, 'rest_32.jpg'),
    (33, '12345678000133', '10000000108', 'Bistrô do Chef', '81999990033', '33', '52050001', 'Aflitos',     'Rua do Futuro',     'Recife',       4.9, 10.00, 45, 'rest_33.jpg'),
    (34, '12345678000134', '10000000109', 'Poke House',     '81999990034', '34', '50050001', 'Boa Vista',   'Rua da Aurora',     'Recife',       5.0, 5.50, 30, 'rest_34.jpg'),
    (35, '12345678000135', '10000000110', 'Smash Burguer',  '81999990035', '35', '52010001', 'Derby',       'Av. Agamenon',      'Recife',       4.7, 4.00, 35, 'rest_35.jpg');

-- Categorias dos novos restaurantes
INSERT INTO PERTENCE (CD_RESTAURANTE, CD_CATEGORIA) VALUES
    (31, 18), -- Crepe Express → Cafeteria
    (32, 3),  -- Temakeria 10 → Japonesa
    (33, 29), -- Bistrô do Chef → Gourmet
    (34, 9),  -- Poke House → Saudável
    (35, 1);  -- Smash Burguer → Lanches

-- ============================================================
-- NOVOS PRODUTOS (31-45)
-- ============================================================
INSERT INTO PRODUTO (CD_PRODUTO, NOME, DESCRICAO, NOTA, PRECO, CD_RESTAURANTE, NOME_IMAGEM) VALUES
    (31, 'Crepe Frango Catupiry',   'Crepe recheado com frango desfiado e catupiry',         4.7, 25.00, 31, 'cat_1.jpg'),
    (32, 'Crepe Nutella Morango',   'Crepe doce com Nutella e morangos frescos',              4.9, 22.00, 31, 'cat_2.jpg'),
    (33, 'Combo Temaki Salmão',     '2 Temakis de Salmão com cream cheese + refri',          4.8, 54.90, 32, 'cat_3.jpg'),
    (34, 'Uramaki Hot Crispy',      '10 Peças de Uramaki com maionese sriracha',              4.6, 38.00, 32, 'cat_4.jpg'),
    (35, 'Risoto de Camarão',       'Risoto cremoso ao champagne com camarões grelhados',     5.0, 78.00, 33, 'cat_5.jpg'),
    (36, 'Filé ao Molho Madeira',   'Filé mignon ao molho madeira com batata gratinada',     4.9, 92.00, 33, 'cat_6.jpg'),
    (37, 'Poke de Salmão',          'Base de arroz shari, salmão, edamame e maionese',       5.0, 42.00, 34, 'cat_7.jpg'),
    (38, 'Poke Vegano',             'Base de quinoa, tofu, pepino, abacate e shoyu',         4.8, 38.00, 34, 'cat_8.jpg'),
    (39, 'Smash Duplo Cheddar',     'Dois smash burgers, queijo americano e pickles',        4.9, 42.00, 35, 'cat_9.jpg'),
    (40, 'Smash Bacon Caramelizado','Smash com bacon caramelizado, onion rings e BBQ',       4.7, 46.00, 35, 'cat_10.jpg'),
    -- Produtos extras em restaurantes já existentes
    (41, 'Pizza Calabresa',         'Molho, mussarela e calabresa fatiada',                  4.6, 42.00,  1, 'cat_11.jpg'),
    (42, 'X-Salada',                'Hambúrguer 150g, alface, tomate e maionese',             4.4, 26.00,  2, 'cat_12.jpg'),
    (43, 'Caipirinha de Limão',     'Dose individual, bem gelada',                           4.5, 16.00, 26, 'cat_13.jpg'),
    (44, 'Brownie com Sorvete',     'Brownie quentinho com bola de sorvete de creme',        4.8, 18.00, 11, 'cat_14.jpg'),
    (45, 'Combo Família Açaí',      'Açaí 2L com 4 complementos à escolha',                 4.9, 58.00,  5, 'cat_15.jpg');

-- ============================================================
-- NOVOS PEDIDOS (31-55)
-- Todos com STATUS = 'Concluido' para aparecerem na
-- VIEW_FATURAMENTO_PEDIDOS_CONCLUIDOS
-- ============================================================
INSERT INTO PEDIDO (CD_PEDIDO, VALOR_TOTAL, STATUS, DATA, CD_RESTAURANTE, CPF_CLIENTE, CPF_ENTREGADOR, CD_CUPOM) VALUES
    (31, 25.00, 'Concluido', '2026-01-05',  31, '10000000091', '10000000101', NULL),
    (32, 54.90, 'Concluido', '2026-01-08',  32, '10000000092', '10000000102', NULL),
    (33, 78.00, 'Concluido', '2026-01-10',  33, '10000000093', '10000000103', NULL),
    (34, 42.00, 'Concluido', '2026-01-12',  34, '10000000094', '10000000104', NULL),
    (35, 42.00, 'Concluido', '2026-01-15',  35, '10000000095', '10000000105', NULL),
    (36, 92.00, 'Concluido', '2026-01-18',  33, '10000000096', '10000000101', NULL),
    (37, 46.00, 'Concluido', '2026-01-20',  35, '10000000097', '10000000102', NULL),
    (38, 38.00, 'Concluido', '2026-01-22',  34, '10000000098', '10000000103', NULL),
    (39, 22.00, 'Concluido', '2026-01-25',  31, '10000000099', '10000000104', NULL),
    (40, 58.00, 'Concluido', '2026-02-01',   5, '10000000100', '10000000105', NULL),
    (41, 45.90, 'Concluido', '2026-02-03',   1, '10000000001', '10000000031', NULL),
    (42, 42.00, 'Concluido', '2026-02-05',   1, '10000000002', '10000000032', NULL),
    (43, 26.00, 'Concluido', '2026-02-07',   2, '10000000003', '10000000033', NULL),
    (44, 78.00, 'Concluido', '2026-02-10',  33, '10000000004', '10000000034', NULL),
    (45, 18.00, 'Concluido', '2026-02-12',  11, '10000000005', '10000000035', NULL),
    (46, 85.00, 'Concluido', '2026-02-14',   4, '10000000006', '10000000036', NULL),
    (47, 30.00, 'Concluido', '2026-02-16',   9, '10000000007', '10000000037', NULL),
    (48, 35.00, 'Concluido', '2026-02-18',  22, '10000000008', '10000000038', NULL),
    (49, 65.00, 'Concluido', '2026-02-20',  25, '10000000009', '10000000039', NULL),
    (50, 14.50, 'Concluido', '2026-02-22',  15, '10000000010', '10000000040', NULL),
    -- Pedidos com status variados (para preencher fila do parceiro)
    (51, 42.00, 'Pendente',  '2026-03-01',  32, '10000000091', NULL,           NULL),
    (52, 92.00, 'Em preparo','2026-03-02',  33, '10000000092', NULL,           NULL),
    (53, 46.00, 'Pendente',  '2026-03-03',  35, '10000000093', NULL,           NULL),
    (54, 38.00, 'Em preparo','2026-03-04',  34, '10000000094', NULL,           NULL),
    (55, 25.00, 'Pendente',  '2026-03-05',  31, '10000000095', NULL,           NULL);

-- ============================================================
-- ITENS DOS PEDIDOS (CONTEM)
-- ============================================================
INSERT INTO CONTEM (CD_PEDIDO, CD_PRODUTO, QUANTIDADE) VALUES
    (31, 31, 1), (32, 33, 1), (33, 35, 1), (34, 37, 1), (35, 39, 1),
    (36, 36, 1), (37, 40, 1), (38, 38, 1), (39, 32, 1), (40, 45, 1),
    (41, 1,  1), (42, 41, 1), (43, 42, 1), (44, 35, 1), (45, 44, 1),
    (46, 4,  1), (47, 9,  1), (48, 22, 1), (49, 25, 1), (50, 15, 1),
    (51, 33, 1), (52, 35, 1), (53, 39, 2), (54, 38, 1), (55, 31, 1);

-- ============================================================
-- PAGAMENTOS DOS NOVOS PEDIDOS CONCLUÍDOS (31-50)
-- (os pendentes/em preparo ainda não têm pagamento)
-- ============================================================
INSERT INTO PAGAMENTO (CD_PAGAMENTO, TIPO, SUBTIPO_CARTAO, DATA_HORA, VALOR, CD_PEDIDO) VALUES
    (31, 'PIX',     NULL,                      '2026-01-05 19:30:00',  25.00, 31),
    (32, 'Cartão',  'Crédito Visa',             '2026-01-08 20:15:00',  54.90, 32),
    (33, 'PIX',     NULL,                      '2026-01-10 21:00:00',  78.00, 33),
    (34, 'Cartão',  'Débito Mastercard',        '2026-01-12 13:30:00',  42.00, 34),
    (35, 'PIX',     NULL,                      '2026-01-15 20:00:00',  42.00, 35),
    (36, 'Cartão',  'Crédito Amex',             '2026-01-18 21:30:00',  92.00, 36),
    (37, 'PIX',     NULL,                      '2026-01-20 22:00:00',  46.00, 37),
    (38, 'Cartão',  'Débito Visa',              '2026-01-22 18:45:00',  38.00, 38),
    (39, 'PIX',     NULL,                      '2026-01-25 17:00:00',  22.00, 39),
    (40, 'Cartão',  'Crédito Elo',              '2026-02-01 16:20:00',  58.00, 40),
    (41, 'PIX',     NULL,                      '2026-02-03 20:00:00',  45.90, 41),
    (42, 'Cartão',  'Crédito Mastercard',       '2026-02-05 19:10:00',  42.00, 42),
    (43, 'PIX',     NULL,                      '2026-02-07 21:30:00',  26.00, 43),
    (44, 'Cartão',  'Débito Elo',               '2026-02-10 20:50:00',  78.00, 44),
    (45, 'Dinheiro',NULL,                      '2026-02-12 15:00:00',  18.00, 45),
    (46, 'PIX',     NULL,                      '2026-02-14 14:00:00',  85.00, 46),
    (47, 'Cartão',  'Vale Refeição VR',         '2026-02-16 12:30:00',  30.00, 47),
    (48, 'PIX',     NULL,                      '2026-02-18 21:00:00',  35.00, 48),
    (49, 'Cartão',  'Crédito Visa',             '2026-02-20 22:10:00',  65.00, 49),
    (50, 'PIX',     NULL,                      '2026-02-22 09:15:00',  14.50, 50);

-- ============================================================
-- AVALIAÇÕES DOS NOVOS PEDIDOS CONCLUÍDOS (31-50)
-- ============================================================
INSERT INTO AVALIA (CD_AVALIACAO, CPF_CLIENTE, CD_PEDIDO, CD_PRODUTO, NOTA, COMENTARIO, DATA) VALUES
    (31, '10000000091', 31, 31, 5.0, 'Crepe delicioso, chegou quentinho e bem recheado!',            '2026-01-06'),
    (32, '10000000092', 32, 33, 4.5, 'Temaki fresquíssimo, o cream cheese faz toda diferença.',      '2026-01-09'),
    (33, '10000000093', 33, 35, 5.0, 'Risoto de camarão impecável, melhor que restaurante presencial.','2026-01-11'),
    (34, '10000000094', 34, 37, 5.0, 'Poke perfeito, ingredientes muito frescos.',                   '2026-01-13'),
    (35, '10000000095', 35, 39, 4.5, 'Smash muito suculento, batata crocante. Recomendo!',           '2026-01-16'),
    (36, '10000000096', 36, 36, 5.0, 'Filé mignon perfeito ao ponto, molho madeira excelente.',      '2026-01-19'),
    (37, '10000000097', 37, 40, 4.0, 'Bacon caramelizado incrível, mas chegou um pouco frio.',       '2026-01-21'),
    (38, '10000000098', 38, 38, 4.8, 'Poke vegano surpreendeu, muito saboroso.',                     '2026-01-23'),
    (39, '10000000099', 39, 32, 5.0, 'Nutella com morango é uma combinação imbatível.',              '2026-01-26'),
    (40, '10000000100', 40, 45, 4.9, 'Combo família do açaí vale muito o preço.',                   '2026-02-02'),
    (41, '10000000001', 41,  1, 4.7, 'Pizza sempre boa, consistente.',                              '2026-02-04'),
    (42, '10000000002', 42, 41, 4.3, 'Calabresa saborosa, mas preferira mais queijo.',              '2026-02-06'),
    (43, '10000000003', 43, 42, 4.5, 'X-Salada simples e gostoso.',                                 '2026-02-08'),
    (44, '10000000004', 44, 35, 5.0, 'Risoto de camarão: uma obra de arte gastronômica.',           '2026-02-11'),
    (45, '10000000005', 45, 44, 5.0, 'Brownie quentinho com sorvete é uma experiência única.',      '2026-02-13'),
    (46, '10000000006', 46,  4, 4.8, 'Picanha no ponto, acompanhamentos caprichados.',              '2026-02-15'),
    (47, '10000000007', 47,  9, 4.6, 'Salada caesar muito boa, frango bem temperado.',              '2026-02-17'),
    (48, '10000000008', 48, 22, 4.7, 'Yakisoba veio bem quente e saboroso.',                        '2026-02-19'),
    (49, '10000000009', 49, 25, 5.0, 'Vinho excelente, entrega rápida e bem embalado.',             '2026-02-21'),
    (50, '10000000010', 50, 15, 4.9, 'Capuccino chegou ainda quente, espuma perfeita.',             '2026-02-23');
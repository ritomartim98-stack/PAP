-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 05-Maio-2026 às 17:14
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `moto_oficina`
--
CREATE DATABASE IF NOT EXISTS `moto_oficina` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `moto_oficina`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cliente`
--

DROP TABLE IF EXISTS `cliente`;
CREATE TABLE `cliente` (
  `idcliente` int(11) NOT NULL,
  `idutilizador` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `tlm` varchar(50) DEFAULT NULL,
  `nif` int(11) DEFAULT NULL,
  `morada` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `marcacao`
--

DROP TABLE IF EXISTS `marcacao`;
CREATE TABLE `marcacao` (
  `idmarcacao` int(11) NOT NULL,
  `idcliente` int(11) NOT NULL,
  `idveiculo` int(11) NOT NULL,
  `datahora` datetime NOT NULL,
  `estado` varchar(45) NOT NULL,
  `motas_cliente` varchar(45) NOT NULL,
  `datacriacao` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `marcacao_servico`
--

DROP TABLE IF EXISTS `marcacao_servico`;
CREATE TABLE `marcacao_servico` (
  `idmarcacao` int(11) NOT NULL,
  `idservico` int(11) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `duracao_min` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `motas`
--

DROP TABLE IF EXISTS `motas`;
CREATE TABLE `motas` (
  `id` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `ano` year(4) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `imagem` varchar(255) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `cilindrada` int(11) DEFAULT NULL,
  `potencia` int(11) DEFAULT NULL,
  `quilometragem` int(11) DEFAULT NULL,
  `horas` int(11) DEFAULT NULL,
  `extras` varchar(255) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `data_adicionado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `motas`
--

INSERT INTO `motas` (`id`, `marca`, `modelo`, `ano`, `preco`, `imagem`, `tipo`, `cilindrada`, `potencia`, `quilometragem`, `horas`, `extras`, `descricao`, `data_adicionado`) VALUES
(1, 'Yamaha', 'YZ 125', '2025', 8200.00, 'uploads/yz125.jpg', 'Motocross', 125, 35, 0, 0, '', 'Mota nova de motocross, leve e potente.', '2026-05-05 15:07:14'),
(2, 'Yamaha', 'YZ125 Monster Energy Edition', '2025', 8500.00, 'uploads/yz125_monster.jpg', 'Motocross', 125, 35, 0, 0, '', 'Edição especial Monster Energy.', '2026-05-05 15:07:14'),
(3, 'Yamaha', 'TMAX Tech MAX', '2025', 15700.00, 'uploads/tmax.jpg', 'Sport', 560, 47, 0, 0, 'ABS', 'Scooter topo de gama com tecnologia avançada.', '2026-05-05 15:07:14'),
(4, 'Harley-Davidson', 'Street 750', '2020', 8900.00, 'uploads/harley750.jpg', 'Cruiser', 749, 53, 15000, 0, 'ABS', 'Mota confortável ideal para estrada.', '2026-05-05 15:07:14'),
(5, 'BMW', 'F 850 GS', '2022', 12500.00, 'uploads/bmw850gs.jpg', 'Adventure', 853, 95, 18000, 0, 'ABS,TCS,Quickshifter', 'Perfeita para aventura e longas viagens.', '2026-05-05 15:07:14'),
(6, 'Honda', 'Gold Wing', '2021', 18500.00, 'uploads/goldwing.jpg', 'Touring', 1833, 125, 22000, 0, 'DCT,Airbag,Navegação', 'Luxo e conforto máximo para viagens.', '2026-05-05 15:07:14');

-- --------------------------------------------------------

--
-- Estrutura da tabela `peca`
--

DROP TABLE IF EXISTS `peca`;
CREATE TABLE `peca` (
  `idpeca` int(11) NOT NULL,
  `categoria` varchar(45) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `referencia` varchar(45) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `imagem` varchar(100) DEFAULT NULL,
  `stock` int(11) NOT NULL,
  `datacriacao` datetime DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `peca`
--

INSERT INTO `peca` (`idpeca`, `categoria`, `nome`, `referencia`, `preco`, `imagem`, `stock`, `datacriacao`, `ativo`) VALUES
(1, 'Travões', 'Brembo', '', 45.99, 'brembo.jpg', 12, NULL, NULL),
(2, 'Motor', 'K&N', '', 18.50, 'kn.jpg', 25, NULL, NULL),
(3, 'Transmissão', 'DID', '', 89.90, 'did.jpg', 8, NULL, NULL),
(4, 'Pneus', 'Michelin', '', 145.00, 'michelin.jpg', 15, NULL, NULL),
(5, 'Lubrificantes', 'Motul', '', 52.90, 'motul.jpg', 30, NULL, NULL),
(6, 'Motor', 'NGK', '', 12.50, 'ngk.jpg', 40, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `servico`
--

DROP TABLE IF EXISTS `servico`;
CREATE TABLE `servico` (
  `idservico` int(11) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `descricao` varchar(45) NOT NULL,
  `duracaoestimada` int(11) DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `ativo` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `servico`
--

INSERT INTO `servico` (`idservico`, `nome`, `descricao`, `duracaoestimada`, `preco`, `ativo`) VALUES
(1, 'Revisao Completa', 'Revisao geral da mota', 150, 150.00, 1),
(2, 'Mudanca de Oleo', 'Mudanca de oleo e filtro', 30, 50.00, 1),
(3, 'Travoes', 'Pastilhas e discos', 90, 120.00, 1),
(4, 'Pneus e Rodas', 'Servico de pneus e rodas', 60, 80.00, 1),
(5, 'Diagnostico Eletronico', 'Diagnostico com equipamento', 60, 60.00, 1),
(6, 'Corrente e Transmissao', 'Ajuste ou troca de transmissao', 60, 90.00, 1),
(7, 'Suspensao', 'Revisao de suspensao', 120, 180.00, 1),
(8, 'Escape', 'Servico de escape', 90, 100.00, 1),
(9, 'Outro', 'Servico a combinar', NULL, 0.00, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `utilizador`
--

DROP TABLE IF EXISTS `utilizador`;
CREATE TABLE `utilizador` (
  `idutilizador` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `perfil` varchar(100) DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT NULL,
  `data_registo` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `veiculo_cliente`
--

DROP TABLE IF EXISTS `veiculo_cliente`;
CREATE TABLE `veiculo_cliente` (
  `idveiculo` int(11) NOT NULL,
  `idcliente` int(11) NOT NULL,
  `matricula` varchar(45) NOT NULL,
  `marca` varchar(45) DEFAULT NULL,
  `modelo` varchar(45) DEFAULT NULL,
  `ano` int(11) DEFAULT NULL,
  `kms` int(11) DEFAULT NULL,
  `abs` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`idcliente`),
  ADD KEY `idutilizador_idx` (`idutilizador`);

--
-- Índices para tabela `marcacao`
--
ALTER TABLE `marcacao`
  ADD PRIMARY KEY (`idmarcacao`),
  ADD KEY `fk_marcacao_cliente_idx` (`idcliente`),
  ADD KEY `fk_marcacao_veiculo_idx` (`idveiculo`);

--
-- Índices para tabela `marcacao_servico`
--
ALTER TABLE `marcacao_servico`
  ADD PRIMARY KEY (`idmarcacao`,`idservico`),
  ADD KEY `fk_ms_servico_idx` (`idservico`);

--
-- Índices para tabela `motas`
--
ALTER TABLE `motas`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `peca`
--
ALTER TABLE `peca`
  ADD PRIMARY KEY (`idpeca`);

--
-- Índices para tabela `servico`
--
ALTER TABLE `servico`
  ADD PRIMARY KEY (`idservico`);

--
-- Índices para tabela `utilizador`
--
ALTER TABLE `utilizador`
  ADD PRIMARY KEY (`idutilizador`);

--
-- Índices para tabela `veiculo_cliente`
--
ALTER TABLE `veiculo_cliente`
  ADD PRIMARY KEY (`idveiculo`),
  ADD KEY `fk_veiculo_cliente_idx` (`idcliente`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `idcliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `marcacao`
--
ALTER TABLE `marcacao`
  MODIFY `idmarcacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `motas`
--
ALTER TABLE `motas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `peca`
--
ALTER TABLE `peca`
  MODIFY `idpeca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `servico`
--
ALTER TABLE `servico`
  MODIFY `idservico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `utilizador`
--
ALTER TABLE `utilizador`
  MODIFY `idutilizador` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `veiculo_cliente`
--
ALTER TABLE `veiculo_cliente`
  MODIFY `idveiculo` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `fk_cliente_utilizador` FOREIGN KEY (`idutilizador`) REFERENCES `utilizador` (`idutilizador`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `marcacao`
--
ALTER TABLE `marcacao`
  ADD CONSTRAINT `fk_marcacao_cliente` FOREIGN KEY (`idcliente`) REFERENCES `cliente` (`idcliente`),
  ADD CONSTRAINT `fk_marcacao_veiculo` FOREIGN KEY (`idveiculo`) REFERENCES `veiculo_cliente` (`idveiculo`);

--
-- Limitadores para a tabela `marcacao_servico`
--
ALTER TABLE `marcacao_servico`
  ADD CONSTRAINT `fk_ms_marcacao` FOREIGN KEY (`idmarcacao`) REFERENCES `marcacao` (`idmarcacao`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ms_servico` FOREIGN KEY (`idservico`) REFERENCES `servico` (`idservico`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `veiculo_cliente`
--
ALTER TABLE `veiculo_cliente`
  ADD CONSTRAINT `fk_veiculo_cliente` FOREIGN KEY (`idcliente`) REFERENCES `cliente` (`idcliente`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

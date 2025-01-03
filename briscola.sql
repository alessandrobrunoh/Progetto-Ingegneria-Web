-- phpMyAdmin SQL Dump
-- version 5.2.1deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Creato il: Gen 03, 2025 alle 19:32
-- Versione del server: 10.11.6-MariaDB-0+deb12u1
-- Versione PHP: 8.2.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `briscola`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `deck`
--

CREATE TABLE `deck` (
  `id` int(11) NOT NULL,
  `room_code` char(8) NOT NULL,
  `number` int(2) NOT NULL,
  `seed` enum('Denari','Coppe','Spade','Bastoni') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `hand_cards`
--

CREATE TABLE `hand_cards` (
  `player_id` int(16) NOT NULL,
  `room_code` char(8) NOT NULL,
  `number` int(2) NOT NULL,
  `seed` enum('Denari','Coppe','Spade','Bastoni') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `players`
--

CREATE TABLE `players` (
  `user_id` int(16) NOT NULL,
  `room_code` char(8) NOT NULL,
  `points` int(8) NOT NULL DEFAULT 0,
  `host` tinyint(1) NOT NULL DEFAULT 0,
  `team` int(1) NOT NULL DEFAULT 1,
  `in_game` int(1) NOT NULL DEFAULT 0,
  `gave_up` int(11) NOT NULL DEFAULT 0,
  `elo` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `rooms`
--

CREATE TABLE `rooms` (
  `code` char(8) NOT NULL,
  `status` enum('waiting','in_progress','full','ended') NOT NULL DEFAULT 'waiting',
  `turn_player_id` int(16) NOT NULL,
  `number` int(11) DEFAULT NULL,
  `seed` enum('Denari','Coppe','Spade','Bastoni') DEFAULT NULL,
  `next_number` int(2) DEFAULT NULL,
  `next_seed` enum('Denari','Coppe','Spade','Bastoni') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `table_cards`
--

CREATE TABLE `table_cards` (
  `id` int(11) NOT NULL,
  `player_id` int(16) NOT NULL,
  `room_code` char(8) NOT NULL,
  `number` int(2) NOT NULL,
  `seed` enum('Denari','Coppe','Spade','Bastoni') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` int(16) NOT NULL,
  `username` char(16) NOT NULL,
  `email` char(64) NOT NULL,
  `password` char(64) NOT NULL,
  `elo` int(11) NOT NULL DEFAULT 1000,
  `total_games` int(8) NOT NULL DEFAULT 0,
  `wins` int(8) NOT NULL DEFAULT 0,
  `best_points` int(4) NOT NULL DEFAULT 0,
  `avatar` int(2) NOT NULL DEFAULT 1,
  `theme` enum('Old Style','Barbie','Aloe','Sky','Light','Dark','Rusty','ColorBlind','Purple','Autumn','Cartoon') NOT NULL,
  `cards` enum('Piacentine','Napoletane','Romagnole','Siciliane') NOT NULL DEFAULT 'Piacentine',
  `music` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `deck`
--
ALTER TABLE `deck`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_code` (`room_code`);

--
-- Indici per le tabelle `hand_cards`
--
ALTER TABLE `hand_cards`
  ADD PRIMARY KEY (`player_id`,`room_code`,`number`,`seed`),
  ADD KEY `PLAYER_GAME_code` (`room_code`);

--
-- Indici per le tabelle `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`user_id`,`room_code`),
  ADD KEY `GAME_code` (`room_code`);

--
-- Indici per le tabelle `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`code`),
  ADD KEY `PLAYER_TURN_ID` (`turn_player_id`);

--
-- Indici per le tabelle `table_cards`
--
ALTER TABLE `table_cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PLAYERS_GAMES_code` (`room_code`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`,`username`) USING BTREE,
  ADD KEY `username` (`username`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `deck`
--
ALTER TABLE `deck`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `table_cards`
--
ALTER TABLE `table_cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1484;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5709;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `deck`
--
ALTER TABLE `deck`
  ADD CONSTRAINT `deck_ibfk_1` FOREIGN KEY (`room_code`) REFERENCES `rooms` (`code`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `hand_cards`
--
ALTER TABLE `hand_cards`
  ADD CONSTRAINT `hand_cards_ibfk_1` FOREIGN KEY (`room_code`) REFERENCES `rooms` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hand_cards_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `players` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `players`
--
ALTER TABLE `players`
  ADD CONSTRAINT `players_ibfk_1` FOREIGN KEY (`room_code`) REFERENCES `rooms` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `players_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`turn_player_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `table_cards`
--
ALTER TABLE `table_cards`
  ADD CONSTRAINT `table_cards_ibfk_2` FOREIGN KEY (`room_code`) REFERENCES `players` (`room_code`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

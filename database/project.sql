-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 17 nov. 2026 à 21:14
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `project`
--

-- --------------------------------------------------------

--
-- Structure de la table `achats`
--

CREATE TABLE `achats` (
  `id` int(11) NOT NULL,
  `date_achat` datetime DEFAULT current_timestamp(),
  `fournisseur_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix_unitaire_ht` float NOT NULL,
  `tva_achat` float NOT NULL,
  `prix_unitaire_ttc` float NOT NULL,
  `prix_total` float NOT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `achats`
--

INSERT INTO `achats` (`id`, `date_achat`, `fournisseur_id`, `produit_id`, `quantite`, `prix_unitaire_ht`, `tva_achat`, `prix_unitaire_ttc`, `prix_total`, `is_active`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '2026-03-28 01:00:29', 1, 1, 2, 3200, 20, 3840, 7680, 0, 'SUPPRIMEE', '2026-03-28 01:00:29', '2026-03-28 01:03:01', '2026-03-28 01:03:01'),
(2, '2026-03-28 01:00:51', 2, 4, 6, 4500, 20, 5400, 32400, 1, 'CONFIRMEE', '2026-03-28 01:00:51', '2026-03-28 01:00:51', NULL),
(3, '2026-03-28 01:01:32', 5, 3, 50, 25, 7, 26.75, 1337.5, 0, 'ANNULEE', '2026-03-28 01:01:32', '2026-03-28 01:03:15', NULL),
(4, '2026-03-28 01:01:56', 6, 6, 4, 1900, 20, 2280, 9120, 1, 'CONFIRMEE', '2026-03-28 01:01:56', '2026-03-28 01:01:56', NULL),
(5, '2026-03-28 01:02:18', 7, 5, 8, 180, 20, 216, 1728, 1, 'CONFIRMEE', '2026-03-28 01:02:18', '2026-03-28 01:02:18', NULL),
(6, '2026-03-28 01:02:45', 2, 2, 3, 2800, 20, 3360, 10080, 1, 'CONFIRMEE', '2026-03-28 01:02:45', '2026-03-28 01:02:45', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(150) NOT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `title`, `description`, `is_active`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Cosmétiques', 'Produits de beauté et soins personnels', 0, 'ARRETE', '2026-03-21 20:11:52', '2026-03-24 18:04:00', '2026-03-24 18:04:00'),
(2, 'Alimentation', 'Produits alimentaires et boissons', 1, 'DISPONIBLE', '2026-03-22 01:18:24', '2026-03-22 01:18:24', NULL),
(3, 'Vêtements', 'Habits pour hommes, femmes et enfants', 1, 'DISPONIBLE', '2026-03-22 01:19:11', '2026-03-22 01:19:11', NULL),
(4, 'Bureautique', 'Matériel de bureau : imprimantes, papiers, stylos', 0, 'SUSPENDU', '2026-03-22 01:19:50', '2026-03-23 17:36:18', NULL),
(5, 'Électroménager', 'Appareils électriques pour la maison', 1, 'DISPONIBLE', '2026-03-22 01:20:30', '2026-03-22 01:20:30', NULL),
(6, 'Technologie', 'Articles liés à la technologie et l\'informatique', 1, 'DISPONIBLE', '2026-03-22 01:20:57', '2026-03-23 03:20:23', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `tel` varchar(255) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `clients`
--

INSERT INTO `clients` (`id`, `firstname`, `lastname`, `email`, `tel`, `adresse`, `is_active`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Salma', 'Zorgui', 'salmazorgui@gamil.com', '+216 56306456', 'Tunis, La Marsa', 1, 'ACTIF', '2026-03-24 00:52:15', '2026-03-24 21:52:44', NULL),
(2, 'Sophie', 'Laurent', 's.laurent@gmail.com', '+33 6 12 34 56 78', 'Paris, 15 Rue de Rivoli', 1, 'ACTIF', '2026-03-24 20:30:22', '2026-03-24 20:30:22', NULL),
(3, 'Mohamed', 'Sassi', 'mohamedsassi@gmail.com', '+216 53255037', 'Sousse, Avenue Habib Bourguiba', 1, 'ACTIF', '2026-03-24 20:32:02', '2026-03-24 20:32:02', NULL),
(4, 'Yassine', 'Mansouri', 'Yassine.mansouri@gmail.com', '+213  5 50 11 22 33', 'Alger, Quartier Hydra', 0, 'SUPPRIMEE', '2026-03-24 20:41:26', '2026-03-24 21:57:48', '2026-03-24 21:57:48'),
(6, 'Youssef', 'Mansouri', 'youssefmansouri@gmail.com', '+216 93001254', 'Gabès, Rue de l\'Oasis', 0, 'BLOQUE', '2026-03-24 21:31:52', '2026-03-24 21:57:20', NULL),
(7, 'Hans', 'Müller', 'hans.müller@gmail.com', '+49 170 1234567', 'Berlin, Alexanderplatz 1', 1, 'ACTIF', '2026-03-24 21:46:35', '2026-03-26 01:29:31', NULL),
(8, 'Amina', 'Idrissi', 'amina.idrissi@gmail.com', '+212 6 61 22 33 44', 'Casablanca, Anfa Place', 1, 'ACTIF', '2026-03-24 21:49:42', '2026-03-26 01:31:23', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `fournisseurs`
--

CREATE TABLE `fournisseurs` (
  `id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `tel` varchar(255) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `fournisseurs`
--

INSERT INTO `fournisseurs` (`id`, `firstname`, `lastname`, `email`, `tel`, `adresse`, `is_active`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Khaled', 'Mansouri', 'khaled.mansouri@gmail.com', '+216 22133445', 'Tunis, Centre Ville, Rue de la Liberté', 1, 'ACTIF', '2026-03-25 00:31:17', '2026-03-25 00:51:35', NULL),
(2, 'Nicolas', 'Moreau', 'n.moreau@gmail.com', '+33 712345678', 'Lyon, 2ème Arrondissement, Place Bellecour', 1, 'ACTIF', '2026-03-25 00:33:18', '2026-03-25 00:33:18', NULL),
(3, 'Mouna', 'Khemiri', 'mouna.khemiri@gmail.com', '+216 55667788', 'Ariana, Ennasr 2, Avenue Hedi Nouira', 0, 'SUPPRIMEE', '2026-03-25 00:34:27', '2026-03-25 00:53:36', '2026-03-25 00:53:36'),
(4, 'Sofiane', 'Belaïdi', 'sofiane.bel@yahoo.dz', '+213 660112233', 'Oran, Front de Mer, Boulevard de l\'ALN', 1, 'ACTIF', '2026-03-25 00:35:50', '2026-03-25 00:35:50', NULL),
(5, 'Omar', 'Al-Fitouri', 'omar.libya@outlook.com', '+218 912233445', 'Tripoli, Place des Martyrs, Rue Omar al-Mokhtar', 1, 'ACTIF', '2026-03-25 00:37:50', '2026-03-25 00:37:50', NULL),
(6, 'Marc', 'Keller', 'm.keller@bluewin.ch', '+41 791234567', 'Genève, Rue du Rhône 12', 1, 'ACTIF', '2026-03-25 00:39:15', '2026-03-25 00:39:15', NULL),
(7, 'Amira', 'Jlassi', 'amira.jlassi@yahoo.fr', '+216 77889900', 'Sousse, Port El Kantaoui', 1, 'ACTIF', '2026-03-25 00:40:31', '2026-03-25 00:40:31', NULL),
(8, 'Nour', 'Ben Amor', 'nour.benamor@gmail.com', '+216 55443322', '', 0, 'BLOQUE', '2026-03-25 00:41:30', '2026-03-25 00:52:57', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `produits`
--

CREATE TABLE `produits` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantite_initial` int(11) NOT NULL,
  `quantite_restant` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `prix_hors_tax` float NOT NULL,
  `prix_ttc` float DEFAULT NULL,
  `tva` float NOT NULL,
  `categorie_id` int(11) NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `produits`
--

INSERT INTO `produits` (`id`, `title`, `description`, `quantite_initial`, `quantite_restant`, `image`, `prix_hors_tax`, `prix_ttc`, `tva`, `categorie_id`, `status`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Laptop Lenovo ThinkPad', 'Ordinateur portable professionnel 16GB RAM SSD 512GB', 25, 3, 'prod_1.jpg', 3200, 3840, 20, 6, 'DISPONIBLE', 1, '2026-03-22 14:15:57', '2026-03-28 01:04:02', NULL),
(2, 'Réfrigérateur Samsung', 'Réfrigérateur double porte 400L', 10, 3, 'prod_2.jpg', 2800, 3360, 20, 5, 'DISPONIBLE', 1, '2026-03-23 04:02:19', '2026-03-28 01:07:17', NULL),
(3, 'Huile d\'olive 1L', 'Huile d\'olive extra vierge tunisienne', 100, 100, 'prod_3.webp', 25, 26.75, 7, 2, 'SUSPENDU', 0, '2026-03-23 04:04:12', '2026-03-28 01:03:15', NULL),
(4, 'Smartphone iPhone 14', 'Téléphone 5G 128 Go écran OLED', 43, 48, 'prod_4.jpg', 4507, 5904.17, 31, 6, 'DISPONIBLE', 1, '2026-03-23 04:25:17', '2026-05-14 14:23:41', NULL),
(5, 'Sneakers Sport Blanc', 'Chaussures sport légères pour marche et entraînement', 40, 48, 'prod_5.jpg', 180, 216, 20, 3, 'ARRETE', 0, '2026-03-23 04:29:23', '2026-03-28 01:02:18', '2026-03-23 17:51:48'),
(6, 'Machine à laver LG', 'lg-machine-à-laver-fh4g6tdy6-8-kg-silver-hublot-1400-tours ', 15, 0, 'prod_6.jpg', 1900, 2280, 20, 5, 'RUPTURE', 0, '2026-03-23 04:37:00', '2026-03-28 01:04:47', NULL),
(7, 'T-Shirt Coton Unisexe', 'T-shirt 100% coton haute qualité', 100, 94, 'prod_7.jpg', 45, 54, 20, 3, 'DISPONIBLE', 1, '2026-03-23 04:39:00', '2026-03-28 00:59:20', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `avatar`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'Sarra', 'khachira', 'sarrakhachira569@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$Tum9lxKiFCKkFIJwDkEoBQ$T4DA9SZ0PXqctKMSJjr79SkFrryCxoxhaHfPKmeCitM', 'admin', 'Sarra.jpg', 1, '2026-05-14 14:22:35', '2026-03-17 12:39:35', '2026-05-14 14:22:35'),
(2, 'Ali', 'khachira', 'alikhachira@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$yLk3ZqwVgtBaC0GIsbaWcg$5KhWzVJvHZRFd2r7w62MkVII/5QyD3vs0sE2XrWJ4cw', 'admin', 'user_2.jpeg', 1, '2026-11-16 22:37:34', '2026-03-17 12:40:04', '2026-11-16 22:37:34'),
(3, 'Mohamed', 'khachira', 'Mohamedkhachira@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$UmotBcAYg5DyXstZCyGEsA$PGGYh8BWYwwWwRGaC/bvCu86ljGVzTyEOpFJWkWNrl0', 'admin', 'Mohamed.jpg', 1, '2026-05-14 14:31:29', '2026-03-17 12:40:17', '2026-05-14 14:31:29'),
(4, 'Amani', 'Khachira', 'amanikhachira@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$jjEmhPB+r3WulZLyvlfKmQ$7uAKMAewIRtbKagJrIh56i4wJmfaCFO3omqjeNZ/vLc', 'admin', 'default.jpg', 0, '2026-03-27 18:06:07', '2026-03-19 18:33:13', '2026-03-27 18:06:07'),
(5, 'Achref', 'Khachira', 'achrefkhachira@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$1br3/h+D0FqLsbZ2DkEoBQ$HNEbiWsWUXG7cUfVtFGZMdj/qZQAEfVUSiuwELa5czA', 'admin', 'Achref.jpeg', 1, '2026-11-21 17:20:36', '2026-11-21 17:20:36', '2026-11-21 17:20:36');

-- --------------------------------------------------------

--
-- Structure de la table `ventes`
--

CREATE TABLE `ventes` (
  `id` int(11) NOT NULL,
  `date_vente` datetime DEFAULT current_timestamp(),
  `client_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix_unitaire_ht` float NOT NULL,
  `tva_vente` float NOT NULL,
  `prix_unitaire_ttc` float NOT NULL,
  `prix_total` float NOT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ventes`
--

INSERT INTO `ventes` (`id`, `date_vente`, `client_id`, `produit_id`, `quantite`, `prix_unitaire_ht`, `tva_vente`, `prix_unitaire_ttc`, `prix_total`, `is_active`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '2026-03-28 00:55:07', 1, 1, 2, 3200, 20, 3840, 7680, 1, 'CONFIRMEE', '2026-03-28 00:55:07', '2026-03-28 00:55:07', NULL),
(2, '2026-03-28 00:55:19', 1, 1, 2, 3200, 20, 3840, 7680, 0, 'SUPPRIMEE', '2026-03-28 00:55:19', '2026-03-28 00:59:04', '2026-03-28 00:59:04'),
(3, '2026-03-28 00:55:57', 2, 2, 1, 2700, 20, 3240, 3240, 1, 'CONFIRMEE', '2026-03-28 00:55:57', '2026-03-28 00:55:57', NULL),
(4, '2026-03-28 00:56:35', 3, 6, 5, 45, 20, 54, 270, 1, 'CONFIRMEE', '2026-03-28 00:56:35', '2026-03-28 00:56:35', NULL),
(5, '2026-03-28 00:57:17', 8, 7, 1, 45, 19, 53.55, 53.55, 0, 'ANNULEE', '2026-03-28 00:57:17', '2026-03-28 00:59:20', NULL),
(6, '2026-03-28 00:57:43', 8, 7, 6, 45, 20, 54, 324, 1, 'CONFIRMEE', '2026-03-28 00:57:43', '2026-03-28 00:57:43', NULL),
(7, '2026-03-28 00:58:29', 1, 1, 10, 3000, 10, 3300, 33000, 1, 'CONFIRMEE', '2026-03-28 00:58:29', '2026-03-28 00:58:29', NULL),
(8, '2026-03-28 00:58:51', 3, 6, 1, 1900, 20, 2280, 2280, 1, 'CONFIRMEE', '2026-03-28 00:58:51', '2026-03-28 00:58:51', NULL),
(9, '2026-03-28 01:04:02', 3, 1, 10, 3200, 20, 3840, 38400, 1, 'CONFIRMEE', '2026-03-28 01:04:02', '2026-03-28 01:04:02', NULL),
(10, '2026-03-28 01:04:47', 7, 6, 13, 1900, 20, 2280, 29640, 1, 'CONFIRMEE', '2026-03-28 01:04:47', '2026-03-28 01:04:47', NULL),
(11, '2026-03-28 01:05:45', 2, 2, 5, 2800, 20, 3360, 16800, 1, 'CONFIRMEE', '2026-03-28 01:05:45', '2026-03-28 01:05:45', NULL),
(12, '2026-03-28 01:06:38', 1, 2, 3, 2800, 20, 3360, 10080, 1, 'CONFIRMEE', '2026-03-28 01:06:38', '2026-03-28 01:06:38', NULL),
(13, '2026-03-28 01:07:17', 8, 2, 1, 2800, 20, 3360, 3360, 1, 'CONFIRMEE', '2026-03-28 01:07:17', '2026-03-28 01:07:17', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `achats`
--
ALTER TABLE `achats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fournisseur_id` (`fournisseur_id`),
  ADD KEY `produit_id` (`produit_id`),
  ADD KEY `ix_achats_id` (`id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_categories_description` (`description`),
  ADD KEY `ix_categories_id` (`id`);

--
-- Index pour la table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_clients_email` (`email`),
  ADD KEY `ix_clients_id` (`id`);

--
-- Index pour la table `fournisseurs`
--
ALTER TABLE `fournisseurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_fournisseurs_email` (`email`),
  ADD KEY `ix_fournisseurs_id` (`id`);

--
-- Index pour la table `produits`
--
ALTER TABLE `produits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categorie_id` (`categorie_id`),
  ADD KEY `ix_produits_id` (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_users_email` (`email`),
  ADD KEY `ix_users_id` (`id`);

--
-- Index pour la table `ventes`
--
ALTER TABLE `ventes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `produit_id` (`produit_id`),
  ADD KEY `ix_ventes_id` (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `achats`
--
ALTER TABLE `achats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `fournisseurs`
--
ALTER TABLE `fournisseurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `produits`
--
ALTER TABLE `produits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `ventes`
--
ALTER TABLE `ventes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `achats`
--
ALTER TABLE `achats`
  ADD CONSTRAINT `achats_ibfk_1` FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseurs` (`id`),
  ADD CONSTRAINT `achats_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`);

--
-- Contraintes pour la table `produits`
--
ALTER TABLE `produits`
  ADD CONSTRAINT `produits_ibfk_1` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`);

--
-- Contraintes pour la table `ventes`
--
ALTER TABLE `ventes`
  ADD CONSTRAINT `ventes_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `ventes_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

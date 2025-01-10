	CREATE TABLE `game_state` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `red_pawns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`red_pawns`)),
 `blue_pawns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`blue_pawns`)),
 `current_turn` int(11) NOT NULL,
 `created_at` datetime DEFAULT current_timestamp(),
 `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
 PRIMARY KEY (`id`)
)

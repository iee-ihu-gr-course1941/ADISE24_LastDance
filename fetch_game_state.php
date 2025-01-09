<?php
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

include "./database/dbconnect.php";

$sql = "SELECT * FROM game_state ORDER BY updated_at DESC LIMIT 1";
$result = mysqli_query($conn, $sql);

if ($result && mysqli_num_rows($result) > 0) {
    $gameState = mysqli_fetch_assoc($result);
    $gameState['red_pawns'] = json_decode($gameState['red_pawns']);
    $gameState['blue_pawns'] = json_decode($gameState['blue_pawns']);
} else {
    $gameState = [
        'red_pawns' => [0, 48],
        'blue_pawns' => [6, 42],
        'current_turn' => 'red',
        'red_score' => 0,
        'blue_score' => 0,
    ];
}

echo json_encode(["success" => true, "game_state" => $gameState]);

mysqli_close($conn);
?> 


<?php
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

include "./database/dbconnect.php";

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['game_state'])) {
    echo json_encode(["success" => false, "error" => "Invalid input data."]);
    exit;
}

$gameState = $data['game_state'];

$redPawns = json_encode($gameState['redPawns']);
$bluePawns = json_encode($gameState['bluePawns']);

$currentTurn = (int) $gameState['currentTurn']; 


$sql = "INSERT INTO game_state (red_pawns, blue_pawns, current_turn) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        red_pawns = ?, 
        blue_pawns = ?, 
        current_turn = ?";

$stmt = mysqli_prepare($conn, $sql);

// Check for errors with statement preparation
if (!$stmt = mysqli_prepare($conn, $sql)) {
    echo json_encode(["success" => false, "error" => "Failed to prepare statement: " . mysqli_error($conn)]);
    exit;
}
// Now bind the parameters. There are 6 parameters in total.
mysqli_stmt_bind_param($stmt, 'ssssss', $redPawns, $bluePawns, $currentTurn, $redPawns, $bluePawns, $currentTurn);

// Execute the query and check if it was successful
if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Error saving data: " . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
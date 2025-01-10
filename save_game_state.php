<?php
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

include "./database/dbconnect.php";

$data = json_decode(file_get_contents('php://input'), true);

// Check if input data is valid
if (!$data || !isset($data['game_state'])) {
    echo json_encode(["success" => false, "error" => "Invalid input data."]);
    exit;
}

$gameState = $data['game_state'];

$redPawns = json_encode($gameState['redPawns']);
$bluePawns = json_encode($gameState['bluePawns']);

$currentTurn = (int)$gameState['currentTurn']; // Ensure it's an integer


// Prepare the SQL query to save the game state
$sql = "INSERT INTO game_state (red_pawns, blue_pawns, current_turn) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        red_pawns = ?, 
        blue_pawns = ?, 
        current_turn = ?";

$stmt = mysqli_prepare($conn, $sql);

// Check for errors with statement preparation
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Failed to prepare statement: " . mysqli_error($conn)]);
    exit;
}

// Bind parameters
// 'sss' -> string for redPawns and bluePawns (encoded JSON), 'i' -> integer for currentTurn
mysqli_stmt_bind_param($stmt, 'sssssi', $redPawns, $bluePawns, $currentTurn, $redPawns, $bluePawns, $currentTurn);

// Execute the query
if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Error saving data: " . mysqli_error($conn)]);
}

// Close the statement and connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>

<?php
header('Content-Type: application/json');

// Enable error reporting to catch PHP issues
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include the existing database connection file
include "./database/dbconnect.php";

// Handle incoming JSON payload
$data = json_decode(file_get_contents('php://input'), true);

// Check if the incoming data is valid
if (!$data || !isset($data['game_state'])) {
    echo json_encode(["success" => false, "error" => "Invalid input data."]);
    exit;
}

// Prepare the game state data
$gameState = $data['game_state'];

// Use json_encode for pawn data, which is already expected to be a JSON array
$redPawns = json_encode($gameState['redPawns']);
$bluePawns = json_encode($gameState['bluePawns']);

// Ensure currentTurn is treated as an integer
$currentTurn = (int) $gameState['currentTurn']; 

// Prepare SQL statement for INSERT/UPDATE
$sql = "INSERT INTO game_state (red_pawns, blue_pawns, current_turn) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        red_pawns = ?, 
        blue_pawns = ?, 
        current_turn = ?";

// Prepare the statement using mysqli_prepare
$stmt = mysqli_prepare($conn, $sql);

// Check for any errors in statement preparation
if ($stmt === false) {
    echo json_encode(["success" => false, "error" => "Failed to prepare statement: " . mysqli_error($conn)]);
    exit;
}

// Bind the parameters: 's' for strings, 'i' for integers
// We bind the same parameters for both the INSERT and UPDATE sections of the query
mysqli_stmt_bind_param($stmt, 'ssiiii', $redPawns, $bluePawns, $currentTurn, $redPawns, $bluePawns, $currentTurn);

// Execute the statement
if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Error saving data: " . mysqli_error($conn)]);
}

// Close the statement and connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>

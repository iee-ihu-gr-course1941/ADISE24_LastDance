function createGameBoard(rows, columns, playerSide) {
  const boardContainer = document.getElementById("game-board");
  if (!boardContainer) return;

  boardContainer.innerHTML = "";
  boardContainer.style.display = "grid";
  boardContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  boardContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  for (let i = 0; i < rows * columns; i++) {
    const cell = document.createElement("div");
    cell.classList.add("game-cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => handleCellClick(cell));
    boardContainer.appendChild(cell);
  }

  const initialState = loadGameState();
  console.log("Initial state loaded:", initialState);
  updateBoardFromState(initialState);
}

// Create a pawn DOM element
function createPawn(color) {
  const pawn = document.createElement("div");
  pawn.classList.add("pawn", color);
  return pawn;
}

// State variables
let selectedCell = null;

// Save the game state to localStorage
function saveGameState(state) {
  localStorage.setItem("gameState", JSON.stringify(state));
}

// Load the game state from localStorage or initialize it
function loadGameState() {
  const defaultState = {
    redPawns: [0, 48],
    bluePawns: [6, 42],
    currentTurn: "red",
    redScore: 0,
    blueScore: 0,
  };

  const savedState = localStorage.getItem("gameState");
  if (!savedState) {
    console.log("No saved game state. Using defaults.");
    return defaultState;
  }

  try {
    return JSON.parse(savedState);
  } catch (error) {
    console.error("Error parsing game state. Using defaults.", error);
    return defaultState;
  }
}

// Update the board based on the game state
// Update the board based on the game state
function updateBoardFromState(gameState) {
  const cells = document.querySelectorAll(".game-cell");

  if (!cells.length) {
    console.error("No game cells found, ensure game board has rendered.");
    return;
  }

  cells.forEach((cell) => (cell.innerHTML = "")); // Clear current pawns

  gameState.redPawns.forEach((index) => {
    const redPawn = createPawn("red");
    cells[index].appendChild(redPawn);
  });

  gameState.bluePawns.forEach((index) => {
    const bluePawn = createPawn("blue");
    cells[index].appendChild(bluePawn);
  });

  // Check if a player has won after the board has been updated
  if (checkWinningConditions(gameState)) {
    return; // Stop if there's a winner
  }

  // Update the UI elements
  const playerTurnElement = document.getElementById("player-turn");
  if (playerTurnElement) {
    playerTurnElement.textContent = `Turn: ${gameState.currentTurn.toUpperCase()}`;
  }

  const redScore = document.getElementById("red-score");
  const blueScore = document.getElementById("blue-score");

  if (redScore && blueScore) {
    redScore.textContent = gameState.redScore;
    blueScore.textContent = gameState.blueScore;
  }
}

// Check if the current player has any legal moves
function hasLegalMoves(playerColor, gameState) {
  const pawns =
    playerColor === "red" ? gameState.redPawns : gameState.bluePawns;
  const columns = 7;

  return pawns.some((index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1], // Orthogonal
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1], // Diagonal
    ];

    return directions.some(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      const newIndex = newRow * columns + newCol;

      return (
        newRow >= 0 &&
        newRow < 7 &&
        newCol >= 0 &&
        newCol < 7 &&
        !gameState.redPawns.includes(newIndex) &&
        !gameState.bluePawns.includes(newIndex)
      );
    });
  });
}

// Function to convert adjacent pawns after a move
function convertAdjacentPawns(destIndex, currentPlayer, gameState) {
  const columns = 7;
  const opponentPlayer = currentPlayer === "red" ? "blue" : "red";

  // Helper function to find adjacent cells
  function getAdjacentIndices(index) {
    const adjacents = [];
    const row = Math.floor(index / columns);
    const col = index % columns;

    const directions = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
      [-1, -1], // Top-left diagonal
      [-1, 1], // Top-right diagonal
      [1, -1], // Bottom-left diagonal
      [1, 1], // Bottom-right diagonal
    ];

    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < 7 && newCol >= 0 && newCol < 7) {
        adjacents.push(newRow * columns + newCol);
      }
    });

    return adjacents;
  }

  // Loop through the adjacent cells of the destination
  const adjacentIndices = getAdjacentIndices(destIndex);
  adjacentIndices.forEach((adjIndex) => {
    const cell = document.querySelector(`[data-index='${adjIndex}']`);
    // Check if the adjacent cell contains an opponent's pawn
    if (
      cell.firstChild &&
      cell.firstChild.classList.contains(opponentPlayer) // Check if the opponent's pawn
    ) {
      // Convert the opponent's pawn to the current player's pawn
      cell.innerHTML = "";
      const newPawn = createPawn(currentPlayer); // Create a new pawn for the current player
      cell.appendChild(newPawn);
    }
  });

  // Update the pawns list after conversion
  gameState.redPawns = updatePawnList("red");
  gameState.bluePawns = updatePawnList("blue");

  // Save the game state after updating
  saveGameState(gameState);
}

let gameOver = false;

// Check if there is a winner based on the game state
function checkWinningConditions(gameState) {
  const totalCells = 7 * 7; // Fixed 7x7 board
  const redPawnsCount = gameState.redPawns.length;
  const bluePawnsCount = gameState.bluePawns.length;

  if (redPawnsCount + bluePawnsCount === totalCells) {
    const winner = redPawnsCount > bluePawnsCount ? "red" : "blue";
    updateScoresAndDisplayWinner(winner);
    gameOver = true; // Set gameOver flag
    disableMoves(); // Prevent further interactions
    return true;
  }

  if (redPawnsCount === 0) {
    updateScoresAndDisplayWinner("blue");
    gameOver = true;
    disableMoves();
    return true;
  }

  if (bluePawnsCount === 0) {
    updateScoresAndDisplayWinner("red");
    gameOver = true;
    disableMoves();
    return true;
  }

  return false;
}

// Update the UI with the score and display the winner
function updateScoresAndDisplayWinner(winner) {
  const redScoreElement = document.getElementById("red-score");
  const blueScoreElement = document.getElementById("blue-score");

  // Update scores and display winner message
  if (winner === "red") {
    alert("Red wins the game! Congratulations!");
    redScoreElement.textContent = parseInt(redScoreElement.textContent) + 1;
  } else if (winner === "blue") {
    alert("Blue wins the game! Congratulations!");
    blueScoreElement.textContent = parseInt(blueScoreElement.textContent) + 1;
  }

  // Save updated scores in localStorage
  const redScore = parseInt(redScoreElement.textContent);
  const blueScore = parseInt(blueScoreElement.textContent);

  // Store in localStorage
  localStorage.setItem("redScore", redScore);
  localStorage.setItem("blueScore", blueScore);

  disableMoves();
}

// Function to disable further moves after the game ends
function disableMoves() {
  const cells = document.querySelectorAll(".game-cell");
  cells.forEach((cell) => cell.removeEventListener("click", handleCellClick));
}

function resetScores() {
  // Reset scores in localStorage
  localStorage.setItem("redScore", 0);
  localStorage.setItem("blueScore", 0);

  // Update the score display elements
  const redScoreElement = document.getElementById("red-score");
  const blueScoreElement = document.getElementById("blue-score");

  redScoreElement.textContent = 0;
  blueScoreElement.textContent = 0;

  // Display reset confirmation
  alert("Scores have been reset to 0.");
}

function handleCellClick(cell) {
  if (gameOver) {
    alert("Game over! Please reset to start a new game.");
    return;
  }

  const gameState = loadGameState();
  saveGameStateToAPI(gameState);
  const index = parseInt(cell.dataset.index, 10);

  // Ensure the game is not over before proceeding
  if (checkWinningConditions(gameState)) {
    return; // Exit if the game is over
  }

  if (selectedCell === null) {
    // Select a pawn if it matches the current player's side
    if (
      cell.firstChild &&
      cell.firstChild.classList.contains(gameState.currentTurn) &&
      cell.firstChild.classList.contains(playerSide)
    ) {
      selectedCell = cell;
      cell.classList.add("selected");
    } else {
      alert(
        `It's ${gameState.currentTurn.toUpperCase()}'s turn! Select your valid piece.`
      );
    }
  } else {
    const sourceIndex = parseInt(selectedCell.dataset.index, 10);
    const distance = calculateDistance(sourceIndex, index);

    if (
      selectedCell.firstChild &&
      selectedCell.firstChild.classList.contains(playerSide) &&
      !cell.firstChild // Ensure the destination is empty
    ) {
      if (distance === 1) {
        // Adjacent move
        const newPawn = createPawn(gameState.currentTurn);
        cell.appendChild(newPawn);
      } else if (distance === 2) {
        // Two-space move
        cell.appendChild(selectedCell.firstChild);
      } else {
        alert("Invalid move! You can only move one or two spaces.");
        clearSelection();
        return;
      }

      // Convert adjacent opponent pawns (after move)
      convertAdjacentPawns(index, gameState.currentTurn, gameState);

      // Check for any winning conditions after the move
      if (checkWinningConditions(gameState)) {
        return; // Exit if the game is over
      }

      // Switch turns
      gameState.currentTurn = gameState.currentTurn === "red" ? "blue" : "red";

      // Check if the next player has legal moves
      if (!hasLegalMoves(gameState.currentTurn, gameState)) {
        alert(
          `${gameState.currentTurn.toUpperCase()} has no legal moves and passes the turn.`
        );
        gameState.currentTurn =
          gameState.currentTurn === "red" ? "blue" : "red"; // Pass the turn if no moves are available
      }

      // Save the updated state and update the board
      saveGameState(gameState);
      updateBoardFromState(gameState);
      clearSelection();
    } else {
      alert("Invalid move or destination occupied!");
      clearSelection();
    }
  }
}

// Calculate the distance between two cell indices
function calculateDistance(sourceIndex, destIndex) {
  const columns = 7; // Fixed board size of 7x7
  const rowDiff = Math.abs(
    Math.floor(sourceIndex / columns) - Math.floor(destIndex / columns)
  );
  const colDiff = Math.abs((sourceIndex % columns) - (destIndex % columns));
  return Math.max(rowDiff, colDiff); // Diagonal and orthogonal distances are equivalent
}

// Update the pawn positions in the game state
function updatePawnList(color) {
  const cells = document.querySelectorAll(".game-cell");
  const positions = [];
  cells.forEach((cell, index) => {
    if (cell.firstChild && cell.firstChild.classList.contains(color)) {
      positions.push(index);
    }
  });
  return positions;
}

// Clear the selected cell state
function clearSelection() {
  if (selectedCell) {
    selectedCell.classList.remove("selected");
    selectedCell = null;
  }
}

function loadGameStateFromAPI() {
  fetch("fetch_game_state.php")
    .then((response) => {
      // Check if response is not OK (e.g., 404 or 500 errors)
      if (!response.ok) {
        throw new Error("Failed to fetch game state");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        console.log("Game state loaded:", data.game_state);
        updateBoardFromState(data.game_state);
      } else {
        console.error("Error loading game state:", data.error);
        const initialState = loadGameState(); // Fallback to localStorage
        updateBoardFromState(initialState);
      }
    })
    .catch((error) => {
      console.error("Error fetching game state:", error);
      const initialState = loadGameState(); // Fallback to localStorage
      updateBoardFromState(initialState);
    });
}

function saveGameStateToAPI(gameState) {
  console.log("Saving game state:", gameState); // Log game state
  fetch("save_game_state.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ game_state: gameState }),
  })
    .then((response) => {
      // Check if response is not OK (e.g., 404 or 500 errors)
      if (!response.ok) {
        throw new Error("Failed to save game state");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        console.log("Game state saved successfully");
      } else {
        console.error("Error saving game state:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error saving game state:", error);
    });
}

// Listen for changes in localStorage to synchronize the game state
window.addEventListener("storage", (event) => {
  if (event.key === "gameState") {
    if (!event.newValue) {
      console.log("Clearing game state from other tabs...");
      const defaultState = loadGameState();
      updateBoardFromState(defaultState);
    } else {
      const newState = JSON.parse(event.newValue);
      console.log("Game state change detected:", newState);
      updateBoardFromState(newState);
    }
  }

  if (event.key === "gameOver") {
    gameOver = event.newValue === "true";
    if (gameOver) {
      disableMoves();
      alert("Game over! Reload to start a new game.");
    }
  }

  if (event.key === "redScore" || event.key === "blueScore") {
    // Update displayed scores when localStorage changes
    const redScore = localStorage.getItem("redScore") || 0;
    const blueScore = localStorage.getItem("blueScore") || 0;

    document.getElementById("red-score").textContent = redScore;
    document.getElementById("blue-score").textContent = blueScore;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const resetButton = document.getElementById("reset-game");
  const resetScoresButton = document.getElementById("score-zero");

  // Load the scores from localStorage
  const savedRedScore = localStorage.getItem("redScore");
  const savedBlueScore = localStorage.getItem("blueScore");

  if (savedRedScore !== null) {
    document.getElementById("red-score").textContent = savedRedScore;
  }

  if (savedBlueScore !== null) {
    document.getElementById("blue-score").textContent = savedBlueScore;
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      console.log("Resetting game state...");
      localStorage.removeItem("gameState");
      alert("Game state cleared. Reloading the game.");
      location.reload();
    });
  } else {
    console.error("Reset button not found in DOM.");
  }

  // Reset Scores functionality
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      console.log("Resetting game state...");
      localStorage.removeItem("gameState");
      alert("Game state cleared. Reloading the game.");
      location.reload();
    });
  } else {
    console.error("Reset button not found in DOM.");
  }

  // Reset Scores functionality
  if (resetScoresButton) {
    resetScoresButton.addEventListener("click", resetScores);
  } else {
    console.error("Reset Scores button not found in DOM.");
  }

  // Setup player side
  const urlParams = new URLSearchParams(window.location.search);
  playerSide = urlParams.get("side");

  if (!playerSide) {
    alert("No side selected or invalid session! Redirecting...");
    window.location.href = "player.html";
    return;
  }

  console.log(`Playing as: ${playerSide.toUpperCase()}`);
  document.getElementById(
    "player-side"
  ).textContent = `Playing as: ${playerSide.toUpperCase()}`;

  createGameBoard(7, 7, playerSide); // Create the game board
  loadGameStateFromAPI();
  const gameState = loadGameState();
  updateBoardFromState(gameState);
});

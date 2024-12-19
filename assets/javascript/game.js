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

// Load the game state from localStorage or initialize it
function loadGameState() {
  const defaultState = {
    redPawns: [0, 48],
    bluePawns: [6, 42],
    currentTurn: "red",
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

// Save the game state to localStorage
function saveGameState(state) {
  localStorage.setItem("gameState", JSON.stringify(state));
}

// Update the board based on the game state
function updateBoardFromState(gameState) {
  const cells = document.querySelectorAll(".game-cell");

  if (!cells.length) {
    console.error("No game cells found, ensure game board has rendered.");
    return;
  }

  cells.forEach((cell) => (cell.innerHTML = ""));

  gameState.redPawns.forEach((index) => {
    const redPawn = createPawn("red");
    cells[index].appendChild(redPawn);
  });

  gameState.bluePawns.forEach((index) => {
    const bluePawn = createPawn("blue");
    cells[index].appendChild(bluePawn);
  });

  console.log("Finding player-turn element...");
  const playerTurnElement = document.getElementById("player-turn");
  if (playerTurnElement) {
    playerTurnElement.textContent = `Turn: ${gameState.currentTurn.toUpperCase()}`;
  } else {
    console.warn(
      "Ensure there is an element with id='player-turn' in your HTML."
    );
  }
}

let playerSide;

// Convert all adjacent opponent pawns after a move
function convertAdjacentPawns(destIndex, currentPlayer, gameState) {
  const columns = 7; // Fixed board size: 7x7 grid
  const opponentPlayer = currentPlayer === "red" ? "blue" : "red";

  // Helper function to find adjacent cell indices
  function getAdjacentIndices(index) {
    const adjacents = [];
    const row = Math.floor(index / columns);
    const col = index % columns;

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1], // Orthogonal directions
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1], // Diagonal directions
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

  // Get adjacent cells
  const adjacentIndices = getAdjacentIndices(destIndex);

  // Convert adjacent opponent pawns
  adjacentIndices.forEach((adjIndex) => {
    const cell = document.querySelector(`[data-index='${adjIndex}']`);
    if (cell.firstChild && cell.firstChild.classList.contains(opponentPlayer)) {
      // Replace opponent pawn with current player's pawn
      cell.innerHTML = ""; // Clear existing pawn
      const newPawn = createPawn(currentPlayer); // New pawn for current player
      cell.appendChild(newPawn);
    }
  });

  // Update game state after conversions
  gameState.redPawns = updatePawnList("red");
  gameState.bluePawns = updatePawnList("blue");
  saveGameState(gameState);
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

// Updated handleCellClick to include pawn conversions and passing turns
function handleCellClick(cell) {
  const gameState = loadGameState();
  const index = parseInt(cell.dataset.index, 10);

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
      !cell.firstChild // Ensure destination is empty
    ) {
      if (distance === 1) {
        // Adjacent move: Duplicate pawn
        const newPawn = createPawn(gameState.currentTurn);
        cell.appendChild(newPawn);
      } else if (distance === 2) {
        // Two-space move: Move pawn
        cell.appendChild(selectedCell.firstChild);
      } else {
        alert("Invalid move! You can only move one or two spaces.");
        clearSelection();
        return;
      }

      // Convert adjacent pawns
      convertAdjacentPawns(index, gameState.currentTurn, gameState);

      // Check if the next player has legal moves
      gameState.currentTurn = gameState.currentTurn === "red" ? "blue" : "red";
      if (!hasLegalMoves(gameState.currentTurn, gameState)) {
        alert(
          `${gameState.currentTurn.toUpperCase()} has no legal moves and passes the turn.`
        );
        // Skip turn if no moves available
        gameState.currentTurn =
          gameState.currentTurn === "red" ? "blue" : "red";
      }

      // Save and update game state
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

// Listen for changes in localStorage to synchronize the game state
window.addEventListener("storage", (event) => {
  if (event.key === "gameState") {
    if (!event.newValue) {
      console.log("Clearing game state from other tabs...");
      const defaultState = {
        redPawns: [0, 48],
        bluePawns: [6, 42],
        currentTurn: "red",
      };
      updateBoardFromState(defaultState);
    } else {
      const newState = JSON.parse(event.newValue);
      console.log("Game state change detected:", newState);
      updateBoardFromState(newState);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const resetButton = document.getElementById("reset-game");

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

  createGameBoard(7, 7, playerSide);
});

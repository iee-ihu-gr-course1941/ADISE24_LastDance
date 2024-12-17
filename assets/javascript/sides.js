// Clear sides when page reloads if both sides are already chosen
window.onload = () => {
  const redSide = localStorage.getItem("redSide");
  const blueSide = localStorage.getItem("blueSide");

  if (redSide || blueSide) {
    console.log("Sides are already selected:", redSide, blueSide);

    // Optionally, ask the user to reset the sides (you can adjust this based on your needs)
    const reset = confirm(
      "Sides are already selected. Do you want to reset the session?"
    );
    if (reset) {
      // Reset sides in localStorage
      localStorage.removeItem("redSide");
      localStorage.removeItem("blueSide");
      console.log("Sides have been reset.");
    } else {
      console.log("Sides not reset. Proceeding with current session.");
    }
  }
};

// Event handlers for side buttons
document.getElementById("red-side").onclick = () => selectSide("red");
document.getElementById("blue-side").onclick = () => selectSide("blue");

function selectSide(side) {
  // Check localStorage for the selected side
  const sideKey = `${side}Side`; // "redSide" or "blueSide"
  const existingPlayer = localStorage.getItem(sideKey);

  if (existingPlayer) {
    // Side already taken
    alert(`${side.toUpperCase()} side is already taken by ${existingPlayer}!`);
  } else {
    // Assign current player to the side (no dynamic player name)
    const playerName = "Player"; // No dynamic name, just "Player" for both sides
    localStorage.setItem(sideKey, playerName);

    // Open game.html in a new window with the selected side
    const gameWindow = window.open(`game.html?side=${side}`, "_blank");

    if (!gameWindow) {
      alert(
        "Unable to open the game window. Please check your browser settings."
      );
    } else {
      console.log(`Opened ${side.toUpperCase()} side in a new window.`);
    }
  }
}

<?php
session_start();
if (isset($_SESSION['id']) && isset($_SESSION['user_name'])){}
else{
    header("Location: index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GAME RULES</title>
    <link rel="stylesheet" href="./assets/css/style.css" />
  </head>
  <body>
    <div class="rules-page">
      <div class="container">
        <div class="description">
          <h1>Rules</h1>
          <ul>
            <li>
              Each player begins with two pieces: red for the first player and
              blue for the second player.
            </li>
            <li>
              The game starts with four pieces positioned in the board’s four
              corners. Red always moves first.:
              <ul>
                <li>
                  Red pieces are in the top-left and bottom-right corners.
                </li>
                <li>
                  Blue pieces are in the top-right and bottom-left corners.
                </li>
              </ul>
            </li>
            <li>
              During their turn, players may move one of their pieces either one
              or two spaces in any direction (vertically, horizontally, or
              diagonally).
            </li>
            <li>
              A move to a square two spaces away diagonally is allowed, as
              diagonal distances are equivalent to orthogonal distances.
            </li>
            <li>
              If a piece moves to an adjacent square:
              <ul>
                <li>
                  A new piece is created on the square the piece departed from.
                </li>
              </ul>
            </li>
            <li>
              If a piece moves to a square that is two spaces away:
              <ul>
                <li>
                  The original piece moves directly to the destination square,
                  leaving the departure square empty.
                </li>
              </ul>
            </li>
            <li>
              After a move, any of the opponent’s pieces that are adjacent to
              the destination square are converted to the moving player's color.
            </li>
            <li>
              A player must make a move if a legal move is available. If no
              legal move is possible, the player must pass.
            </li>
            <li>
              The game ends when all squares are filled or when one player has
              no remaining pieces.
            </li>
            <li>
              The player with the most pieces on the board at the end wins the
              game.
            </li>
            <li>
              A draw may occur when the board has an even number of squares,
              either due to non-playable squares or nonstandard board sizes with
              an even number of squares.
            </li>
          </ul>
        </div>
      </div>
      <button
        class="description-button button"
        onclick="window.location.href='./player.html';"
      >
        PLAY THE GAME
      </button>
      <a href="logout.php" class="description-logout">Logout</a>
    </div>
  </body>
</html>


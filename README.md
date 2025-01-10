# Attax Game 

 

## Overview 

Welcome to **Attax**, a strategic two-player game developed as part of our semester project for the International Hellenic University of Sindos. This collaborative effort by Konstantinos Sioulas and Konstantinos Smaragdas brings you an engaging Web-based game. Players can select their side (red or blue) and compete in a turn-based battle. With  API integration, the game ensures state persistence, allowing players to resume their gameplay seamlessly. 

 

--- 

 

## Game Features 

- **Dynamic Game Board**: A 7x7 grid dynamically created at the start of each game. 

- **Score Tracking**: The scores of both players are tracked and updated in real-time. 

- **Two-Player Gameplay**: Select your side (red or blue) and compete in a turn-based strategic battle. 

- **Persistent Sessions**: Save and restore game state across sessions using PHP and localStorage. 

- **Minimalistic UI**: Focused on delivering a user-friendly and distraction-free gaming experience. 

 

--- 

 

## Technologies Used 

- **HTML**: Structures and layouts the game interface. 

- **CSS**: Styles game elements for a polished and intuitive design. 

- **JavaScript**: Powers game logic, side selection, and user interactions. 

- **PHP**: Handles server-side session management via API integration and login system. 

- **AJAX and JQuery**: Making asynchronous requests to fetch and save game state.

- **MySQL**: Database containing the schemas of the user and game state.



--- 

 

## API Integration 

The API manages session data and game state persistence efficiently, enabling seamless gameplay. 

 

### Key Features of the API 

- **Session Management**: Automatically restores a player's side upon reload. 

- **Data Persistence**: Maintains game state even if the browser is closed. 

- **File Handling**: Stores session data in an easily retrievable JSON format. 

 

--- 

 

## How to Play 

1. **Select a Side**: Choose either the red or blue side. 

2. **Make a Move**: Click your pawn, then move to an adjacent empty square. 

3. **Capture Pawns**: Convert adjacent opponent pawns to your color. 

4. **Win the Game**: Capture all opponent pawns. 

 

--- 

 

## Game Rules 

- Each player starts with **2 pawns** placed at opposite corners of the board. 

- Players alternate turns. 

- Pawns can move: 

  - One or two spaces adjacent to their starting cell. 

- After moving: 

  - Adjacent opponent pawns are converted to your color. 

- Winning: 

  - The game ends when a player captures all opponent pawns or which plays has the higher number of pawns at th end.  

 

--- 

 

## Authors 

- **Konstantinos Sioulas**   

- **Konstantinos Smaragdas** 

 

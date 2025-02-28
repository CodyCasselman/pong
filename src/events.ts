import { Game } from "./classes/game";
import { PADDLE_HEIGHT, PADDLE_SPEED } from "./constants";
import { GameState } from "./types";
import { drawMenu, menuActions, moveMenuCursor } from "./ui/menu";

// destructuring the game instance
const game = Game.getInstance();
//STINKY: CLASS ALSO DIRECTLY HANDLES PLAYER MOVEMENTS
document.addEventListener("mousemove", function (event: MouseEvent) {
  // Move player1 paddle
  game.player1.y = event.clientY - PADDLE_HEIGHT / 2;
});

document.addEventListener("touchmove", function (event: TouchEvent) {
  // Move player1 paddle
  game.player1.y = event.touches[0].clientY - PADDLE_HEIGHT / 2;
});

document.addEventListener("touchstart", function (_event: TouchEvent) {
  // Start a new game loop
  game.newGame();
});

document.addEventListener("click", function (_event: Event) {
  // Start a new game loop
  game.newGame();
});
//STINKY: UNCLEAR METHODS AND LONG METHOD
// Add event listeners for paddle movement
document.addEventListener("keydown", function (event: KeyboardEvent) {
  handleMovement(event); 

  if (event.code === "Space" && game.gameState === GameState.menu) {
    // Start a new game loop
    game.newGame();
  } else if (event.code === "Escape") {
    // Draw the menu
    console.log("ESCAPE");
    drawMenu();
  } else if (event.code === "Enter" && game.gameState === GameState.menu) {
    // If the Enter key is pressed in menu, do something based on the selected menu option
    menuActions();
  }
});
//REFACTOR
const handleMovement = (event: KeyboardEvent): void =>{
  //Moving Player 1
  if (event.code === "KeyW") {
    game.player1.velocityY = -PADDLE_SPEED;
  } else if (event.code === "KeyS") {
    game.player1.velocityY = PADDLE_SPEED;
  } 
  //Moving Player 2
  else if (event.code === "ArrowUp") {
    if (game.gameState === GameState.menu) {
      event.preventDefault();
      moveMenuCursor("up");
    }
    // Move player2 up
    game.player2.velocityY = -PADDLE_SPEED;
  } else if (event.code === "ArrowDown") {
    if (game.gameState === GameState.menu) {
      event.preventDefault();
      moveMenuCursor("down");
    }
    // Move player2 down
    game.player2.velocityY = PADDLE_SPEED;
  }
}

// Stop the player from moving
document.addEventListener("keyup", function (event: KeyboardEvent) {
  // Player 1 controls
  if (event.code === "KeyW" || event.code === "KeyS") {
    // Stop player1 movement
    game.player1.velocityY = 0;
  }
  // Player 2 controls
  else if (event.code === "ArrowUp" || event.code === "ArrowDown") {
    // Stop player2 movement
    game.player2.velocityY = 0;
  }
});

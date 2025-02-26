import { Game } from "./classes/game";
import { PADDLE_HEIGHT, PADDLE_SPEED } from "./constants";
import { GameState } from "./types";
import { drawMenu, menuActions, menuCursorDown, menuCursorUp } from "./ui/menu";

// destructuring the game instance
const game = Game.getInstance();

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
//UNCLEAR METHODS
// Add event listeners for paddle movement
document.addEventListener("keydown", function (event: KeyboardEvent) {
  if (event.code === "KeyW") {
    // Move player1 up
    game.player1.velocityY = -PADDLE_SPEED;
  } else if (event.code === "KeyS") {
    // Move player1 down
    game.player1.velocityY = PADDLE_SPEED;
  } else if (event.code === "ArrowUp") {
    if (game.gameState === GameState.menu) {
      event.preventDefault();
      menuCursorUp();
    }
    // Move player2 up
    game.player2.velocityY = -PADDLE_SPEED;
  } else if (event.code === "ArrowDown") {
    if (game.gameState === GameState.menu) {
      event.preventDefault();
      menuCursorDown();
    }
    // Move player2 down
    game.player2.velocityY = PADDLE_SPEED;
  } else if (event.code === "Space" && game.gameState === GameState.menu) {
    // Start a new game loop
    game.newGame();
  } else if (event.code === "Escape") {
    // Draw the menu
    drawMenu();
  } else if (event.code === "Enter" && game.gameState === GameState.menu) {
    // If the Enter key is pressed in menu, do something based on the selected menu option
    menuActions();
  }
});

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

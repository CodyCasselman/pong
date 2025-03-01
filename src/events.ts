import { Game } from "./classes/game";
import { PADDLE_HEIGHT, PADDLE_SPEED } from "./constants";
import { GameState } from "./types";
import { drawMenu, menuActions, moveMenuCursor } from "./ui/menu";
import { Player } from "./classes/player";

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

document.addEventListener("keydown", function (event: KeyboardEvent) {
  handleMovement(event); 

  if(game.gameState === GameState.menu){
    if (event.code === "Space") {
      // Start a new game loop
      game.newGame();
    } 
    else if (event.code === "Enter") {
      // If the Enter key is pressed in menu, do something based on the selected menu option
      menuActions();
    }
  }
  else if (event.code === "Escape") {
    // Draw the menu
    console.log("ESCAPE");
    drawMenu();
  } 
  
});

//REFACTOR
const handleMovement = (event: KeyboardEvent): void =>{
  //Handling Key Input
  if (event.code === "KeyW" || event.code ==="KeyS") {
    let paddleOneSpeed = (event.code === "KeyW" ? -PADDLE_SPEED : PADDLE_SPEED);
    movePlayer(game.player1, paddleOneSpeed);
  }
  //Handling arrow input
  else if (event.code === "ArrowUp" || event.code === "ArrowDown") {
    let direction: string = (event.code === "ArrowUp" ? "up" : "down");
    let paddleTwoSpeed: number = (event.code === "ArrowUp" ? -PADDLE_SPEED : PADDLE_SPEED);
    if(game.gameState === GameState.menu){
      event.preventDefault
      moveMenuCursor(direction)
    }
    movePlayer(game.player2, paddleTwoSpeed);
  }
}

const movePlayer = (player: Player, speed: number): void => {
  player.velocityY = speed;
}



// Stop the player from moving
document.addEventListener("keyup", function (event: KeyboardEvent) {
  // Player 1 controls
  if (event.code === "KeyW" || event.code === "KeyS") {
    // Stop player1 movement
    movePlayer(game.player1, 0);
  }
  // Player 2 controls
  else if (event.code === "ArrowUp" || event.code === "ArrowDown") {
    // Stop player2 movement
    movePlayer(game.player2, 0);
  }
});

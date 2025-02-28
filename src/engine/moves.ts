import { Ball } from "../classes/ball";
import { AI_LEVEL, canvas } from "../constants";
import { Player } from "../classes/player";
import { resetBall } from "../reset";
import { GameState } from "../types";

//STINKY: LONG METHOD
function moveBall(
  ball: Ball,
  player1: Player,
  player2: Player,
  gameState: GameState
) {
  // Move the ball
  // Add a random sign to the ball's velocity
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // Bounce the ball off the top and bottom walls
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }
  // Bounce the ball off the left and right walls, and update scores
  if (ball.x + ball.radius > canvas.width) {
    recordScore(ball, player1, gameState);
  } else if (ball.x - ball.radius < 0) {
    recordScore(ball, player2, gameState)
  }
}

//REFACTOR:
const recordScore = (ball: Ball, player: Player, gameState: GameState): void => {
    //Bounce the ball off of the wall, update the scoring players score
    ball.velocityX = -ball.velocityX;
    player.score++;
    gameState = GameState.score;
    resetBall(ball);
}


const movePaddles = (ball: Ball, player1: Player, player2: Player): void => {
  // Move player1
  movePaddle(player1);
  // if ai is enabled, move the paddle to the ball
  if (player2.ai) {
    player2.y = ball.y - (player2.height / 2) * AI_LEVEL;
  } else {
    // Move player2
    movePaddle(player2);
  }
};

//STINKY: POOR METHOD NAME
const movePaddle = (player: Player): void => {
  if (
    player.y + player.velocityY > 0 &&
    player.y + player.height + player.velocityY < canvas.height
  ) {
    player.y += player.velocityY;
  }
};

export { moveBall, movePaddles };

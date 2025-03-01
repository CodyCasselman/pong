import { Ball } from "../classes/ball";
import { AI_LEVEL, canvas } from "../constants";
import { Player } from "../classes/player";
import { resetBall } from "../reset";
import { BallAndPlayers, GameState } from "../types";

function moveBall(
  {ball, player1, player2, gameState}: BallAndPlayers & {gameState: GameState}
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

const recordScore = (ball: Ball, player: Player, gameState: GameState): void => {
    //Bounce the ball off of the wall, update the scoring players score
    ball.velocityX = -ball.velocityX;
    player.score++;
    gameState = GameState.score;
    resetBall(ball);
}

const movePaddles = ({ball, player1, player2}:  BallAndPlayers): void => {
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

const movePaddle = (player: Player): void => {
  let deltaPlayer = player.y + player.velocityY;
  if (
    deltaPlayer > 0 &&
    deltaPlayer + player.height < canvas.height
  ) {
    player.y = deltaPlayer;
  }
};

export { moveBall, movePaddles };

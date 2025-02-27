import { Ball } from "./classes/ball";
import { BALL_SPEED, PADDLE_HEIGHT, canvas } from "./constants";
import { PlayersAndWinner, Players } from "./types";
//STINKY: CLASS DOESNT DO MUCH
const resetScores = (playersAndWinner: PlayersAndWinner) => {
  // destructure the args
  let { player1, player2, winner } = playersAndWinner;

  // reset scores
  player1.score = 0;
  player2.score = 0;

  // reset winner
  winner = null;
};

const resetBall = (ball: Ball): void => {
  // Move the ball to the center of the canvas
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  // Reset the ball's speed
  ball.speed = BALL_SPEED;

  // Reverse the ball's direction
  ball.velocityX = -ball.velocityX;
};

const resetPaddle = (players: Players): void => {
  // destructure the args
  let { player1, player2 } = players;
  player1.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
  player2.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
};

export { resetScores, resetBall, resetPaddle };

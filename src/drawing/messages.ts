import { Player } from "../classes/player";
import { canvas, DEFAULT_COLOR, GAME_FONT_FAMILY } from "../constants";
import { drawText, clearCanvas } from "./draw";
//EXCESSIVE USE OF CONST
const showNewGameMessage = (): void => {
  const text = "Press Space to start a new game or Esc to quit";
  const x = canvas.width / 2;
  const y = canvas.height / 2 + 100;
  const color = DEFAULT_COLOR;
  const fontFamily = GAME_FONT_FAMILY;
  const fontSize = 16;
  const textAlign = "center";
  if (canvas && canvas.width && canvas.height) {
    drawText({ text, x, y, color, fontFamily, fontSize, textAlign });
  }
};

const showGameOverMessage = (winner: Player): void => {
  clearCanvas();

  const messageWidth = canvas.width / 2;
  const messageHeight = canvas.height / 2;

  // draw game over message
  drawText({
    text: "Game Over",
    x: messageWidth,
    y: messageHeight - 100,
    fontSize: 48,
  });

  // draw winner message
  drawText({
    text: `${winner.toString()} wins`,
    x: messageWidth,
    y: messageHeight,
    fontSize: 32,
  });

  // draw new game message
  showNewGameMessage();
};

// Draw the score for both players
const showScore = (player1Score: number, player2Score: number): void => {
  const leftPlayerScorePosition = canvas.width / 4;
  const rightPlayerScorePosition = (canvas.width / 4) * 3;
  const y = canvas.height / 5;
  const fontSize = 120;

  // Draw player 1's score
  drawText({
    text: player1Score.toString(),
    x: leftPlayerScorePosition,
    y,
    fontSize,
  });

  // Draw player 2's score
  drawText({
    text: player2Score.toString(),
    x: rightPlayerScorePosition,
    y,
    fontSize,
  });
};

export { showGameOverMessage, showNewGameMessage, showScore };

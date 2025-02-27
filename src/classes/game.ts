import {
  canvas,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  DEFAULT_COLOR,
  BALL_SPEED,
  WINNING_SCORE,
} from "../constants";
import { clearCanvas, drawElements } from "../drawing/draw";
import { showGameOverMessage, showScore } from "../drawing/messages";
import { checkCollisions } from "../engine/collisions";
import { moveBall, movePaddles } from "../engine/moves";
import { resetScores, resetBall, resetPaddle } from "../reset";
import { GameState } from "../types";
import { Ball } from "./ball";
import { Player } from "./player";

export class Game {
  players: number = 1;
  winner: Player | null;
  player1: Player;
  player2: Player;
  ball: Ball;
  gameState: GameState;

  private static instance: Game;

  constructor() {
    this.winner = null;
    this.player1 = new Player(
      "Player 1",
      0,
      canvas.height / 2 - PADDLE_HEIGHT / 2,
      PADDLE_HEIGHT,
      PADDLE_WIDTH,
      0,
      DEFAULT_COLOR
    );
    this.player2 = new Player(
      this.getPlayer2Name(),
      canvas.width - PADDLE_WIDTH,
      canvas.height / 2 - PADDLE_HEIGHT / 2,
      PADDLE_HEIGHT,
      PADDLE_WIDTH,
      0,
      DEFAULT_COLOR,
      this.getAI()
    );
    this.ball = new Ball(
      canvas.width / 2,
      canvas.height / 2,
      BALL_SPEED,
      BALL_SPEED,
      BALL_SPEED,
      DEFAULT_COLOR
    );
    this.gameState = GameState.menu;
  }

  static getInstance() {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  setPlayers(players: number) {
    this.players = players;
    this.player2.ai = this.getAI(); //STINKY: No need for a method call here
    this.player2.name = this.getPlayer2Name();
  }
  //DUPLICATE CODE ISH
  getPlayer2Name(): string {
    return this.players > 1 ? "Player 2" : "Computer";
  }

  getAI(): boolean {
    return this.players > 1 ? false : true;
  }

  newGame() {
    //STINKY: POINTLESS BOOLEAN
    if (
      this.gameState === GameState.menu ||
      this.gameState === GameState.gameOver
    ) {
      resetScores({
        player1: this.player1,
        player2: this.player2,
        winner: this.winner,
      });
      this.gameState = GameState.start;
      resetBall(this.ball);
      resetPaddle({ player1: this.player1, player2: this.player2 });
    }
    requestAnimationFrame(this.update.bind(this));
  }

  //UPDATE DOES TOO MUCH
  update() {
    this.gameOver(); //LACK OF COMMENTS
    if (this.gameState === "gameOver") {
      showGameOverMessage(this.winner as Player);
      this.gameState = GameState.menu;
      return; // Exit the game loop if the game is over
    }
    clearCanvas();
    drawElements({ //STINKY: TOO MANY PARAMETERS. CAN BE TURNED INTO OBJECTS
      ball: this.ball,
      player1: this.player1,
      player2: this.player2,
    });
    moveBall(this.ball, this.player1, this.player2, this.gameState);
    movePaddles(this.ball, this.player1, this.player2);
    checkCollisions({
      ball: this.ball,
      player1: this.player1,
      player2: this.player2,
    });
    showScore(this.player1.score, this.player2.score);

    requestAnimationFrame(this.update.bind(this));
  }
  //UNCLEAR METHOD NAME AND FUNCTION
  gameOver() {
    if (
      //STINKY
      this.player1.score === WINNING_SCORE ||
      this.player2.score === WINNING_SCORE
    ) {
      
      this.gameState = GameState.gameOver;
      //STINKY
      this.winner =
        this.player1.score > this.player2.score ? this.player1 : this.player2;
    }
  }
}

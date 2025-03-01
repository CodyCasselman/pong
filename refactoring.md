# Refactoring
## Data and Statement Level Refactors
### Incorrect Conditions in Loops and Conditionals:
**collisions.ts, lines 68-76**
**Before**
```typescript
// Check if ball edges are past player edges
  const isBallRightEdgePastPlayerLeftEdge: boolean = ballRight > playerLeft; // ball right edge past player left edge
  const isBallLeftEdgePastPlayerRightEdge: boolean = ballLeft < playerRight; // ball left edge past player right edge
  const isBallBottomEdgePastPlayerTopEdge: boolean = ballBottom > playerTop; // ball bottom edge past player top edge
  const isBallTopEdgePastPlayerBottomEdge: boolean = ballTop < playerBottom; // ball top edge past player bottom edge

  // Check if ball is between player edges and not in the corners
  // If ball is in the corners, it's not a collision
  // This is a little hacky, but it's a good start
  return (
    isBallRightEdgePastPlayerLeftEdge &&
    isBallLeftEdgePastPlayerRightEdge &&
    isBallBottomEdgePastPlayerTopEdge &&
    isBallTopEdgePastPlayerBottomEdge &&
    ball.x > player.x &&
    ball.x < player.x + player.width
  );
```
**After**
```typescript
// Check if ball is between player edges
  let ballPastEdge = ballRight > playerLeft && 
    ballLeft < playerRight &&
    ballBottom > playerTop &&
    ballTop < playerBottom;

  // Check if ball is not in a corner
  let ballPastPlayer = ball.x > player.x &&
    ball.x < player.x + player.width;

  return (
    ballPastEdge && ballPastPlayer
  );
```
**draw.ts, lines 44-74**
**Before**
```typescript
//draw the paddles
if (player1) {
    if (player1.width && player1.height && player1.color) {
      drawRect({
        x: player1.x,
        y: player1.y,
        width: player1.width,
        height: player1.height,
        color: player1.color,
      });
    } else {
      throw new Error("player1 paddle is missing a required property");
    }
  } else {
    throw new Error("player1 paddle is missing");
  }

  // draw player2 paddle
  if (player2) {
    if (player2.width && player2.height && player2.color) {
      drawRect({
        x: player2.x,
        y: player2.y,
        width: player2.width || 0,
        height: player2.height || 0,
        color: player2.color || DEFAULT_COLOR,
      });
    } else {
      throw new Error("player2 paddle is missing a required property");
    }
  } else {
    throw new Error("player2 paddle is missing");
  }
```
**After**
```typescript
// Draw the paddles.
const drawPaddles = (players: Players): void => {
  // destructure the args
  let { player1, player2 } = players;
  // draw player1 paddle
  checkPlayerError(player1, "Player 1");
  drawRect({
    x: player1.x,
    y: player1.y,
    width: player1.width,
    height: player1.height,
    color: player1.color,
  });

  // draw player2 paddle
  checkPlayerError(player2, "Player 2");
  drawRect({
    x: player2.x,
    y: player2.y,
    width: player2.width || 0,
    height: player2.height || 0,
    color: player2.color || DEFAULT_COLOR,
  });
};

const checkPlayerError = (player: Player, playerName: String) => {
  if(!player){
    throw new Error(playerName + " paddle is missing.");
  }
  if(!player.width){
    throw new Error(playerName + " is missing the width property");
  }
  if(!player.height){
    throw new Error(playerName + " is missing the height property")
  }
  if(!player.color){
    throw new Error(playerName + " is missing the color property")
  }
}
```

**moves.ts, lines 48-55**
**Before**
```typescript
const movePaddle = (player: Player): void => {
  if (
    player.y + player.velocityY > 0 &&
    player.y + player.height + player.velocityY < canvas.height
  ) {
    player.y += player.velocityY;
  }
};
```
**After**
```typescript
const movePaddle = (player: Player): void => {
  let deltaPlayer = player.y + player.velocityY;
  if (
    deltaPlayer > 0 &&
    deltaPlayer + player.height < canvas.height
  ) {
    player.y = deltaPlayer;
  }
};
```

**event.ts, lines 33-44**
**Before**
```typescript
else if (event.code === "Space" && game.gameState === GameState.menu) {
    // Start a new game loop
    game.newGame();
  } else if (event.code === "Escape") {
    // Draw the menu
    drawMenu();
  } else if (event.code === "Enter" && game.gameState === GameState.menu) {
    // If the Enter key is pressed in menu, do something based on the selected menu option
    menuActions();
  }
```
**After**
```typescript
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
```

### Frequently Grouped Variables:
**game.ts lines 106-117**
**Before**
```typescript
drawElements({
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
```
**After**
```typescript
    const ballAndPlayers: BallAndPlayers = {
      ball: this.ball,
      player1: this.player1,
      player2: this.player2
    };
    drawElements(ballAndPlayers);
    moveBall({...ballAndPlayers, gameState: this.gameState});
    movePaddles(ballAndPlayers);
    checkCollisions(ballAndPlayers);
```
## Routine Level Refactors
### Method is Too Long
**moves.ts lines 7-35**
**Before**
```typescript
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
    ball.velocityX = -ball.velocityX;
    player1.score++;
    gameState = GameState.score;
    resetBall(ball);
  } else if (ball.x - ball.radius < 0) {
    ball.velocityX = -ball.velocityX;
    player2.score++;
    gameState = GameState.score;
    resetBall(ball);
  }
}
```
**After**
```typescript
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
```

**draw.ts, lines 38-76**
**Before**
```typescript
// Draw the paddles.
const drawPaddles = (players: Players): void => {
  // destructure the args
  let { player1, player2 } = players;

  // draw player1 paddle
  if (player1) {
    if (player1.width && player1.height && player1.color) {
      drawRect({
        x: player1.x,
        y: player1.y,
        width: player1.width,
        height: player1.height,
        color: player1.color,
      });
    } else {
      throw new Error("player1 paddle is missing a required property");
    }
  } else {
    throw new Error("player1 paddle is missing");
  }

  // draw player2 paddle
  if (player2) {
    if (player2.width && player2.height && player2.color) {
      drawRect({
        x: player2.x,
        y: player2.y,
        width: player2.width || 0,
        height: player2.height || 0,
        color: player2.color || DEFAULT_COLOR,
      });
    } else {
      throw new Error("player2 paddle is missing a required property");
    }
  } else {
    throw new Error("player2 paddle is missing");
  }
};
```
**After**
```typescript
// Draw the paddles.
const drawPaddles = (players: Players): void => {
  // destructure the args
  let { player1, player2 } = players;
  // draw player1 paddle
  checkPlayerError(player1, "Player 1");
  drawRect({
    x: player1.x,
    y: player1.y,
    width: player1.width,
    height: player1.height,
    color: player1.color,
  });

  // draw player2 paddle
  checkPlayerError(player2, "Player 2");
  drawRect({
    x: player2.x,
    y: player2.y,
    width: player2.width || 0,
    height: player2.height || 0,
    color: player2.color || DEFAULT_COLOR,
  });
};

const checkPlayerError = (player: Player, playerName: String) => {
  if(!player){
    throw new Error(playerName + " paddle is missing.");
  }
  if(!player.width){
    throw new Error(playerName + " is missing the width property");
  }
  if(!player.height){
    throw new Error(playerName + " is missing the height property")
  }
  if(!player.color){
    throw new Error(playerName + " is missing the color property")
  }
}
```

**event.ts lines 29-61**
**Before**
```typescript
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
```
**After**
```typescript
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
```

### Confusing or Incomplete Error Messages
**draw.ts lines 53-56, 70-73, 193-206**
**Before**
```typescript
  // draw player1 paddle
  if (player1) {
    if (player1.width && player1.height && player1.color) {
      drawRect({
        x: player1.x,
        y: player1.y,
        width: player1.width,
        height: player1.height,
        color: player1.color,
      });
    } else {
      throw new Error("player1 paddle is missing a required property");
    }
  } else {
    throw new Error("player1 paddle is missing");
  }
--------


```
**After**
```typescript
```

## Class or System Level Refactors:
### Architecture Issue


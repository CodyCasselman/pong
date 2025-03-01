# Refactoring
**What do we find critical?**

To identify which code smells could be considered critical, we considered and weighed their impact to maintainability, their frequency, and their overall impact on the program at whole. One serious consideration is that we found the program to be incredibly difficult to decipher. Therefore, we prioritized code smells such as long methods, incorrect conditions, and incomplete error messages in order to address the readability issue within the code. We also considered refactoring the program to alleviate its issue with repeated code, but decided that focusing on long methods also addressed the repeated code.

## Data and Statement Level Refactors
### Code Smell: Incorrect Conditions in Loops and Conditionals:
#### collisions.ts, lines 68-76
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
#### draw.ts, lines 44-74
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
**Explanation**

This refactor focused particularly on nested conditionals that occur in the error checking present in the above code. By having complicated conditions, the developer made it difficult to identify what the error is catching. By having multiple nested conditionals, the developer made it difficult to modify, and difficult to read.
My refactor took each value that was checked and placed them in their own conditionals. This created a "gate" which the program had to pass. This way, it was much easier to identify where the actual error would be coming from.

#### moves.ts, lines 48-55
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
**Explanation**

This refactor focused on improving clarity by removing multiple and repeated operations from conditional statements. By extracting the statement `player.y + player.velocityY` into its own variable; `deltaPlayer`, I avoided needing to repeat writing the same code multiple times. This allows for a more clear boolean, allowing other developers to better understand how the program is working.

#### event.ts, lines 33-44
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
**Explanation**

The above code suffered from a redundant conditional. In the version pre-refactoring, the developer checks whether the `game.gameState === GameState.menu` multiple times. This was avoided in the refactor by checking whether the game was in the menu state first, and then nesting additional logic inside of that boolean. While nested booleans are generally not preferred, this one has a low depth and allows for more concise, clear code.

### Frequently Grouped Variables:
#### game.ts lines 106-117
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
**Explanation**

In a number of statements, the same variables are input functions which all require the same arguments. This looks cluttered, and can allow for information to be difficult to parse. In my refactor, I utilized the already created type BallAndPlayers to group the arguments together, and allow the inputted arguments to be much more concise. By utilizing custom objects, we are able to make our code more readable and modular.
## Routine Level Refactors
### Method is Too Long
#### moves.ts lines 7-35
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
**Explanation**

The above code repeats the same statements multiple times. This makes the program look more complicated than it is, and as a result makes it more difficult to understand. To remedy this issue, we used the extract method refactor, and this allowed us to group similar operations together, reducing the visual length of the method. By doing this, we improved the readability of the program, and make it so that if the program needs to change, they can be made in fewer places.

#### draw.ts, lines 38-76
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
**Explanation**

In this refactor, we focused on reducing the length of the above method, by extracting repeated code and making it more modular. This allows us to more easily understand what the program is doing, as rather than a single method performing every operation, we have smaller methods that can perform few operations. This allows them to be used in more areas. The refactor provides modular, readable code.

#### event.ts lines 29-61
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
  handleMenu(event);
});

const handleMenu = (event): void=>{
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
}

const handleMovement = (event: KeyboardEvent): void =>{
  //Handling Movement Input
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
**Explanation**

In this refactor, we again use the extract method to extract smaller operations occuring within our main operation. This allows those smaller operations to be clearer as to what they're acheiving. The key event is still processing key events, but now the method handleMovement is handling the event for player movement, and handleMenu is handling the event for menu inputs. By making methods shorter and clearer in what they're attempting to do, we increase the readability and adaptability of our code.

### Confusing or Incomplete Error Messages
#### draw.ts lines 38-76, 184-197
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
---------------------------------------------------------
const clearCanvas = (): void => {
  // Remove everything from the canvas
  // If the canvas is not initialized properly or the context is not good,
  // do nothing. This is a "fail fast" approach.
  if (!canvas || !ctx) {
    return;
  }
  try {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } catch (e) {
    // We could do something with the error, but we are not interested in it
    // for now. This method is not critical, so we can just ignore it.
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
---------------------------------------------------------
const clearCanvas = (): void => {
  // Remove everything from the canvas
  // If the canvas is not initialized properly or the context is not good,
  // do nothing. This is a "fail fast" approach.
  if (!canvas || !ctx) {
    return;
  }
  try {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } catch (e) {
    throw new Error("Unable to clear canvas");
  }
};
```
**Explanation**

Error messages are incredibly important in software systems. They allow us to understand the faults within our program and remedy them accordingly. In the developer's code, there are multiple areas in which the way the error is caused is hidden or unimplemented. In checkPlayerError, we more clearly define what about the player is causing the error. By knowing what is at fault, the developer will be able to quicker remedy it. In clearCanvas, the developer simply left comments stating that a method may not work. In our refactor, we throw an error and notify users that the method does not work. By making an error harder to find, or allowing a program to simply coast through an error without issue, the developer makes their program more difficult to work on.

## Class or System Level Refactors:
### Architecture Issue
There is a significant issue with the architecture that drives the main logic of the game. In the file game.ts, you have this script controlling almost all entities in the game. The system clearly wants to be an event-driven architecture. This is evident from the use of key-events in order to force the game into motion. But by forcing so much of the game’s logic into game.ts, it more closely resembles a monolithic architecture. Game.ts handles calling player movements, checking for collisions, drawing all of the elements of the game, handling the game state, and driving the central update loop.

I recommend the game to fully embrace an event-driven architecture. This would involve distributing logic across different classes, allowing them to respond to events rather than being controlled by an exterior system. For example, it would be ideal to host the physics logic of the game in a physics.ts script. The movement system should also be split into its own system. The developer clearly attempted to do this, this is evident by the inclusion of classes such as moves.ts and collisions.ts. But each of these classes are constantly called upon, and therefore tightly coupled with game.ts. This refactor would also address the duplicated code issues in the program, as well as the lack of cohesion evident in multiple classes (event.ts being a prime offender).

By not embracing an event-driven architecture, the system’s modularity and adaptability has been severely hampered. If one were to change the logic behind the player movement, they would need to make changes in event.ts, moves.ts and constants.ts. This is difficult to track, and leads to any small change becoming exponentially more difficult to implement.



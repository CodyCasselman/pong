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

**draw.ts, lines 44-74**
**Before**
```typescript

```
**After**
```typescript

```

### Frequently Grouped Variables:



## Routine Level Refactors
### Code is Duplicated
### Method is Too Long
### Confusing or Incomplete Error Messages

## Class or System Level Refactors:
### Architecture Issue


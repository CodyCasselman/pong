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

```
**After**
```typescript

```

**draw.ts, lines 44-74**
**Before**
```typescript

```
**After**
```typescript

```

**draw.ts, lines 44-74**
**Before**
```typescript

```
**After**
```typescript

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


---
layout: blog-post
title: "GameHub - Built with AI Assistance"
description: "How I built a collection of 6 browser games using Claude Code and Qwen for AI pair programming."
date: 2024-01-15
tags:
  - AI-Assisted
  - Games
  - JavaScript
  - HTML5
image: /images/blog/gamehub.png
---

# GameHub - Built with AI Assistance

## Overview
GameHub is a collection of 6 classic browser games (Snake, Pong, Tic Tac Toe, Memory, Breakout, and Flappy) built entirely with AI pair programming assistance using Claude Code and Qwen. This project explores how AI can accelerate game development while maintaining code quality and learning value.

## The Goal
I wanted to create a portfolio piece that demonstrates:
1. Classic game development fundamentals
2. AI pair programming capabilities
3. Clean, maintainable vanilla JavaScript code
4. Fun, interactive projects that showcase technical skills

## AI Tools Used
- **Claude Code**: Primary game logic, collision detection, game loop architecture
- **Qwen**: Canvas rendering optimization, physics calculations, UI responsiveness

## How AI Helped

### Code Generation

#### Game Loop Architecture
Claude helped me create a clean, reusable game loop pattern:

```javascript
class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.running = false;
    this.lastTime = 0;
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }

  loop(timestamp = 0) {
    if (!this.running) return;

    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }
}
```

#### Collision Detection
AI generated robust collision detection for multiple game types:

```javascript
// AABB collision detection - works for all games
checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}
```

### Problem Solving

#### AI Opponent for Pong
Claude helped implement a minimax-based AI opponent with adjustable difficulty:

```javascript
class PongAI {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.speed = this.getSpeed();
  }

  getSpeed() {
    const speeds = {
      easy: 0.05,
      medium: 0.1,
      hard: 0.15
    };
    return speeds[this.difficulty] || 0.1;
  }

  move(ballY, playerY, paddleHeight) {
    // AI follows ball with limited speed (difficulty-based)
    const center = playerY + paddleHeight / 2;
    if (Math.abs(ballY - center) > 10) {
      return ballY > center
        ? playerY + this.speed
        : playerY - this.speed;
    }
    return playerY;
  }
}
```

#### Tic Tac Toe Minimax
Qwen helped optimize the minimax algorithm with alpha-beta pruning:

```javascript
function minimax(board, depth, isMaximizing) {
  const winner = checkWinner(board);
  if (winner) return winner.score;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of getEmptyCells(board)) {
      board[move] = 'AI';
      const eval = minimax(board, depth + 1, false);
      board[move] = '';
      maxEval = Math.max(maxEval, eval);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of getEmptyCells(board)) {
      board[move] = 'Player';
      const eval = minimax(board, depth + 1, true);
      board[move] = '';
      minEval = Math.min(minEval, eval);
    }
    return minEval;
  }
}
```

### Debugging & Optimization

#### Canvas Rendering Issues
AI helped debug flickering issues by implementing double buffering:

```javascript
// Solution: Use offscreen canvas for rendering
const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
const offscreenCtx = offscreenCanvas.getContext('2d');

// Draw to offscreen first, then copy to visible canvas
offscreenCtx.clearRect(0, 0, width, height);
// ... draw game elements ...
ctx.drawImage(offscreenCanvas, 0, 0);
```

#### Memory Leaks in Memory Game
Claude identified and fixed memory leaks in card flip animations.

### Learning & Understanding

AI helped me understand:
- Game physics and delta-time calculations
- State management patterns for games
- Canvas API optimization techniques
- Minimax algorithm and game theory basics

## The Process

### Prompting Strategy
**What worked well:**
1. Start with high-level architecture, then iterate on details
2. Ask AI to explain concepts before generating code
3. Request multiple implementations to compare approaches
4. Use AI as a code reviewer, not just a generator

**Example effective prompt:**
```
I need a Snake game with these requirements:
- Canvas-based rendering
- Arrow key controls
- Score tracking and high score (localStorage)
- Progressive difficulty (speed increases with food eaten)
- Mobile-friendly touch controls

Start by outlining the class structure, then we'll implement each part.
```

### Human Decisions
AI couldn't decide:
- Game balance (difficulty curves, scoring)
- Visual design choices (colors, styling)
- Which features to prioritize
- When to stop iterating and ship

### Iteration Cycle
Typical workflow:
1. Describe feature requirements
2. Review AI-generated code
3. Test and identify issues
4. Ask AI to fix or improve
5. Repeat until satisfied

## Challenges

### What AI Couldn't Help With
- **Visual design**: I had to create all game sprites and styling
- **Game feel**: Tuning the "juice" (screen shake, particles) required human intuition
- **Accessibility**: Keyboard navigation improvements needed manual testing

### Unexpected Issues
- Mobile touch controls required platform-specific handling
- Safari had different Canvas behavior that needed workarounds
- Some AI-generated code worked in dev but had issues in production

## Results

### Quantitative
- **Development time saved**: ~40% compared to traditional development
- **Number of iterations**: 15-20 per game on average
- **AI-generated code**: ~60% of total codebase

### Qualitative
- Clean, well-structured code with AI guidance
- Learned new patterns for game development
- Discovered AI's strengths (boilerplate, algorithms) and weaknesses (design, UX)

## Key Learnings

1. **AI excels at algorithms** - Minimax, collision detection, pathfinding
2. **Human needed for design** - Visuals, feel, user experience
3. **Iterative prompting works best** - Start broad, refine details
4. **AI as pair programmer, not replacement** - Review and understand all code
5. **Documentation matters** - AI helps write docs, but you need to know what to ask for

## Code Samples

### Example Prompt
```
Help me implement a card flip animation for a memory game.
Requirements:
- CSS 3D transforms
- Backface visibility
- Smooth transition
- Works on mobile
- Prevent clicking flipped cards
```

### Resulting Code
```css
.card {
  perspective: 1000px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  backface-visibility: hidden;
  /* ... */
}

.card-front {
  transform: rotateY(180deg);
}
```

## Next Steps
- Add more games to the collection
- Implement multiplayer support
- Add sound effects with AI-generated audio
- Create a level editor for custom games

---

*This project was built with AI pair programming assistance using Claude Code and Qwen.*

# GameHub

GameHub is a collection of browser-based HTML5 games in a single static site.

## Included games

- 2048
- Breakout
- Connect 4
- Copter
- Flappy Bird
- Minesweeper
- Memory
- Pac-Man
- Pong
- Snake
- Space Invaders
- Sudoku
- Tetris
- Tic-Tac-Toe

## Run locally

This project is static HTML/CSS/JS, so no build step is required.

You can open `index.html` directly in a browser for quick checks, but serving the folder with a static server is the recommended approach for full compatibility (for example: `python -m http.server`).

## Project structure

- `index.html` — main game hub page
- `*.html` — individual game pages
- `styles.css` — shared styles
- `leaderboard.js` / `multiplayer.js` — leaderboard tracking and multiplayer support scripts

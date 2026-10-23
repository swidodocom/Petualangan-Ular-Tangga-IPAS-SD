import { BoardLadder, BoardSnake } from '../types/game';

export interface BoardSetup {
  size: number;
  gridRows: number;
  gridCols: number;
  ladders: BoardLadder[];
  snakes: BoardSnake[];
  quizTiles: number[];
}

export const BOARD_36: BoardSetup = {
  size: 36,
  gridRows: 6,
  gridCols: 6,
  ladders: [
    { bottom: 3, top: 16 },
    { bottom: 8, top: 22 },
    { bottom: 14, top: 29 },
    { bottom: 20, top: 32 }
  ],
  snakes: [
    { head: 17, tail: 4 },
    { head: 27, tail: 9 },
    { head: 31, tail: 18 },
    { head: 35, tail: 12 }
  ],
  quizTiles: [6, 11, 15, 23, 26, 33]
};

export const BOARD_64: BoardSetup = {
  size: 64,
  gridRows: 8,
  gridCols: 8,
  ladders: [
    { bottom: 5, top: 24 },
    { bottom: 12, top: 33 },
    { bottom: 20, top: 42 },
    { bottom: 28, top: 49 },
    { bottom: 36, top: 58 },
    { bottom: 44, top: 62 }
  ],
  snakes: [
    { head: 22, tail: 7 },
    { head: 34, tail: 15 },
    { head: 41, tail: 19 },
    { head: 53, tail: 29 },
    { head: 60, tail: 38 },
    { head: 63, tail: 40 }
  ],
  quizTiles: [9, 16, 25, 30, 37, 47, 51, 55]
};

/**
 * Calculates row and column (0-indexed from top-left) for a snake-and-ladder tile.
 * Traditional layout:
 * - Tile 1 is at bottom-left.
 * - Rows zigzag alternately:
 *   Bottom row goes left-to-right (col 0 to N-1)
 *   Next row up goes right-to-left (col N-1 to 0)
 *   Next row up goes left-to-right, etc.
 */
export const getTileGridPosition = (tileNumber: number, rows: number, cols: number) => {
  const indexFrom0 = tileNumber - 1;
  const rowFromBottom = Math.floor(indexFrom0 / cols);
  const rowFromTop = rows - 1 - rowFromBottom;

  const isLeftToRight = rowFromBottom % 2 === 0;
  const colIndexInRow = indexFrom0 % cols;
  const col = isLeftToRight ? colIndexInRow : cols - 1 - colIndexInRow;

  return { row: rowFromTop, col };
};

/**
 * Converts row & col to center percentage (0% - 100%) in board container
 */
export const getTileCenterPercent = (tileNumber: number, rows: number, cols: number) => {
  const { row, col } = getTileGridPosition(tileNumber, rows, cols);
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;

  return {
    x: col * cellWidth + cellWidth / 2,
    y: row * cellHeight + cellHeight / 2
  };
};

import { GridBuilder } from './GridBuilder';
import { WordPlacer } from './WordPlacer';
import { Puzzle, PuzzleConfig, GenerationResult, Grid } from '../../types/puzzle';

export class WordSearchGenerator {
  static generate(config: PuzzleConfig, words: string[]): GenerationResult {
    try {
      // 1. Create Grid
      const grid = GridBuilder.createGrid(config.gridSize, config.shape);

      // 2. Place Words
      const { placedWords, unplacedWords } = WordPlacer.placeWords(
        grid,
        words.map((w) => w.toUpperCase()),
        config.directions
      );

      // 3. Fill Empty Cells
      this.fillEmptyCells(grid);

      const puzzle: Puzzle = {
        id: crypto.randomUUID(),
        title: 'Untitled Puzzle',
        grid,
        words,
        placedWords,
        unplacedWords,
        config,
        difficulty: config.difficulty,
        difficultyScore: 0, // Calculate later
        createdAt: new Date(),
      };

      return {
        success: true,
        puzzle,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private static fillEmptyCells(grid: Grid): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < grid.size; r++) {
      for (let c = 0; c < grid.size; c++) {
        const cell = grid.cells[r]?.[c];
        if (cell && !cell.letter && !cell.masked) {
          cell.letter = letters[Math.floor(Math.random() * letters.length)] || 'A';
        }
      }
    }
  }
}

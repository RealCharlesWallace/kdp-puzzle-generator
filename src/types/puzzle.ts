/**
 * Core type definitions for the puzzle generation system
 */

/**
 * Direction a word can be placed in the grid
 */
export type Direction =
  | 'horizontal'
  | 'vertical'
  | 'diagonal_down'
  | 'diagonal_up'
  | 'horizontal_reverse'
  | 'vertical_reverse'
  | 'diagonal_down_reverse'
  | 'diagonal_up_reverse';

/**
 * Available puzzle shapes
 */
export type ShapeType =
  | 'rectangle'
  | 'circle'
  | 'heart'
  | 'star'
  | 'diamond'
  | 'triangle'
  | 'pumpkin'
  | 'christmas_tree'
  | 'easter_egg'
  | 'shamrock';

/**
 * Difficulty levels for puzzle generation
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

/**
 * Strategy for filling empty cells
 */
export type FillStrategy = 'random' | 'weighted' | 'confusing';

/**
 * Position in the grid
 */
export interface Position {
  row: number;
  col: number;
}

/**
 * A single cell in the puzzle grid
 */
export interface GridCell {
  /** Single letter (A-Z) */
  letter: string;

  /** Row position (0-indexed) */
  row: number;

  /** Column position (0-indexed) */
  col: number;

  /** Whether this cell contains a letter from a placed word */
  isPartOfWord: boolean;

  /** IDs of words using this cell */
  wordIds: string[];

  /** Whether this cell is outside the shape mask */
  masked: boolean;
}

/**
 * The complete grid structure
 */
export interface Grid {
  /** Grid dimension (size × size) */
  size: number;

  /** 2D array of cells */
  cells: GridCell[][];

  /** Grid shape */
  shape: ShapeType;

  /** Shape mask (true = usable cell, false = masked) */
  shapeMask: boolean[][];
}

/**
 * A word that has been successfully placed in the grid
 */
export interface PlacedWord {
  /** Unique identifier */
  id: string;

  /** The actual word */
  word: string;

  /** Starting row (0-indexed) */
  startRow: number;

  /** Starting column (0-indexed) */
  startCol: number;

  /** Direction of placement */
  direction: Direction;

  /** All cell positions occupied by this word */
  positions: Position[];

  /** Individual word difficulty score */
  difficulty: number;
}

/**
 * Puzzle generation configuration
 */
export interface PuzzleConfig {
  /** Grid size (width and height in cells) */
  gridSize: number;

  /** Puzzle shape */
  shape: ShapeType;

  /** Difficulty level */
  difficulty: DifficultyLevel;

  /** Allowed word placement directions */
  directions: Direction[];

  /** Allow words to be placed backwards */
  allowBackwards: boolean;

  /** Allow word intersections (letters overlap) */
  allowOverlap: boolean;

  /** Strategy for filling empty cells */
  fillStrategy: FillStrategy;
}

/**
 * Puzzle metadata
 */
export interface PuzzleMetadata {
  /** Title of the puzzle */
  title?: string;

  /** Theme/category */
  theme?: string;

  /** Author */
  author?: string;

  /** Additional tags */
  tags?: string[];

  /** Creation timestamp */
  createdAt: Date;
}

/**
 * Complete puzzle data structure
 */
export interface Puzzle {
  /** Unique puzzle identifier */
  id: string;

  /** Puzzle title */
  title: string;

  /** Theme/category */
  theme?: string;

  /** The grid */
  grid: Grid;

  /** Input word list */
  words: string[];

  /** Successfully placed words */
  placedWords: PlacedWord[];

  /** Words that couldn't be placed */
  unplacedWords: string[];

  /** Generation configuration */
  config: PuzzleConfig;

  /** Overall difficulty level */
  difficulty: DifficultyLevel;

  /** Calculated difficulty score (0-100) */
  difficultyScore: number;

  /** Creation timestamp */
  createdAt: Date;

  /** Additional metadata */
  metadata?: PuzzleMetadata;
}

/**
 * Validation result for word lists
 */
export interface ValidationResult {
  /** Whether the word list is valid */
  isValid: boolean;

  /** Validation errors */
  errors: string[];

  /** Non-blocking warnings */
  warnings: string[];

  /** Valid words from the input */
  validWords: string[];

  /** Invalid words from the input */
  invalidWords: string[];
}

/**
 * Generation result
 */
export interface GenerationResult {
  /** Whether generation was successful */
  success: boolean;

  /** Generated puzzle (if successful) */
  puzzle?: Puzzle;

  /** Error message (if failed) */
  error?: string;

  /** Warnings during generation */
  warnings?: string[];
}

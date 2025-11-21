import { create } from 'zustand';
import type { Puzzle, PuzzleConfig, DifficultyLevel, ShapeType, Direction } from '@/types/puzzle';
import { WordSearchGenerator } from '@/core/algorithm/WordSearchGenerator';
import { GridBuilder } from '@/core/algorithm/GridBuilder';
import { PuzzlePDFGenerator } from '@/core/pdf/PuzzlePDFGenerator';

/**
 * Puzzle store state interface
 */
interface PuzzleState {
  // Current puzzle data
  currentPuzzle: Puzzle | null;
  words: string[];
  title: string;
  theme: string;

  // Generator configuration
  config: PuzzleConfig;

  // UI state
  isGenerating: boolean;
  error: string | null;
  pdfTheme: string;

  // Actions
  setWords: (words: string[]) => void;
  setTitle: (title: string) => void;
  setTheme: (theme: string) => void;
  setGridSize: (size: number) => void;
  setShape: (shape: ShapeType) => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  setDirections: (directions: Direction[]) => void;
  setAllowBackwards: (allow: boolean) => void;
  generatePuzzle: () => Promise<void>;
  clearPuzzle: () => void;
  setError: (error: string | null) => void;
  setPdfTheme: (themeId: string) => void;
  exportPDF: (includeAnswerKey?: boolean) => void;
}

/**
 * Default puzzle configuration
 */
const DEFAULT_CONFIG: PuzzleConfig = {
  gridSize: 15,
  shape: 'rectangle',
  difficulty: 'medium',
  directions: ['horizontal', 'vertical', 'diagonal_down', 'diagonal_up'],
  allowBackwards: false,
  allowOverlap: true,
  fillStrategy: 'weighted',
};

/**
 * Main puzzle store
 * Manages puzzle generation state and configuration
 */
export const usePuzzleStore = create<PuzzleState>((set, get) => ({
  // Initial state
  currentPuzzle: null,
  words: [],
  title: '',
  theme: '',
  config: DEFAULT_CONFIG,
  isGenerating: false,
  error: null,
  pdfTheme: 'modern',

  // Actions
  setWords: (words) => {
    set({ words, error: null });
  },

  setTitle: (title) => {
    set({ title });
  },

  setTheme: (theme) => {
    set({ theme });
  },

  setGridSize: (size) => {
    set((state) => ({
      config: { ...state.config, gridSize: size },
    }));
  },

  setShape: (shape) => {
    set((state) => ({
      config: { ...state.config, shape },
    }));
  },

  setDifficulty: (difficulty) => {
    set((state) => {
      // Update directions based on difficulty
      let directions: Direction[];

      switch (difficulty) {
        case 'easy':
          directions = ['horizontal', 'vertical'];
          break;
        case 'medium':
          directions = ['horizontal', 'vertical', 'diagonal_down', 'diagonal_up'];
          break;
        case 'hard':
        case 'expert':
          directions = [
            'horizontal',
            'vertical',
            'diagonal_down',
            'diagonal_up',
            'horizontal_reverse',
            'vertical_reverse',
            'diagonal_down_reverse',
            'diagonal_up_reverse',
          ];
          break;
        default:
          directions = state.config.directions;
      }

      return {
        config: {
          ...state.config,
          difficulty,
          directions,
          allowBackwards: difficulty === 'hard' || difficulty === 'expert',
        },
      };
    });
  },

  setDirections: (directions) => {
    set((state) => ({
      config: { ...state.config, directions },
    }));
  },

  setAllowBackwards: (allow) => {
    set((state) => ({
      config: { ...state.config, allowBackwards: allow },
    }));
  },

  generatePuzzle: async () => {
    const { words, config, title } = get();

    // Validation
    if (words.length < 5) {
      set({ error: 'Please enter at least 5 words' });
      return;
    }

    const totalLetters = words.reduce((sum, w) => sum + w.replace(/\s+/g, '').length, 0);
    const availableCells = GridBuilder.getAvailableCellCount(config.gridSize, config.shape);

    if (totalLetters > availableCells) {
      let suggestedSize: number | null = null;
      for (let size = config.gridSize + 1; size <= 25; size++) {
        if (GridBuilder.getAvailableCellCount(size, config.shape) >= totalLetters) {
          suggestedSize = size;
          break;
        }
      }

      const needsReduction = suggestedSize === null;
      const message = needsReduction
        ? 'Your word list is too large for the maximum grid size (25). Reduce word count or word lengths.'
        : `Your word list needs at least a ${suggestedSize}×${suggestedSize} grid. Increase grid size or reduce words.`;

      set({ error: message });
      return;
    }

    set({ isGenerating: true, error: null });

    try {
      // Small delay to allow UI to show loading state
      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = WordSearchGenerator.generate(config, words);

      if (result.success && result.puzzle) {
        result.puzzle.title = title || 'Word Search Puzzle';
        set({
          currentPuzzle: result.puzzle,
          isGenerating: false,
          error: null,
        });
      } else {
        throw new Error(result.error || 'Failed to generate puzzle');
      }
    } catch (error) {
      set({
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate puzzle',
      });
    }
  },

  clearPuzzle: () => {
    set({
      currentPuzzle: null,
      words: [],
      title: '',
      theme: '',
      error: null,
    });
  },

  setError: (error) => {
    set({ error });
  },

  setPdfTheme: (themeId) => {
    set({ pdfTheme: themeId });
  },

  exportPDF: (includeAnswerKey = true) => {
    const { currentPuzzle, pdfTheme, title } = get();

    if (!currentPuzzle) {
      set({ error: 'No puzzle to export. Please generate a puzzle first.' });
      return;
    }

    try {
      PuzzlePDFGenerator.download(currentPuzzle, {
        pageSize: '8.5x11',
        includeAnswerKey,
        title: title || currentPuzzle.title || 'Word Search Puzzle',
        themeId: pdfTheme,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to export PDF',
      });
    }
  },
}));

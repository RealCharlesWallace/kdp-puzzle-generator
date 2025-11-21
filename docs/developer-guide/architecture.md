# System Architecture

## Overview

Clara follows a **Client-First Architecture**, meaning the core puzzle generation logic runs entirely in the user's browser. This ensures fast performance and privacy.

## Core Components

### 1. Puzzle Generation Engine (`src/core/algorithm`)

*   **`WordSearchGenerator`**: The main coordinator class. It takes configuration and words as input and returns a complete `Puzzle` object.
*   **`GridBuilder`**: Responsible for creating the grid structure and applying shape masks (e.g., Circle).
*   **`WordPlacer`**: Handles the complex logic of placing words into the grid, checking for collisions and boundary constraints. It supports multiple directions based on difficulty.

### 2. State Management (`src/store`)

*   **`puzzleStore`**: Built with **Zustand**, this store manages the application state, including:
    *   Current configuration (grid size, difficulty, etc.)
    *   Word list
    *   Generated puzzle data
    *   UI states (loading, errors)

### 3. UI Components (`src/components`)

*   **`PuzzleCanvas`**: A React component that renders the puzzle grid using the HTML5 Canvas API. It handles:
    *   Grid rendering
    *   Shape masking
    *   Solution highlighting
*   **`HomePage`**: The main layout, connecting the store to the UI components.

## Data Flow

1.  User updates settings/words in the UI.
2.  `puzzleStore` updates the state.
3.  User clicks "Generate".
4.  `puzzleStore` calls `WordSearchGenerator.generate()`.
5.  `WordSearchGenerator` creates a grid and places words.
6.  Resulting `Puzzle` object is stored in `puzzleStore`.
7.  `PuzzleCanvas` subscribes to the store and re-renders the new puzzle.

## Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **State**: Zustand
*   **Testing**: Vitest, React Testing Library

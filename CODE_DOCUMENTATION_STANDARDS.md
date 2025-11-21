# Clara - Code Documentation Standards

## Document Information
- **Project**: Clara - KDP Word Search Puzzle Generator
- **Version**: 1.0
- **Date**: 2025-11-20
- **Purpose**: Establish coding standards and documentation requirements for consistent, maintainable code

---

## TABLE OF CONTENTS

1. [Overview](#1-overview)
2. [TypeScript Standards](#2-typescript-standards)
3. [React Component Standards](#3-react-component-standards)
4. [Code Documentation](#4-code-documentation)
5. [File Organization](#5-file-organization)
6. [Naming Conventions](#6-naming-conventions)
7. [Code Style](#7-code-style)
8. [Testing Standards](#8-testing-standards)
9. [Git Commit Standards](#9-git-commit-standards)
10. [Code Review Checklist](#10-code-review-checklist)

---

## 1. OVERVIEW

### 1.1 Purpose

This document defines the coding standards and documentation requirements for the Clara project. Following these standards ensures:

- **Consistency**: Uniform code style across the codebase
- **Maintainability**: Easy to understand and modify code
- **Quality**: Fewer bugs through type safety and testing
- **Collaboration**: Clear expectations for all contributors
- **Scalability**: Code that can grow with the project

### 1.2 Enforcement

Standards are enforced through:

- **ESLint**: Automated linting on every commit (pre-commit hook)
- **TypeScript**: Strict mode enabled, no compilation with errors
- **Prettier**: Automatic code formatting
- **Code Reviews**: Manual review before merging
- **CI/CD**: Automated checks in GitHub Actions

### 1.3 Exceptions

Exceptions to these standards must be:
- Documented with `// EXCEPTION:` comment explaining why
- Approved in code review
- Minimal and rare

---

## 2. TYPESCRIPT STANDARDS

### 2.1 Strict Mode

**Requirement**: TypeScript strict mode MUST be enabled.

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true
  }
}
```

### 2.2 Type Annotations

#### 2.2.1 Function Parameters and Return Types

**Rule**: Always annotate function parameters and return types explicitly.

**Good**:
```typescript
function calculateGridSize(words: string[], minSize: number): number {
  const longestWord = Math.max(...words.map(w => w.length));
  return Math.max(longestWord + 2, minSize);
}
```

**Bad**:
```typescript
// Missing return type
function calculateGridSize(words: string[], minSize: number) {
  const longestWord = Math.max(...words.map(w => w.length));
  return Math.max(longestWord + 2, minSize);
}
```

#### 2.2.2 Variable Type Inference

**Rule**: Let TypeScript infer variable types when the type is obvious from the initialization.

**Good**:
```typescript
const gridSize = 15; // number (inferred)
const words = ['HELLO', 'WORLD']; // string[] (inferred)

// Explicit when not obvious
const config: PuzzleConfig = getPuzzleConfig();
```

**Bad**:
```typescript
// Unnecessary explicit typing
const gridSize: number = 15;
const words: string[] = ['HELLO', 'WORLD'];
```

### 2.3 Avoid `any`

**Rule**: Never use `any` type unless absolutely necessary. Use `unknown` or generics instead.

**Good**:
```typescript
function parseJSON<T>(json: string): T {
  return JSON.parse(json) as T;
}

// Or with unknown
function handleError(error: unknown): void {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

**Bad**:
```typescript
function parseJSON(json: string): any {
  return JSON.parse(json);
}
```

**Allowed Exception**:
```typescript
// EXCEPTION: Third-party library without types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyLib: any = require('old-library');
```

### 2.4 Interface vs Type

**Rule**: Prefer `interface` for object shapes. Use `type` for unions, intersections, and utility types.

**Interfaces** (for objects):
```typescript
interface PuzzleConfig {
  gridSize: number;
  shape: ShapeType;
  difficulty: DifficultyLevel;
}
```

**Types** (for unions, intersections):
```typescript
type ShapeType = 'rectangle' | 'circle' | 'heart' | 'star';
type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

// Intersection
type StyledPuzzle = PuzzleConfig & { cssClass: string };
```

### 2.5 Null and Undefined

**Rule**: Be explicit about null/undefined. Use optional properties (`?`) and nullish coalescing (`??`).

**Good**:
```typescript
interface User {
  name: string;
  email?: string; // Optional
}

function greetUser(user: User): string {
  const email = user.email ?? 'no-email@example.com';
  return `Hello ${user.name} (${email})`;
}
```

**Bad**:
```typescript
interface User {
  name: string;
  email: string | undefined; // Prefer optional property
}

function greetUser(user: User): string {
  const email = user.email || 'no-email@example.com'; // Use ?? instead
  return `Hello ${user.name} (${email})`;
}
```

### 2.6 Enums

**Rule**: Prefer string literal unions over enums for better type safety and readability.

**Good** (String Literal Union):
```typescript
type Direction = 'horizontal' | 'vertical' | 'diagonal_down' | 'diagonal_up';

const direction: Direction = 'horizontal';
```

**Acceptable** (Const Enum for performance-critical code):
```typescript
const enum Direction {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
  DIAGONAL_DOWN = 'diagonal_down',
  DIAGONAL_UP = 'diagonal_up',
}
```

---

## 3. REACT COMPONENT STANDARDS

### 3.1 Component Structure

**Rule**: Use functional components with hooks. Organize as follows:

```typescript
// 1. Imports (grouped)
import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { usePuzzleStore } from '@/store/puzzleStore';
import type { PuzzleConfig } from '@/types/puzzle';

// 2. Type definitions (if not in separate file)
interface PuzzleGeneratorProps {
  initialWords?: string[];
  onGenerate?: (puzzle: Puzzle) => void;
}

// 3. Component definition
export const PuzzleGenerator: React.FC<PuzzleGeneratorProps> = ({
  initialWords = [],
  onGenerate,
}) => {
  // 3a. Hooks (useState, useEffect, custom hooks)
  const [words, setWords] = useState<string[]>(initialWords);
  const { generatePuzzle, isGenerating } = usePuzzleStore();

  useEffect(() => {
    // Effect logic
  }, []);

  // 3b. Event handlers
  const handleGenerate = async (): Promise<void> => {
    const puzzle = await generatePuzzle(words);
    onGenerate?.(puzzle);
  };

  // 3c. Render helpers (if complex)
  const renderWordList = (): React.ReactNode => {
    return words.map((word) => <WordChip key={word} word={word} />);
  };

  // 3d. Return JSX
  return (
    <div className="puzzle-generator">
      <Input value={words.join('\n')} onChange={(e) => setWords(e.target.value.split('\n'))} />
      <Button onClick={handleGenerate} disabled={isGenerating}>
        Generate Puzzle
      </Button>
      {renderWordList()}
    </div>
  );
};

// 4. Default props (if needed)
PuzzleGenerator.defaultProps = {
  initialWords: [],
};
```

### 3.2 Props Interface

**Rule**: Always define explicit props interface. Export if reusable.

```typescript
export interface ButtonProps {
  /** Button text or content */
  children: React.ReactNode;

  /** Click handler */
  onClick?: () => void;

  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline';

  /** Disable button */
  disabled?: boolean;

  /** Additional CSS classes */
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  // Component implementation
};
```

### 3.3 Component File Structure

**Rule**: Each component gets its own folder (if non-trivial).

```
Button/
├── Button.tsx              # Component implementation
├── Button.test.tsx         # Unit tests
├── Button.stories.tsx      # Storybook stories
├── index.ts                # Re-export
└── types.ts                # Type definitions (if complex)
```

**Simple components** (single file):
```typescript
// components/ui/Badge.tsx
export interface BadgeProps {
  label: string;
  color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color = 'blue' }) => {
  return <span className={`badge badge-${color}`}>{label}</span>;
};
```

### 3.4 Custom Hooks

**Rule**: Extract reusable logic into custom hooks. Prefix with `use`.

```typescript
// hooks/usePuzzleGenerator.ts

import { useState, useCallback } from 'react';
import type { Puzzle, PuzzleConfig } from '@/types/puzzle';

interface UsePuzzleGeneratorReturn {
  puzzle: Puzzle | null;
  isGenerating: boolean;
  error: Error | null;
  generate: (words: string[], config: PuzzleConfig) => Promise<void>;
  clear: () => void;
}

/**
 * Hook for generating word search puzzles
 * @returns Puzzle state and generation functions
 */
export function usePuzzleGenerator(): UsePuzzleGeneratorReturn {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generate = useCallback(async (words: string[], config: PuzzleConfig): Promise<void> => {
    setIsGenerating(true);
    setError(null);

    try {
      const generator = new WordSearchGenerator(config);
      const newPuzzle = await generator.generate(words);
      setPuzzle(newPuzzle);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clear = useCallback((): void => {
    setPuzzle(null);
    setError(null);
  }, []);

  return { puzzle, isGenerating, error, generate, clear };
}
```

---

## 4. CODE DOCUMENTATION

### 4.1 JSDoc/TSDoc Comments

**Rule**: Document all public APIs, complex functions, and non-obvious code.

#### 4.1.1 Function Documentation

```typescript
/**
 * Generates a word search puzzle from a list of words
 *
 * @param words - Array of words to place in the puzzle (5-50 words)
 * @param config - Puzzle configuration settings
 * @returns Generated puzzle with grid and placed words
 * @throws {ValidationError} If word list is invalid
 * @throws {GenerationError} If puzzle cannot be generated
 *
 * @example
 * ```typescript
 * const puzzle = generatePuzzle(
 *   ['HELLO', 'WORLD'],
 *   { gridSize: 15, shape: 'rectangle', difficulty: 'medium' }
 * );
 * ```
 */
export function generatePuzzle(words: string[], config: PuzzleConfig): Puzzle {
  // Implementation
}
```

#### 4.1.2 Class Documentation

```typescript
/**
 * Word search puzzle generator
 *
 * Handles the complete puzzle generation process including:
 * - Grid initialization
 * - Word placement using configurable algorithms
 * - Empty cell filling
 * - Answer key generation
 *
 * @example
 * ```typescript
 * const generator = new WordSearchGenerator({
 *   gridSize: 15,
 *   shape: 'circle',
 *   difficulty: 'hard'
 * });
 *
 * const puzzle = generator.generate(['HELLO', 'WORLD']);
 * ```
 */
export class WordSearchGenerator {
  /**
   * Current puzzle configuration
   * @readonly
   */
  private readonly config: PuzzleConfig;

  /**
   * Initialize generator with configuration
   * @param config - Puzzle generation settings
   */
  constructor(config: PuzzleConfig) {
    this.config = config;
  }

  /**
   * Generate a new puzzle
   * @param words - Words to place
   * @returns Complete puzzle
   */
  public generate(words: string[]): Puzzle {
    // Implementation
  }
}
```

#### 4.1.3 Interface Documentation

```typescript
/**
 * Configuration for puzzle generation
 */
export interface PuzzleConfig {
  /**
   * Grid size (width and height in cells)
   * @minimum 10
   * @maximum 50
   */
  gridSize: number;

  /**
   * Puzzle shape
   * @default 'rectangle'
   */
  shape: ShapeType;

  /**
   * Difficulty level affecting word placement
   * @default 'medium'
   */
  difficulty: DifficultyLevel;

  /**
   * Allowed word placement directions
   * @default ['horizontal', 'vertical', 'diagonal_down', 'diagonal_up']
   */
  directions: Direction[];

  /**
   * Allow words to be placed backwards
   * @default false
   */
  allowBackwards: boolean;
}
```

### 4.2 Inline Comments

**Rule**: Use inline comments sparingly, only for complex or non-obvious logic.

**Good**:
```typescript
// Calculate cell size to fit grid within available space
// Formula: (availableWidth - padding) / gridSize
const cellSize = (containerWidth - 2 * GRID_PADDING) / config.gridSize;

// HACK: Force re-render to fix Safari canvas bug
// See: https://bugs.webkit.org/show_bug.cgi?id=123456
setKey(Date.now());
```

**Bad** (explaining obvious code):
```typescript
// Set the grid size to 15
const gridSize = 15;

// Loop through all words
words.forEach(word => {
  // Process each word
  processWord(word);
});
```

### 4.3 TODO Comments

**Rule**: Use standardized TODO format. Link to GitHub issue when possible.

```typescript
// TODO(#123): Implement diagonal word placement
// Blocked by: Shape mask refactoring

// FIXME: Memory leak in canvas cleanup
// Reproduces when generating >100 puzzles in a session

// OPTIMIZE: Cache grid calculations
// Current: O(n²) on every render
// Target: O(1) with memoization
```

---

## 5. FILE ORGANIZATION

### 5.1 Import Order

**Rule**: Group and sort imports in the following order:

```typescript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

// 2. Internal components
import { Button } from '@/components/ui/Button';
import { PuzzleCanvas } from '@/components/puzzle/PuzzleCanvas';

// 3. Hooks and utilities
import { usePuzzleGenerator } from '@/hooks/usePuzzleGenerator';
import { formatDate } from '@/utils/formatting';

// 4. Store and services
import { usePuzzleStore } from '@/store/puzzleStore';
import { analyticsService } from '@/services/analytics';

// 5. Types (use 'type' imports)
import type { Puzzle, PuzzleConfig } from '@/types/puzzle';

// 6. Styles and assets
import './PuzzleGenerator.css';
import logoImage from '@/assets/logo.png';
```

### 5.2 Export Strategy

**Rule**: Use named exports for components and utilities. Avoid default exports.

**Good**:
```typescript
// Button.tsx
export const Button: React.FC<ButtonProps> = ({ ... }) => { ... };

// index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

**Usage**:
```typescript
import { Button } from '@/components/ui/Button';
```

**Avoid** (default export):
```typescript
// Button.tsx
export default Button; // Don't do this

// Usage - less discoverable, harder to refactor
import Button from '@/components/ui/Button';
```

**Exception**: Default export for pages (Next.js convention):
```typescript
// pages/Home/Home.tsx
export default function HomePage() { ... }
```

---

## 6. NAMING CONVENTIONS

### 6.1 File Names

| Type | Convention | Example |
|------|------------|---------|
| React Component | PascalCase | `PuzzleCanvas.tsx` |
| Hook | camelCase with `use` prefix | `usePuzzleGenerator.ts` |
| Utility | camelCase | `formatDate.ts`, `arrayUtils.ts` |
| Type/Interface | PascalCase | `puzzle.ts`, `api.ts` |
| Config | camelCase | `app.config.ts` |
| Test | Same as file + `.test` | `PuzzleCanvas.test.tsx` |
| Story | Same as file + `.stories` | `Button.stories.tsx` |

### 6.2 Variable Names

```typescript
// Constants: SCREAMING_SNAKE_CASE
const MAX_GRID_SIZE = 50;
const DEFAULT_DIFFICULTY = 'medium';

// Variables and functions: camelCase
const gridSize = 15;
const placedWords: PlacedWord[] = [];

function calculateDifficulty(puzzle: Puzzle): number {
  // ...
}

// Classes: PascalCase
class WordSearchGenerator {
  // ...
}

// Interfaces/Types: PascalCase
interface PuzzleConfig {
  // ...
}

type ShapeType = 'rectangle' | 'circle';

// Private class members: prefix with underscore
class GridBuilder {
  private _grid: Grid;
  private _shapeMask: boolean[][];
}

// Boolean variables: prefix with is/has/should/can
const isGenerating = false;
const hasError = true;
const shouldValidate = true;
const canPlaceWord = checkPlacement();
```

### 6.3 React Component Names

```typescript
// Component: PascalCase
export const PuzzleGenerator: React.FC<PuzzleGeneratorProps> = ({ ... }) => { ... };

// Props interface: ComponentName + Props
interface PuzzleGeneratorProps {
  // ...
}

// Event handlers: handle + Action
const handleGenerate = () => { ... };
const handleWordChange = (word: string) => { ... };

// Render functions: render + What
const renderWordList = (): React.ReactNode => { ... };
const renderHeader = (): React.ReactNode => { ... };
```

---

## 7. CODE STYLE

### 7.1 Prettier Configuration

**Rule**: Use project Prettier config. Format on save.

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 7.2 ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react/react-in-jsx-scope": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### 7.3 Code Complexity

**Rule**: Keep functions small and focused. Maximum cyclomatic complexity: 10.

**Good** (simple, focused):
```typescript
function isWordValid(word: string): boolean {
  return word.length >= 2 && word.length <= 20 && /^[A-Z]+$/i.test(word);
}

function validateWordList(words: string[]): ValidationResult {
  const errors: string[] = [];

  if (words.length < 5) {
    errors.push('At least 5 words required');
  }

  words.forEach((word) => {
    if (!isWordValid(word)) {
      errors.push(`Invalid word: ${word}`);
    }
  });

  return { isValid: errors.length === 0, errors };
}
```

**Bad** (too complex, multiple responsibilities):
```typescript
function validateAndGeneratePuzzle(words: string[], config: PuzzleConfig): Puzzle | null {
  // 50 lines of validation, generation, error handling...
  // Cyclomatic complexity: 25
}
```

**Fix**: Split into smaller functions or use early returns to reduce nesting.

### 7.4 DRY Principle

**Rule**: Don't Repeat Yourself. Extract common logic.

**Before**:
```typescript
// Repeated logic
const puzzlePDF = generatePDF(puzzle, { pageSize: '8.5x11', margins: { top: 0.5, bottom: 0.5 } });
const answerPDF = generatePDF(answer, { pageSize: '8.5x11', margins: { top: 0.5, bottom: 0.5 } });
```

**After**:
```typescript
// Extract to constant or function
const DEFAULT_PDF_CONFIG = {
  pageSize: '8.5x11' as const,
  margins: { top: 0.5, bottom: 0.5 },
};

const puzzlePDF = generatePDF(puzzle, DEFAULT_PDF_CONFIG);
const answerPDF = generatePDF(answer, DEFAULT_PDF_CONFIG);
```

---

## 8. TESTING STANDARDS

### 8.1 Test File Structure

```typescript
// PuzzleGenerator.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PuzzleGenerator } from './PuzzleGenerator';

describe('PuzzleGenerator', () => {
  // Setup
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test group
  describe('word input', () => {
    it('should accept valid word list', () => {
      render(<PuzzleGenerator />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'HELLO\nWORLD' } });

      expect(input).toHaveValue('HELLO\nWORLD');
    });

    it('should reject words with invalid characters', async () => {
      render(<PuzzleGenerator />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'HELLO123' } });

      await waitFor(() => {
        expect(screen.getByText(/invalid characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('puzzle generation', () => {
    it('should generate puzzle on button click', async () => {
      const onGenerate = vi.fn();
      render(<PuzzleGenerator onGenerate={onGenerate} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'HELLO\nWORLD\nTEST\nFOO\nBAR' } });

      const button = screen.getByRole('button', { name: /generate/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(onGenerate).toHaveBeenCalledTimes(1);
      });
    });
  });
});
```

### 8.2 Test Coverage Requirements

| Component Type | Coverage Goal |
|----------------|---------------|
| Core algorithms | 95%+ |
| React components | 70%+ |
| Utilities | 90%+ |
| Hooks | 80%+ |
| Overall project | 80%+ |

### 8.3 Test Naming

**Rule**: Use descriptive test names that explain what is being tested.

**Good**:
```typescript
it('should place word horizontally when direction is horizontal', () => { ... });
it('should throw ValidationError when word exceeds max length', () => { ... });
it('should render loading spinner while generating puzzle', () => { ... });
```

**Bad**:
```typescript
it('works', () => { ... });
it('test 1', () => { ... });
it('should do the thing', () => { ... });
```

### 8.4 Mocking

**Rule**: Mock external dependencies, not internal logic.

```typescript
// Good - mock external service
vi.mock('@/services/api', () => ({
  fetchWordList: vi.fn().mockResolvedValue(['HELLO', 'WORLD']),
}));

// Good - mock browser API
const mockCanvasContext = {
  fillRect: vi.fn(),
  fillText: vi.fn(),
};

vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
  mockCanvasContext as unknown as CanvasRenderingContext2D
);
```

---

## 9. GIT COMMIT STANDARDS

### 9.1 Commit Message Format

**Rule**: Follow [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

**Examples**:
```
feat(puzzle): add star shape support
fix(pdf): correct margin calculation for 6x9 page size
docs(readme): add installation instructions
refactor(grid): extract shape mask generation to separate module
test(generator): add tests for diagonal word placement
chore(deps): update React to v18.2.0
```

### 9.2 Commit Scope

Common scopes:
- `puzzle`: Puzzle generation logic
- `pdf`: PDF export functionality
- `ui`: UI components
- `api`: API integration
- `store`: State management
- `hooks`: Custom React hooks
- `config`: Configuration files
- `deps`: Dependencies

### 9.3 Commit Body

**Rule**: Use body for complex changes. Explain WHY, not WHAT.

```
feat(puzzle): implement backward word placement

Previously, words could only be placed left-to-right and top-to-bottom.
This adds support for right-to-left and bottom-to-top placement,
increasing puzzle difficulty for hard and expert modes.

Affects difficulty calculation: backward words add +5 to difficulty score.
```

### 9.4 Breaking Changes

**Rule**: Mark breaking changes in footer.

```
feat(api): change PDF generation API signature

BREAKING CHANGE: `generatePDF` now returns Promise<Blob> instead of Blob.
Update all calls to use `await generatePDF(...)`.

Migration:
- Before: const pdf = generatePDF(puzzle);
- After: const pdf = await generatePDF(puzzle);
```

---

## 10. CODE REVIEW CHECKLIST

### 10.1 Before Submitting PR

- [ ] Code compiles without errors (`pnpm build`)
- [ ] All tests pass (`pnpm test`)
- [ ] Linting passes with no errors (`pnpm lint`)
- [ ] Type checking passes (`pnpm type-check`)
- [ ] Code is formatted (`pnpm format`)
- [ ] New code has tests (80%+ coverage)
- [ ] Documentation updated (README, JSDoc)
- [ ] No console.log or debugging code
- [ ] No commented-out code
- [ ] Commit messages follow convention
- [ ] Branch is up-to-date with main

### 10.2 Code Review Criteria

#### Functionality
- [ ] Code works as intended
- [ ] Edge cases handled
- [ ] Error handling present
- [ ] No obvious bugs

#### Code Quality
- [ ] Follows project conventions
- [ ] DRY principle applied
- [ ] Functions are small and focused
- [ ] Naming is clear and consistent
- [ ] No unnecessary complexity

#### Testing
- [ ] Tests cover main functionality
- [ ] Tests cover edge cases
- [ ] Tests are meaningful (not just for coverage)
- [ ] Mocks are appropriate

#### Documentation
- [ ] Public APIs documented
- [ ] Complex logic explained
- [ ] README updated if needed
- [ ] Type definitions are clear

#### Performance
- [ ] No obvious performance issues
- [ ] Large data sets handled efficiently
- [ ] No unnecessary re-renders (React)
- [ ] Assets optimized

#### Security
- [ ] Input validation present
- [ ] No XSS vulnerabilities
- [ ] No hardcoded secrets
- [ ] Dependencies are safe

---

## APPENDIX A: Quick Reference

### TypeScript

```typescript
// Function
function myFunction(param: string): number { ... }

// Interface
interface MyInterface {
  prop: string;
  optional?: number;
}

// Type
type MyType = 'option1' | 'option2';

// Generics
function identity<T>(value: T): T { return value; }
```

### React Component Template

```typescript
import React from 'react';

export interface MyComponentProps {
  /** Description */
  prop: string;
}

/**
 * Component description
 */
export const MyComponent: React.FC<MyComponentProps> = ({ prop }) => {
  return <div>{prop}</div>;
};
```

### Test Template

```typescript
import { describe, it, expect } from 'vitest';

describe('MyFunction', () => {
  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

### Commit Message Template

```
type(scope): short description

Longer explanation if needed.
Why this change was made.

BREAKING CHANGE: if applicable
Fixes #123
```

---

## APPENDIX B: IDE Setup

### VS Code Extensions

Required:
- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features

Recommended:
- Tailwind CSS IntelliSense
- Error Lens
- GitLens
- Auto Import

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

---

## APPENDIX C: Resources

### Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Best Practices
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Testing Library](https://testing-library.com/)

### Tools
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [TypeDoc](https://typedoc.org/)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-20
**Maintained by**: Development Team

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-20 | Development Team | Initial documentation standards |

---

**END OF DOCUMENT**

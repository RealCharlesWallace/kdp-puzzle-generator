# Clara - Quick Start Guide

## Get Up and Running in 5 Minutes

This guide will get you from zero to a running development environment in 5 minutes.

---

## Prerequisites Check

Before starting, verify you have:

```bash
# Check Node.js version (need 18+)
node --version
# Should show v18.x.x or higher

# Check if pnpm is installed
pnpm --version
# If not installed, run: npm install -g pnpm
```

---

## Step 1: Install Dependencies (2 minutes)

```bash
# Navigate to project directory
cd /Users/charlesatchison/Coding/Clara_Project

# Install all dependencies
pnpm install
```

This will install all required packages (~200 MB).

---

## Step 2: Set Up Environment (30 seconds)

```bash
# Copy environment template
cp .env.example .env

# The default values work for local development
# No need to edit unless you want to enable analytics
```

---

## Step 3: Start Development Server (30 seconds)

```bash
# Start the dev server
pnpm dev
```

The app will automatically open at `http://localhost:5173`

You should see:
- Homepage with "Create Professional Word Search Puzzles" heading
- Navigation working
- Generator page accessible

---

## Step 4: Verify Everything Works (1 minute)

### Test the Homepage
1. Open `http://localhost:5173`
2. Click "Start Creating" - should navigate to `/generator`

### Test the Generator Page
1. The page should load without errors
2. You should see:
   - Word input textarea on the left
   - Preview panel on the right
   - Grid size, shape, and difficulty selectors

### Run Tests
```bash
# Run unit tests
pnpm test

# Should show 1 passing test (HomePage test)
```

---

## Step 5: Make Your First Change (1 minute)

Let's verify hot module replacement works:

1. Open `src/pages/Home/index.tsx`
2. Change line 11:
   ```tsx
   // Before
   Create Professional Word Search Puzzles in Seconds

   // After
   Create AMAZING Word Search Puzzles in Seconds
   ```
3. Save the file
4. The browser should auto-reload and show "AMAZING"

If you see the change immediately, everything is working! ✅

---

## What's Next?

Now that you're set up, you can:

### 1. Review the Documentation
- **PROJECT_OUTLINE.md** - Complete project architecture
- **REQUIREMENTS.md** - Detailed feature specifications
- **CODE_DOCUMENTATION_STANDARDS.md** - Coding guidelines
- **PROJECT_TIMELINE.md** - 14-week development roadmap

### 2. Start Development

Based on the timeline (PROJECT_TIMELINE.md), you're on **Day 1** of Week 1:

**Current Tasks (Day 1-2)**:
- ✅ Project setup (DONE!)
- [ ] Implement Grid class (`src/core/algorithm/GridBuilder.ts`)
- [ ] Implement basic word placement algorithm (`src/core/algorithm/WordPlacer.ts`)

**Recommended Next Steps**:
1. Create `src/core/algorithm/GridBuilder.ts`
2. Create `src/core/algorithm/WordPlacer.ts`
3. Write unit tests as you go

### 3. Understand the Code Structure

```
src/
├── pages/          # Page components (Home, Generator)
├── components/     # Reusable UI components (to be built)
├── core/          # Business logic (puzzle algorithm, PDF gen)
│   ├── algorithm/ # 🎯 START HERE - Puzzle generation
│   ├── pdf/       # PDF export (Week 2)
│   └── utils/     # Shared utilities
├── store/         # Zustand state management
│   └── puzzleStore.ts  # ✅ Already set up
└── types/         # TypeScript definitions
    ├── puzzle.ts  # ✅ Core types defined
    └── pdf.ts     # ✅ PDF types defined
```

### 4. Key Files to Explore

**Already Created**:
- `src/types/puzzle.ts` - All type definitions for puzzles
- `src/store/puzzleStore.ts` - State management (connect your algorithm here)
- `src/pages/Generator/index.tsx` - UI is ready, waiting for algorithm

**You Need to Create**:
- `src/core/algorithm/WordSearchGenerator.ts` - Main generator class
- `src/core/algorithm/GridBuilder.ts` - Grid creation
- `src/core/algorithm/WordPlacer.ts` - Word placement logic
- `src/core/algorithm/ShapeManager.ts` - Shape mask generation

---

## Common Commands Reference

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format code with Prettier
pnpm type-check       # TypeScript type checking

# Testing
pnpm test             # Run tests once
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report

# All checks (before committing)
pnpm lint && pnpm type-check && pnpm test
```

---

## Troubleshooting

### Port 5173 already in use
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or specify a different port
pnpm dev --port 3000
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript errors after install
```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Hot reload not working
```bash
# Hard refresh browser
# Cmd/Ctrl + Shift + R

# Or restart dev server
# Ctrl + C to stop, then pnpm dev again
```

---

## VS Code Setup (Recommended)

If using VS Code, install these extensions:

1. **ESLint** - Linting
2. **Prettier** - Formatting
3. **Tailwind CSS IntelliSense** - Tailwind autocomplete
4. **Error Lens** - Inline error display

Then add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## Ready to Code!

You're all set! The foundation is built, and you're ready to implement the core puzzle generation algorithm.

**Recommended First Task**: Implement the `GridBuilder` class

```typescript
// src/core/algorithm/GridBuilder.ts

/**
 * Builds the initial grid structure
 */
export class GridBuilder {
  constructor(private size: number, private shape: ShapeType) {}

  public build(): Grid {
    // TODO: Implement grid creation
    // 1. Create size × size 2D array
    // 2. Apply shape mask
    // 3. Initialize all cells
    return {} as Grid; // Replace with actual implementation
  }
}
```

Good luck, and happy coding! 🚀

---

## Getting Help

- **Documentation**: Check the `docs/` folder
- **Issues**: Create a GitHub issue
- **Questions**: See PROJECT_OUTLINE.md section on architecture

---

**Last Updated**: 2025-11-20

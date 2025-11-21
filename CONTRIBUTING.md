# Contributing to Clara

Thank you for your interest in contributing to Clara! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Review Process](#review-process)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. By participating in this project, you agree to:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/clara.git
cd clara

# Add upstream remote
git remote add upstream https://github.com/original-owner/clara.git
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Create a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

---

## Development Workflow

### 1. Make Changes

- Write code following our [coding standards](CODE_DOCUMENTATION_STANDARDS.md)
- Add tests for new features
- Update documentation as needed

### 2. Test Your Changes

```bash
# Run all checks
pnpm lint
pnpm type-check
pnpm test

# Test manually in browser
pnpm dev
```

### 3. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add star shape support"
```

**Commit types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build, dependencies, tooling

**Examples**:
```
feat(puzzle): add diagonal word placement
fix(pdf): correct margin calculation for circle shape
docs(readme): update installation instructions
test(generator): add unit tests for word validation
```

---

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Avoid `any` type (use `unknown` or generics)
- Always annotate function return types
- Document public APIs with JSDoc comments

**Example**:
```typescript
/**
 * Validates a word list for puzzle generation
 * @param words - Array of words to validate
 * @param config - Puzzle configuration
 * @returns Validation result with errors and warnings
 */
export function validateWords(
  words: string[],
  config: PuzzleConfig
): ValidationResult {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Define explicit props interfaces
- Export interfaces for reusable components

**Example**:
```typescript
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  // Implementation
};
```

### Code Style

- Run `pnpm format` before committing
- Follow existing patterns in the codebase
- Keep functions small and focused (max ~50 lines)
- Use descriptive variable names

See [CODE_DOCUMENTATION_STANDARDS.md](CODE_DOCUMENTATION_STANDARDS.md) for complete guidelines.

---

## Testing

### Unit Tests

Write tests for all new features:

```typescript
// MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Coverage Requirements

- Overall: 80%+
- Core algorithms: 95%+
- Components: 70%+

---

## Submitting Changes

### 1. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 2. Create a Pull Request

- Go to the repository on GitHub
- Click "New Pull Request"
- Select your branch
- Fill out the PR template completely

### 3. PR Checklist

Before submitting, ensure:

- [ ] Code follows project standards
- [ ] All tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm type-check`)
- [ ] Code is formatted (`pnpm format`)
- [ ] Tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] PR description is clear and complete

---

## Review Process

### What to Expect

1. **Initial Review** (1-3 days): A maintainer will review your PR
2. **Feedback**: You may receive requests for changes
3. **Iteration**: Make requested changes and push updates
4. **Approval**: Once approved, a maintainer will merge

### Review Criteria

Reviewers will check:

- **Functionality**: Does it work as intended?
- **Code Quality**: Follows standards, well-structured
- **Testing**: Adequate test coverage
- **Documentation**: Clear comments and docs
- **Performance**: No obvious performance issues
- **Security**: No vulnerabilities introduced

### Responding to Feedback

- Be patient and respectful
- Ask questions if feedback is unclear
- Make requested changes promptly
- Thank reviewers for their time

---

## Types of Contributions

We welcome various types of contributions:

### 🐛 Bug Fixes

- Check [existing issues](https://github.com/yourusername/clara/issues) first
- Create an issue if one doesn't exist
- Reference the issue in your PR

### ✨ New Features

- Open an issue to discuss the feature first
- Get maintainer approval before starting
- Follow the feature request template

### 📝 Documentation

- Fix typos, improve clarity
- Add examples and guides
- Update outdated information

### 🧪 Tests

- Increase test coverage
- Add missing test cases
- Improve test quality

### 🎨 Design

- UI/UX improvements
- Accessibility enhancements
- Visual polish

---

## Project Structure

Understanding the structure helps you contribute effectively:

```
clara/
├── src/
│   ├── components/    # React components
│   │   ├── ui/        # Reusable UI components
│   │   ├── puzzle/    # Puzzle-specific components
│   │   └── features/  # Feature modules
│   ├── core/          # Business logic (no React)
│   │   ├── algorithm/ # Puzzle generation
│   │   ├── pdf/       # PDF export
│   │   └── utils/     # Utilities
│   ├── services/      # External integrations
│   ├── store/         # State management
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   └── types/         # TypeScript types
├── tests/             # Test files
└── docs/              # Documentation
```

### Where to Add Things

- **New puzzle algorithm**: `src/core/algorithm/`
- **New UI component**: `src/components/ui/`
- **New page**: `src/pages/`
- **New type**: `src/types/`
- **New hook**: `src/hooks/`
- **Tests**: `tests/` (mirrors `src/` structure)

---

## Development Tips

### Hot Module Replacement

Save files to see changes instantly:
- Component changes: Auto-reloads
- Style changes: Hot updates
- Type changes: May need manual refresh

### Debugging

```typescript
// Use console.warn or console.error for debugging
console.warn('Debug:', myVariable);

// Remove before committing!
```

### TypeScript Errors

```bash
# Get detailed error info
pnpm type-check

# Restart TS server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Performance Profiling

```typescript
// Use React DevTools Profiler
// Or manual timing
const start = performance.now();
// ... code to measure
console.log(`Took ${performance.now() - start}ms`);
```

---

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/yourusername/clara/discussions)
- **Bugs**: File an [Issue](https://github.com/yourusername/clara/issues)
- **Chat**: Join our [Discord](#) (if available)
- **Email**: support@clara-puzzles.com

---

## Recognition

Contributors will be:
- Listed in the project README
- Credited in release notes
- Acknowledged in the community

Thank you for contributing to Clara! 🎉

---

**Last Updated**: 2025-11-20

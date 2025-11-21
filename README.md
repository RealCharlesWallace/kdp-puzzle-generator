# Clara - KDP Word Search Puzzle Generator

> **Tagline**: Create professional word search puzzles for Amazon KDP in seconds, not hours.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Building](#building)
  - [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Documentation](#documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

**Clara** is a modern, web-based word search puzzle generator specifically designed for Amazon KDP (Kindle Direct Publishing) creators and low-content book publishers. Generate print-ready, professional-quality word search puzzles with custom shapes, multiple difficulty levels, and full KDP compliance in under 60 seconds.

### Why Clara?

- **KDP-Optimized**: PDFs meet Amazon KDP print specifications out of the box
- **Fast**: Generate puzzles in <2 seconds, export PDFs in <5 seconds
- **No Sign-Up Required**: Start creating immediately (MVP free tier)
- **Commercial License Included**: Use generated puzzles in your published books
- **Professional Quality**: Print-ready 300 DPI equivalent PDFs
- **Batch Generation**: Create 50+ puzzles at once (Pro tier)

### Target Users

- KDP low-content book publishers
- Puzzle book creators
- Teachers and educators
- Activity book designers
- Print-on-demand entrepreneurs

---

## Features

### MVP (Current Phase)

- ✅ **Custom Word Lists**: Enter 5-50 words manually or import from CSV
- ✅ **Multiple Grid Sizes**: 10×10, 12×12, 15×15, 20×20
- ✅ **Shaped Puzzles**: Rectangle and Circle shapes
- ✅ **Difficulty Levels**: Easy, Medium, Hard, Expert
- ✅ **Real-Time Preview**: See your puzzle instantly as you generate
- ✅ **Print-Ready PDF Export**: KDP-compliant PDF with answer key
- ✅ **Commercial License**: Use in published books with no restrictions
- ✅ **Mobile Responsive**: Works on desktop, tablet, and mobile

### Phase 2 (In Progress)

- 🔄 **Enhanced Shapes**: Heart, Star, Diamond, Triangle, + seasonal shapes
- 🔄 **Batch Generation**: Create up to 50 puzzles at once
- 🔄 **Themed Word Lists**: 20+ pre-made word list categories
- 🔄 **Custom Styling**: Fonts, colors, grid line thickness

### Phase 3 (Planned)

- 📋 **Full Interior Builder**: Create complete 50-120 page book interiors
- 📋 **Book Templates**: Pre-designed layouts for instant books
- 📋 **Flipbook Preview**: See your entire book before publishing

### Phase 4 (Planned)

- 📋 **AI Word Generator**: Generate themed word lists using AI
- 📋 **User Accounts**: Save and manage projects
- 📋 **Pro Features**: Advanced customization, SVG export, API access

---

## Demo

**Live Demo**: [https://clara-puzzles.com](https://clara-puzzles.com) (placeholder)

**Screenshot Previews**:

```
┌─────────────────────────────────────────────────┐
│  Clara - Word Search Generator                  │
├──────────────┬──────────────────────────────────┤
│              │                                   │
│  Enter Words │      [Preview Canvas]            │
│  HELLO       │       H E L L O W               │
│  WORLD       │       A B C D E F               │
│  PUZZLE      │       W O R L D G               │
│  ...         │       X Y Z P U H               │
│              │       Q R S T Z I               │
│  Grid: 15×15 │       M N O P Z J               │
│  Shape: ○    │       K L M N L K               │
│  Difficulty:  │       E F G H E L               │
│  [Medium]    │                                   │
│              │  Words: HELLO, WORLD, PUZZLE    │
│  [Generate]  │                                   │
└──────────────┴──────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **pnpm**: v8.0.0 or higher (Package manager)
  ```bash
  npm install -g pnpm
  ```
- **Git**: For version control ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/clara.git
   cd clara
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy the example environment file and configure it:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure the following:

   ```env
   # App Configuration
   VITE_APP_NAME=Clara
   VITE_APP_URL=http://localhost:5173

   # Analytics (optional for local development)
   VITE_GA_TRACKING_ID=
   VITE_PLAUSIBLE_DOMAIN=

   # Feature Flags
   VITE_ENABLE_AI_FEATURES=false
   VITE_ENABLE_BATCH_GENERATION=true
   VITE_MAX_FREE_PUZZLES=25

   # Phase 4: Add these when implementing backend features
   # DATABASE_URL=
   # CLERK_SECRET_KEY=
   # STRIPE_SECRET_KEY=
   # OPENAI_API_KEY=
   ```

4. **Verify installation**

   ```bash
   pnpm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser. You should see the Clara homepage.

---

### Development

#### Start the development server

```bash
pnpm run dev
```

The application will be available at `http://localhost:5173` with hot module replacement (HMR) enabled.

#### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint and auto-fix issues |
| `pnpm format` | Format code with Prettier |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm test:coverage` | Generate test coverage report |

#### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** and test locally
   ```bash
   pnpm dev
   ```

3. **Run tests and linting**
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

4. **Commit changes** (follows conventional commits)
   ```bash
   git add .
   git commit -m "feat: add new shape selector component"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

---

### Building

#### Production Build

```bash
pnpm build
```

This will:
- Compile TypeScript to JavaScript
- Bundle and minify code
- Optimize assets
- Generate production-ready files in `dist/`

#### Analyze Bundle Size

```bash
pnpm build --analyze
```

Opens a visual representation of bundle sizes to identify optimization opportunities.

#### Build Output

```
dist/
├── assets/
│   ├── index-[hash].js       # Main application bundle
│   ├── index-[hash].css      # Compiled styles
│   └── [asset]-[hash].[ext]  # Optimized images, fonts
├── index.html                 # Entry HTML
└── favicon.ico
```

---

### Deployment

#### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

   For production:
   ```bash
   vercel --prod
   ```

#### Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login and deploy**
   ```bash
   netlify login
   netlify deploy --prod
   ```

#### Environment Variables (Production)

Set the following environment variables in your hosting platform:

```env
VITE_APP_NAME=Clara
VITE_APP_URL=https://your-domain.com
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_ENABLE_AI_FEATURES=false
VITE_ENABLE_BATCH_GENERATION=true
```

For Phase 4 (backend features), also set:
```env
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
```

---

## Project Structure

```
clara/
├── .github/
│   └── workflows/           # CI/CD workflows
├── docs/                    # Documentation
│   ├── PROJECT_OUTLINE.md   # Comprehensive project plan
│   ├── REQUIREMENTS.md      # Detailed requirements
│   └── CODE_DOCUMENTATION_STANDARDS.md
├── public/                  # Static assets
│   ├── assets/
│   └── samples/             # Sample word lists
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   ├── puzzle/          # Puzzle-specific components
│   │   └── features/        # Feature modules
│   ├── core/                # Core business logic
│   │   ├── algorithm/       # Puzzle generation algorithms
│   │   ├── pdf/             # PDF generation
│   │   ├── validation/      # Input validation
│   │   └── utils/           # Utilities
│   ├── services/            # External service integrations
│   ├── store/               # State management (Zustand)
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript types
│   ├── config/              # Configuration files
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── tests/
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── e2e/                 # End-to-end tests
├── .env.example             # Environment variables template
├── package.json
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── README.md                # This file
└── LICENSE
```

### Key Directories

- **`src/components/`**: All React components, organized by category
- **`src/core/`**: Pure TypeScript business logic (no React dependencies)
- **`src/services/`**: API clients, storage, analytics
- **`src/store/`**: Zustand state management stores
- **`tests/`**: All test files (unit, integration, e2e)

---

## Technology Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI framework | 18.2+ |
| TypeScript | Type safety | 5.0+ |
| Vite | Build tool & dev server | 5.0+ |
| Tailwind CSS | Styling | 3.3+ |
| Zustand | State management | 4.4+ |
| React Hook Form | Form handling | 7.47+ |
| Zod | Schema validation | 3.22+ |

### Core Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| jsPDF | PDF generation | 2.5+ |
| jspdf-autotable | PDF tables | 3.6+ |
| JSZip | ZIP file creation | 3.10+ |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Vitest | Unit testing |
| Playwright | E2E testing |
| TypeDoc | API documentation |
| Storybook | Component documentation |

### Backend (Phase 4)

| Technology | Purpose |
|------------|---------|
| Next.js | Serverless functions |
| PostgreSQL | Database |
| Prisma | ORM |
| Clerk | Authentication |
| Stripe | Payments |
| OpenAI | AI features |

---

## Documentation

### For Users

- **Quick Start Guide**: [docs/user-guide/quick-start.md](docs/user-guide/quick-start.md)
- **Feature Guides**: [docs/user-guide/features/](docs/user-guide/features/)
- **KDP Publishing Guide**: [docs/user-guide/kdp-guide.md](docs/user-guide/kdp-guide.md)
- **FAQ**: [docs/user-guide/faq.md](docs/user-guide/faq.md)

### For Developers

- **Project Outline**: [PROJECT_OUTLINE.md](PROJECT_OUTLINE.md) - Comprehensive project plan
- **Requirements**: [REQUIREMENTS.md](REQUIREMENTS.md) - Detailed specifications
- **Code Documentation Standards**: [CODE_DOCUMENTATION_STANDARDS.md](CODE_DOCUMENTATION_STANDARDS.md)
- **Architecture Guide**: [docs/architecture/overview.md](docs/architecture/overview.md)
- **API Reference**: [docs/api/](docs/api/)
- **Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md)

### Generating API Documentation

```bash
pnpm run docs:generate
```

This generates TypeDoc documentation from code comments and outputs to `docs/api/`.

---

## Testing

### Unit Tests

Run unit tests with Vitest:

```bash
pnpm test              # Run once
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage report
```

**Coverage Goals**:
- Overall: >80%
- Core algorithms: >95%
- Components: >70%

### Integration Tests

```bash
pnpm test:integration
```

Tests interactions between modules (e.g., puzzle generation → PDF export).

### End-to-End Tests

Run E2E tests with Playwright:

```bash
pnpm test:e2e          # Headless mode
pnpm test:e2e:ui       # With UI
```

**Key E2E Flows**:
1. Generate puzzle → Export PDF
2. Batch generation → Download ZIP
3. User signup → Create project → Save

### Manual Testing Checklist

Before each release:

- [ ] Test on Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Verify PDF output in Adobe Acrobat
- [ ] Test print output (actual print to verify KDP compliance)
- [ ] Test error scenarios (invalid input, network failures)

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Quick Contribution Guide

1. **Fork** the repository
2. **Clone** your fork
   ```bash
   git clone https://github.com/YOUR-USERNAME/clara.git
   ```
3. **Create a branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```
4. **Make changes** and **commit**
   ```bash
   git commit -m "feat: add awesome feature"
   ```
5. **Push** to your fork
   ```bash
   git push origin feature/my-new-feature
   ```
6. **Open a Pull Request** on GitHub

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, etc.

**Examples**:
```
feat(puzzle): add star shape support
fix(pdf): correct margin calculation for circle shape
docs(readme): add installation instructions
```

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Commercial Use

Puzzles generated with Clara include a commercial license. You are free to:
- Use generated puzzles in books published on Amazon KDP
- Sell physical or digital puzzle books
- Use in educational materials
- Use in commercial products

**No attribution required.**

---

## Contact

- **Website**: [https://clara-puzzles.com](https://clara-puzzles.com)
- **Email**: support@clara-puzzles.com
- **GitHub Issues**: [https://github.com/yourusername/clara/issues](https://github.com/yourusername/clara/issues)
- **Twitter**: [@ClaraPuzzles](https://twitter.com/ClaraPuzzles)

### Support

- **Documentation**: [https://docs.clara-puzzles.com](https://docs.clara-puzzles.com)
- **FAQ**: [docs/user-guide/faq.md](docs/user-guide/faq.md)
- **Community Forum**: [https://community.clara-puzzles.com](https://community.clara-puzzles.com)

---

## Roadmap

### Q1 2025
- [x] MVP Launch (basic puzzle generation + PDF export)
- [ ] Add 8 additional shapes
- [ ] Implement batch generation

### Q2 2025
- [ ] Full interior builder
- [ ] Book templates
- [ ] User accounts

### Q3 2025
- [ ] AI word list generator
- [ ] Payment & subscriptions
- [ ] Advanced customization

### Q4 2025
- [ ] Mobile app (React Native)
- [ ] Public API
- [ ] Integrations (Canva, BookBolt)

See [PROJECT_OUTLINE.md](PROJECT_OUTLINE.md) for detailed roadmap.

---

## Acknowledgments

- **Word Search Algorithm**: Inspired by various open-source implementations
- **Design**: Built with [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Heroicons](https://heroicons.com/)
- **Fonts**: [Google Fonts](https://fonts.google.com/)

---

## FAQ

### Can I use generated puzzles commercially?

Yes! All puzzles generated with Clara include a commercial license. Use them in your KDP books, activity books, or any commercial products without attribution.

### Do I need to sign up to use Clara?

No sign-up is required for the free tier. You can generate and download puzzles immediately. User accounts are optional (Phase 4) for saving projects and accessing Pro features.

### Are the PDFs KDP-compliant?

Yes, all PDFs are generated to meet Amazon KDP print specifications, including proper margins, page sizes, and resolution.

### Can I request a new feature?

Absolutely! Open an issue on [GitHub](https://github.com/yourusername/clara/issues) or email us at support@clara-puzzles.com.

### Is Clara open source?

The core puzzle generation library is MIT licensed. The full application will have portions that are open source and portions that are proprietary for business features.

---

**Made with ❤️ for KDP Creators**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/clara?style=social)](https://github.com/yourusername/clara)
[![Twitter Follow](https://img.shields.io/twitter/follow/ClaraPuzzles?style=social)](https://twitter.com/ClaraPuzzles)

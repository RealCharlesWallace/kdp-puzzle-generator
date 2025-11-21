# Clara - Detailed Requirements Specification

## Document Information
- **Project**: Clara - KDP Word Search Puzzle Generator
- **Version**: 1.0
- **Date**: 2025-11-20
- **Status**: Draft for Review

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Functional Requirements](#2-functional-requirements)
3. [Non-Functional Requirements](#3-non-functional-requirements)
4. [User Interface Requirements](#4-user-interface-requirements)
5. [Data Requirements](#5-data-requirements)
6. [Integration Requirements](#6-integration-requirements)
7. [Security Requirements](#7-security-requirements)
8. [Performance Requirements](#8-performance-requirements)
9. [Quality Requirements](#9-quality-requirements)
10. [Constraints](#10-constraints)

---

## 1. INTRODUCTION

### 1.1 Purpose
This document specifies the detailed functional and non-functional requirements for Clara, a web-based word search puzzle generator specifically designed for Amazon KDP (Kindle Direct Publishing) creators.

### 1.2 Scope
Clara will enable users to:
- Generate customized word search puzzles in seconds
- Export print-ready PDF files optimized for Amazon KDP specifications
- Create full book interiors with multiple puzzles
- Use AI-powered word list generation (Pro tier)
- Save and manage puzzle projects (Pro tier)

### 1.3 Definitions and Acronyms
- **KDP**: Kindle Direct Publishing (Amazon's self-publishing platform)
- **MVP**: Minimum Viable Product
- **Grid**: The 2D array of letters forming the puzzle
- **Shape**: The outline/boundary of the puzzle (rectangle, circle, heart, etc.)
- **Placed Word**: A word successfully inserted into the grid
- **Answer Key**: A solution sheet showing where all words are located
- **Interior**: Complete book content ready for publishing
- **DPI**: Dots Per Inch (print resolution measurement)

### 1.4 References
- Amazon KDP Print Specifications: https://kdp.amazon.com/en_US/help/topic/G201834180
- Project Outline: PROJECT_OUTLINE.md
- README: README.md

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Core Puzzle Generation (MVP)

#### FR-2.1.1 Word Input
**Priority**: MUST HAVE (MVP)

**Description**: Users must be able to input a list of words to be placed in the puzzle.

**Acceptance Criteria**:
- User can enter words in a text area (one word per line)
- System accepts 5-50 words per puzzle
- Words must be 2-20 characters long
- Only letters A-Z are accepted (case-insensitive)
- Spaces, numbers, and special characters are rejected with clear error message
- Duplicate words are automatically removed
- Empty lines are ignored
- Real-time word count display
- Word list validation before generation

**Error Handling**:
- If word list is empty: "Please enter at least 5 words"
- If word is too long: "Word '[WORD]' exceeds 20 characters"
- If invalid characters: "Word '[WORD]' contains invalid characters (only A-Z allowed)"
- If fewer than 5 words: "Please enter at least 5 words (currently: [COUNT])"

#### FR-2.1.2 Grid Size Selection
**Priority**: MUST HAVE (MVP)

**Description**: Users can select the size of the puzzle grid.

**Acceptance Criteria**:
- Dropdown/slider with preset sizes: 10×10, 12×12, 15×15, 20×20
- Default: 15×15
- Grid size automatically validates against word list (longest word must fit)
- If words won't fit, suggest minimum grid size

**Validation Rules**:
```typescript
minimumGridSize = longestWord.length + 2; // +2 for spacing
if (selectedGridSize < minimumGridSize) {
  suggest(minimumGridSize);
}
```

#### FR-2.1.3 Shape Selection
**Priority**: MUST HAVE (MVP)

**Description**: Users can choose the shape of the puzzle.

**MVP Shapes**:
- Rectangle (default)
- Circle

**Acceptance Criteria**:
- Visual shape selector with preview icons
- Selected shape is highlighted
- Shape preview updates in real-time
- Each shape has a name and description

**Future Shapes** (Post-MVP):
- Heart, Star, Diamond, Triangle
- Seasonal: Pumpkin, Christmas Tree, Easter Egg, Shamrock
- Custom upload (Premium tier)

#### FR-2.1.4 Difficulty Settings
**Priority**: MUST HAVE (MVP)

**Description**: Users can select puzzle difficulty level.

**Difficulty Levels**:

| Level | Directions Allowed | Backwards | Description |
|-------|-------------------|-----------|-------------|
| Easy | Horizontal, Vertical | No | Great for kids and beginners |
| Medium | + Diagonals | No | Moderate challenge |
| Hard | All directions | Yes | Challenging for adults |
| Expert | All directions | Yes | Maximum difficulty + high word density |

**Acceptance Criteria**:
- Clear difficulty selector (buttons or dropdown)
- Tooltip/description for each level
- Difficulty affects word placement algorithm density
- Expert mode attempts maximum word overlap

#### FR-2.1.5 Direction Toggles
**Priority**: MUST HAVE (MVP)

**Description**: Advanced users can manually toggle specific word directions.

**Acceptance Criteria**:
- Checkboxes for: Horizontal, Vertical, Diagonal Down, Diagonal Up, Backwards
- Toggles override difficulty presets
- "Custom" difficulty mode when manual toggles are used
- At least one direction must be enabled

#### FR-2.1.6 Puzzle Generation
**Priority**: MUST HAVE (MVP)

**Description**: System generates a word search puzzle based on user settings.

**Acceptance Criteria**:
- "Generate Puzzle" button prominently displayed
- Generation completes in <2 seconds for grids up to 20×20
- Progress indicator shown during generation
- Successfully places at least 80% of input words (or shows warning)
- Fills empty cells with random letters using weighted letter frequency
- Generates unique puzzle each time (different random seed)

**Algorithm Requirements**:
1. Initialize grid with shape mask
2. Shuffle word list (for randomization)
3. Sort words by length (longest first for better placement)
4. Attempt to place each word:
   - Try random positions up to `gridSize * 10` attempts
   - If random fails, try systematic scan
   - Allow overlap only when letters match
5. Fill remaining cells with random letters
6. Record all placed word positions for answer key

**Success Metrics**:
- 95% success rate for standard word lists
- Graceful degradation when words don't fit
- Clear messaging about unplaced words

#### FR-2.1.7 Real-Time Preview
**Priority**: MUST HAVE (MVP)

**Description**: Users see a live preview of the generated puzzle.

**Acceptance Criteria**:
- Canvas-based grid display
- Clear, readable letters
- Grid lines visible
- Updates immediately after generation
- Responsive sizing (fits container)
- Print-quality rendering

**Visual Requirements**:
- Font: Sans-serif, bold, uppercase
- Grid lines: 1px solid black
- Cell background: White
- Letter color: Black
- Letter size: Auto-calculated to fit cell

#### FR-2.1.8 Word List Display
**Priority**: MUST HAVE (MVP)

**Description**: Display the list of words to find alongside the puzzle.

**Acceptance Criteria**:
- Words displayed in columns (2-4 depending on space)
- Alphabetically sorted (optional toggle)
- Clearly separated from grid
- Matches words actually placed in puzzle (excludes unplaced words)
- Optional checkboxes next to each word

#### FR-2.1.9 Answer Key Generation
**Priority**: MUST HAVE (MVP)

**Description**: System automatically generates a solution showing word locations.

**Acceptance Criteria**:
- Highlights all placed words in the grid
- Different color for each word (or consistent highlight color)
- Clearly shows direction of each word
- Legend showing word list with coordinates (optional)
- Separate page/view from main puzzle

**Visual Approach**:
- Option 1: Highlight letters with background color
- Option 2: Draw lines through found words
- Option 3: Show only found words, remove fill letters

---

### 2.2 PDF Export (MVP)

#### FR-2.2.1 PDF Generation
**Priority**: MUST HAVE (MVP)

**Description**: Users can export puzzles as print-ready PDF files.

**Acceptance Criteria**:
- "Export to PDF" button clearly visible
- Generates two PDFs: Puzzle and Answer Key
- Both PDFs bundled in a ZIP file
- Download starts automatically
- File naming: `wordsearch_[timestamp].zip`

**PDF Specifications**:
- Format: PDF 1.4 or higher
- Page size: 8.5×11 inches (US Letter)
- Orientation: Portrait
- Margins: 0.5" top/bottom, 0.375" left (binding), 0.25" right
- Resolution: 300 DPI equivalent
- Color mode: Grayscale or Black & White
- Fonts: Embedded (Arial or Helvetica)

#### FR-2.2.2 KDP Compliance
**Priority**: MUST HAVE (MVP)

**Description**: PDFs must meet Amazon KDP print specifications.

**KDP Requirements**:
- Minimum margins respected (see FR-2.2.1)
- Bleed: Not required for interior (but supported)
- Safe zone: All content within 0.5" from trim edges
- No RGB color space issues
- Fonts properly embedded
- No security/password restrictions
- No layers or transparency (flatten all)

**Validation**:
- Automated checks before PDF generation
- Warning if content exceeds safe zone
- Test prints validated with KDP previewer

#### FR-2.2.3 Page Layout Options
**Priority**: SHOULD HAVE (MVP)

**Description**: Users can customize PDF layout.

**Options**:
- Title position: Top, Center, None
- Word list position: Below grid, Right side, Separate page
- Page numbers: On/Off
- Footer text: Custom text or blank
- Grid centering: Auto-center on page

**Default Settings**:
- Title: Centered at top
- Word list: Below grid, 3 columns
- Page numbers: Off
- Footer: "© [Year] - Commercial Use Allowed"

#### FR-2.2.4 Batch Download
**Priority**: NICE TO HAVE (Post-MVP)

**Description**: Download multiple puzzles at once.

**Acceptance Criteria**:
- If multiple puzzles generated, bundle all in one ZIP
- Naming: `puzzle_01.pdf`, `puzzle_01_answer.pdf`, etc.
- Maximum 50 puzzles per ZIP (free tier: 1)

---

### 2.3 Word List Management

#### FR-2.3.1 CSV Import
**Priority**: SHOULD HAVE (MVP)

**Description**: Import word lists from CSV files.

**Acceptance Criteria**:
- File upload button
- Accepts .csv and .txt files
- Parses comma-separated or newline-separated words
- Handles headers (ignores first row if detected)
- Maximum file size: 1 MB
- Shows preview before import

**Format Support**:
```csv
word1, word2, word3
word4, word5, word6
```
or
```
word1
word2
word3
```

#### FR-2.3.2 Word Validation
**Priority**: MUST HAVE (MVP)

**Description**: Validate word list before generation.

**Validation Rules**:
1. Word length: 2-20 characters
2. Characters: A-Z only (case-insensitive)
3. No duplicates
4. No empty entries
5. Minimum 5 words
6. Maximum 50 words (free tier)

**Feedback**:
- Green checkmark for valid words
- Red X for invalid words with reason
- Summary: "X valid, Y invalid"

#### FR-2.3.3 Sample Word Lists
**Priority**: SHOULD HAVE (MVP)

**Description**: Provide pre-made word lists for quick testing.

**Sample Lists** (10 minimum):
- Animals (20 words)
- Colors (15 words)
- Countries (25 words)
- Sports (20 words)
- Food (20 words)
- Holidays (15 words)
- Occupations (20 words)
- Weather (15 words)
- Transportation (20 words)
- Nature (20 words)

**Acceptance Criteria**:
- Dropdown or modal to browse samples
- One-click to load sample
- Replaces current word list (with confirmation)
- Can edit after loading

---

### 2.4 Batch Generation (Phase 2)

#### FR-2.4.1 Bulk Puzzle Creation
**Priority**: MUST HAVE (Phase 2)

**Description**: Generate multiple puzzles at once with different words.

**Acceptance Criteria**:
- Input multiple word lists (one per puzzle)
- Set common settings (size, shape, difficulty) for all
- Generate up to 50 puzzles (Pro tier)
- Progress bar showing completion
- Option to cancel mid-generation

**Input Format**:
- Text area with separator (e.g., "---" between lists)
- Or CSV upload with multiple rows
- Or multiple file uploads

**Output**:
- One ZIP file with all puzzles + answer keys
- Organized in folders: puzzles/, answers/
- Numbered sequentially

#### FR-2.4.2 Progress Tracking
**Priority**: MUST HAVE (Phase 2)

**Description**: Show generation progress for batch operations.

**Acceptance Criteria**:
- Progress bar: "Generating puzzle 5 of 50..."
- Time estimate: "Approx. 2 minutes remaining"
- Pause/cancel option
- Error handling: Continue with next puzzle if one fails

---

### 2.5 Interior Builder (Phase 3)

#### FR-2.5.1 Multi-Page Layout
**Priority**: MUST HAVE (Phase 3)

**Description**: Create complete book interiors with multiple puzzles.

**Acceptance Criteria**:
- Select number of pages: 50, 100, 120
- Add puzzles to book (drag-and-drop order)
- Add blank pages, covers, intro pages
- Page preview (thumbnail view)
- Reorder pages
- Delete pages

#### FR-2.5.2 Book Templates
**Priority**: SHOULD HAVE (Phase 3)

**Description**: Pre-designed book templates for quick creation.

**Templates** (minimum 3):
1. **Classic**: Simple puzzles, minimal decoration
2. **Kids**: Larger fonts, fun fonts, illustrations
3. **Premium**: Decorative borders, themed pages
4. **Holiday**: Seasonal themes (Christmas, Halloween, etc.)
5. **Educational**: Difficulty progression, hints

**Template Includes**:
- Cover page (title, subtitle, author)
- Introduction page
- Instructions page
- Puzzle pages (with consistent styling)
- Answer key section
- Back matter (notes pages, etc.)

#### FR-2.5.3 Interior Preview
**Priority**: MUST HAVE (Phase 3)

**Description**: Flipbook-style preview of the final book.

**Acceptance Criteria**:
- Page-by-page navigation
- Zoom in/out
- Full-screen mode
- Page thumbnails sidebar
- Jump to specific page

#### FR-2.5.4 Interior PDF Export
**Priority**: MUST HAVE (Phase 3)

**Description**: Export complete book interior as single PDF.

**Acceptance Criteria**:
- Single PDF file with all pages
- Proper page ordering
- KDP-compliant (meets all FR-2.2.2 requirements)
- File size optimization (under 500 MB)
- Option for bleed or no-bleed

**Special Considerations**:
- Left/right page margins (different for binding)
- Page numbers on correct sides
- Chapter/section breaks

---

### 2.6 AI Features (Phase 4)

#### FR-2.6.1 AI Word List Generator
**Priority**: MUST HAVE (Phase 4)

**Description**: Generate themed word lists using AI.

**Acceptance Criteria**:
- Input: Theme/topic (e.g., "Halloween", "Ocean Animals")
- Output: 20-50 words related to theme
- Adjustable word count
- Difficulty filter (easy words vs. advanced vocabulary)
- Additional context field (e.g., "for kids ages 8-10")
- Rate limit: 100 requests/month (Pro tier)

**API Integration**:
- OpenAI GPT-4 or GPT-3.5-turbo
- Prompt engineering for consistent output
- Validation of AI output (ensure proper format)
- Fallback to error message if API fails

**Example Interaction**:
```
User: "Generate 30 words about space exploration"
System: ROCKET, ASTRONAUT, MOON, MARS, ORBIT, GALAXY, ...
User: "Make them harder"
System: TRAJECTORY, EXOPLANET, NEBULA, PROPULSION, ...
```

#### FR-2.6.2 Puzzle Title Generator
**Priority**: NICE TO HAVE (Phase 4)

**Description**: AI-generated catchy titles for puzzles.

**Acceptance Criteria**:
- Input: Theme or word list
- Output: 5 title suggestions
- Titles formatted for book covers (proper case)
- Option to regenerate
- Rate limit: Included in AI word list quota

**Example Output**:
- "The Ultimate Space Adventure Word Search"
- "Cosmic Word Hunt: 50 Space Puzzles"
- "Explore the Galaxy: Word Search for Kids"

---

### 2.7 User Account Features (Phase 4)

#### FR-2.7.1 User Registration
**Priority**: MUST HAVE (Phase 4)

**Description**: Users can create accounts to access Pro features.

**Acceptance Criteria**:
- Email + password registration
- OAuth (Google, Facebook)
- Email verification required
- Password requirements: 8+ chars, 1 uppercase, 1 number
- Terms of Service acceptance

#### FR-2.7.2 Save Projects
**Priority**: MUST HAVE (Phase 4)

**Description**: Logged-in users can save puzzle projects.

**Acceptance Criteria**:
- "Save Project" button
- Name project
- Add description/tags
- Auto-save every 30 seconds (when logged in)
- "Last saved: [timestamp]" indicator

**Project Data Includes**:
- Word list
- Grid settings (size, shape, difficulty)
- Generated puzzle (if exists)
- PDF settings
- Timestamps (created, modified)

#### FR-2.7.3 Load Projects
**Priority**: MUST HAVE (Phase 4)

**Description**: Users can load saved projects.

**Acceptance Criteria**:
- "My Projects" page
- Grid or list view
- Thumbnail preview of each puzzle
- Search/filter projects
- Sort by: Date created, Date modified, Name
- One-click load

#### FR-2.7.4 Project Management
**Priority**: SHOULD HAVE (Phase 4)

**Description**: Manage saved projects.

**Features**:
- Rename project
- Delete project (with confirmation)
- Duplicate project
- Export project data (JSON)
- Import project data
- Share project (read-only link)

#### FR-2.7.5 Usage Dashboard
**Priority**: MUST HAVE (Phase 4)

**Description**: Users see their usage and limits.

**Dashboard Metrics**:
- Puzzles generated this month: X / Y
- AI requests used: X / Y
- Storage used: X MB / Y MB
- Subscription tier
- Days until renewal
- Upgrade CTA (for free users)

---

### 2.8 Payment & Subscription (Phase 4)

#### FR-2.8.1 Subscription Tiers
**Priority**: MUST HAVE (Phase 4)

**Description**: Three pricing tiers with different features.

See PROJECT_OUTLINE.md Section 8.1 for complete tier details.

**Acceptance Criteria**:
- Pricing page clearly shows tiers
- Feature comparison table
- Monthly and yearly options
- Yearly shows savings ("Save 20%")
- Free tier always available (no credit card required)

#### FR-2.8.2 Payment Processing
**Priority**: MUST HAVE (Phase 4)

**Description**: Stripe integration for payments.

**Acceptance Criteria**:
- Stripe Checkout for subscriptions
- Support credit/debit cards
- Support Apple Pay, Google Pay
- PCI compliance (handled by Stripe)
- Automatic billing on renewal
- Email receipts

#### FR-2.8.3 Subscription Management
**Priority**: MUST HAVE (Phase 4)

**Description**: Users can manage their subscriptions.

**Features**:
- View current plan
- Upgrade/downgrade
- Cancel subscription
- Update payment method
- View billing history
- Download invoices

**Business Rules**:
- Upgrades: Immediate access, prorated charge
- Downgrades: Takes effect next billing cycle
- Cancellation: Access until end of period
- Grace period: 3 days after failed payment

---

## 3. NON-FUNCTIONAL REQUIREMENTS

### 3.1 Performance

#### NFR-3.1.1 Page Load Time
- **Requirement**: Initial page load <3 seconds on average broadband
- **Measurement**: Lighthouse performance score >90
- **Priority**: MUST HAVE

#### NFR-3.1.2 Puzzle Generation Speed
- **Requirement**:
  - 15×15 grid: <500ms
  - 20×20 grid: <1 second
  - 30×30 grid: <3 seconds
- **Priority**: MUST HAVE

#### NFR-3.1.3 PDF Generation Speed
- **Requirement**:
  - Single puzzle: <2 seconds
  - 50-puzzle batch: <60 seconds
- **Priority**: SHOULD HAVE

#### NFR-3.1.4 Batch Processing
- **Requirement**: Process 50 puzzles without browser freezing
- **Implementation**: Use Web Workers for background processing
- **Priority**: MUST HAVE (Phase 2)

### 3.2 Scalability

#### NFR-3.2.1 Concurrent Users
- **Requirement**: Support 1,000 concurrent users
- **Infrastructure**: Serverless architecture (Vercel)
- **Priority**: SHOULD HAVE

#### NFR-3.2.2 Database Scalability
- **Requirement**: Support 10,000 users, 100,000 saved puzzles
- **Database**: PostgreSQL with proper indexing
- **Priority**: MUST HAVE (Phase 4)

### 3.3 Availability

#### NFR-3.3.1 Uptime
- **Requirement**: 99.9% uptime (MVP), 99.95% (Phase 4)
- **Monitoring**: UptimeRobot, Vercel monitoring
- **Priority**: MUST HAVE

#### NFR-3.3.2 Error Handling
- **Requirement**: Graceful degradation, no crashes
- **Implementation**: Try-catch blocks, error boundaries
- **Priority**: MUST HAVE

### 3.4 Usability

#### NFR-3.4.1 Mobile Responsiveness
- **Requirement**: Fully functional on mobile (tablets & phones)
- **Breakpoints**: 320px, 768px, 1024px, 1440px
- **Priority**: MUST HAVE

#### NFR-3.4.2 Accessibility
- **Requirement**: WCAG 2.1 Level AA compliance
- **Features**: Keyboard navigation, screen reader support, color contrast
- **Priority**: SHOULD HAVE

#### NFR-3.4.3 Browser Support
- **Requirement**: Latest 2 versions of Chrome, Firefox, Safari, Edge
- **Testing**: Cross-browser testing in CI/CD
- **Priority**: MUST HAVE

### 3.5 Maintainability

#### NFR-3.5.1 Code Quality
- **Requirement**:
  - TypeScript strict mode
  - ESLint: 0 errors
  - Test coverage: >80%
- **Priority**: MUST HAVE

#### NFR-3.5.2 Documentation
- **Requirement**: All public APIs documented with JSDoc/TSDoc
- **Priority**: MUST HAVE

### 3.6 Security

#### NFR-3.6.1 Data Privacy
- **Requirement**: GDPR compliant, privacy policy posted
- **Priority**: MUST HAVE

#### NFR-3.6.2 Authentication Security
- **Requirement**: OAuth 2.0, JWT tokens, secure password hashing
- **Priority**: MUST HAVE (Phase 4)

#### NFR-3.6.3 Rate Limiting
- **Requirement**: Prevent abuse (100 generations/hour for free tier)
- **Priority**: SHOULD HAVE

---

## 4. USER INTERFACE REQUIREMENTS

### 4.1 Layout

#### UIR-4.1.1 Header
- Logo (top-left)
- Navigation links: Home, Generator, Pricing, About
- User account menu (Phase 4): Login, Profile, Dashboard
- Mobile: Hamburger menu

#### UIR-4.1.2 Main Generator Interface

**Layout (Desktop)**:
```
┌─────────────────────────────────────────────────┐
│              HEADER                              │
├──────────────┬──────────────────────────────────┤
│              │                                   │
│  Controls    │      Puzzle Preview              │
│  Panel       │      (Canvas)                    │
│              │                                   │
│  - Words     │                                   │
│  - Size      │                                   │
│  - Shape     │                                   │
│  - Difficulty│                                   │
│              │                                   │
│  [Generate]  │                                   │
│              ├───────────────────────────────────┤
│              │  Word List Display               │
│              │  (2-3 columns)                   │
├──────────────┴───────────────────────────────────┤
│  Export Panel                                    │
│  [Download PDF]  [Download ZIP]                 │
└─────────────────────────────────────────────────┘
```

**Mobile**: Stacked layout (controls → preview → export)

#### UIR-4.1.3 Color Scheme
- Primary: #4F46E5 (Indigo)
- Secondary: #10B981 (Green)
- Background: #F9FAFB (Light Gray)
- Text: #111827 (Dark Gray)
- Accent: #F59E0B (Amber)

### 4.2 Components

#### UIR-4.2.1 Button Styles
- Primary: Filled background, white text
- Secondary: Outlined, colored text
- Disabled: Gray, low opacity
- States: Default, Hover, Active, Disabled

#### UIR-4.2.2 Form Controls
- Text inputs: Border, rounded corners, focus state
- Dropdowns: Custom styled (not native select)
- Checkboxes/Radio: Custom styled, accessible
- Sliders: Visual track, thumb, value label

#### UIR-4.2.3 Feedback Elements
- Loading spinner: Centered, animated
- Toast notifications: Top-right, auto-dismiss
- Error messages: Inline (below input) or modal
- Success messages: Green toast or inline

### 4.3 Interactions

#### UIR-4.3.1 Micro-interactions
- Button hover: Slight scale, color change
- Loading states: Skeleton screens
- Puzzle generation: Progress animation
- PDF export: Download progress bar

#### UIR-4.3.2 Keyboard Shortcuts (Nice to have)
- Ctrl/Cmd + G: Generate puzzle
- Ctrl/Cmd + E: Export PDF
- Ctrl/Cmd + S: Save project (logged in)

---

## 5. DATA REQUIREMENTS

### 5.1 Data Storage

#### DR-5.1.1 Client-Side Storage (MVP)
- **Technology**: localStorage
- **Purpose**: Save user preferences
- **Data Stored**:
  - Last used settings (grid size, shape, difficulty)
  - Recent word lists (max 5)
  - UI preferences (theme, layout)
- **Capacity**: 5 MB limit

#### DR-5.1.2 Server-Side Storage (Phase 4)
- **Technology**: PostgreSQL
- **Purpose**: User accounts, saved projects
- **Data Stored**: See Section 6.2 in PROJECT_OUTLINE.md

### 5.2 Data Retention

#### DR-5.2.1 User Data
- Active users: Indefinite
- Inactive users (no login 2 years): Delete after email notice
- Deleted accounts: 30-day soft delete, then permanent

#### DR-5.2.2 Generated Puzzles
- Anonymous users: Not stored
- Free tier: 30 days
- Pro tier: 1 year
- Premium tier: Indefinite

### 5.3 Data Export

#### DR-5.3.1 User Data Export
- Users can download all their data (GDPR requirement)
- Format: JSON
- Includes: Projects, puzzles, settings, usage history

---

## 6. INTEGRATION REQUIREMENTS

### 6.1 Third-Party Services

#### IR-6.1.1 OpenAI API (Phase 4)
- **Purpose**: AI word generation
- **Model**: GPT-3.5-turbo or GPT-4
- **Rate Limit**: 50 requests/minute
- **Fallback**: Graceful error message if API unavailable

#### IR-6.1.2 Stripe (Phase 4)
- **Purpose**: Payment processing
- **Integration**: Stripe Checkout, Customer Portal
- **Webhooks**: Handle subscription events
- **Testing**: Stripe test mode

#### IR-6.1.3 Clerk / NextAuth (Phase 4)
- **Purpose**: User authentication
- **Methods**: Email/password, Google OAuth, Facebook OAuth
- **Session**: JWT tokens

#### IR-6.1.4 Analytics
- **Google Analytics 4**: Page views, events
- **Plausible** (optional): Privacy-friendly alternative
- **Events to Track**:
  - Puzzle generated
  - PDF downloaded
  - Subscription started
  - Error occurred

### 6.2 APIs to Expose (Phase 8)

#### IR-6.2.1 Public API
- RESTful API for developers
- Rate limit: 1,000 requests/day (free), 10,000 (paid)
- Endpoints:
  - POST /api/v1/generate
  - GET /api/v1/shapes
  - POST /api/v1/export

---

## 7. SECURITY REQUIREMENTS

### 7.1 Authentication & Authorization

#### SR-7.1.1 Password Security
- Hashing: bcrypt (cost factor 12)
- No plain-text password storage
- Password reset via email token (expires 1 hour)

#### SR-7.1.2 Session Management
- JWT tokens (expires 7 days)
- Refresh tokens (expires 30 days)
- Secure, HttpOnly cookies

#### SR-7.1.3 Authorization
- Role-based access: Free, Pro, Premium, Admin
- Feature flags for tier-specific features
- API endpoints check user tier

### 7.2 Data Security

#### SR-7.2.1 Encryption
- Data in transit: HTTPS only (TLS 1.3)
- Data at rest: Database encryption (managed by provider)
- Sensitive data (API keys): Environment variables, never in code

#### SR-7.2.2 Input Validation
- Sanitize all user inputs
- Prevent XSS: Escape HTML in user-generated content
- Prevent SQL injection: Use ORM (Prisma)
- File upload: Validate file type, size, scan for malware

### 7.3 Compliance

#### SR-7.3.1 GDPR
- Privacy policy page
- Cookie consent banner
- Right to access: User data export
- Right to deletion: Account deletion with data purge
- Data processing agreement for EU users

#### SR-7.3.2 CCPA (California)
- "Do Not Sell My Info" link
- Privacy policy includes CCPA requirements

---

## 8. PERFORMANCE REQUIREMENTS

### 8.1 Client-Side Performance

#### PR-8.1.1 Bundle Size
- Initial bundle: <500 KB (gzipped)
- Code splitting: Lazy load routes
- Tree shaking: Remove unused code

#### PR-8.1.2 Rendering
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- Cumulative Layout Shift: <0.1

### 8.2 Server-Side Performance (Phase 4)

#### PR-8.2.1 API Response Time
- 95th percentile: <200ms
- 99th percentile: <500ms
- Database queries: <50ms average

#### PR-8.2.2 Caching
- Static assets: CDN with long cache (1 year)
- API responses: Cache where appropriate
- User data: Redis cache for hot data

---

## 9. QUALITY REQUIREMENTS

### 9.1 Testing

#### QR-9.1.1 Test Coverage
- Unit tests: >80% coverage
- Integration tests: Critical paths covered
- E2E tests: Main user flows (generate → export)

#### QR-9.1.2 Test Automation
- CI/CD: Tests run on every commit
- Pre-commit hooks: Linting, formatting
- Automated visual regression tests (Chromatic)

### 9.2 Code Quality

#### QR-9.2.1 Linting
- ESLint: Airbnb config + custom rules
- Prettier: Enforce code formatting
- 0 errors, 0 warnings before merge

#### QR-9.2.2 Type Safety
- TypeScript strict mode
- No `any` types (except where absolutely necessary)
- All props, functions, API responses typed

---

## 10. CONSTRAINTS

### 10.1 Technical Constraints

#### C-10.1.1 Browser Limitations
- localStorage: 5 MB limit
- Canvas size: Max 32,767 pixels (browser limit)
- PDF generation: Client-side limited to ~100 pages

#### C-10.1.2 Third-Party Limits
- OpenAI: Rate limits, cost per request
- Stripe: Payment processing fees (2.9% + $0.30)
- Vercel: Free tier limits (100 GB bandwidth/month)

### 10.2 Business Constraints

#### C-10.2.1 Budget
- Initial development: $2,000-$5,000
- Monthly operating costs: $50-$200 (until profitable)
- Marketing budget: $200-$500/month

#### C-10.2.2 Timeline
- MVP launch: 2-3 weeks
- Phase 2-4: 3-6 months
- Break-even target: 12 months

### 10.3 Regulatory Constraints

#### C-10.3.1 Legal
- Must have Terms of Service
- Must have Privacy Policy
- Must comply with GDPR, CCPA
- Must include commercial license with each puzzle

---

## APPENDIX A: USER STORIES

### Epic 1: Basic Puzzle Generation

**US-1.1**: As a KDP creator, I want to quickly enter a list of words so I can generate a puzzle without typing each word individually.

**US-1.2**: As a user, I want to choose different puzzle shapes (like hearts or stars) so my puzzle books have visual variety.

**US-1.3**: As a puzzle creator, I want to set difficulty levels so I can create appropriate puzzles for different age groups.

**US-1.4**: As a user, I want to see a real-time preview of my puzzle so I can verify it looks correct before exporting.

**US-1.5**: As a KDP publisher, I want to download a print-ready PDF that meets Amazon's specifications so I don't have to manually format it.

### Epic 2: Batch & Interior Creation

**US-2.1**: As a low-content publisher, I want to generate 50 puzzles at once so I can create full books quickly.

**US-2.2**: As a book creator, I want to build a complete interior with cover pages and instructions so I have a ready-to-publish product.

**US-2.3**: As a user, I want to preview my full book before exporting so I can catch any issues.

### Epic 3: AI & Automation

**US-3.1**: As a busy publisher, I want AI to generate themed word lists for me so I don't have to manually research words.

**US-3.2**: As a user, I want AI to suggest catchy book titles so my books stand out on Amazon.

### Epic 4: Account & Management

**US-4.1**: As a returning user, I want to save my projects so I can continue working on them later.

**US-4.2**: As a Pro user, I want to see my usage limits so I know when I'm approaching my tier's cap.

**US-4.3**: As a user, I want to upgrade to Pro to access advanced features when I'm ready to scale my business.

---

## APPENDIX B: ACCEPTANCE TEST SCENARIOS

### Test Scenario 1: Basic Puzzle Generation

**Preconditions**: User on homepage, not logged in

**Steps**:
1. Enter 10 words in word input field
2. Select 15×15 grid size
3. Select circle shape
4. Select "Medium" difficulty
5. Click "Generate Puzzle"
6. Verify puzzle appears in preview
7. Verify all 10 words are visible in word list
8. Click "Download PDF"
9. Verify ZIP file downloads
10. Open ZIP, verify 2 PDFs present (puzzle + answer key)
11. Open puzzle PDF, verify it's 8.5×11", properly formatted

**Expected Result**: User receives print-ready PDF in <10 seconds from start

---

### Test Scenario 2: Error Handling

**Preconditions**: User on generator page

**Steps**:
1. Enter word "SUPERCALIFRAGILISTICEXPIALIDOCIOUS" (34 characters)
2. Select 20×20 grid
3. Click "Generate"
4. Verify error: "Word 'SUPERCALIFRAGILISTICEXPIALIDOCIOUS' exceeds 20 characters"
5. Remove long word
6. Enter only 2 words
7. Click "Generate"
8. Verify error: "Please enter at least 5 words (currently: 2)"

**Expected Result**: Clear, helpful error messages prevent invalid generation

---

## REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-20 | Development Team | Initial requirements document |

---

## APPROVAL

**Prepared by**: Development Team
**Reviewed by**: [Project Owner]
**Approved by**: [Stakeholder]
**Date**: [Approval Date]

---

**END OF DOCUMENT**

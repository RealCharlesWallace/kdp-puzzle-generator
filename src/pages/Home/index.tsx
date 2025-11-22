import React, { useMemo, useState } from 'react';
import { usePuzzleStore } from '@/store/puzzleStore';
import { PuzzleCanvas } from '@/components/puzzle/PuzzleCanvas';
import { DocsModal } from '@/components/docs/DocsModal';
import { DifficultyLevel, ShapeType } from '@/types/puzzle';
import { getAllThemes, getTheme } from '@/config/themes';
import { GridBuilder } from '@/core/algorithm/GridBuilder';

const TOAST_DURATION = 2500;
const AMAZON_BOOK_URL =
  'https://www.amazon.com/dp/B0DKG36F8W?ref_=cm_sw_r_cp_ud_dp_08S189X0VN54S6HVCD99&starsLeft=1&skipTwisterOG=1';

const HomePage: React.FC = () => {
  const {
    currentPuzzle,
    words,
    config,
    title,
    isGenerating,
    error,
    pdfTheme,
    exportCopies,
    setWords,
    setTitle,
    setGridSize,
    setShape,
    setDifficulty,
    setPdfTheme,
    generatePuzzle,
  } = usePuzzleStore();

  const [inputWords, setInputWords] = useState(words.join('\n'));
  const [titleInput, setTitleInput] = useState(title);
  const [copyCount, setCopyCount] = useState(1);
  const [showSolution, setShowSolution] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const maxTitleLength = 60;
  const minWords = 5;

  const capacityInfo = useMemo(() => {
    const totalLetters = words.reduce((sum, w) => sum + w.replace(/\s+/g, '').length, 0);
    const availableCells = GridBuilder.getAvailableCellCount(config.gridSize, config.shape);
    let suggestedSize: number | null = null;
    for (let size = config.gridSize; size <= 25; size++) {
      if (GridBuilder.getAvailableCellCount(size, config.shape) >= totalLetters) {
        suggestedSize = size;
        break;
      }
    }
    return {
      totalLetters,
      availableCells,
      fits: totalLetters <= availableCells,
      suggestedSize,
    };
  }, [words, config.gridSize, config.shape]);

  const generationBlocked = !capacityInfo.fits || isGenerating;

  const handleWordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setInputWords(e.target.value);
    setWords(e.target.value.split('\n').filter((w) => w.trim().length > 0));
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.split(/[,;\t]/)[0]?.trim() ?? '')
      .filter((l) => l.length > 0);
    setWords(lines);
    setInputWords(lines.join('\n'));
    event.target.value = '';
  };

  const handleGenerateClick = (): void => {
    if (words.length < minWords) {
      const remaining = Math.max(0, minWords - words.length);
      const plural = remaining === 1 ? '' : 's';
      setToastMessage(`Add ${remaining} more word${plural} (minimum ${minWords}) to generate.`);
      setTimeout(() => setToastMessage(null), TOAST_DURATION);
      return;
    }

    const hasMultiWordLine = words.some((w) => w.trim().includes(' '));
    if (hasMultiWordLine) {
      setToastMessage('Each line should be a single word — remove spaces or put one per line.');
      setTimeout(() => setToastMessage(null), TOAST_DURATION);
      return;
    }
    void generatePuzzle();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 font-sans text-slate-900">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/60 bg-white/85 px-6 py-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-amber-100 bg-gradient-to-br from-pink-200 to-amber-200 shadow">
            <img
              src={`${import.meta.env.BASE_URL}assets/images/clara_wallace_photo.jpg`}
              alt="Clara Wallace"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            Hello Word Puzzles
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowDocs(true)}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-slate-900 to-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md active:scale-95"
          >
            Instructions
          </button>
        </div>
      </header>

      <main className="container mx-auto flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:h-[calc(100vh-73px)] lg:flex-row lg:gap-8">
        {/* Toast notification */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-amber-200 bg-white px-4 py-3 text-sm font-medium text-amber-800 shadow-lg">
            {toastMessage}
          </div>
        )}
        {/* Sidebar Controls */}
        <aside className="flex w-full flex-shrink-0 flex-col gap-6 rounded-xl border border-white/60 bg-white p-6 pb-8 shadow-sm lg:w-80">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Configuration
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="puzzle-title">
                Puzzle Title
              </label>
              <div className="space-y-1">
                <input
                  id="puzzle-title"
                  type="text"
                  value={titleInput}
                  maxLength={maxTitleLength}
                  onChange={(e) => {
                    setTitleInput(e.target.value);
                    setTitle(e.target.value);
                  }}
                  placeholder="e.g. Summer Vacation Search"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <div className="text-right text-xs text-slate-500">
                  {titleInput.length}/{maxTitleLength}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Grid Size</label>
                <label className="cursor-pointer text-xs font-semibold text-blue-600 underline">
                  <input
                    type="file"
                    accept=".csv,text/csv,text/tab-separated-values,.tsv,.txt"
                    className="hidden"
                    onChange={(e) => {
                      void handleCsvUpload(e);
                    }}
                  />
                  Import CSV
                </label>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                <input
                  type="range"
                  min="10"
                  max="25"
                  value={config.gridSize}
                  onChange={(e) => setGridSize(parseInt(e.target.value))}
                  className="flex-1 cursor-pointer accent-blue-600"
                />
                <span className="w-6 text-center font-mono text-sm font-semibold text-blue-600">
                  {config.gridSize}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Difficulty</label>
              <div className="relative">
                <select
                  value={config.difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Shape</label>
              <div className="relative">
                <select
                  value={config.shape}
                  onChange={(e) => setShape(e.target.value as ShapeType)}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="circle">Circle</option>
                  <option value="star">Star</option>
                  <option value="diamond">Diamond</option>
                  <option value="triangle">Triangle</option>
                  <option value="heart">Heart</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">PDF Theme</label>
              <div className="relative">
                <select
                  value={pdfTheme}
                  onChange={(e) => setPdfTheme(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {getAllThemes().map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name} - {theme.description}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ▼
                </div>
              </div>
              <p className="text-xs italic text-slate-500">
                Choose a color theme for your exported PDF
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Word List
              </h2>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                {words.length}
              </span>
            </div>
            <textarea
              value={inputWords}
              onChange={handleWordsChange}
              placeholder="Enter words (one per line)"
              className="w-full flex-1 resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-600">
                <span>⚠️</span>
                {error}
              </div>
            )}
            {!capacityInfo.fits && (
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
                {capacityInfo.suggestedSize
                  ? `Your words need at least a ${capacityInfo.suggestedSize}×${capacityInfo.suggestedSize} grid. Increase the grid size or shorten the list.`
                  : 'Your word list is too large for the maximum grid size (25). Reduce word count or word lengths.'}
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={handleGenerateClick}
                disabled={generationBlocked}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Puzzle'}
              </button>
              <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
                <label className="text-sm font-medium text-slate-700" htmlFor="copy-count">
                  Copies
                </label>
                <input
                  id="copy-count"
                  type="number"
                  min={1}
                  max={25}
                  value={copyCount}
                  onChange={(e) => setCopyCount(Math.max(1, Math.min(25, Number(e.target.value))))}
                  className="w-20 rounded border border-slate-200 px-2 py-1 text-sm"
                />
                <button
                  onClick={() => {
                    void exportCopies(copyCount);
                  }}
                  className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md sm:ml-auto sm:w-auto"
                >
                  Export PDFs
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="relative flex min-h-[60vh] flex-1 flex-col gap-6 overflow-hidden rounded-xl border border-white/60 bg-white p-6 shadow-sm md:min-h-0">
          <div className="z-10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Preview</h2>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={showSolution}
                  onChange={(e) => setShowSolution(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Show Solution
              </label>
            </div>
          </div>

          <div className="relative flex min-h-[50vh] flex-1 items-center justify-center overflow-hidden md:min-h-0">
            {/* Background Pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            ></div>

            {currentPuzzle ? (
              <div className="animate-in fade-in zoom-in-95 relative z-10 h-full max-h-full w-full max-w-full transform transition-all duration-500 ease-out">
                <PuzzleCanvas
                  grid={currentPuzzle.grid}
                  placedWords={currentPuzzle.placedWords}
                  showSolution={showSolution}
                  theme={getTheme(pdfTheme)}
                />
              </div>
            ) : (
              <div className="z-10 text-center text-slate-400">
                <div className="animate-bounce-slow mb-6 text-7xl opacity-50">🧩</div>
                <p className="mb-2 text-xl font-semibold text-slate-600">Ready to create?</p>
                <p className="mx-auto max-w-xs text-sm text-slate-500">
                  Add your words in the sidebar and click Generate to create your first puzzle.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="px-4 pb-10 sm:px-6">
        <div className="container mx-auto">
          <a
            href={AMAZON_BOOK_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="View I Like to Cut & Paste Stuff on Amazon"
            className="mt-6 block rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 via-rose-50 to-sky-50 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 md:p-8"
          >
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div className="flex gap-4">
                <div className="hidden h-32 w-24 shrink-0 overflow-hidden rounded-xl border border-amber-100 shadow-sm sm:block">
                  <img
                    src={`${import.meta.env.BASE_URL}book-cover.jpg`}
                    alt="I Like to Cut & Paste Stuff book cover"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    Recommended
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    I Like to Cut &amp; Paste Stuff
                  </h3>
                  <p className="text-sm font-medium text-slate-700">
                    Explore Your Creativity In This Creative Gluebook Journal for All Ages
                  </p>
                  <p className="text-xs text-slate-600">
                    Part of Hello Imagination Creative Activity Books · 4.6★ (14 reviews)
                  </p>
                  <p className="text-xs text-slate-600 md:max-w-xl">
                    Gluebooking fun with hand-drawn art, journaling prompts, and ready-to-cut images
                    to jump-start creative play for kids, tweens, teens, and adults.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:justify-end">
                <div className="h-32 w-24 shrink-0 overflow-hidden rounded-xl border border-amber-100 shadow-sm sm:hidden">
                  <img
                    src={`${import.meta.env.BASE_URL}book-cover.jpg`}
                    alt="I Like to Cut & Paste Stuff book cover"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm">
                  <span>View on Amazon</span>
                  <span aria-hidden>↗</span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </footer>

      {/* Documentation Modal */}
      <DocsModal isOpen={showDocs} onClose={() => setShowDocs(false)} />
    </div>
  );
};

export default HomePage;

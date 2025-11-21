import React, { useMemo, useState } from 'react';
import { usePuzzleStore } from '@/store/puzzleStore';
import { PuzzleCanvas } from '@/components/puzzle/PuzzleCanvas';
import { DocsModal } from '@/components/docs/DocsModal';
import { DifficultyLevel, ShapeType } from '@/types/puzzle';
import { getAllThemes, getTheme } from '@/config/themes';
import { GridBuilder } from '@/core/algorithm/GridBuilder';

const TOAST_DURATION = 2500;

const HomePage: React.FC = () => {
  const {
    currentPuzzle,
    words,
    config,
    title,
    isGenerating,
    error,
    pdfTheme,
    setWords,
    setTitle,
    setGridSize,
    setShape,
    setDifficulty,
    setPdfTheme,
    generatePuzzle,
    exportPDF,
  } = usePuzzleStore();

  const [inputWords, setInputWords] = useState(words.join('\n'));
  const [titleInput, setTitleInput] = useState(title);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans text-slate-900">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-md">
            C
          </div>
          <h1 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            Clara
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowDocs(true)}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Documentation
          </button>
          <button
            onClick={() => exportPDF(true)}
            disabled={!currentPuzzle}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export PDF
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
        <aside className="flex w-full flex-shrink-0 flex-col gap-6 rounded-xl border border-white/50 bg-white/60 p-6 pb-8 shadow-sm backdrop-blur-sm lg:w-80">
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
              <label className="text-sm font-medium text-slate-700">Grid Size</label>
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
            <button
              onClick={handleGenerateClick}
              disabled={generationBlocked}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Puzzle'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <section className="relative flex min-h-[60vh] flex-1 flex-col gap-6 overflow-hidden rounded-xl border border-white/50 bg-white/60 p-6 shadow-sm backdrop-blur-sm md:min-h-0">
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

      {/* Documentation Modal */}
      <DocsModal isOpen={showDocs} onClose={() => setShowDocs(false)} />
    </div>
  );
};

export default HomePage;

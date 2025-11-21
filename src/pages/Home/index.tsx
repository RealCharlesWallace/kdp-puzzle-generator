import React, { useState } from 'react';
import { usePuzzleStore } from '@/store/puzzleStore';
import { PuzzleCanvas } from '@/components/puzzle/PuzzleCanvas';
import { DocsModal } from '@/components/docs/DocsModal';
import { DifficultyLevel, ShapeType } from '@/types/puzzle';
import { getAllThemes, getTheme } from '@/config/themes';

const HomePage: React.FC = () => {
  const {
    currentPuzzle,
    words,
    config,
    isGenerating,
    error,
    pdfTheme,
    setWords,
    setGridSize,
    setShape,
    setDifficulty,
    setPdfTheme,
    generatePuzzle,
    exportPDF,
  } = usePuzzleStore();

  const [inputWords, setInputWords] = useState(words.join('\n'));
  const [showSolution, setShowSolution] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const handleWordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputWords(e.target.value);
    setWords(e.target.value.split('\n').filter((w) => w.trim().length > 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans text-slate-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
            C
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Clara</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowDocs(true)}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Documentation
          </button>
          <button
            onClick={() => exportPDF(true)}
            disabled={!currentPuzzle}
            className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export PDF
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 flex gap-8 h-[calc(100vh-73px)]">
        {/* Sidebar Controls */}
        <aside className="w-80 flex-shrink-0 flex flex-col gap-6 overflow-y-auto pb-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Configuration
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Grid Size</label>
              <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                <input
                  type="range"
                  min="10"
                  max="25"
                  value={config.gridSize}
                  onChange={(e) => setGridSize(parseInt(e.target.value))}
                  className="flex-1 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm font-mono font-semibold text-blue-600 w-6 text-center">{config.gridSize}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Difficulty</label>
              <div className="relative">
                <select
                  value={config.difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="circle">Circle</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm appearance-none cursor-pointer"
                >
                  {getAllThemes().map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name} - {theme.description}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                Choose a color theme for your exported PDF
              </p>
            </div>
          </div>

          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Word List
              </h2>
              <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                {words.length}
              </span>
            </div>
            <textarea
              value={inputWords}
              onChange={handleWordsChange}
              placeholder="Enter words (one per line)"
              className="w-full flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none shadow-sm"
            />
            {error && (
              <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                <span>⚠️</span>
                {error}
              </div>
            )}
            <button
              onClick={() => generatePuzzle()}
              disabled={isGenerating || words.length < 5}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {isGenerating ? 'Generating...' : 'Generate Puzzle'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 min-h-0 flex flex-col gap-6 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm overflow-hidden relative">
          <div className="flex items-center justify-between z-10">
            <h2 className="text-lg font-semibold text-slate-800">Preview</h2>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer select-none hover:text-slate-900 transition-colors">
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

          <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {currentPuzzle ? (
              <div className="relative z-10 h-full w-full max-h-full max-w-full transform transition-all duration-500 ease-out animate-in fade-in zoom-in-95">
                <PuzzleCanvas
                  grid={currentPuzzle.grid}
                  placedWords={currentPuzzle.placedWords}
                  showSolution={showSolution}
                  theme={getTheme(pdfTheme)}
                />
              </div>
            ) : (
              <div className="text-center text-slate-400 z-10">
                <div className="mb-6 text-7xl opacity-50 animate-bounce-slow">🧩</div>
                <p className="text-xl font-semibold text-slate-600 mb-2">Ready to create?</p>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
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

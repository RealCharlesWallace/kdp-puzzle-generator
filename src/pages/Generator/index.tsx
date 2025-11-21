import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePuzzleStore } from '@/store/puzzleStore';

/**
 * Generator page component
 * Main puzzle generation interface
 */
export function GeneratorPage(): JSX.Element {
  const {
    words,
    setWords,
    config,
    setGridSize,
    setShape,
    setDifficulty,
    isGenerating,
    error,
    generatePuzzle,
  } = usePuzzleStore();

  const [wordInput, setWordInput] = useState('');

  const handleWordInputChange = (value: string): void => {
    setWordInput(value);
    const wordList = value
      .split('\n')
      .map((w) => w.trim().toUpperCase())
      .filter((w) => w.length > 0);
    setWords(wordList);
  };

  const handleGenerate = async (): Promise<void> => {
    await generatePuzzle();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container-custom flex items-center justify-between py-4">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Clara
          </Link>
          <nav className="flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/generator" className="font-semibold text-primary-600">
              Generator
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Puzzle Settings</h2>

              {/* Word Input */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Words (one per line)
                </label>
                <textarea
                  value={wordInput}
                  onChange={(e) => handleWordInputChange(e.target.value)}
                  placeholder="HELLO&#10;WORLD&#10;PUZZLE&#10;CREATOR&#10;AWESOME"
                  className="h-48 w-full rounded-lg border border-gray-300 p-3 font-mono text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {words.length} words entered (minimum 5 required)
                </p>
              </div>

              {/* Grid Size */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Grid Size</label>
                <select
                  value={config.gridSize}
                  onChange={(e) => setGridSize(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value={10}>10 × 10</option>
                  <option value={12}>12 × 12</option>
                  <option value={15}>15 × 15</option>
                  <option value={20}>20 × 20</option>
                </select>
              </div>

              {/* Shape */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Shape</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShape('rectangle')}
                    className={`rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                      config.shape === 'rectangle'
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Rectangle
                  </button>
                  <button
                    onClick={() => setShape('circle')}
                    className={`rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                      config.shape === 'circle'
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Circle
                  </button>
                </div>
              </div>

              {/* Difficulty */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Difficulty</label>
                <select
                  value={config.difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || words.length < 5}
                className="w-full rounded-lg bg-primary-600 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isGenerating ? 'Generating...' : 'Generate Puzzle'}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Preview</h2>
              <div className="flex min-h-[500px] items-center justify-center rounded-lg bg-gray-50">
                <p className="text-gray-500">
                  {words.length < 5
                    ? 'Enter at least 5 words to generate a puzzle'
                    : 'Click "Generate Puzzle" to see preview'}
                </p>
              </div>

              {/* Export Panel (placeholder) */}
              <div className="mt-6 flex gap-4">
                <button
                  disabled
                  className="flex-1 rounded-lg bg-gray-300 py-2 font-medium text-gray-500"
                >
                  Download PDF
                </button>
                <button
                  disabled
                  className="flex-1 rounded-lg bg-gray-300 py-2 font-medium text-gray-500"
                >
                  Download ZIP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
          <div>
            <h2 className="text-2xl font-bold">Clara Documentation</h2>
            <p className="mt-1 text-sm text-blue-100">KDP Word Search Puzzle Generator</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="prose prose-slate max-w-none">
            {/* Quick Start */}
            <section className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="text-2xl">🚀</span> Quick Start
              </h3>
              <ol className="space-y-3 text-slate-700">
                <li>
                  <strong>Enter Words:</strong> Type your words in the sidebar (one per line,
                  minimum 5 words)
                </li>
                <li>
                  <strong>Configure:</strong> Adjust grid size (10-25), difficulty, and shape
                </li>
                <li>
                  <strong>Choose Theme:</strong> Select a PDF theme for your export
                </li>
                <li>
                  <strong>Generate:</strong> Click &quot;Generate Puzzle&quot; to create your word
                  search
                </li>
                <li>
                  <strong>Export:</strong> Click &quot;Export PDF&quot; to download your puzzle
                </li>
              </ol>
            </section>

            {/* Configuration */}
            <section className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="text-2xl">⚙️</span> Configuration Options
              </h3>

              <div className="space-y-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <h4 className="mb-2 font-semibold text-slate-900">Grid Size (10-25)</h4>
                  <p className="text-sm text-slate-600">
                    Larger grids can fit more words. Recommended: 15-20 for most puzzles.
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <h4 className="mb-2 font-semibold text-slate-900">Difficulty Levels</h4>
                  <ul className="ml-4 space-y-1 text-sm text-slate-600">
                    <li>
                      <strong>Easy:</strong> Horizontal and vertical only
                    </li>
                    <li>
                      <strong>Medium:</strong> Adds diagonal directions
                    </li>
                    <li>
                      <strong>Hard:</strong> Includes reverse directions
                    </li>
                    <li>
                      <strong>Expert:</strong> All directions including reverse diagonals
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <h4 className="mb-2 font-semibold text-slate-900">Shapes</h4>
                  <ul className="ml-4 space-y-1 text-sm text-slate-600">
                    <li>
                      <strong>Rectangle:</strong> Standard full grid
                    </li>
                    <li>
                      <strong>Circle:</strong> Circular masked grid
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* PDF Themes */}
            <section className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="text-2xl">🎨</span> PDF Themes
              </h3>
              <p className="mb-4 text-slate-700">
                Choose from 8 professionally designed themes. The preview shows exactly how your PDF
                will look!
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-3">
                  <div className="font-semibold text-indigo-900">Modern Gradient</div>
                  <div className="text-xs text-indigo-700">Sleek & contemporary</div>
                </div>
                <div className="rounded-lg border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-3">
                  <div className="font-semibold text-cyan-900">Ocean Waves</div>
                  <div className="text-xs text-cyan-700">Cool blue tones</div>
                </div>
                <div className="rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50 p-3">
                  <div className="font-semibold text-orange-900">Sunset Glow</div>
                  <div className="text-xs text-orange-700">Warm & inviting</div>
                </div>
                <div className="rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-3">
                  <div className="font-semibold text-green-900">Forest Green</div>
                  <div className="text-xs text-green-700">Natural & organic</div>
                </div>
                <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-3">
                  <div className="font-semibold text-purple-900">Royal Purple</div>
                  <div className="text-xs text-purple-700">Elegant & premium</div>
                </div>
                <div className="rounded-lg border border-pink-200 bg-gradient-to-br from-pink-50 to-yellow-50 p-3">
                  <div className="font-semibold text-pink-900">Candy Pop</div>
                  <div className="text-xs text-pink-700">Fun for kids</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 p-3">
                  <div className="font-semibold text-slate-900">Minimal Clean</div>
                  <div className="text-xs text-slate-700">Ultra-clean design</div>
                </div>
                <div className="rounded-lg border border-cyan-400 bg-gradient-to-br from-slate-900 to-cyan-900 p-3">
                  <div className="font-semibold text-cyan-100">Neon Glow</div>
                  <div className="text-xs text-cyan-300">High contrast</div>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="text-2xl">💡</span> Pro Tips
              </h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>
                    <strong>Word Length:</strong> Mix short and long words for better placement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>
                    <strong>Grid Size:</strong> Use larger grids (20+) for 15+ words
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>
                    <strong>Preview:</strong> Use &quot;Show Solution&quot; to verify word placement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>
                    <strong>KDP Publishing:</strong> All PDFs are formatted for Amazon KDP
                    (8.5&quot; x 11&quot;)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>
                    <strong>Answer Key:</strong> PDFs include an answer key on page 2
                  </span>
                </li>
              </ul>
            </section>

            {/* Troubleshooting */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="text-2xl">🔧</span> Troubleshooting
              </h3>
              <div className="space-y-3">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h4 className="mb-1 font-semibold text-amber-900">Words not fitting?</h4>
                  <p className="text-sm text-amber-800">
                    Increase grid size or reduce number of words
                  </p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h4 className="mb-1 font-semibold text-amber-900">Export button disabled?</h4>
                  <p className="text-sm text-amber-800">Generate a puzzle first before exporting</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h4 className="mb-1 font-semibold text-amber-900">Preview cut off?</h4>
                  <p className="text-sm text-amber-800">
                    The canvas auto-scales - try zooming your browser
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">Version 1.0.0 • Built for KDP Publishers</p>
            <button
              onClick={onClose}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

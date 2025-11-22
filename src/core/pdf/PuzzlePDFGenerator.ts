import { jsPDF } from 'jspdf';
import { Puzzle } from '@/types/puzzle';
import { PuzzleTheme, getTheme } from '@/config/themes';

export interface PDFExportOptions {
  pageSize: '8.5x11' | '8x10' | '6x9' | '7x10';
  includeAnswerKey: boolean;
  title?: string;
  themeId?: string;
}

export class PuzzlePDFGenerator {
  static generate(puzzle: Puzzle, options: PDFExportOptions): jsPDF {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: this.getPageFormat(options.pageSize),
    });

    const theme = getTheme(options.themeId || 'classic');

    // Add puzzle page
    this.addPuzzlePage(doc, puzzle, options, theme);

    // Add answer key if requested
    if (options.includeAnswerKey) {
      doc.addPage();
      this.addAnswerKeyPage(doc, puzzle, theme);
    }

    return doc;
  }

  /** Create separate docs for puzzle and answer key */
  static createPuzzleAndAnswer(
    puzzle: Puzzle,
    options: PDFExportOptions
  ): { puzzleDoc: jsPDF; answerDoc: jsPDF } {
    const puzzleDoc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: this.getPageFormat(options.pageSize),
    });
    const theme = getTheme(options.themeId || 'classic');
    this.addPuzzlePage(puzzleDoc, puzzle, { ...options, includeAnswerKey: false }, theme);

    const answerDoc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: this.getPageFormat(options.pageSize),
    });
    this.addAnswerKeyPage(answerDoc, puzzle, theme);

    return { puzzleDoc, answerDoc };
  }

  private static getPageFormat(size: string): [number, number] {
    const formats: Record<string, [number, number]> = {
      '8.5x11': [8.5, 11],
      '8x10': [8, 10],
      '6x9': [6, 9],
      '7x10': [7, 10],
    };
    return formats[size] || [8.5, 11];
  }

  private static hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      return [0, 0, 0];
    }
    const [, r = '00', g = '00', b = '00'] = result;
    return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
  }

  private static addPuzzlePage(
    doc: jsPDF,
    puzzle: Puzzle,
    options: PDFExportOptions,
    theme: PuzzleTheme
  ): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Margins (KDP safe zones)
    const margin = {
      top: 0.5,
      bottom: 0.5,
      left: 0.5,
      right: 0.5,
    };

    // Background color
    const bgRgb = this.hexToRgb(theme.colors.background);
    doc.setFillColor(bgRgb[0], bgRgb[1], bgRgb[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Title
    const title = options.title || puzzle.title || 'Word Search Puzzle';
    doc.setFontSize(theme.style.titleSize);
    doc.setFont(theme.fonts.title, 'bold');
    const titleRgb = this.hexToRgb(theme.colors.titleColor);
    doc.setTextColor(titleRgb[0], titleRgb[1], titleRgb[2]);
    doc.text(title, pageWidth / 2, margin.top + 0.3, { align: 'center' });

    // Calculate grid dimensions with padding to keep word list clear (units are inches)
    const availableWidth = pageWidth - margin.left - margin.right;
    const availableHeight = pageHeight - margin.top - margin.bottom - 2; // leave room for words
    const maxGridSize = Math.min(availableWidth, availableHeight);
    const cellSizeIn = Math.min(Math.max(maxGridSize / puzzle.grid.size, 0.18), 0.45); // clamp cell size in inches
    const cellSizePt = cellSizeIn * 72; // convert to points for font sizing
    const gridSize = cellSizeIn * puzzle.grid.size;
    const letterScale = Math.max(0.5, Math.min(theme.style.gridLetterSize / 100, 0.8));
    const gridLineWidth = Math.max(0.01, Math.min(0.05, cellSizeIn * 0.08)); // inches

    // Center the grid
    const gridX = (pageWidth - gridSize) / 2;
    const gridY = margin.top + 0.8;

    // Draw grid
    doc.setFontSize(cellSizePt * letterScale);
    doc.setFont(theme.fonts.grid, 'normal');

    const borderRgb = this.hexToRgb(theme.colors.gridBorder);
    doc.setDrawColor(borderRgb[0], borderRgb[1], borderRgb[2]);
    doc.setLineWidth(gridLineWidth);

    const letterRgb = this.hexToRgb(theme.colors.letterColor);
    const cellBg = this.hexToRgb(theme.colors.cellBackground);
    const cellBgAlt = this.hexToRgb(theme.colors.cellBackgroundAlt);

    for (let row = 0; row < puzzle.grid.size; row++) {
      for (let col = 0; col < puzzle.grid.size; col++) {
        const cell = puzzle.grid.cells[row]?.[col];
        if (!cell || cell.masked) {
          continue;
        }

        const x = gridX + col * cellSizeIn;
        const y = gridY + row * cellSizeIn;

        // Cell fill (alternating)
        const isAlt = (row + col) % 2 === 0;
        const fill = theme.style.useAlternatingCells ? (isAlt ? cellBg : cellBgAlt) : cellBg;
        doc.setFillColor(fill[0], fill[1], fill[2]);
        doc.rect(x, y, cellSizeIn, cellSizeIn, 'FD');

        // Draw cell border
        doc.rect(x, y, cellSizeIn, cellSizeIn);

        // Draw letter
        if (cell.letter) {
          doc.setTextColor(letterRgb[0], letterRgb[1], letterRgb[2]);
          doc.text(cell.letter, x + cellSizeIn / 2, y + cellSizeIn / 2, {
            align: 'center',
            baseline: 'middle',
          });
        }
      }
    }

    // Word list
    const wordListY = gridY + gridSize + 0.4;
    doc.setFontSize(theme.style.wordListSize);
    doc.setFont(theme.fonts.wordList, 'bold');
    const wordListRgb = this.hexToRgb(theme.colors.wordListColor);
    doc.setTextColor(wordListRgb[0], wordListRgb[1], wordListRgb[2]);
    doc.text('Find these words:', pageWidth / 2, wordListY, { align: 'center' });

    // Arrange words in columns
    const columns = 3;
    const columnWidth = Math.min(availableWidth / columns, 2);
    const wordsPerColumn = Math.ceil(puzzle.words.length / columns);
    const totalWordsHeight = wordsPerColumn * 0.2;
    const wordsTop = wordListY + 0.2;
    const wordsBlockWidth = columnWidth * columns;
    const wordsStartX = (pageWidth - wordsBlockWidth) / 2;

    doc.setFont(theme.fonts.wordList, 'normal');
    puzzle.words.forEach((word, index) => {
      const column = Math.floor(index / wordsPerColumn);
      const row = index % wordsPerColumn;
      const x = wordsStartX + column * columnWidth;
      const y = wordsTop + row * 0.2;

      if (y < pageHeight - margin.bottom && y < wordListY + totalWordsHeight + 0.2) {
        doc.text(`• ${word.toUpperCase()}`, x, y);
      }
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      'Generated by Clara - KDP Word Search Puzzle Generator',
      pageWidth / 2,
      pageHeight - 0.3,
      { align: 'center' }
    );
  }

  private static addAnswerKeyPage(doc: jsPDF, puzzle: Puzzle, theme: PuzzleTheme): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = {
      top: 0.5,
      bottom: 0.5,
      left: 0.5,
      right: 0.5,
    };

    // Background color
    const bgRgb = this.hexToRgb(theme.colors.gridBackground);
    doc.setFillColor(bgRgb[0], bgRgb[1], bgRgb[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Title
    doc.setFontSize(theme.style.titleSize);
    doc.setFont(theme.fonts.title, 'bold');
    const titleRgb = this.hexToRgb(theme.colors.titleColor);
    doc.setTextColor(titleRgb[0], titleRgb[1], titleRgb[2]);
    doc.text('Answer Key', pageWidth / 2, margin.top + 0.3, { align: 'center' });

    // Calculate grid dimensions
    const availableWidth = pageWidth - margin.left - margin.right;
    const availableHeight = pageHeight - margin.top - margin.bottom - 1;
    const gridSize = Math.min(availableWidth, availableHeight);
    const cellSizeIn = gridSize / puzzle.grid.size;
    const cellSizePt = cellSizeIn * 72;

    // Center the grid
    const gridX = (pageWidth - gridSize) / 2;
    const gridY = margin.top + 0.8;

    // Draw grid with highlighted words
    const letterScale = Math.max(0.5, Math.min(theme.style.gridLetterSize / 100, 0.8));
    const lineWidth = Math.max(0.01, Math.min(0.05, cellSizeIn * 0.08));

    doc.setFontSize(cellSizePt * letterScale);
    doc.setFont(theme.fonts.grid, 'normal');

    const borderRgb = this.hexToRgb(theme.colors.gridBorder);
    doc.setDrawColor(borderRgb[0], borderRgb[1], borderRgb[2]);
    doc.setLineWidth(lineWidth);

    const highlightRgb = this.hexToRgb(theme.colors.answerHighlight);
    const letterRgb = this.hexToRgb(theme.colors.letterColor);
    const cellBg = this.hexToRgb(theme.colors.cellBackground);
    const cellBgAlt = this.hexToRgb(theme.colors.cellBackgroundAlt);

    // First pass: draw all cells
    for (let row = 0; row < puzzle.grid.size; row++) {
      for (let col = 0; col < puzzle.grid.size; col++) {
        const cell = puzzle.grid.cells[row]?.[col];
        if (!cell || cell.masked) {
          continue;
        }

        const x = gridX + col * cellSizeIn;
        const y = gridY + row * cellSizeIn;

        // Highlight cells that are part of words
        if (cell.isPartOfWord) {
          doc.setFillColor(highlightRgb[0], highlightRgb[1], highlightRgb[2]);
          doc.rect(x, y, cellSizeIn, cellSizeIn, 'FD');
        } else {
          const isAlt = (row + col) % 2 === 0;
          const fill = theme.style.useAlternatingCells ? (isAlt ? cellBg : cellBgAlt) : cellBg;
          doc.setFillColor(fill[0], fill[1], fill[2]);
          doc.rect(x, y, cellSizeIn, cellSizeIn, 'FD');
        }

        // Draw letter
        if (cell.letter) {
          doc.setTextColor(letterRgb[0], letterRgb[1], letterRgb[2]);
          doc.text(cell.letter, x + cellSizeIn / 2, y + cellSizeIn / 2, {
            align: 'center',
            baseline: 'middle',
          });
        }
      }
    }

    // Draw hollow ovals around found words
    const lineRgb = this.hexToRgb(theme.colors.answerLine);
    doc.setDrawColor(lineRgb[0], lineRgb[1], lineRgb[2]);
    doc.setLineWidth(Math.max(0.01, cellSizeIn * 0.12));
    doc.setLineCap('round');

    puzzle.placedWords.forEach((word) => {
      if (word.positions.length === 0) {
        return;
      }

      const startPos = word.positions[0];
      const endPos = word.positions[word.positions.length - 1];

      if (!startPos || !endPos) {
        return;
      }

      const startX = gridX + startPos.col * cellSizeIn + cellSizeIn / 2;
      const startY = gridY + startPos.row * cellSizeIn + cellSizeIn / 2;
      const endX = gridX + endPos.col * cellSizeIn + cellSizeIn / 2;
      const endY = gridY + endPos.row * cellSizeIn + cellSizeIn / 2;

      const centerX = (startX + endX) / 2;
      const centerY = (startY + endY) / 2;
      const dx = endX - startX;
      const dy = endY - startY;
      const length = Math.sqrt(dx * dx + dy * dy);

      // Axis-aligned oval around the word so letters stay visible
      const radiusX = length / 2 + cellSizeIn * 0.35;
      const radiusY = cellSizeIn * 0.7;

      doc.ellipse(centerX, centerY, radiusX, radiusY, 'S');
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      'Generated by Clara - KDP Word Search Puzzle Generator',
      pageWidth / 2,
      pageHeight - 0.3,
      { align: 'center' }
    );
  }

  static download(puzzle: Puzzle, options: PDFExportOptions): void {
    const doc = this.generate(puzzle, options);
    const themeName = options.themeId || 'classic';
    const filename = `word-search-${themeName}-${Date.now()}.pdf`;
    doc.save(filename);
  }
}

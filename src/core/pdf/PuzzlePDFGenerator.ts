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
        const bgRgb = this.hexToRgb(theme.colors.gridBackground);
        doc.setFillColor(bgRgb[0], bgRgb[1], bgRgb[2]);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Title
        const title = options.title || puzzle.title || 'Word Search Puzzle';
        doc.setFontSize(theme.style.titleSize);
        doc.setFont(theme.fonts.title, 'bold');
        const titleRgb = this.hexToRgb(theme.colors.titleColor);
        doc.setTextColor(titleRgb[0], titleRgb[1], titleRgb[2]);
        doc.text(title, pageWidth / 2, margin.top + 0.3, { align: 'center' });

        // Calculate grid dimensions
        const availableWidth = pageWidth - margin.left - margin.right;
        const availableHeight = pageHeight - margin.top - margin.bottom - 1.5;
        const gridSize = Math.min(availableWidth, availableHeight * 0.7);
        const cellSize = gridSize / puzzle.grid.size;

        // Center the grid
        const gridX = (pageWidth - gridSize) / 2;
        const gridY = margin.top + 0.8;

        // Draw grid
        doc.setFontSize(cellSize * theme.style.gridLetterSize);
        doc.setFont(theme.fonts.grid, 'normal');

        const borderRgb = this.hexToRgb(theme.colors.gridBorder);
        doc.setDrawColor(borderRgb[0], borderRgb[1], borderRgb[2]);
        doc.setLineWidth(theme.style.gridBorderWidth);

        const letterRgb = this.hexToRgb(theme.colors.letterColor);

        for (let row = 0; row < puzzle.grid.size; row++) {
            for (let col = 0; col < puzzle.grid.size; col++) {
                const cell = puzzle.grid.cells[row]?.[col];
                if (!cell || cell.masked) {
                    continue;
                }

                const x = gridX + col * cellSize;
                const y = gridY + row * cellSize;

                // Draw cell border
                doc.rect(x, y, cellSize, cellSize);

                // Draw letter
                if (cell.letter) {
                    doc.setTextColor(letterRgb[0], letterRgb[1], letterRgb[2]);
                    doc.text(
                        cell.letter,
                        x + cellSize / 2,
                        y + cellSize / 2 + cellSize * 0.15,
                        { align: 'center' }
                    );
                }
            }
        }

        // Word list
        const wordListY = gridY + gridSize + 0.3;
        doc.setFontSize(theme.style.wordListSize);
        doc.setFont(theme.fonts.wordList, 'bold');
        const wordListRgb = this.hexToRgb(theme.colors.wordListColor);
        doc.setTextColor(wordListRgb[0], wordListRgb[1], wordListRgb[2]);
        doc.text('Find these words:', margin.left, wordListY);

        // Arrange words in columns
        const columns = 3;
        const columnWidth = availableWidth / columns;
        const wordsPerColumn = Math.ceil(puzzle.words.length / columns);

        doc.setFont(theme.fonts.wordList, 'normal');
        puzzle.words.forEach((word, index) => {
            const column = Math.floor(index / wordsPerColumn);
            const row = index % wordsPerColumn;
            const x = margin.left + column * columnWidth;
            const y = wordListY + 0.2 + row * 0.2;

            if (y < pageHeight - margin.bottom) {
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

    private static addAnswerKeyPage(
        doc: jsPDF,
        puzzle: Puzzle,
        theme: PuzzleTheme
    ): void {
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
        const cellSize = gridSize / puzzle.grid.size;

        // Center the grid
        const gridX = (pageWidth - gridSize) / 2;
        const gridY = margin.top + 0.8;

        // Draw grid with highlighted words
        doc.setFontSize(cellSize * theme.style.gridLetterSize);
        doc.setFont(theme.fonts.grid, 'normal');

        const borderRgb = this.hexToRgb(theme.colors.gridBorder);
        doc.setDrawColor(borderRgb[0], borderRgb[1], borderRgb[2]);
        doc.setLineWidth(theme.style.gridBorderWidth);

        const highlightRgb = this.hexToRgb(theme.colors.answerHighlight);
        const letterRgb = this.hexToRgb(theme.colors.letterColor);

        // First pass: draw all cells
        for (let row = 0; row < puzzle.grid.size; row++) {
            for (let col = 0; col < puzzle.grid.size; col++) {
                const cell = puzzle.grid.cells[row]?.[col];
                if (!cell || cell.masked) {
                    continue;
                }

                const x = gridX + col * cellSize;
                const y = gridY + row * cellSize;

                // Highlight cells that are part of words
                if (cell.isPartOfWord) {
                    doc.setFillColor(highlightRgb[0], highlightRgb[1], highlightRgb[2]);
                    doc.rect(x, y, cellSize, cellSize, 'FD');
                } else {
                    doc.rect(x, y, cellSize, cellSize);
                }

                // Draw letter
                if (cell.letter) {
                    doc.setTextColor(letterRgb[0], letterRgb[1], letterRgb[2]);
                    doc.text(
                        cell.letter,
                        x + cellSize / 2,
                        y + cellSize / 2 + cellSize * 0.15,
                        { align: 'center' }
                    );
                }
            }
        }

        // Draw lines through found words
        const lineRgb = this.hexToRgb(theme.colors.answerLine);
        doc.setDrawColor(lineRgb[0], lineRgb[1], lineRgb[2]);
        doc.setLineWidth(cellSize * 0.3);
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

            const startX = gridX + startPos.col * cellSize + cellSize / 2;
            const startY = gridY + startPos.row * cellSize + cellSize / 2;
            const endX = gridX + endPos.col * cellSize + cellSize / 2;
            const endY = gridY + endPos.row * cellSize + cellSize / 2;

            doc.line(startX, startY, endX, endY);
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

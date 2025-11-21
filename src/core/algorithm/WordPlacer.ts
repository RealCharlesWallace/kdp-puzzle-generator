import { Grid, PlacedWord, Direction, Position } from '../../types/puzzle';

export class WordPlacer {
    static placeWords(
        grid: Grid,
        words: string[],
        directions: Direction[]
    ): { placedWords: PlacedWord[]; unplacedWords: string[] } {
        const placedWords: PlacedWord[] = [];
        const unplacedWords: string[] = [];

        // Sort words by length (longest first) to improve placement success
        const sortedWords = [...words].sort((a, b) => b.length - a.length);

        for (const word of sortedWords) {
            const placement = this.tryPlaceWord(grid, word, directions);
            if (placement) {
                placedWords.push(placement);
                this.commitPlacement(grid, placement);
            } else {
                unplacedWords.push(word);
            }
        }

        return { placedWords, unplacedWords };
    }

    private static tryPlaceWord(
        grid: Grid,
        word: string,
        directions: Direction[]
    ): PlacedWord | null {
        const maxAttempts = 100;
        const size = grid.size;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);
            const direction = directions[Math.floor(Math.random() * directions.length)];

            if (direction && this.canPlaceWord(grid, word, row, col, direction)) {
                return {
                    id: crypto.randomUUID(),
                    word,
                    startRow: row,
                    startCol: col,
                    direction,
                    positions: this.getWordPositions(word, row, col, direction),
                    difficulty: 1, // Placeholder
                };
            }
        }

        return null;
    }

    private static canPlaceWord(
        grid: Grid,
        word: string,
        row: number,
        col: number,
        direction: Direction
    ): boolean {
        const positions = this.getWordPositions(word, row, col, direction);

        // Check bounds and conflicts
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            if (!pos) continue;
            const { row: r, col: c } = pos;

            // Check bounds
            if (r < 0 || r >= grid.size || c < 0 || c >= grid.size) return false;

            // Check mask
            const cell = grid.cells[r]?.[c];
            if (!cell || cell.masked) return false;

            // Check conflicts
            if (cell.letter && cell.letter !== word[i]) return false;
        }

        return true;
    }

    private static getWordPositions(
        word: string,
        startRow: number,
        startCol: number,
        direction: Direction
    ): Position[] {
        const positions: Position[] = [];
        let r = startRow;
        let c = startCol;

        const dr = this.getDeltaRow(direction);
        const dc = this.getDeltaCol(direction);

        for (let i = 0; i < word.length; i++) {
            positions.push({ row: r, col: c });
            r += dr;
            c += dc;
        }

        return positions;
    }

    private static getDeltaRow(direction: Direction): number {
        switch (direction) {
            case 'vertical':
            case 'diagonal_down':
            case 'diagonal_up_reverse':
                return 1;
            case 'vertical_reverse':
            case 'diagonal_up':
            case 'diagonal_down_reverse':
                return -1;
            default:
                return 0;
        }
    }

    private static getDeltaCol(direction: Direction): number {
        switch (direction) {
            case 'horizontal':
            case 'diagonal_down':
            case 'diagonal_up':
                return 1;
            case 'horizontal_reverse':
            case 'diagonal_down_reverse':
            case 'diagonal_up_reverse':
                return -1;
            default:
                return 0;
        }
    }

    private static commitPlacement(grid: Grid, placement: PlacedWord): void {
        placement.positions.forEach((pos, index) => {
            const cell = grid.cells[pos.row]?.[pos.col];
            if (cell) {
                cell.letter = placement.word[index] || '';
                cell.isPartOfWord = true;
                cell.wordIds.push(placement.id);
            }
        });
    }
}

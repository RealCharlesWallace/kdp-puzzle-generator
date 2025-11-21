import { Grid, GridCell, ShapeType } from '../../types/puzzle';

export class GridBuilder {
  static createGrid(size: number, shape: ShapeType): Grid {
    const shapeMask = this.generateShapeMask(shape, size);
    const cells: GridCell[][] = [];

    for (let row = 0; row < size; row++) {
      const rowCells: GridCell[] = [];
      for (let col = 0; col < size; col++) {
        rowCells.push({
          letter: '',
          row,
          col,
          isPartOfWord: false,
          wordIds: [],
          masked: !(shapeMask[row]?.[col] ?? false),
        });
      }
      cells.push(rowCells);
    }

    return {
      size,
      cells,
      shape,
      shapeMask,
    };
  }

  static getAvailableCellCount(size: number, shape: ShapeType): number {
    const mask = this.generateShapeMask(shape, size);
    let count = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (mask[r]?.[c]) {
          count++;
        }
      }
    }
    return count;
  }

  private static generateShapeMask(shape: ShapeType, size: number): boolean[][] {
    const mask: boolean[][] = Array.from({ length: size }, () => Array<boolean>(size).fill(true));

    if (shape === 'circle') {
      const center = (size - 1) / 2;
      const radius = size / 2;

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const distance = Math.sqrt(Math.pow(row - center, 2) + Math.pow(col - center, 2));
          if (distance > radius) {
            const rowMask = mask[row];
            if (rowMask && rowMask[col] !== undefined) {
              rowMask[col] = false;
            }
          }
        }
      }
    }

    return mask;
  }
}

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
            mask[row][col] = false;
          }
        }
      }
      return mask;
    }

    if (shape === 'diamond') {
      const center = (size - 1) / 2;
      const maxDist = center;
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const dist = Math.abs(row - center) + Math.abs(col - center);
          if (dist > maxDist) {
            mask[row][col] = false;
          }
        }
      }
      return mask;
    }

    if (shape === 'triangle') {
      // Upright triangle
      for (let row = 0; row < size; row++) {
        const span = Math.floor(((row / (size - 1)) * (size - 1)) / 2);
        const start = Math.floor(size / 2) - span;
        const end = Math.floor(size / 2) + span;
        for (let col = 0; col < size; col++) {
          if (col < start || col > end) {
            mask[row][col] = false;
          }
        }
      }
      return mask;
    }

    if (shape === 'star') {
      // Simple 8-point star approximation: combine cross + diagonals
      const center = (size - 1) / 2;
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const cross = row === center || col === center;
          const diag = Math.abs(row - center) === Math.abs(col - center);
          const nearCenter =
            Math.abs(row - center) <= Math.floor(size * 0.15) ||
            Math.abs(col - center) <= Math.floor(size * 0.15);
          if (!(cross || diag || nearCenter)) {
            mask[row][col] = false;
          }
        }
      }
      return mask;
    }

    return mask;
  }
}

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

    switch (shape) {
      case 'circle': {
        const center = (size - 1) / 2;
        const radius = size / 2;
        for (let row = 0; row < size; row++) {
          const rowMask = mask[row]!;
          for (let col = 0; col < size; col++) {
            const distance = Math.sqrt(Math.pow(row - center, 2) + Math.pow(col - center, 2));
            if (distance > radius) {
              rowMask[col] = false;
            }
          }
        }
        return mask;
      }

      case 'diamond': {
        const center = (size - 1) / 2;
        const maxDist = center;
        for (let row = 0; row < size; row++) {
          const rowMask = mask[row]!;
          for (let col = 0; col < size; col++) {
            const dist = Math.abs(row - center) + Math.abs(col - center);
            if (dist > maxDist) {
              rowMask[col] = false;
            }
          }
        }
        return mask;
      }

      case 'triangle': {
        const center = Math.floor((size - 1) / 2);
        for (let row = 0; row < size; row++) {
          const rowMask = mask[row]!;
          const width = Math.max(1, Math.min(size, Math.floor(((row + 1) / size) * size)));
          const start = center - Math.floor(width / 2);
          const end = start + width - 1;
          for (let col = 0; col < size; col++) {
            if (col < start || col > end) {
              rowMask[col] = false;
            }
          }
        }
        return mask;
      }

      case 'star': {
        // 8-point star approximation: thick cross + diagonals + center
        const center = (size - 1) / 2;
        const armThickness = Math.max(1, Math.floor(size * 0.1));
        const coreRadius = Math.max(2, Math.floor(size * 0.15));

        // Start with everything masked, then open the star
        for (let row = 0; row < size; row++) {
          mask[row]!.fill(false);
        }

        for (let row = 0; row < size; row++) {
          const rowMask = mask[row]!;
          for (let col = 0; col < size; col++) {
            const inCross =
              Math.abs(row - center) <= armThickness || Math.abs(col - center) <= armThickness;
            const inDiag =
              Math.abs(row - col) <= armThickness ||
              Math.abs(row + col - (size - 1)) <= armThickness;
            const dist = Math.sqrt(Math.pow(row - center, 2) + Math.pow(col - center, 2));
            const inCore = dist <= coreRadius;
            rowMask[col] = inCross || inDiag || inCore;
          }
        }
        return mask;
      }

      case 'heart': {
        const norm = (val: number): number => (2 * val) / (size - 1) - 1; // map 0..size-1 to -1..1
        for (let row = 0; row < size; row++) {
          const rowMask = mask[row]!;
          for (let col = 0; col < size; col++) {
            const x = norm(col) * 1.2;
            const y = -norm(row) * 1.1; // flip y and stretch
            // (x^2 + y^2 - 1)^3 - x^2 y^3 <= 0 is inside the heart
            const lhs = Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3);
            rowMask[col] = lhs <= 0;
          }
        }
        return mask;
      }

      default:
        return mask;
    }
  }
}

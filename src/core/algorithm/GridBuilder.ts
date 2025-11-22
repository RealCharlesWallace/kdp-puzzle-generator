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
        // 5-point star using point-in-polygon against a decagon (outer + inner points)
        const norm = (val: number): number => (2 * val) / (size - 1) - 1; // map 0..size-1 to -1..1
        const outerRadius = 1;
        const innerRadius = 0.45;
        const points: Array<{ x: number; y: number }> = Array.from({ length: 10 }, (_, i) => {
          const angle = -Math.PI / 2 + (i * Math.PI) / 5; // start at top, go clockwise
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          return {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
          };
        });

        const pointInPolygon = (x: number, y: number): boolean => {
          let inside = false;
          for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const xi = points[i]!.x;
            const yi = points[i]!.y;
            const xj = points[j]!.x;
            const yj = points[j]!.y;
            const intersect =
              yi > y !== yj > y &&
              x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi;
            if (intersect) inside = !inside;
          }
          return inside;
        };

        for (let row = 0; row < size; row++) {
          const rowMask = mask[row]!;
          for (let col = 0; col < size; col++) {
            const x = norm(col);
            const y = -norm(row);
            rowMask[col] = pointInPolygon(x, y);
          }
        }
        return mask;
      }

      case 'heart': {
        const norm = (val: number): number => (2 * val) / (size - 1) - 1; // map 0..size-1 to -1..1
        for (let row = 0; row < size; row++) {
          const rowMask = mask[row]!;
          for (let col = 0; col < size; col++) {
            const x = norm(col) * 1.05;
            const y = -norm(row) * 1.15 + 0.1; // flip y, stretch vertically, and nudge up to deepen the notch
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

import React, { useEffect, useRef, useState } from 'react';
import { Grid, PlacedWord } from '@/types/puzzle';
import { PuzzleTheme } from '@/config/themes';

interface PuzzleCanvasProps {
  grid: Grid;
  placedWords: PlacedWord[];
  showSolution?: boolean;
  theme: PuzzleTheme;
}

export const PuzzleCanvas: React.FC<PuzzleCanvasProps> = ({
  grid,
  placedWords,
  showSolution = false,
  theme,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = (): void => {
      if (!containerRef.current) {
        return;
      }

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const styles = window.getComputedStyle(container);
      const paddingX =
        parseFloat(styles.paddingLeft || '0') + parseFloat(styles.paddingRight || '0');
      const paddingY =
        parseFloat(styles.paddingTop || '0') + parseFloat(styles.paddingBottom || '0');

      // Use the actual inner space of the container as our drawing budget
      const availableWidth = rect.width - paddingX;
      const availableHeight = rect.height - paddingY;

      setDimensions({
        width: availableWidth,
        height: availableHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Use ResizeObserver for better container tracking
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const padding = 20;
    const availableWidth = Math.max(0, dimensions.width - padding * 2);
    const availableHeight = Math.max(0, dimensions.height - padding * 2);
    const maxDrawableSize = Math.min(availableWidth, availableHeight);
    const cellSize = Math.max(8, maxDrawableSize / grid.size); // Use full inner space; min size keeps small grids legible

    const width = grid.size * cellSize + padding * 2;
    const height = grid.size * cellSize + padding * 2;

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = theme.colors.background;
    ctx.fillRect(0, 0, width, height);

    // Grid background
    const gridX = padding;
    const gridY = padding;
    const gridWidth = grid.size * cellSize;
    const gridHeight = grid.size * cellSize;

    ctx.fillStyle = theme.colors.gridBackground;
    if (theme.style.cornerRadius > 0) {
      roundRect(ctx, gridX, gridY, gridWidth, gridHeight, theme.style.cornerRadius);
      ctx.fill();
    } else {
      ctx.fillRect(gridX, gridY, gridWidth, gridHeight);
    }

    // Shadow if enabled
    if (theme.style.useShadows) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
    }

    // Draw grid cells
    const fontSize = Math.max(10, cellSize * 0.5);
    ctx.font = `bold ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw solution lines under letters for clarity
    if (showSolution) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      placedWords.forEach((word) => {
        if (word.positions.length === 0) {
          return;
        }

        const startPos = word.positions[0];
        const endPos = word.positions[word.positions.length - 1];

        if (!startPos || !endPos) {
          return;
        }

        const startX = padding + startPos.col * cellSize + cellSize / 2;
        const startY = padding + startPos.row * cellSize + cellSize / 2;
        const endX = padding + endPos.col * cellSize + cellSize / 2;
        const endY = padding + endPos.row * cellSize + cellSize / 2;

        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, theme.colors.answerLine + 'AA');
        gradient.addColorStop(1, theme.colors.answerLine + '66');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(2, cellSize * 0.18);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });

      ctx.restore();
    }

    grid.cells.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.masked) {
          return;
        }

        const x = padding + colIndex * cellSize;
        const y = padding + rowIndex * cellSize;

        // Reset shadow for cells
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Cell background (alternating if enabled)
        if (theme.style.useAlternatingCells) {
          const isAlternate = (rowIndex + colIndex) % 2 === 0;
          ctx.fillStyle = isAlternate
            ? theme.colors.cellBackground
            : theme.colors.cellBackgroundAlt;
        } else {
          ctx.fillStyle = theme.colors.cellBackground;
        }

        // Highlight if part of word and showing solution
        if (showSolution && cell.isPartOfWord) {
          ctx.fillStyle = theme.colors.answerHighlight;
        }

        // Draw cell with rounded corners if specified
        const cellPadding = Math.max(1, theme.style.cellPadding);
        if (theme.style.cornerRadius > 0) {
          roundRect(
            ctx,
            x + cellPadding,
            y + cellPadding,
            cellSize - cellPadding * 2,
            cellSize - cellPadding * 2,
            Math.min(theme.style.cornerRadius / 2, cellSize / 4)
          );
          ctx.fill();
        } else {
          ctx.fillRect(x, y, cellSize, cellSize);
        }

        // Cell border
        ctx.strokeStyle = theme.colors.gridBorder;
        ctx.lineWidth = Math.max(0.5, theme.style.gridBorderWidth);
        if (theme.style.cornerRadius > 0) {
          roundRect(
            ctx,
            x + cellPadding,
            y + cellPadding,
            cellSize - cellPadding * 2,
            cellSize - cellPadding * 2,
            Math.min(theme.style.cornerRadius / 2, cellSize / 4)
          );
          ctx.stroke();
        } else {
          ctx.strokeRect(x, y, cellSize, cellSize);
        }

        // Draw letter
        if (cell.letter) {
          ctx.fillStyle = theme.colors.letterColor;
          ctx.font = `bold ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.textBaseline = 'middle';
          const centerX = x + cellSize / 2;
          const centerY = y + cellSize / 2;
          ctx.fillText(cell.letter, centerX, centerY);
        }
      });
    });

    // Draw solution lines if enabled
    // (Lines are now drawn beneath letters above)
  }, [grid, placedWords, showSolution, theme, dimensions]);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300"
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.gridBackground} 100%)`,
      }}
    >
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-md"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

// Helper function to draw rounded rectangles
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

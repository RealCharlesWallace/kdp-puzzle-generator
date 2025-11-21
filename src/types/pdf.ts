/**
 * Type definitions for PDF generation and export
 */

/**
 * KDP page sizes (in inches)
 */
export type KDPPageSize = '8.5x11' | '8x10' | '6x9' | '7x10';

/**
 * Page orientation
 */
export type PageOrientation = 'portrait' | 'landscape';

/**
 * PDF margins (in inches)
 */
export interface PDFMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Grid styling options for PDF
 */
export interface PDFGridStyle {
  /** Cell size in points (auto-calculated if not provided) */
  cellSize?: number;

  /** Border width in points */
  borderWidth: number;

  /** Border color (hex) */
  borderColor: string;

  /** Font size in points (auto-scaled if not provided) */
  fontSize?: number;

  /** Font family */
  fontFamily: string;

  /** Letter spacing */
  letterSpacing: number;

  /** Background color for cells (hex) */
  backgroundColor: string;

  /** Letter color (hex) */
  letterColor: string;
}

/**
 * Title styling options
 */
export interface PDFTitleStyle {
  /** Font size in points */
  fontSize: number;

  /** Font family */
  fontFamily: string;

  /** Color (hex) */
  color: string;

  /** Text alignment */
  alignment: 'left' | 'center' | 'right';

  /** Margin below title (in points) */
  marginBottom: number;

  /** Bold text */
  bold: boolean;
}

/**
 * Word list styling options
 */
export interface PDFWordListStyle {
  /** Number of columns */
  columns: number;

  /** Font size in points */
  fontSize: number;

  /** Font family */
  fontFamily: string;

  /** Color (hex) */
  color: string;

  /** Spacing between items (in points) */
  spacing: number;

  /** Show checkboxes next to words */
  showCheckboxes: boolean;

  /** Alphabetically sort words */
  alphabetize: boolean;
}

/**
 * Answer key styling options
 */
export interface PDFAnswerKeyStyle {
  /** Highlight color for found words (hex) */
  highlightColor: string;

  /** Highlight opacity (0-1) */
  highlightOpacity: number;

  /** Show solution overlay */
  showSolution: boolean;

  /** Draw lines through words */
  drawLines: boolean;

  /** Line width for word highlighting */
  lineWidth: number;
}

/**
 * Complete PDF styling configuration
 */
export interface PDFStyling {
  grid: PDFGridStyle;
  title: PDFTitleStyle;
  wordList: PDFWordListStyle;
  answerKey: PDFAnswerKeyStyle;
}

/**
 * PDF export options
 */
export interface PDFExportOptions {
  /** Page size */
  pageSize: KDPPageSize;

  /** Page orientation */
  orientation: PageOrientation;

  /** Include answer key */
  includeAnswerKey: boolean;

  /** Generate separate file for answer key */
  separateAnswerKeyFile: boolean;

  /** PDF styling */
  styling: PDFStyling;

  /** Page margins */
  margins: PDFMargins;

  /** Include puzzle title on page */
  includePuzzleTitle: boolean;

  /** Include word list below/beside grid */
  includeWordList: boolean;

  /** Word list columns */
  wordListColumns: number;

  /** Add page numbers */
  addPageNumbers: boolean;

  /** Footer text */
  footerText?: string;
}

/**
 * Book interior options (Phase 3)
 */
export interface BookOptions {
  /** Number of pages */
  pageCount: number;

  /** Include cover page */
  includeCoverPage: boolean;

  /** Include introduction page */
  includeIntroduction: boolean;

  /** Include answer key section */
  includeAnswerSection: boolean;

  /** Template to use */
  template?: string;

  /** PDF export options for puzzles */
  puzzleOptions: PDFExportOptions;
}

/**
 * Default KDP specifications
 */
export const KDP_SPECS = {
  pageFormats: {
    '8.5x11': { width: 8.5, height: 11, unit: 'in' as const },
    '8x10': { width: 8, height: 10, unit: 'in' as const },
    '6x9': { width: 6, height: 9, unit: 'in' as const },
    '7x10': { width: 7, height: 10, unit: 'in' as const },
  },
  bleed: 0.125,
  safeZone: {
    top: 0.5,
    bottom: 0.5,
    inside: 0.375,
    outside: 0.25,
  },
  dpi: 300,
  safeFonts: ['Arial', 'Times New Roman', 'Courier', 'Helvetica'],
} as const;

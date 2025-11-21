export interface PuzzleTheme {
    id: string;
    name: string;
    description: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        gridBackground: string;
        gridBorder: string;
        cellBackground: string;
        cellBackgroundAlt: string; // For alternating pattern
        letterColor: string;
        titleColor: string;
        wordListColor: string;
        answerHighlight: string;
        answerLine: string;
    };
    fonts: {
        title: string;
        grid: string;
        wordList: string;
    };
    style: {
        gridBorderWidth: number;
        titleSize: number;
        gridLetterSize: number;
        wordListSize: number;
        cellPadding: number;
        useAlternatingCells: boolean;
        useShadows: boolean;
        cornerRadius: number;
    };
}

export const PUZZLE_THEMES: Record<string, PuzzleTheme> = {
    modern: {
        id: 'modern',
        name: 'Modern Gradient',
        description: 'Sleek gradient design with soft shadows',
        colors: {
            primary: '#6366F1',
            secondary: '#8B5CF6',
            accent: '#EC4899',
            background: '#F8FAFC',
            gridBackground: '#FFFFFF',
            gridBorder: '#E2E8F0',
            cellBackground: '#FFFFFF',
            cellBackgroundAlt: '#F8FAFC',
            letterColor: '#1E293B',
            titleColor: '#0F172A',
            wordListColor: '#475569',
            answerHighlight: '#DDD6FE',
            answerLine: '#8B5CF6',
        },
        fonts: {
            title: 'helvetica',
            grid: 'helvetica',
            wordList: 'helvetica',
        },
        style: {
            gridBorderWidth: 0.5,
            titleSize: 24,
            gridLetterSize: 52,
            wordListSize: 11,
            cellPadding: 2,
            useAlternatingCells: true,
            useShadows: true,
            cornerRadius: 4,
        },
    },

    ocean: {
        id: 'ocean',
        name: 'Ocean Waves',
        description: 'Refreshing blue gradient with wave patterns',
        colors: {
            primary: '#0EA5E9',
            secondary: '#06B6D4',
            accent: '#14B8A6',
            background: '#ECFEFF',
            gridBackground: '#FFFFFF',
            gridBorder: '#67E8F9',
            cellBackground: '#F0F9FF',
            cellBackgroundAlt: '#E0F2FE',
            letterColor: '#0C4A6E',
            titleColor: '#164E63',
            wordListColor: '#0369A1',
            answerHighlight: '#BAE6FD',
            answerLine: '#0EA5E9',
        },
        fonts: {
            title: 'helvetica',
            grid: 'helvetica',
            wordList: 'helvetica',
        },
        style: {
            gridBorderWidth: 1,
            titleSize: 26,
            gridLetterSize: 54,
            wordListSize: 12,
            cellPadding: 3,
            useAlternatingCells: true,
            useShadows: true,
            cornerRadius: 6,
        },
    },

    sunset: {
        id: 'sunset',
        name: 'Sunset Glow',
        description: 'Warm gradient from orange to pink',
        colors: {
            primary: '#F97316',
            secondary: '#FB923C',
            accent: '#FBBF24',
            background: '#FFF7ED',
            gridBackground: '#FFFBEB',
            gridBorder: '#FED7AA',
            cellBackground: '#FFF7ED',
            cellBackgroundAlt: '#FFEDD5',
            letterColor: '#9A3412',
            titleColor: '#7C2D12',
            wordListColor: '#C2410C',
            answerHighlight: '#FED7AA',
            answerLine: '#FB923C',
        },
        fonts: {
            title: 'helvetica',
            grid: 'helvetica',
            wordList: 'helvetica',
        },
        style: {
            gridBorderWidth: 1.5,
            titleSize: 28,
            gridLetterSize: 56,
            wordListSize: 12,
            cellPadding: 3,
            useAlternatingCells: true,
            useShadows: true,
            cornerRadius: 8,
        },
    },

    forest: {
        id: 'forest',
        name: 'Forest Green',
        description: 'Natural green tones with organic feel',
        colors: {
            primary: '#10B981',
            secondary: '#059669',
            accent: '#84CC16',
            background: '#F0FDF4',
            gridBackground: '#FFFFFF',
            gridBorder: '#86EFAC',
            cellBackground: '#F0FDF4',
            cellBackgroundAlt: '#DCFCE7',
            letterColor: '#064E3B',
            titleColor: '#14532D',
            wordListColor: '#166534',
            answerHighlight: '#BBF7D0',
            answerLine: '#10B981',
        },
        fonts: {
            title: 'helvetica',
            grid: 'helvetica',
            wordList: 'helvetica',
        },
        style: {
            gridBorderWidth: 1,
            titleSize: 24,
            gridLetterSize: 52,
            wordListSize: 11,
            cellPadding: 2,
            useAlternatingCells: true,
            useShadows: true,
            cornerRadius: 4,
        },
    },

    royal: {
        id: 'royal',
        name: 'Royal Purple',
        description: 'Elegant purple with gold accents',
        colors: {
            primary: '#7C3AED',
            secondary: '#A855F7',
            accent: '#FBBF24',
            background: '#FAF5FF',
            gridBackground: '#FFFFFF',
            gridBorder: '#D8B4FE',
            cellBackground: '#FAF5FF',
            cellBackgroundAlt: '#F3E8FF',
            letterColor: '#4C1D95',
            titleColor: '#581C87',
            wordListColor: '#6B21A8',
            answerHighlight: '#E9D5FF',
            answerLine: '#A855F7',
        },
        fonts: {
            title: 'helvetica',
            grid: 'helvetica',
            wordList: 'helvetica',
        },
        style: {
            gridBorderWidth: 1.5,
            titleSize: 26,
            gridLetterSize: 54,
            wordListSize: 12,
            cellPadding: 3,
            useAlternatingCells: true,
            useShadows: true,
            cornerRadius: 6,
        },
    },

    candy: {
        id: 'candy',
        name: 'Candy Pop',
        description: 'Sweet pastel colors for kids',
        colors: {
            primary: '#EC4899',
            secondary: '#F472B6',
            accent: '#A78BFA',
            background: '#FDF2F8',
            gridBackground: '#FFFBEB',
            gridBorder: '#FBCFE8',
            cellBackground: '#FEF3C7',
            cellBackgroundAlt: '#FCE7F3',
            letterColor: '#BE185D',
            titleColor: '#9F1239',
            wordListColor: '#DB2777',
            answerHighlight: '#FBCFE8',
            answerLine: '#F472B6',
        },
        fonts: {
            title: 'helvetica',
            grid: 'helvetica',
            wordList: 'helvetica',
        },
        style: {
            gridBorderWidth: 2,
            titleSize: 28,
            gridLetterSize: 58,
            wordListSize: 13,
            cellPadding: 4,
            useAlternatingCells: true,
            useShadows: true,
            cornerRadius: 10,
        },
    },

    minimal: {
        id: 'minimal',
        name: 'Minimal Clean',
        description: 'Ultra-clean monochrome design',
        colors: {
            primary: '#64748B',
            secondary: '#475569',
            accent: '#94A3B8',
            background: '#FFFFFF',
            gridBackground: '#FFFFFF',
            gridBorder: '#E2E8F0',
            cellBackground: '#FFFFFF',
            cellBackgroundAlt: '#F8FAFC',
            letterColor: '#0F172A',
            titleColor: '#1E293B',
            wordListColor: '#475569',
            answerHighlight: '#E2E8F0',
            answerLine: '#64748B',
        },
        fonts: {
            title: 'helvetica',
            grid: 'helvetica',
            wordList: 'helvetica',
        },
        style: {
            gridBorderWidth: 0.5,
            titleSize: 22,
            gridLetterSize: 50,
            wordListSize: 10,
            cellPadding: 1,
            useAlternatingCells: false,
            useShadows: false,
            cornerRadius: 0,
        },
    },

    neon: {
        id: 'neon',
        name: 'Neon Glow',
        description: 'Vibrant neon colors with high contrast',
        colors: {
            primary: '#06B6D4',
            secondary: '#8B5CF6',
            accent: '#F59E0B',
            background: '#0F172A',
            gridBackground: '#1E293B',
            gridBorder: '#06B6D4',
            cellBackground: '#1E293B',
            cellBackgroundAlt: '#334155',
            letterColor: '#06B6D4',
            titleColor: '#22D3EE',
            wordListColor: '#A78BFA',
            answerHighlight: '#334155',
            answerLine: '#8B5CF6',
        },
        fonts: {
            title: 'helvetica',
            grid: 'helvetica',
            wordList: 'helvetica',
        },
        style: {
            gridBorderWidth: 2,
            titleSize: 28,
            gridLetterSize: 56,
            wordListSize: 12,
            cellPadding: 3,
            useAlternatingCells: true,
            useShadows: true,
            cornerRadius: 4,
        },
    },
};

export function getTheme(themeId?: string): PuzzleTheme {
    const defaultTheme = PUZZLE_THEMES.modern ?? Object.values(PUZZLE_THEMES)[0];
    if (!defaultTheme) {
        throw new Error('No puzzle themes configured');
    }

    if (!themeId) {
        return defaultTheme;
    }

    const theme = PUZZLE_THEMES[themeId];
    return theme ?? defaultTheme;
}

export function getAllThemes(): PuzzleTheme[] {
    return Object.values(PUZZLE_THEMES);
}

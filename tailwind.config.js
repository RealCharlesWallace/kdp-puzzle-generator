/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: '#fff0fb',
          100: '#ffd6f2',
          200: '#ffb5e5',
          300: '#ff8ad5',
          400: '#ff5dc6',
          500: '#ff2fb2', // Main primary (Hello Imagination pink)
          600: '#e01c94',
          700: '#b90f7a',
          800: '#92095f',
          900: '#5f003d',
        },
        // Secondary/accent colors
        secondary: {
          50: '#f9e8ff',
          100: '#f1c8ff',
          200: '#e89fff',
          300: '#dd75ff',
          400: '#d24cff',
          500: '#c321ff',
          600: '#9c19d6',
          700: '#7410a8',
          800: '#4d0979',
          900: '#2b044d',
        },
        // Accent color
        accent: {
          50: '#fff9e6',
          100: '#ffeec2',
          200: '#ffdf8a',
          300: '#ffd247',
          400: '#ffc20d',
          500: '#ffb300',
          600: '#d48d00',
          700: '#aa6d00',
          800: '#805000',
          900: '#553600',
        },
        border: '#ffc6ec',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      spacing: {
        18: '4.5rem',
        112: '28rem',
        128: '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.1)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

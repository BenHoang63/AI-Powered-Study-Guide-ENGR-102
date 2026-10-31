/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tamu: {
          DEFAULT: '#500000',
          dark: '#3d0000',
          light: '#800000',
          crimson: '#500000',
          subtle: 'rgba(80, 0, 0, 0.25)',
          border: 'rgba(128, 0, 0, 0.5)',
          text: '#ffffff',
        },
        so: {
          bg: '#141414',
          card: '#1d1d1d',
          surface: '#242424',
          hover: '#2e2e2e',
          border: '#333333',
          borderSubtle: '#262626',
          accent: {
            DEFAULT: '#500000',
            hover: '#660000',
            light: '#ffffff',
            dark: '#3d0000',
            subtle: 'rgba(80, 0, 0, 0.25)',
            border: '#800000',
          },
          // Remapped to consistent lighter maroon so no orange exists anywhere
          orange: {
            DEFAULT: '#5b1515ff',
            hover: '#6a1919ff',
            light: '#ffffff',
            dark: '#800000',
            subtle: 'rgba(153, 0, 0, 0.25)',
            border: 'rgba(153, 0, 0, 0.5)',
          },
          blue: {
            DEFAULT: '#379fef',
            hover: '#2b88d3',
            subtle: 'rgba(55, 159, 239, 0.12)',
          },
          green: {
            DEFAULT: '#5eba7d',
            subtle: 'rgba(94, 186, 125, 0.12)',
          },
          red: {
            DEFAULT: '#e67373',
            subtle: 'rgba(230, 115, 115, 0.12)',
          },
          yellow: {
            DEFAULT: '#f1b600',
            subtle: 'rgba(241, 182, 0, 0.12)',
          },
          text: {
            primary: '#f2ede9',
            bright: '#ffffff',
            body: '#d9d3ce',
            muted: '#8c8c8c',
            subtle: '#5c5c5c',
          },
        },
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Cascadia Code', 'Source Code Pro', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'so-sm': '0 1px 2px rgba(0, 0, 0, 0.4)',
        'so': '0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3)',
        'so-md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'so-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
        'so-maroon': '0 0 0 2px #141414, 0 0 0 4px #800000',
        'so-orange': '0 0 0 2px #141414, 0 0 0 4px #800000',
      },
    },
  },
  plugins: [],
}

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        brand: {
          base: '#1F6F43',
        },
        // Grayscale
        gray: {
          100: '#F8F9FA',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#111827',
        },
        // Category Colors
        green: {
          light: '#E0FAE9',
          base: '#16A34A',
          dark: '#15803D',
        },
        blue: {
          light: '#DBEAFE',
          base: '#2563EB',
          dark: '#1D4ED8',
        },
        purple: {
          light: '#F3E8FF',
          base: '#9333EA',
          dark: '#7E22CE',
        },
        orange: {
          light: '#FFEDD5',
          base: '#EA580C',
          dark: '#C2410C',
        },
        pink: {
          light: '#FCE7F3',
          base: '#DB2777',
          dark: '#BE185D',
        },
        yellow: {
          light: '#F7F3CA',
          base: '#CA8A04',
          dark: '#A16207',
        },
        red: {
          light: '#FEE2E2',
          base: '#DC2626',
          dark: '#B91C1C',
        },
      },
    },
  },
  plugins: [],
}
export default config


import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro Text"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: '#0071E3',
        brandDark: '#0051CC',
        accent: '#2BB673',
        danger: '#FF3B30',
        dark: '#111113',
        'muted-text': '#6E6E73',
        shell: '#F5F5F7',
      },
      borderRadius: {
        surface: '36px',
        card: '24px',
        control: '18px',
      },
      boxShadow: {
        focus: '0 0 0 4px rgba(0, 113, 227, 0.15)',
        card: '0 25px 60px rgba(15, 23, 42, 0.12)',
        soft: '0 18px 40px rgba(15, 23, 42, 0.08)',
        glow: '0 30px 60px rgba(15, 23, 42, 0.14)',
      },
      screens: {
        'max-lg': { max: '1100px' },
        'max-md': { max: '960px' },
        'max-sm': { max: '640px' },
      },
    },
  },
  plugins: [],
}

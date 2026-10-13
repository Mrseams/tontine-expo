/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#F4F4F6',
        ink: '#0B0B0F',
        muted: '#8E8E96',
        faint: '#C4C4CA',
        line: '#ECECF0',
        momo: '#FFCC00',
        orange: '#FF7A1A',
        success: '#1FA25A',
      },
      fontFamily: {
        regular: ['InterTight_400Regular'],
        medium: ['InterTight_500Medium'],
        semibold: ['InterTight_600SemiBold'],
        bold: ['InterTight_700Bold'],
      },
    },
  },
  plugins: [],
};

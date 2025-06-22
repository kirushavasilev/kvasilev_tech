/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        space: {
          accent: 'rgb(255, 255, 255)',
          dark: 'rgb(29, 29, 29)',
          card: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(98, 98, 98, 0.41)',
          textDark: 'rgb(242, 239, 229)',
          accent2: 'rgb(245, 192, 192)',
          purple: 'rgb(255, 106, 0)',
          purpleLight: 'rgb(235, 225, 254)',
          starDark: 'rgb(195, 199, 214)',
          starLight: 'rgb(216, 199, 250)',
          tooltip: {
            bg: 'rgba(0, 0, 0, 0.9)',
            text: 'rgb(255, 255, 255)',
            border: 'rgb(255, 255, 255)',
            accent: 'rgb(123, 212, 0)',
            accentText: 'rgb(29, 29, 29)',
            accentBorder: 'rgba(163, 191, 250, 0.95)',
          },
        },
      },
      fontFamily: {
        atkinson: ['Atkinson', 'sans-serif'],
        palatino: ['Palatino', 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}


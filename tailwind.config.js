module.exports = {
  purge: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#03A9F4',
          dark: '#0288D1',
          light: '#B3E5FC',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        'elevated': '0 10px 25px rgba(0,0,0,0.08)'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

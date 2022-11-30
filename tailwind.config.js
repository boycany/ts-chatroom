module.exports = {
  content: ['./src/client/**/*.html', './src/client/**/*.ts'],
  theme: {
    extend: {
      colors: {
        'card': '#1e1e26',
        'dark': '#14151a',
        'light': '#ffe4c4',
        'sky': '#87cefa'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          mint: '#5ce0c6',
          mintLight: '#b2f2e8',
          mintDark: '#3aaa94',
          pink: '#ff7eb6',
          pinkLight: '#ffa8d0',
          pinkDark: '#d6558e'
        }
      }
    },
  },
  plugins: [],
};

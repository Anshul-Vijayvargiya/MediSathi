/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: '#0B0D12',
        sidebar: '#0E1015',
        card: '#151821',
        light: 'rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}

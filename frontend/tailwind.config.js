/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black': '#000000',
        'card-bg': '#0a0a0a',
        'card-border': '#1a1a1a',
        'input-bg': '#0a0a0a',
        'text-primary': '#ffffff',
        'text-secondary': '#888888',
        'text-tertiary': '#555555',
        'accent': '#ffffff',
        'accent-hover': '#cccccc',
        'error': '#ff4444',
        'success': '#44ff44',
      },
    },
  },
  plugins: [],
}
 
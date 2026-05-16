/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9962A',
        'gold-light': '#E8BF5A',
        'gold-pale': '#F5E8C0',
        deep: '#1A1208',
        ink: '#2E1F0A',
        cream: '#FAF5E9',
        'cream-2': '#F0E8D0',
        brand: '#FAF5E9',
        accent: '#8B2500',
        muted: '#7A6040',
      },
      fontFamily: {
        bengali: ['var(--font-bengali)', 'serif'],
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

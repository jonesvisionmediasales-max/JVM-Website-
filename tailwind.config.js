/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#1B1B1B',
        gold: '#C8A24D',
        goldLight: '#E0C988',
        lightgray: '#F4F4F4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C8A24D 0%, #E0C988 50%, #C8A24D 100%)',
      },
      boxShadow: {
        gold: '0 8px 30px rgba(200, 162, 77, 0.25)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}

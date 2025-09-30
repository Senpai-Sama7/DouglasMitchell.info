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
        // Modern glassmorphic palette
        glass: {
          50: 'rgba(255, 255, 255, 0.1)',
          100: 'rgba(255, 255, 255, 0.2)',
          200: 'rgba(255, 255, 255, 0.3)',
          300: 'rgba(255, 255, 255, 0.4)',
        },
        dark: {
          50: 'rgba(0, 0, 0, 0.1)',
          100: 'rgba(0, 0, 0, 0.2)',
          200: 'rgba(0, 0, 0, 0.3)',
          300: 'rgba(0, 0, 0, 0.4)',
        },
        accent: {
          purple: '#8B5CF6',
          blue: '#3B82F6',
          pink: '#EC4899',
          emerald: '#10B981',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'clay': '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
        'clay-hover': '0 20px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};

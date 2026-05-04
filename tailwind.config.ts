import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-purple': '#0d0820',
        'mid-purple': '#1a0f35',
        'card-glass': 'rgba(255,255,255,0.04)',
        ivory: '#f0ebe0',
        'ivory-dim': '#c8c4bc',
        'rose-gold': '#c9956c',
        'rose-gold-light': '#e0b48c',
        lavender: '#b19cd9',
        'lavender-light': '#d4c5f0',
        'purple-glow': 'rgba(177,156,217,0.25)',
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #0d0820 0%, #1a0f35 50%, #0f0a28 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(177,156,217,0.08) 0%, rgba(13,8,32,0.6) 100%)',
        'rose-button': 'linear-gradient(135deg, #c9956c 0%, #d4a57c 100%)',
        'lavender-button': 'linear-gradient(135deg, #8b6bb5 0%, #b19cd9 100%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(177,156,217,0.2)',
        'card-selected': '0 0 0 2px rgba(177,156,217,0.6), 0 0 32px rgba(177,156,217,0.3)',
        'glow-rose': '0 0 24px rgba(201,149,108,0.4)',
        'glow-lavender': '0 0 24px rgba(177,156,217,0.4)',
      },
      animation: {
        'flip-in': 'flipIn 0.6s ease-in-out forwards',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        flipIn: {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

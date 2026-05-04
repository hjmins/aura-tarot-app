import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#080412',
        ivory: '#f0ebe0',
        'ivory-dim': '#9d96b0',
        'ivory-faint': '#5e5870',
        gold: '#d4af37',
        'gold-light': '#e8cc6a',
        'rose-gold': '#c9956c',
        'rose-gold-light': '#e0b48c',
        lavender: '#b19cd9',
        'lavender-light': '#d4c5f0',
        'lavender-dim': '#7c6bad',
      },
      backgroundImage: {
        'btn-primary': 'linear-gradient(135deg, #6b3fa0 0%, #9b6dd0 100%)',
        'btn-gold': 'linear-gradient(135deg, #c9956c 0%, #e0b48c 100%)',
        'card-glass': 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(8,4,18,0.6) 100%)',
        'card-selected': 'linear-gradient(145deg, rgba(139,107,181,0.2) 0%, rgba(8,4,18,0.7) 100%)',
        'gold-line': 'linear-gradient(135deg, rgba(212,175,55,0.6), rgba(201,149,108,0.4), rgba(177,156,217,0.5))',
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(139,107,181,0.25)',
        'glow-purple-strong': '0 0 40px rgba(139,107,181,0.4)',
        'glow-gold': '0 0 30px rgba(212,175,55,0.25)',
        'glow-rose': '0 0 24px rgba(201,149,108,0.35)',
        'card': '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
        'card-hover': '0 12px 48px rgba(0,0,0,0.6), 0 0 30px rgba(139,107,181,0.2)',
        'selected': '0 0 0 2px rgba(139,107,181,0.7), 0 0 30px rgba(139,107,181,0.25)',
        'btn': '0 4px 20px rgba(107,63,160,0.4)',
        'btn-gold': '0 4px 24px rgba(201,149,108,0.5)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;

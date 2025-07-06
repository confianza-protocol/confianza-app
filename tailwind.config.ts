import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Core Design System Colors
        background: '#0F172A',
        surface: '#1E293B',
        'surface-hover': '#334155',
        primary: '#2563EB',
        'primary-hover': '#1D4ED8',
        'text-primary': '#E2E8F0',
        'text-secondary': '#64748B',
        'text-muted': '#475569',
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DC2626',
        // Trust Score Colors
        'trust-gold': '#F59E0B',
        'trust-silver': '#6B7280',
        'trust-bronze': '#D97706',
        'trust-unverified': '#9CA3AF',
        // Border Colors
        border: '#334155',
        'border-light': '#475569',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
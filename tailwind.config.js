import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  daisyui: {
    themes: [
      {
        contesthub: {
          primary: '#2f6f6d',
          secondary: '#64748b',
          accent: '#d97706',
          neutral: '#18212f',
          'base-100': '#f8fafc',
          'base-200': '#eef2f7',
          'base-300': '#d9e2ec',
          'base-content': '#172033',
          info: '#2563eb',
          success: '#15803d',
          warning: '#b45309',
          error: '#b91c1c',
        },
      },
      {
        contesthubdark: {
          primary: '#5fb7b3',
          secondary: '#94a3b8',
          accent: '#f0a04b',
          neutral: '#e2e8f0',
          'base-100': '#101722',
          'base-200': '#172033',
          'base-300': '#253244',
          'base-content': '#e5edf6',
          info: '#60a5fa',
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#f87171',
        },
      },
    ],
  },
  plugins: [daisyui],
}

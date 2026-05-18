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
        light: {
          primary: '#d85f3f',
          'primary-content': '#ffffff',
          secondary: '#0f766e',
          'secondary-content': '#f0fdfa',
          accent: '#b7791f',
          'accent-content': '#fff7ed',
          neutral: '#243447',
          'neutral-content': '#f8fafc',
          'base-100': '#ffffff',
          'base-200': '#f7f8fa',
          'base-300': '#e5e7eb',
          'base-content': '#1f2937',
          info: '#2563eb',
          success: '#15803d',
          warning: '#b7791f',
          error: '#b42318',
        },
      },
      {
        dark: {
          primary: '#f08a66',
          'primary-content': '#1f2937',
          secondary: '#5eead4',
          'secondary-content': '#10201f',
          accent: '#f4c46b',
          'accent-content': '#231a07',
          neutral: '#d9e2ec',
          'neutral-content': '#111827',
          'base-100': '#17202c',
          'base-200': '#111827',
          'base-300': '#2b3645',
          'base-content': '#eef2f7',
          info: '#93c5fd',
          success: '#86efac',
          warning: '#facc15',
          error: '#fca5a5',
        },
      },
    ],
  },
  plugins: [daisyui],
}

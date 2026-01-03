/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        electricBlue: '#2563eb',
        cyberPink: '#db2777',
        highvisYellow: '#facc15',
      },
      boxShadow: {
        'brutal-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '12px 12px 0px 0px rgba(0,0,0,1)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

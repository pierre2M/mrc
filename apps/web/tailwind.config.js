/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts,md,svx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif']
      },
      colors: {
        // Palette MRC — sobre, universitaire
        mrc: {
          50:  '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43'
        },
        // Couleur d'accentuation — statuts des écritures
        non_valide:  '#ef4444', // rouge
        en_cours:    '#f59e0b', // ambre
        valide:      '#10b981', // vert
        brouillon:   '#6b7280'  // gris
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.mrc.900'),
            'h1, h2, h3': { color: theme('colors.mrc.800') },
            a: { color: theme('colors.mrc.600') }
          }
        }
      })
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};

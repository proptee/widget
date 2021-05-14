module.exports = {
  purge: {
    mode: 'all',
    enabled: true,
    preserveHtmlElements: false,
    content: ['./src/widget.html'],
  },
  prefix: 'tw-',
  theme: {
    extend: {
      boxShadow: {
        lg: '0 4px 24px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem',
        108: '27rem',
        120: '30rem',
        128: '32rem',
      },
      keyframes: {
        bumpup: {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateY(0)',
          },
          '40%': {
            transform: 'translateY(-15px)',
          },
          '60%': {
            transform: 'translateY(-5px)',
          },
        },
        bumpdown: {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateY(0)',
          },
          '40%': {
            transform: 'translateY(+15px)',
          },
          '60%': {
            transform: 'translateY(+5px)',
          },
        },
      },
      animation: {
        bumpup: 'bumpup 500ms ease-in-out',
        bumpdown: 'bumpdown 500ms ease-in-out',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      gray: {
        100: '#f7fafc',
        200: '#edf2f7',
        300: '#e2e8f0',
        400: '#cbd5e0',
        500: '#a0aec0',
        600: '#718096',
        700: '#4a5568',
        800: '#2d3748',
        900: '#1a202c',
      },
      gradient: {
        blue: '#00B7CC',
        green: '#40ED74',
        red: '#ca0000',
      },
    },
    fontWeight: {
      normal: 400,
      semibold: 600,
      bold: 700,
    },
  },
};

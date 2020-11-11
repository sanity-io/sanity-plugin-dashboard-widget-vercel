export default {
  // Scales
  breakpoints: ['560px', '800px'],
  colors: {
    cyan: '#50e3c2',
    darkGray: '#333',
    gray: '#888',
    danger: '#ff0000',
    warning: '#f5a623',
  },
  fontSizes: [
    '0.64rem', //
    '0.8rem',
    '1.0rem',
    '1.25rem',
  ],
  lineHeights: {
    body: 1.5,
  },
  sizes: [],
  space: ['0px', '4px', '8px', '16px', '32px'],
  // Styles
  styles: {},
  // Variants
  images: {
    avatar: {
      borderRadius: 20,
      height: 20,
      width: 20,
    },
  },
  statusDots: {
    BUILDING: {
      bg: 'warning',
    },
    ERROR: {
      bg: 'danger',
    },
    READY: {
      bg: 'cyan',
    },
    QUEUED: {
      bg: 'darkGray',
    },
  },
}

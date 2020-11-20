export default {
  // Scales
  breakpoints: ['560px', '800px'],
  colors: {
    // general
    muted: '#888',
    text: '#262f3d',
    // status
    danger: '#ff0000',
    queued: '#333',
    success: '#50e3c2',
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
  styles: {
    a: {
      color: '#2276fc',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  // Variants
  alerts: {
    danger: {
      borderColor: 'danger',
      borderStyle: 'solid',
      borderWidth: '1px',
      color: 'danger',
      fontWeight: 400,
    },
  },
  cells: {
    age: {
      maxWidth: '100px',
      width: '100px',
    },
    branch: {
      display: ['none', null, 'table-cell'],
      maxWidth: '300px',
      width: '300px',
    },
    creator: {
      maxWidth: '80px',
      width: '80px',
    },
    state: {
      display: ['none', 'table-cell'],
      maxWidth: '90px',
      width: '90px',
    },
  },
  images: {
    avatar: {
      borderRadius: 20,
      height: 20,
      width: 20,
    },
  },
  singleLine: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  statusDots: {
    BUILDING: {
      bg: 'warning',
    },
    ERROR: {
      bg: 'danger',
    },
    READY: {
      bg: 'success',
    },
    QUEUED: {
      bg: 'queued',
    },
  },
  text: {
    strong: {
      fontWeight: 600,
    },
  },
}

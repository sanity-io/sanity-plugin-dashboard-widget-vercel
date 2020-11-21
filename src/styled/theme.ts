type Options = {
  forceSmallLayout?: boolean
}

const theme = ({ forceSmallLayout = false }: Options = {}) => ({
  // Scales
  breakpoints: ['560px', '800px'],
  colors: {
    danger: '#ff0000',
    muted: '#888',
    text: '#262f3d',
    vercelStatusColors: {
      BUILDING: '#f5a623',
      CANCELED: '#ff0000',
      ERROR: '#ff0000',
      READY: '#50e3c2',
      QUEUED: '#333',
    },
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
  cells: {
    age: {
      maxWidth: '60px',
      width: '60px',
    },
    branch: {
      display: forceSmallLayout ? ['none'] : ['none', null, 'table-cell'],
      maxWidth: '300px',
      width: '300px',
    },
    creator: {
      maxWidth: '80px',
      width: '80px',
    },
    state: {
      display: forceSmallLayout ? ['none'] : ['none', 'table-cell'],
      maxWidth: '110px',
      width: '110px',
    },
  },
  images: {
    avatar: {
      borderRadius: 20,
      height: 20,
      width: 20,
    },
  },
  messages: {
    danger: {
      bg: 'rgba(255, 0, 0, 0.05)',
      borderColor: 'danger',
      color: 'danger',
      fontWeight: 400,
    },
  },
  skeleton: {
    avatar: {
      bg: '#eee',
      borderRadius: 20,
      height: 20,
      userSelect: 'none',
      width: 20,
    },
    text: {
      bg: '#eee',
      borderRadius: '3px',
      userSelect: 'none',
      width: '100%',
    },
  },
  singleLine: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  statusDot: {
    smallOnly: {
      borderRadius: '20px',
      display: forceSmallLayout ? ['block'] : ['block', 'none'],
      size: '10px',
    },
    default: {
      borderRadius: '20px',
      size: '10px',
    },
  },
  text: {
    strong: {
      fontWeight: 600,
    },
  },
})

export default theme

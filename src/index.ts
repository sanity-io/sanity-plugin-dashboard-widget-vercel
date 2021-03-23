import Widget from './app'

// Initialize `javascript-time-ago` locale (required for react-time-ago)
// `react-time-ago` installs `javascript-time-ago` automatically as a dependency
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)

export default {
  title: 'Vercel',
  name: 'vercel',
  component: Widget,
}

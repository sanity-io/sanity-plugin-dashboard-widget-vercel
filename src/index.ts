import Widget from './app'

// Initialize `javascript-time-ago` locale (required for react-time-ago)
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import {DashboardWidget, type LayoutConfig} from '@sanity/dashboard'

TimeAgo.addDefaultLocale(en)

export function vercelWidget(config: {layout?: LayoutConfig} = {}): DashboardWidget {
  return {
    name: 'vercel',
    component: Widget,
    layout: config.layout ?? {width: 'full'},
  }
}

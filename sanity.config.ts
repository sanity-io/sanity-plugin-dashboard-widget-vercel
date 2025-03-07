import {defineConfig} from 'sanity'
import {dashboardTool} from '@sanity/dashboard'
import {visionTool} from '@sanity/vision'
import {vercelWidget} from './src'

export default defineConfig({
  name: 'sanity-plugin-dashboard-widget-vercel',
  projectId: 'ppsg7ml5',
  dataset: 'test',
  plugins: [
    dashboardTool({
      widgets: [vercelWidget()],
    }),
    visionTool(),
  ],
  scheduledPublishing: {
    enabled: false,
  },
})

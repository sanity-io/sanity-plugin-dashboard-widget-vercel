import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'

export default defineConfig({
  name: 'sanity-plugin-dashboard-widget-vercel',
  projectId: 'ppsg7ml5',
  dataset: 'test',
  plugins: [visionTool()],
})

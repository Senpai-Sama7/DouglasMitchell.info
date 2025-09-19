import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'douglas-mitchell-studio',
  title: 'Douglas Mitchell Studio',
  projectId: (() => {
    const id = process.env.SANITY_PROJECT_ID;
    if (!id) throw new Error("Missing SANITY_PROJECT_ID environment variable");
    return id;
  })(),
  dataset: process.env.SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes
  }
})

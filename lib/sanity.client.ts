import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-08-01',
  useCdn: true
})

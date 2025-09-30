// pages/index.tsx - Main blog page
import { GetStaticProps } from 'next'
import { builder } from '@builder.io/sdk'
import BlogLayout from '../components/BlogLayout'
import '../components/BentoComponents' // Register components

// Initialize Builder
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!)

interface HomeProps {
  builderContent: any
}

export default function Home({ builderContent }: HomeProps) {
  return <BlogLayout content={builderContent} model="blog-page" />
}

export const getStaticProps: GetStaticProps = async () => {
  // Fetch content from Builder.io at build time
  const builderContent = await builder
    .get('blog-page', { url: '/' })
    .promise()

  return {
    props: {
      builderContent: builderContent || null
    },
    revalidate: 60 // Revalidate every minute
  }
}
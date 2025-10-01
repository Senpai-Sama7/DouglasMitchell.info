'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BentoBlogGrid from '@/components/BentoBlogGrid'
import { getBlogPosts } from '@/lib/sanity'
import { getLogger } from '@/lib/log'

const logger = getLogger('blog-page')

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const blogPosts = await getBlogPosts()
        setPosts(blogPosts)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          logger.error({
            event: 'blog.posts.fetch.failed',
            message: 'Failed to fetch blog posts from Sanity',
            error
          })
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Personal Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Thoughts, projects, and discoveries in technology, design, and beyond
          </p>
        </motion.header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <BentoBlogGrid posts={posts} />
        )}
      </div>
    </div>
  )
}

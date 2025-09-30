// components/BlogLayout.tsx - Main bento grid layout with Builder.io
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import VisualAIPanel from './VisualAIPanel'

// Initialize Builder
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!)

interface BlogLayoutProps {
  content?: any
  model?: string
}

export default function BlogLayout({ content, model = 'blog-page' }: BlogLayoutProps) {
  const [builderContent, setBuilderContent] = useState(content)
  const isPreviewing = useIsPreviewing()
  const [showAIPanel, setShowAIPanel] = useState(false)

  useEffect(() => {
    if (!content) {
      // Fetch content from Builder.io if not provided
      builder.get(model, { url: window.location.pathname })
        .promise()
        .then(setBuilderContent)
    }
  }, [content, model])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">Your Blog</h1>
              <span className="text-sm text-gray-500">Personal insights & discoveries</span>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-6">
                <a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
                <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
                <a href="#topics" className="text-gray-600 hover:text-blue-600 transition-colors">Topics</a>
              </nav>

              {isPreviewing && (
                <button
                  onClick={() => setShowAIPanel(!showAIPanel)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>✨</span>
                  <span>AI Assistant</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bento-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[200px]"
        >
          {/* Builder.io Content */}
          <BuilderComponent
            model={model}
            content={builderContent}
            options={{
              includeRefs: true,
              noTrack: false
            }}
          />
        </motion.div>
      </main>

      {/* Visual AI Panel */}
      {showAIPanel && isPreviewing && (
        <VisualAIPanel 
          onClose={() => setShowAIPanel(false)}
          onLayoutChange={(changes) => {
            // Handle AI-driven layout changes
            console.log('AI Layout Changes:', changes)
          }}
        />
      )}
    </div>
  )
}
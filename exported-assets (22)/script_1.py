# Create the main blog layout component with Builder.io integration
main_layout = '''// components/BlogLayout.tsx - Main bento grid layout with Builder.io
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
}'''

print("Main blog layout component created!")

# Create Bento components for Builder.io
bento_components = '''// components/BentoComponents.tsx - Drag-and-drop bento components
import { builder } from '@builder.io/react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Heart, MessageCircle, Share2, Eye } from 'lucide-react'
import clsx from 'clsx'

// Featured Blog Post Component
export const BentoBlogPost = ({ 
  title = "Your Blog Post Title",
  description = "Write your amazing blog post description here...",
  category = "Technology",
  image = "",
  readTime = 5,
  publishDate = new Date().toISOString(),
  tags = [],
  size = "large"
}) => {
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 md:col-span-2 row-span-2", 
    large: "col-span-1 md:col-span-2 lg:col-span-3 row-span-2"
  }

  return (
    <motion.article 
      className={clsx(
        "bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group",
        sizeClasses[size]
      )}
      whileHover={{ y: -4 }}
      layout
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {category}
          </span>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(publishDate).toLocaleDateString()}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{readTime} min read</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Heart className="w-3 h-3 hover:text-red-500 cursor-pointer transition-colors" />
            <MessageCircle className="w-3 h-3 hover:text-blue-500 cursor-pointer transition-colors" />
            <Share2 className="w-3 h-3 hover:text-green-500 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
      
      {image && (
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      )}
    </motion.article>
  )
}

// Stats Card Component
export const BentoStatsCard = ({
  number = "42",
  label = "Articles Written", 
  growth = "+12%",
  icon = "📊",
  color = "blue",
  size = "small"
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600", 
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600"
  }

  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 md:col-span-2 row-span-1"
  }

  return (
    <motion.div 
      className={clsx(
        "bg-gradient-to-br text-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300",
        colorClasses[color],
        sizeClasses[size]
      )}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="flex flex-col justify-between h-full">
        <div className="text-2xl mb-2">{icon}</div>
        
        <div>
          <div className="text-3xl font-bold mb-1">{number}</div>
          <div className="text-sm opacity-90 mb-2">{label}</div>
          
          {growth && (
            <div className="text-xs opacity-75 flex items-center">
              <span className="mr-1">↗</span>
              <span>{growth} this month</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// About Card Component  
export const BentoAboutCard = ({
  name = "Your Name",
  title = "AI Enthusiast & Developer",
  location = "Houston, TX", 
  bio = "Passionate about AI, technology, and creating innovative solutions...",
  avatar = "",
  socialLinks = [],
  size = "medium"
}) => {
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 md:col-span-2 row-span-2"
  }

  return (
    <motion.div 
      className={clsx(
        "bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300",
        sizeClasses[size]
      )}
      whileHover={{ y: -4 }}
      layout
    >
      <div className="flex flex-col items-center text-center h-full">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-4">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            name.charAt(0)
          )}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-blue-600 mb-1">{title}</p>
        <p className="text-xs text-gray-500 mb-4">📍 {location}</p>
        
        <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
          {bio}
        </p>
        
        {socialLinks.length > 0 && (
          <div className="flex space-x-3">
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-blue-100 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-sm">{link.icon}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Newsletter Component
export const BentoNewsletter = ({
  title = "Stay Updated",
  description = "Get the latest posts and insights delivered to your inbox",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  size = "medium"
}) => {
  const sizeClasses = {
    medium: "col-span-1 md:col-span-2 row-span-1",
    large: "col-span-1 md:col-span-3 row-span-1"
  }

  return (
    <motion.div 
      className={clsx(
        "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300",
        sizeClasses[size]
      )}
      whileHover={{ y: -4 }}
      layout
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm opacity-90 mb-4">{description}</p>
        </div>
        
        <div className="flex gap-2">
          <input 
            type="email"
            placeholder={placeholder}
            className="flex-1 px-3 py-2 rounded-lg text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            {buttonText}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Activity Feed Component
export const BentoActivityFeed = ({
  title = "Recent Activity",
  activities = [
    { icon: "✏️", text: "Updated article on 'AI Development'", time: "2 hours ago" },
    { icon: "❤️", text: "Received 25 likes on latest post", time: "1 day ago" },
    { icon: "💬", text: "New comment on 'Tech Trends'", time: "2 days ago" }
  ],
  size = "medium"
}) => {
  const sizeClasses = {
    medium: "col-span-1 md:col-span-2 row-span-2",
    large: "col-span-1 md:col-span-3 row-span-2"
  }

  return (
    <motion.div 
      className={clsx(
        "bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300",
        sizeClasses[size]
      )}
      whileHover={{ y: -4 }}
      layout
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div 
            key={index}
            className="flex items-start space-x-3 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <span className="text-sm">{activity.icon}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                {activity.text}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Register all components with Builder.io
const registerBentoComponents = () => {
  // Blog Post Component
  builder.registerComponent(BentoBlogPost, {
    name: 'Bento Blog Post',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Your Blog Post Title' },
      { name: 'description', type: 'longText', defaultValue: 'Write your amazing blog post description here...' },
      { name: 'category', type: 'string', enum: ['Technology', 'AI/ML', 'Web Dev', 'Lifestyle', 'Houston'], defaultValue: 'Technology' },
      { name: 'image', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp'] },
      { name: 'readTime', type: 'number', defaultValue: 5 },
      { name: 'publishDate', type: 'date', defaultValue: new Date().toISOString() },
      { name: 'tags', type: 'list', subFields: [{ name: 'tag', type: 'string' }] },
      { name: 'size', type: 'string', enum: ['small', 'medium', 'large'], defaultValue: 'large' }
    ]
  })

  // Stats Card Component  
  builder.registerComponent(BentoStatsCard, {
    name: 'Bento Stats Card',
    inputs: [
      { name: 'number', type: 'string', defaultValue: '42' },
      { name: 'label', type: 'string', defaultValue: 'Articles Written' },
      { name: 'growth', type: 'string', defaultValue: '+12%' },
      { name: 'icon', type: 'string', defaultValue: '📊' },
      { name: 'color', type: 'string', enum: ['blue', 'green', 'purple', 'orange'], defaultValue: 'blue' },
      { name: 'size', type: 'string', enum: ['small', 'medium'], defaultValue: 'small' }
    ]
  })

  // About Card Component
  builder.registerComponent(BentoAboutCard, {
    name: 'Bento About Card', 
    inputs: [
      { name: 'name', type: 'string', defaultValue: 'Your Name' },
      { name: 'title', type: 'string', defaultValue: 'AI Enthusiast & Developer' },
      { name: 'location', type: 'string', defaultValue: 'Houston, TX' },
      { name: 'bio', type: 'longText', defaultValue: 'Passionate about AI, technology, and creating innovative solutions...' },
      { name: 'avatar', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png'] },
      { name: 'socialLinks', type: 'list', subFields: [
        { name: 'icon', type: 'string' },
        { name: 'url', type: 'url' }
      ]},
      { name: 'size', type: 'string', enum: ['small', 'medium'], defaultValue: 'medium' }
    ]
  })

  // Newsletter Component
  builder.registerComponent(BentoNewsletter, {
    name: 'Bento Newsletter',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Stay Updated' },
      { name: 'description', type: 'string', defaultValue: 'Get the latest posts and insights delivered to your inbox' },
      { name: 'placeholder', type: 'string', defaultValue: 'Enter your email' },
      { name: 'buttonText', type: 'string', defaultValue: 'Subscribe' },
      { name: 'size', type: 'string', enum: ['medium', 'large'], defaultValue: 'medium' }
    ]
  })

  // Activity Feed Component
  builder.registerComponent(BentoActivityFeed, {
    name: 'Bento Activity Feed',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Recent Activity' },
      { name: 'activities', type: 'list', subFields: [
        { name: 'icon', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'time', type: 'string' }
      ]},
      { name: 'size', type: 'string', enum: ['medium', 'large'], defaultValue: 'medium' }
    ]
  })
}

// Auto-register when imported
if (typeof window !== 'undefined') {
  registerBentoComponents()
}

export { registerBentoComponents }'''

print("Bento components with Builder.io integration created!")

# Save the files
with open('BlogLayout.tsx', 'w') as f:
    f.write(main_layout)

with open('BentoComponents.tsx', 'w') as f:
    f.write(bento_components)

print("✅ React components created!")
print("\nFiles generated:")
print("- BlogLayout.tsx (Main layout with Builder.io)")
print("- BentoComponents.tsx (Drag-and-drop bento components)")
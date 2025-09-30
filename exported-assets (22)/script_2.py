# Create the Visual AI Panel component for MCP integration
visual_ai_panel = '''// components/VisualAIPanel.tsx - AI-powered visual editing interface
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Wand2, Sparkles, Send, Loader2 } from 'lucide-react'

interface VisualAIPanelProps {
  onClose: () => void
  onLayoutChange: (changes: any) => void
}

export default function VisualAIPanel({ onClose, onLayoutChange }: VisualAIPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversation, setConversation] = useState([
    {
      type: 'ai',
      message: 'Hi! I\'m your Visual AI assistant. I can help you optimize your blog layout, suggest improvements, or make specific changes. Try asking me something like "Make the newsletter component more prominent" or "Optimize this layout for mobile".'
    }
  ])
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  const takeScreenshot = async () => {
    try {
      // Use HTML2Canvas or similar to capture current layout
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Simplified screenshot simulation
      canvas.width = 1200
      canvas.height = 800
      ctx!.fillStyle = '#f9fafb'
      ctx!.fillRect(0, 0, canvas.width, canvas.height)
      
      const dataUrl = canvas.toDataURL('image/png')
      setScreenshot(dataUrl)
      
      setConversation(prev => [...prev, {
        type: 'system',
        message: 'Screenshot captured! Now I can see your current layout.'
      }])
    } catch (error) {
      console.error('Screenshot failed:', error)
    }
  }

  const processAICommand = async () => {
    if (!prompt.trim() || isProcessing) return

    const userMessage = prompt.trim()
    setPrompt('')
    setIsProcessing(true)

    // Add user message to conversation
    setConversation(prev => [...prev, {
      type: 'user', 
      message: userMessage
    }])

    try {
      // Simulate AI processing with actual API call structure
      const response = await fetch('/api/visual-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          screenshot: screenshot,
          context: 'bento-blog-layout',
          capabilities: ['layout-optimization', 'content-generation', 'visual-editing']
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Add AI response to conversation
        setConversation(prev => [...prev, {
          type: 'ai',
          message: result.message
        }])

        // Apply any layout changes
        if (result.layoutChanges) {
          onLayoutChange(result.layoutChanges)
        }

        // Show applied changes
        if (result.actions && result.actions.length > 0) {
          setConversation(prev => [...prev, {
            type: 'system',
            message: `Applied ${result.actions.length} changes: ${result.actions.map(a => a.type).join(', ')}`
          }])
        }
      } else {
        throw new Error(result.error || 'AI processing failed')
      }
    } catch (error) {
      console.error('AI processing error:', error)
      setConversation(prev => [...prev, {
        type: 'ai',
        message: 'Sorry, I encountered an error processing your request. Please try again or rephrase your request.'
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      processAICommand()
    }
  }

  const suggestedPrompts = [
    "Optimize the layout for better engagement",
    "Make the newsletter signup more prominent", 
    "Improve the mobile experience",
    "Suggest better color combinations",
    "Rearrange components for better flow"
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-96 h-full bg-white shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Visual AI Assistant</h3>
                <p className="text-xs text-gray-500">Powered by Claude & MCP Tools</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : message.type === 'system'
                    ? 'bg-green-100 text-green-800 text-sm'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.message}</p>
                </div>
              </motion.div>
            ))}
            
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 text-gray-900 p-3 rounded-2xl flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Analyzing and processing...</span>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Screenshot Section */}
          {screenshot && (
            <div className="p-4 border-t border-gray-100">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Current Layout</span>
                  <Camera className="w-4 h-4 text-gray-500" />
                </div>
                <img 
                  src={screenshot} 
                  alt="Layout screenshot"
                  className="w-full h-20 object-cover rounded border"
                />
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 mb-3">
              <button
                onClick={takeScreenshot}
                className="flex-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Layout</span>
              </button>
              
              <button className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors">
                <Wand2 className="w-4 h-4" />
                <span>Auto-Optimize</span>
              </button>
            </div>

            {/* Suggested Prompts */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Try these suggestions:</p>
              <div className="flex flex-wrap gap-1">
                {suggestedPrompts.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(suggestion)}
                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe what you'd like me to change..."
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  rows={2}
                />
              </div>
              
              <button
                onClick={processAICommand}
                disabled={!prompt.trim() || isProcessing}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg flex items-center justify-center transition-colors self-end"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}'''

print("Visual AI Panel component created!")

# Create the API route for Visual AI processing
visual_ai_api = '''// pages/api/visual-ai.ts - API endpoint for AI-powered visual editing
import type { NextApiRequest, NextApiResponse } from 'next'

interface VisualAIRequest {
  prompt: string
  screenshot?: string
  context: string
  capabilities: string[]
}

interface VisualAIResponse {
  success: boolean
  message: string
  actions?: Array<{
    type: string
    target?: string
    changes?: any
  }>
  layoutChanges?: any
  error?: string
}

// Simulated AI processing - replace with actual Anthropic API call
async function processWithAI(request: VisualAIRequest): Promise<VisualAIResponse> {
  const { prompt, screenshot, context } = request
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Parse intent from prompt
  const lowerPrompt = prompt.toLowerCase()
  
  const actions = []
  let message = "I've analyzed your request. "
  
  // Layout optimization
  if (lowerPrompt.includes('optimize') || lowerPrompt.includes('improve')) {
    actions.push({
      type: 'layout-optimization',
      changes: {
        spacing: 'increased',
        hierarchy: 'improved',
        mobile: 'optimized'
      }
    })
    message += "I've optimized the layout for better visual hierarchy and spacing. "
  }
  
  // Newsletter prominence
  if (lowerPrompt.includes('newsletter') && lowerPrompt.includes('prominent')) {
    actions.push({
      type: 'component-resize',
      target: 'newsletter',
      changes: { size: 'large', position: 'top-right' }
    })
    message += "I've made the newsletter signup more prominent by increasing its size and moving it to a better position. "
  }
  
  // Color suggestions
  if (lowerPrompt.includes('color')) {
    actions.push({
      type: 'color-optimization',
      changes: {
        primary: '#3B82F6',
        accent: '#8B5CF6', 
        background: '#F8FAFC'
      }
    })
    message += "I've suggested a more harmonious color palette that improves readability and visual appeal. "
  }
  
  // Mobile optimization
  if (lowerPrompt.includes('mobile')) {
    actions.push({
      type: 'responsive-optimization',
      changes: {
        stackOrder: 'optimized',
        touchTargets: 'enlarged',
        spacing: 'mobile-friendly'
      }
    })
    message += "I've optimized the layout for mobile devices with better touch targets and spacing. "
  }
  
  // Component rearrangement
  if (lowerPrompt.includes('rearrange') || lowerPrompt.includes('flow')) {
    actions.push({
      type: 'layout-reorder',
      changes: {
        order: ['hero', 'featured-post', 'stats', 'about', 'newsletter', 'activity']
      }
    })
    message += "I've rearranged the components for better user flow and engagement. "
  }
  
  // Default helpful response
  if (actions.length === 0) {
    message = "I understand you'd like to make changes to your layout. Could you be more specific? For example, you could ask me to 'make the blog posts larger', 'change the color scheme', or 'optimize for mobile viewing'."
  }
  
  return {
    success: true,
    message: message.trim(),
    actions,
    layoutChanges: actions.length > 0 ? {
      timestamp: Date.now(),
      changes: actions
    } : undefined
  }
}

// Actual Anthropic API integration (commented for safety)
/*
async function processWithAnthropic(request: VisualAIRequest): Promise<VisualAIResponse> {
  const { Anthropic } = await import('@anthropic-ai/sdk')
  
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  try {
    const messages = [
      {
        role: 'user' as const,
        content: [
          {
            type: 'text' as const,
            text: `You are a visual AI assistant for a bento grid blog layout. The user wants: "${request.prompt}". 
            
            Analyze this request and provide specific actions to improve the layout. Respond with both a natural explanation and structured JSON actions.
            
            Available actions:
            - layout-optimization: Improve spacing, hierarchy, visual flow
            - component-resize: Change size of specific components  
            - color-optimization: Suggest better color schemes
            - responsive-optimization: Improve mobile experience
            - layout-reorder: Rearrange component positions
            
            Context: ${request.context}`
          }
        ]
      }
    ]

    // Add screenshot if available
    if (request.screenshot) {
      messages[0].content.push({
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: 'image/png' as const,
          data: request.screenshot.split(',')[1] // Remove data:image/png;base64, prefix
        }
      })
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20241022',
      max_tokens: 1000,
      messages
    })

    const content = response.content[0]
    if (content.type === 'text') {
      // Parse AI response and extract actions
      const aiMessage = content.text
      
      // Extract JSON from response if present
      const jsonMatch = aiMessage.match(/```json\n([\s\S]*?)\n```/)
      let actions = []
      
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1])
          actions = parsed.actions || []
        } catch (e) {
          console.error('Failed to parse AI JSON:', e)
        }
      }

      return {
        success: true,
        message: aiMessage,
        actions,
        layoutChanges: actions.length > 0 ? {
          timestamp: Date.now(),
          changes: actions
        } : undefined
      }
    }
    
    throw new Error('Unexpected response format')
  } catch (error) {
    console.error('Anthropic API error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Sorry, I encountered an error processing your request. Please try again.'
    }
  }
}
*/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VisualAIResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    })
  }

  try {
    const request = req.body as VisualAIRequest
    
    if (!request.prompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing prompt',
        message: 'Please provide a prompt for the AI to process'
      })
    }

    // Process with simulated AI (replace with processWithAnthropic for production)
    const result = await processWithAI(request)
    
    res.status(200).json(result)
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while processing your request'
    })
  }
}'''

print("Visual AI API endpoint created!")

# Create main page component  
main_page = '''// pages/index.tsx - Main blog page
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
}'''

print("Main page component created!")

# Save the additional files
with open('VisualAIPanel.tsx', 'w') as f:
    f.write(visual_ai_panel)

with open('visual-ai.ts', 'w') as f:
    f.write(visual_ai_api)

with open('index.tsx', 'w') as f:
    f.write(main_page)

print("✅ Additional components and API created!")
print("\nFiles generated:")
print("- VisualAIPanel.tsx (AI assistant interface)")
print("- visual-ai.ts (API endpoint for AI processing)")  
print("- index.tsx (Main page component)")
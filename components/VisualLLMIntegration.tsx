'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Wand2, Code, Palette } from 'lucide-react'

interface VisualLLMIntegrationProps {
  onVisualEdit?: (instruction: string) => void
  onCodeEdit?: (instruction: string) => void
}

export default function VisualLLMIntegration({ onVisualEdit, onCodeEdit }: VisualLLMIntegrationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [mode, setMode] = useState<'visual' | 'code'>('visual')

  const handleSubmit = () => {
    if (mode === 'visual' && onVisualEdit) {
      onVisualEdit(instruction)
    } else if (mode === 'code' && onCodeEdit) {
      onCodeEdit(instruction)
    }
    setInstruction('')
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg z-50"
      >
        <Wand2 className="w-6 h-6 text-white" />
      </motion.button>

      {/* Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900/90 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Visual LLM Assistant</h3>
            
            {/* Mode Selection */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMode('visual')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  mode === 'visual' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Eye size={16} />
                Visual Edit
              </button>
              <button
                onClick={() => setMode('code')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  mode === 'code' 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Code size={16} />
                Code Edit
              </button>
            </div>

            {/* Instruction Input */}
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={
                mode === 'visual' 
                  ? "Describe visual changes you want to make..."
                  : "Describe code changes you want to make..."
              }
              className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-cyan-400/50"
            />

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 px-4 bg-white/5 border border-white/20 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!instruction.trim()}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                Apply Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

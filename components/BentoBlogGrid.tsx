'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Eye, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  readTime: number
  category: string
  mainImage?: { asset: { url: string } }
  views?: number
  likes?: number
  featured?: boolean
}

interface BentoBlogGridProps {
  posts: BlogPost[]
}

export default function BentoBlogGrid({ posts }: BentoBlogGridProps) {
  const getGridClass = (index: number, featured: boolean) => {
    if (featured) return 'col-span-2 row-span-2'
    if (index % 7 === 0) return 'col-span-2'
    if (index % 5 === 0) return 'row-span-2'
    return 'col-span-1 row-span-1'
  }

  return (
    <div className="grid grid-cols-4 auto-rows-[200px] gap-4 max-w-7xl mx-auto">
      {posts.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`${getGridClass(index, post.featured)} group`}
        >
          <Link href={`/blog/${post.slug.current}`}>
            <div className="relative h-full w-full rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer">
              
              {/* Background Image */}
              {post.mainImage && (
                <div className="absolute inset-0">
                  <Image
                    src={post.mainImage.asset.url}
                    alt={post.title}
                    fill
                    className="object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-medium bg-cyan-400/20 text-cyan-300 rounded-full">
                      {post.category}
                    </span>
                    {post.featured && (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-400/20 text-purple-300 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{post.readTime}m</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {post.views && (
                      <div className="flex items-center gap-1">
                        <Eye size={12} />
                        <span>{post.views}</span>
                      </div>
                    )}
                    {post.likes && (
                      <div className="flex items-center gap-1">
                        <Heart size={12} />
                        <span>{post.likes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

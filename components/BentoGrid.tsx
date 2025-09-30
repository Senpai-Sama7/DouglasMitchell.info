"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Heart, MessageCircle, Share2, ArrowUpRight, Sparkles } from "lucide-react";
import clsx from "clsx";

export interface BentoItem {
  id: string;
  type: "hero" | "stats" | "about" | "newsletter" | "activity" | "feature" | "blog";
  title: string;
  content?: string;
  size: "small" | "medium" | "large" | "wide";
  gradient?: string;
  color?: "blue" | "purple" | "orange" | "green";
  data?: any;
}

interface BentoGridProps {
  items: BentoItem[];
  editable?: boolean;
  onEdit?: (id: string) => void;
}

export function BentoGrid({ items, editable = false, onEdit }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[120px] p-6">
      {items.map((item, index) => (
        <BentoCard
          key={item.id}
          item={item}
          index={index}
          editable={editable}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

function BentoCard({ item, index, editable, onEdit }: { 
  item: BentoItem; 
  index: number;
  editable?: boolean; 
  onEdit?: (id: string) => void; 
}) {
  const sizeClasses = {
    small: "col-span-1 md:col-span-2 row-span-2",
    medium: "col-span-1 md:col-span-2 lg:col-span-3 row-span-3", 
    large: "col-span-1 md:col-span-3 lg:col-span-4 row-span-4",
    wide: "col-span-1 md:col-span-4 lg:col-span-6 row-span-2"
  };

  return (
    <motion.div
      className={clsx(
        "group relative overflow-hidden cursor-pointer",
        "bg-glass-100 backdrop-blur-xl border border-white/20",
        "rounded-3xl shadow-glass hover:shadow-clay-hover",
        "transition-all duration-500 ease-out",
        "hover:scale-[1.02] hover:-translate-y-1",
        sizeClasses[item.size]
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ 
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.2 }
      }}
      onClick={() => editable && onEdit?.(item.id)}
    >
      {/* Gradient overlay */}
      <div className={clsx(
        "absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-300",
        item.gradient || "bg-gradient-to-br from-accent-purple/20 to-accent-blue/20"
      )} />
      
      {/* Glass reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      
      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between z-10">
        {renderCardContent(item)}
        
        {/* Hover indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight className="w-5 h-5 text-white/80" />
        </div>
        
        {/* Edit indicator */}
        {editable && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 bg-accent-purple/80 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✎</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-3xl border border-white/30 group-hover:border-white/50 transition-colors duration-300" />
    </motion.div>
  );
}

function renderCardContent(item: BentoItem) {
  switch (item.type) {
    case "hero":
      return (
        <div className="h-full flex flex-col justify-center">
          <motion.div 
            className="mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-white/90" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            {item.title}
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            {item.content}
          </p>
        </div>
      );

    case "stats":
      return (
        <div className="h-full flex flex-col justify-between">
          <div className="text-3xl mb-2">{item.data?.icon || "📊"}</div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">
              {item.data?.number || "42"}
            </div>
            <div className="text-sm text-white/80 mb-2">{item.title}</div>
            {item.data?.growth && (
              <div className="text-xs text-white/60 flex items-center">
                <span className="mr-1">↗</span>
                <span>{item.data.growth}</span>
              </div>
            )}
          </div>
        </div>
      );

    case "about":
      return (
        <div className="h-full flex flex-col items-center text-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold mb-4 border border-white/20">
            {item.data?.avatar ? (
              <img src={item.data.avatar} alt={item.title} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              item.title.charAt(0)
            )}
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
          <p className="text-sm text-white/70 mb-1">{item.data?.role || "Developer"}</p>
          <p className="text-xs text-white/60">📍 {item.data?.location || "Remote"}</p>
        </div>
      );

    case "newsletter":
      return (
        <div className="h-full flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-white/80 mb-4">{item.content}</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="email"
              placeholder="Enter email"
              className="flex-1 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors border border-white/20">
              Join
            </button>
          </div>
        </div>
      );

    case "activity":
      return (
        <div className="h-full">
          <h3 className="text-lg font-bold text-white mb-4">{item.title}</h3>
          <div className="space-y-3">
            {(item.data?.activities || []).slice(0, 2).map((activity: any, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <span className="text-sm">{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{activity.text}</p>
                  <p className="text-xs text-white/60 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "feature":
      return (
        <div className="h-full flex flex-col justify-center">
          <div className="text-4xl mb-4">{item.data?.icon || "✨"}</div>
          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-white/80 text-sm">{item.content}</p>
        </div>
      );

    default:
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-white/80">{item.content}</p>
          </div>
        </div>
      );
  }
}

// Modern glassmorphic demo data
export const defaultBentoItems: BentoItem[] = [
  {
    id: "1",
    type: "hero",
    title: "AI-Powered Portfolio",
    content: "Crafting the future of web experiences with cutting-edge technology and beautiful design.",
    size: "large",
    gradient: "bg-gradient-to-br from-accent-purple/30 to-accent-pink/30"
  },
  {
    id: "2", 
    type: "stats",
    title: "Projects",
    size: "small",
    gradient: "bg-gradient-to-br from-accent-blue/30 to-accent-purple/30",
    data: { number: "25+", icon: "🚀", growth: "+5 this month" }
  },
  {
    id: "3",
    type: "about",
    title: "Douglas Mitchell",
    size: "medium",
    gradient: "bg-gradient-to-br from-accent-emerald/30 to-accent-blue/30",
    data: { role: "AI Developer", location: "Houston, TX" }
  },
  {
    id: "4",
    type: "stats", 
    title: "GitHub Stars",
    size: "small",
    gradient: "bg-gradient-to-br from-accent-pink/30 to-accent-purple/30",
    data: { number: "150+", icon: "⭐", growth: "+12 this week" }
  },
  {
    id: "5",
    type: "feature",
    title: "Modern Stack",
    content: "Next.js, TypeScript, AI/ML, and cutting-edge tools for exceptional results.",
    size: "medium",
    gradient: "bg-gradient-to-br from-accent-blue/30 to-accent-emerald/30",
    data: { icon: "⚡" }
  },
  {
    id: "6",
    type: "newsletter",
    title: "Stay Connected",
    content: "Get updates on latest projects and tech insights.",
    size: "medium",
    gradient: "bg-gradient-to-br from-accent-purple/30 to-accent-blue/30"
  },
  {
    id: "7",
    type: "activity",
    title: "Recent Work", 
    size: "medium",
    gradient: "bg-gradient-to-br from-accent-pink/30 to-accent-emerald/30",
    data: {
      activities: [
        { icon: "💻", text: "Launched AI portfolio system", time: "2 hours ago" },
        { icon: "🎨", text: "Redesigned with glassmorphism", time: "1 day ago" },
        { icon: "🚀", text: "Deployed to production", time: "2 days ago" }
      ]
    }
  }
];

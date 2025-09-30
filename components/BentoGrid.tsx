"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Heart, MessageCircle, Share2 } from "lucide-react";
import clsx from "clsx";

export interface BentoItem {
  id: string;
  type: "blog" | "stats" | "about" | "newsletter" | "activity";
  title: string;
  content?: string;
  size: "small" | "medium" | "large";
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
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[160px]">
      {items.map((item) => (
        <BentoCard
          key={item.id}
          item={item}
          editable={editable}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

function BentoCard({ item, editable, onEdit }: { 
  item: BentoItem; 
  editable?: boolean; 
  onEdit?: (id: string) => void; 
}) {
  const sizeClasses = {
    small: "col-span-1 md:col-span-2 row-span-1",
    medium: "col-span-1 md:col-span-3 row-span-2", 
    large: "col-span-1 md:col-span-4 row-span-2"
  };

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    green: "from-green-500 to-green-600"
  };

  return (
    <motion.div
      className={clsx(
        "bento relative overflow-hidden cursor-pointer group",
        sizeClasses[item.size]
      )}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      onClick={() => editable && onEdit?.(item.id)}
    >
      {renderCardContent(item, colorClasses)}
      {editable && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
            ✎
          </div>
        </div>
      )}
    </motion.div>
  );
}

function renderCardContent(item: BentoItem, colorClasses: Record<string, string>) {
  switch (item.type) {
    case "blog":
      return (
        <div className="h-full p-6 flex flex-col justify-between bg-white">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {item.data?.category || "Blog"}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3">
              {item.content}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{item.data?.date || "Today"}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{item.data?.readTime || "5"} min</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-3 h-3 hover:text-red-500 cursor-pointer transition-colors" />
              <MessageCircle className="w-3 h-3 hover:text-blue-500 cursor-pointer transition-colors" />
              <Share2 className="w-3 h-3 hover:text-green-500 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      );

    case "stats":
      return (
        <div className={clsx(
          "h-full p-6 text-white bg-gradient-to-br",
          colorClasses[item.color || "blue"]
        )}>
          <div className="flex flex-col justify-between h-full">
            <div className="text-2xl mb-2">{item.data?.icon || "📊"}</div>
            <div>
              <div className="text-3xl font-bold mb-1">{item.data?.number || "42"}</div>
              <div className="text-sm opacity-90 mb-2">{item.title}</div>
              {item.data?.growth && (
                <div className="text-xs opacity-75 flex items-center">
                  <span className="mr-1">↗</span>
                  <span>{item.data.growth} this month</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case "about":
      return (
        <div className="h-full p-6 bg-white flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-4">
            {item.data?.avatar ? (
              <img src={item.data.avatar} alt={item.title} className="w-full h-full rounded-full object-cover" />
            ) : (
              item.title.charAt(0)
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
          <p className="text-sm text-blue-600 mb-1">{item.data?.role || "Developer"}</p>
          <p className="text-xs text-gray-500 mb-4">📍 {item.data?.location || "Houston, TX"}</p>
          <p className="text-sm text-gray-600 leading-relaxed flex-1">
            {item.content}
          </p>
        </div>
      );

    case "newsletter":
      return (
        <div className="h-full p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
            <p className="text-sm opacity-90 mb-4">{item.content}</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 rounded-lg text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      );

    case "activity":
      return (
        <div className="h-full p-6 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{item.title}</h3>
          <div className="space-y-3">
            {(item.data?.activities || []).slice(0, 3).map((activity: any, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-sm">{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="h-full p-6 bg-white flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.content}</p>
          </div>
        </div>
      );
  }
}

// Default demo data
export const defaultBentoItems: BentoItem[] = [
  {
    id: "1",
    type: "blog",
    title: "Building the Future with AI",
    content: "Exploring how artificial intelligence is reshaping the way we build and deploy applications in 2024.",
    size: "large",
    data: { category: "AI/ML", date: "Dec 30", readTime: "8" }
  },
  {
    id: "2", 
    type: "stats",
    title: "Projects Built",
    size: "small",
    color: "blue",
    data: { number: "25+", icon: "🚀", growth: "+5" }
  },
  {
    id: "3",
    type: "about",
    title: "Douglas Mitchell",
    content: "AI enthusiast and full-stack developer passionate about creating innovative solutions that make a difference.",
    size: "medium",
    data: { role: "AI Developer", location: "Houston, TX" }
  },
  {
    id: "4",
    type: "stats", 
    title: "GitHub Stars",
    size: "small",
    color: "green",
    data: { number: "150+", icon: "⭐", growth: "+12" }
  },
  {
    id: "5",
    type: "newsletter",
    title: "Stay Updated",
    content: "Get the latest insights on AI, development, and tech trends delivered to your inbox.",
    size: "medium"
  },
  {
    id: "6",
    type: "activity",
    title: "Recent Activity", 
    size: "medium",
    data: {
      activities: [
        { icon: "✏️", text: "Updated AI agent project", time: "2 hours ago" },
        { icon: "❤️", text: "Received 15 stars on GitHub", time: "1 day ago" },
        { icon: "💬", text: "New comment on blog post", time: "2 days ago" }
      ]
    }
  }
];

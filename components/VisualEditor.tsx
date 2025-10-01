"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wand2, Save, Eye } from "lucide-react";
import { BentoItem } from "./BentoGrid";

interface VisualEditorProps {
  isOpen: boolean;
  onClose: () => void;
  items: BentoItem[];
  onUpdateItems: (items: BentoItem[]) => void;
  editingId?: string;
}

export default function VisualEditor({ isOpen, onClose, items, onUpdateItems, editingId }: VisualEditorProps) {
  const [editingItem, setEditingItem] = useState<BentoItem | null>(
    editingId ? items.find(item => item.id === editingId) || null : null
  );

  const handleSave = () => {
    if (editingItem) {
      const updatedItems = items.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
      onUpdateItems(updatedItems);
      setEditingItem(null);
    }
  };

  const handleAddNew = () => {
    const newItem: BentoItem = {
      id: Date.now().toString(),
      type: "blog",
      title: "New Item",
      content: "Add your content here...",
      size: "medium"
    };
    onUpdateItems([...items, newItem]);
    setEditingItem(newItem);
  };

  const handleDelete = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    onUpdateItems(updatedItems);
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex"
        >
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-96 h-full bg-white shadow-2xl flex flex-col ml-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <Wand2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Visual Editor</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Items List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Grid Items</h4>
                  <button
                    onClick={handleAddNew}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Add New
                  </button>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        editingItem?.id === item.id 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setEditingItem(item)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            {item.type} • {item.size}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Form */}
              {editingItem && (
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Edit Item</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          title: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={editingItem.type}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          type: e.target.value as BentoItem["type"]
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="blog">Blog Post</option>
                        <option value="stats">Stats Card</option>
                        <option value="about">About Card</option>
                        <option value="newsletter">Newsletter</option>
                        <option value="activity">Activity Feed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size
                      </label>
                      <select
                        value={editingItem.size}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          size: e.target.value as BentoItem["size"]
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea
                        value={editingItem.content || ""}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          content: e.target.value
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {editingItem.type === "stats" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number
                          </label>
                          <input
                            type="text"
                            value={editingItem.data?.number || ""}
                            onChange={(e) => setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, number: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color
                          </label>
                          <select
                            value={editingItem.color || "blue"}
                            onChange={(e) => setEditingItem({
                              ...editingItem,
                              color: e.target.value as BentoItem["color"]
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="blue">Blue</option>
                            <option value="purple">Purple</option>
                            <option value="orange">Orange</option>
                            <option value="green">Green</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

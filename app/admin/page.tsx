"use client";

import { useState, useEffect } from "react";
import { BentoGrid, defaultBentoItems, BentoItem } from "../../components/BentoGrid";
import { VisualEditor } from "../../components/VisualEditor";
import { Eye, Edit3, Save, Download, Upload } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<BentoItem[]>(defaultBentoItems);
  const [editingId, setEditingId] = useState<string>();

  // Simple password authentication (in production, use proper auth)
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") { // Change this in production
      setIsAuthenticated(true);
      loadSavedLayout();
    } else {
      alert("Invalid password");
    }
  };

  const loadSavedLayout = () => {
    const saved = localStorage.getItem("bento-layout");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load saved layout:", error);
      }
    }
  };

  const saveLayout = () => {
    localStorage.setItem("bento-layout", JSON.stringify(items));
    alert("Layout saved successfully!");
  };

  const exportLayout = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bento-layout.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importLayout = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          setItems(imported);
          alert("Layout imported successfully!");
        } catch (error) {
          alert("Failed to import layout. Please check the file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCardEdit = (id: string) => {
    setEditingId(id);
    setIsEditing(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float [animation-delay:2s]"></div>
        </div>
        
        <div className="relative bg-glass-100 backdrop-blur-xl border border-white/20 rounded-3xl shadow-glass p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Admin Access
            </h1>
            <p className="text-white/70 text-sm">Enter password to customize your bento grid</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-glass-50 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-glass-100 transition-all"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-2xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float [animation-delay:2s]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-glass-50 backdrop-blur-xl border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Bento Editor</h1>
              <p className="text-white/60 text-sm">Glassmorphic Design System</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                isEditing 
                  ? "bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30" 
                  : "bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
              }`}
            >
              {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{isEditing ? "Preview" : "Edit"}</span>
            </button>
            
            <button
              onClick={saveLayout}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-all duration-300 backdrop-blur-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>

            <button
              onClick={exportLayout}
              className="flex items-center space-x-2 px-4 py-2 bg-pink-500/20 border border-pink-400/30 text-pink-300 rounded-xl hover:bg-pink-500/30 transition-all duration-300 backdrop-blur-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <label className="flex items-center space-x-2 px-4 py-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 rounded-xl hover:bg-orange-500/30 transition-all duration-300 cursor-pointer backdrop-blur-sm">
              <Upload className="w-4 h-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={importLayout}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="bg-glass-100 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              {isEditing ? "🎨 Edit Mode Active" : "👁️ Preview Mode"}
            </h2>
            <p className="text-white/70">
              {isEditing 
                ? "Click on any card to edit its content, or use the visual editor panel."
                : "This is how your bento grid will appear to visitors."
              }
            </p>
          </div>
        </div>

        <BentoGrid 
          items={items} 
          editable={isEditing}
          onEdit={handleCardEdit}
        />
      </div>

      {/* Visual Editor Panel */}
      <VisualEditor
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        items={items}
        onUpdateItems={setItems}
        editingId={editingId}
      />
    </div>
  );
}

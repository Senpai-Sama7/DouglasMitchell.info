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
      <div className="min-h-screen bg-gradient-to-br from-halcyon-warm to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-bento shadow-bento p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-halcyon-text mb-6 text-center">
            Admin Access
          </h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-halcyon-warm to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-halcyon-text">
            Bento Grid Editor
          </h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isEditing 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "bg-primary text-white hover:bg-blue-700"
              }`}
            >
              {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{isEditing ? "Preview" : "Edit"}</span>
            </button>
            
            <button
              onClick={saveLayout}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>

            <button
              onClick={exportLayout}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <label className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer">
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
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {isEditing ? "Edit Mode - Click cards to modify" : "Preview Mode"}
          </h2>
          <p className="text-gray-600">
            {isEditing 
              ? "Click on any card to edit its content, or use the visual editor panel."
              : "This is how your bento grid will appear to visitors."
            }
          </p>
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

"use client";

import { lazy, Suspense } from "react";
import { BentoItem } from "./BentoGrid";

const VisualEditor = lazy(() => import("./VisualEditor"));

interface LazyVisualEditorProps {
  isOpen: boolean;
  onClose: () => void;
  items: BentoItem[];
  onUpdateItems: (items: BentoItem[]) => void;
  editingId?: string;
}

function EditorSkeleton() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] animate-pulse">
        <div className="h-8 bg-white/20 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-32 bg-white/10 rounded"></div>
          <div className="h-24 bg-white/10 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function LazyVisualEditor(props: LazyVisualEditorProps) {
  if (!props.isOpen) return null;

  return (
    <Suspense fallback={<EditorSkeleton />}>
      <VisualEditor {...props} />
    </Suspense>
  );
}

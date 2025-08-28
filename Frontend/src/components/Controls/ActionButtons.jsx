// src/components/Controls/ActionButtons.jsx
import React from 'react';

// The "Recognize" button is no longer needed.
export default function ActionButtons({ handleUndo, handleClear, isLoading, canUndo }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        className="px-4 py-2 rounded-lg border shadow hover:bg-gray-100 disabled:opacity-50"
        onClick={handleUndo}
        disabled={!canUndo || isLoading}
      >
        Undo
      </button>
      <button
        className="px-4 py-2 rounded-lg border shadow hover:bg-gray-100"
        onClick={handleClear}
      >
        Clear
      </button>
    </div>
  );
}
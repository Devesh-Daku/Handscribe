// src/components/RecognizedOutput.jsx
import React from 'react';

export default function RecognizedOutput({ lineResults, totalLines }) {
  const sortedLines = Array.from({ length: totalLines }).map((_, i) => {
    const lineKey = `line_${i + 1}`;
    const result = lineResults[lineKey];
    if (result?.isLoading) {
      return <span key={lineKey} className="text-blue-500">Recognizing...</span>;
    }
    if (result?.text) {
      return result.text;
    }
    return ""; // Return empty string for lines not yet recognized
  });
  
  return (
    <div className="w-full p-4 border rounded-lg bg-white min-h-[100px]">
      <h3 className="font-bold text-lg mb-2">Recognized Text</h3>
      <div className="text-gray-800 whitespace-pre-wrap font-sans">
        {sortedLines.map((text, index) => (
          <div key={index} className="min-h-[1.5em]">
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
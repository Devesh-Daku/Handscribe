import React from "react";

export default function RecognizedOutput({ recognized }) {
  if (!recognized) {
    return <p className="text-xs text-gray-500">Write on the canvas, then click <b>Recognize</b>.</p>;
  }

  return (
    <div className="text-sm">
      <div className="font-medium">Matrix dims: {recognized.dims[0]} × {recognized.dims[1]}</div>
      <div className="mt-2">Top-left sample (4×8):</div>
      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-64">
        {JSON.stringify(recognized.sample, null, 2)}
      </pre>
    </div>
  );
}

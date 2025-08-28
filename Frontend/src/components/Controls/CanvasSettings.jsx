// src/components/Controls/CanvasSettings.jsx
import React from 'react';

export default function CanvasSettings({
  size,
  setSize,
  backgroundColor,
  setBackgroundColor,
  guidelines,
  setGuidelines,
  showGuidelines,
  setShowGuidelines,
}) {
  const colors = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Paper', value: '#FDF5E6' },
    { name: 'Mint', value: '#F0FFF0' },
  ];

  return (
    <>
      {/* Canvas Size */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Canvas Size</label>
        <div className="flex gap-2">
          <button className={`flex-1 p-2 rounded ${size === 256 ? 'bg-black text-white' : 'border'}`} onClick={() => setSize(256)}>S</button>
          <button className={`flex-1 p-2 rounded ${size === 512 ? 'bg-black text-white' : 'border'}`} onClick={() => setSize(512)}>M</button>
          <button className={`flex-1 p-2 rounded ${size === 768 ? 'bg-black text-white' : 'border'}`} onClick={() => setSize(768)}>L</button>
        </div>
      </div>

      {/* Canvas Color */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Canvas Color</label>
        <div className="flex gap-2">
          {colors.map(color => (
            <button
              key={color.value}
              onClick={() => setBackgroundColor(color.value)}
              className={`flex-1 p-2 rounded border-2 ${backgroundColor === color.value ? 'border-blue-500' : 'border-transparent'}`}
              style={{ backgroundColor: color.value, color: color.value === '#FFFFFF' ? 'black' : 'inherit' }}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <label htmlFor="guidelines" className="font-semibold">Guidelines: {guidelines}</label>
            <div className="flex items-center">
              <input type="checkbox" id="showGuidelines" checked={showGuidelines} onChange={(e) => setShowGuidelines(e.target.checked)} className="mr-2"/>
              <label htmlFor="showGuidelines">Show</label>
            </div>
        </div>
        <input type="range" id="guidelines" min="2" max="10" value={guidelines} onChange={(e) => setGuidelines(Number(e.target.value))} className="w-full"/>
      </div>
    </>
  );
}
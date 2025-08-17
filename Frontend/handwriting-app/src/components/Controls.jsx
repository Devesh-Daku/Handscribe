// src/components/Controls.js
export default function Controls({ onRecognize, onClear, onStore, onSend }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-xl border shadow" onClick={onRecognize}>
          Recognize
        </button>
        <button className="px-4 py-2 rounded-xl border shadow" onClick={onClear}>
          Clear
        </button>
        <button className="px-4 py-2 rounded-xl border shadow" onClick={onStore}>
          Store
        </button>
        <button className="px-4 py-2 rounded-xl border shadow" onClick={onSend}>
          Send Matrix
        </button>
      </div>
    </div>
  );
}

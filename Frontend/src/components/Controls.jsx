export default function Controls({ onRecognize, onClear, onStore, onSend, onSendSplit }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
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
        <button className="px-4 py-2 rounded-xl border shadow" onClick={onSendSplit}>
          Send Split Matrices
        </button>
      </div>
    </div>
  );
}

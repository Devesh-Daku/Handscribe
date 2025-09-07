import React, { useState, useCallback, useEffect } from "react";
import CanvasBoard from "./components/CanvasBoard";
import RecognizedOutput from "./components/RecognizedOutput";
import { useHandwritingBoard } from "./hooks/useHandwritingBoard";
import { CANVAS_CONFIG } from "./constants/appConstants";
import "./App.css";

// Import the wake-up utility function and the new status sidebar
import { startWakeUpSequence } from './utils/serverwakeup.jsx';
import ServerStatusSidebar from "./components/ServerStatusSidebar";

// Import sub-components
import ActionButtons from "./components/Controls/ActionButtons";
import CanvasSettings from "./components/Controls/CanvasSettings";
import ToolSettings from "./components/Controls/ToolSettings";

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export default function App() {
  const { canvasRef, history, lineResults, handlers } = useHandwritingBoard();
  const { handleLineChange, handleStrokeEnd, handleDrawingStart, handleClear, handleUndo } = handlers;

  const [serverStatuses, setServerStatuses] = useState({});

  // State for all settings
  const [size, setSize] = useState(CANVAS_CONFIG.DEFAULT_SIZE);
  const [tool, setTool] = useState('pen');
  const [penSize, setPenSize] = useState(CANVAS_CONFIG.DEFAULT_LINE_WIDTH);
  const [guidelines, setGuidelines] = useState(CANVAS_CONFIG.DEFAULT_GUIDELINES);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleStatusChange = (serverName, status) => {
      setServerStatuses(prevStatuses => ({
        ...prevStatuses,
        [serverName]: status,
      }));
    };
    
    startWakeUpSequence(handleStatusChange);
  }, []);

  // --- Stabilize the event handlers with useCallback ---
  const onLineChangeCallback = useCallback((prevLine) => {
    handleLineChange(prevLine, guidelines, 10);
  }, [handleLineChange, guidelines]);

  const onStrokeEndCallback = useCallback((currentLine) => {
    handleStrokeEnd(currentLine, guidelines, 10);
  }, [handleStrokeEnd, guidelines]);
  
  const onDrawingStartCallback = useCallback((currentLine) => {
    handleDrawingStart(currentLine);
  }, [handleDrawingStart]);
  
  const onUndoCallback = useCallback(() => {
    handleUndo(backgroundColor);
  }, [handleUndo, backgroundColor]);

  const onClearCallback = useCallback(() => {
    handleClear(backgroundColor);
  }, [handleClear, backgroundColor]);


  return (
    <div className="outer min-h-screen w-full flex flex-col text-gray-800 ">
      <header className="flex items-center p-4 bg-white shadow-md z-20">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-gray-200 transition-colors" title="Toggle Settings">
          <MenuIcon />
        </button>
        <h1 className="text-2xl font-bold ml-4">Hand Scribe</h1>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className={`absolute lg:relative flex-shrink-0 w-72 bg-white shadow-lg lg:shadow-none p-4 flex flex-col gap-4 overflow-y-auto transition-transform duration-300 ease-in-out z-10 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <h2 className="text-xl font-semibold border-b pb-2">Settings</h2>
          <CanvasSettings
            size={size} setSize={setSize}
            backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor}
            guidelines={guidelines} setGuidelines={setGuidelines}
            showGuidelines={showGuidelines} setShowGuidelines={setShowGuidelines}
          />
          <hr/>
          <ToolSettings
            tool={tool} setTool={setTool}
            penSize={penSize} setPenSize={setPenSize}
          />
        </aside>

        <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-8 gap-8 overflow-y-auto">
          <div className="w-full lg:w-7/12 flex flex-col items-center gap-4">
            <CanvasBoard
              ref={canvasRef}
              size={size}
              tool={tool}
              penSize={penSize}
              guidelines={guidelines}
              showGuidelines={showGuidelines}
              backgroundColor={backgroundColor}
              history={history}
              onLineChange={onLineChangeCallback}
              onStrokeEnd={onStrokeEndCallback}
              onDrawingStart={onDrawingStartCallback}
            />
            <ActionButtons
              handleUndo={onUndoCallback}
              handleClear={onClearCallback}
              isLoading={Object.values(lineResults).some(l => l.isLoading)}
              canUndo={history.current.length > 0}
            />
          </div>

          <div className="w-full lg:w-5/12">
            <RecognizedOutput
              lineResults={lineResults}
              totalLines={guidelines}
            />
            <ServerStatusSidebar serverStatuses={serverStatuses} />
          </div>
        </main>
      </div>

    </div>
  );
}
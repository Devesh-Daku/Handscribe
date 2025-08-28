// src/components/Controls.jsx
import React from 'react';
import ActionButtons from './Controls/ActionButtons';
import CanvasSettings from './Controls/CanvasSettings';
import ToolSettings from './Controls/ToolSettings';

export default function Controls(props) {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50">
      <ActionButtons
        handleRecognize={props.handleRecognize}
        handleUndo={props.handleUndo}
        handleClear={props.handleClear}
        isLoading={props.apiState.isLoading}
        canUndo={props.history.current.length > 0}
      />
      <hr/>
      <CanvasSettings
        size={props.size}
        setSize={props.setSize}
        backgroundColor={props.backgroundColor}
        setBackgroundColor={props.setBackgroundColor}
        guidelines={props.guidelines}
        setGuidelines={props.setGuidelines}
        showGuidelines={props.showGuidelines}
        setShowGuidelines={props.setShowGuidelines}
      />
      <hr/>
      <ToolSettings
        tool={props.tool}
        setTool={props.setTool}
        penSize={props.penSize}
        setPenSize={props.setPenSize}
      />
    </div>
  );
}
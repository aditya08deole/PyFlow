import React from 'react';

interface DebugPanelProps {
  isDebugging: boolean;
  onStart: () => void;
  onStop: () => void;
  onStep: () => void;
  currentLine?: number | null;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  isDebugging,
  onStart,
  onStop,
  onStep,
  currentLine,
}) => {
  return (
    <div className="h-full p-4 bg-gray-50">
      <h3 className="text-lg font-medium mb-4">Debug Controls</h3>

      <div className="space-y-3">
        {!isDebugging ? (
          <button
            onClick={onStart}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Start Debugging
          </button>
        ) : (
          <div className="space-y-2">
            <button
              onClick={onStep}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Step Forward
            </button>
            <button
              onClick={onStop}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Stop Debugging
            </button>
          </div>
        )}

        {currentLine && (
          <div className="mt-4 p-3 bg-blue-100 rounded">
            <p className="text-sm font-medium">Current Line: {currentLine}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPanel;

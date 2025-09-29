import React, { useState } from 'react';

type VisualizationMode = 'flowchart' | 'datastructure' | 'memory' | 'compare';

interface FlowchartViewerProps {
  data: string;
  currentLine?: number | null;
  dsState?: any;
  memoryState?: any;
  compareMode?: boolean;
}

const FlowchartViewer: React.FC<FlowchartViewerProps> = ({ 
  data, 
  currentLine, 
  dsState, 
  memoryState, 
  compareMode = false 
}) => {
  const [viewMode, setViewMode] = useState<VisualizationMode>('flowchart');
  const [showControls, setShowControls] = useState(true);

  const renderFlowchart = () => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
      {data ? (
        <div className="font-mono text-xs text-left bg-gray-50 p-4 rounded">
          <pre>{data}</pre>
        </div>
      ) : (
        <p>Write some Python code to see the flowchart visualization</p>
      )}
    </div>
  );

  const renderDataStructure = () => (
    <div className="border-2 border-blue-200 rounded-lg p-8 bg-blue-50">
      {dsState ? (
        <div className="space-y-4">
          <h4 className="font-semibold text-blue-800">Data Structures</h4>
          <div className="grid grid-cols-1 gap-4">
            {/* Array Visualization */}
            {dsState.arrays && dsState.arrays.map((arr: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded border">
                <div className="text-sm font-medium mb-2">{arr.name}</div>
                <div className="flex space-x-1">
                  {arr.values.map((val: any, i: number) => (
                    <div 
                      key={i} 
                      className={`w-8 h-8 border border-gray-400 flex items-center justify-center text-xs ${
                        arr.highlightIndex === i ? 'bg-yellow-300' : 'bg-white'
                      }`}
                    >
                      {val}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-1 mt-1">
                  {arr.values.map((_: any, i: number) => (
                    <div key={i} className="w-8 text-center text-xs text-gray-500">
                      {i}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Tree Visualization Placeholder */}
            {dsState.trees && (
              <div className="bg-white p-4 rounded border">
                <div className="text-sm font-medium mb-2">Binary Tree</div>
                <div className="text-center text-gray-500">
                  Tree visualization coming soon...
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-blue-600">No data structures detected. Try creating arrays, lists, or trees!</p>
      )}
    </div>
  );

  const renderMemoryView = () => (
    <div className="border-2 border-green-200 rounded-lg p-8 bg-green-50">
      <h4 className="font-semibold text-green-800 mb-4">Memory Layout</h4>
      {memoryState ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded">
            <h5 className="font-medium mb-2">Stack</h5>
            <div className="space-y-1">
              {memoryState.stack?.map((frame: any, idx: number) => (
                <div key={idx} className="text-xs bg-gray-100 p-2 rounded">
                  {frame.function} (line {frame.line})
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded">
            <h5 className="font-medium mb-2">Heap Objects</h5>
            <div className="space-y-1 text-xs">
              {memoryState.heap?.map((obj: any, idx: number) => (
                <div key={idx} className="bg-blue-100 p-2 rounded">
                  {obj.type}: {obj.value} (ref: {obj.id})
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-green-600">Run code to see memory allocation</p>
      )}
    </div>
  );

  const renderCompareMode = () => (
    <div className="border-2 border-purple-200 rounded-lg p-8 bg-purple-50">
      <h4 className="font-semibold text-purple-800 mb-4">Algorithm Comparison</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded">
          <h5 className="font-medium mb-2">Algorithm A</h5>
          <div className="text-sm text-gray-600">
            Comparisons: 23<br/>
            Swaps: 12<br/>
            Time: O(n²)
          </div>
        </div>
        <div className="bg-white p-4 rounded">
          <h5 className="font-medium mb-2">Algorithm B</h5>
          <div className="text-sm text-gray-600">
            Comparisons: 15<br/>
            Swaps: 8<br/>
            Time: O(n log n)
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('flowchart')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'flowchart' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Flowchart
          </button>
          <button
            onClick={() => setViewMode('datastructure')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'datastructure' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Data Structures
          </button>
          <button
            onClick={() => setViewMode('memory')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'memory' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Memory
          </button>
          {compareMode && (
            <button
              onClick={() => setViewMode('compare')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'compare' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Compare
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowControls(!showControls)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {showControls ? 'Hide' : 'Show'} Controls
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="text-center text-gray-500">
          <div className="mb-4">
            <h3 className="text-lg font-medium">
              {viewMode === 'flowchart' && 'Flow Diagram'}
              {viewMode === 'datastructure' && 'Data Structure Visualization'}
              {viewMode === 'memory' && 'Memory Layout'}
              {viewMode === 'compare' && 'Algorithm Comparison'}
            </h3>
            <p className="text-sm">
              {viewMode === 'flowchart' && 'Visual representation of your code structure'}
              {viewMode === 'datastructure' && 'Real-time data structure state and operations'}
              {viewMode === 'memory' && 'Stack frames and heap object allocation'}
              {viewMode === 'compare' && 'Side-by-side algorithm performance analysis'}
            </p>
          </div>
          
          {viewMode === 'flowchart' && renderFlowchart()}
          {viewMode === 'datastructure' && renderDataStructure()}
          {viewMode === 'memory' && renderMemoryView()}
          {viewMode === 'compare' && renderCompareMode()}
          
          {currentLine && (
            <div className="mt-4 p-2 bg-blue-100 rounded">
              <p className="text-blue-800">Currently executing line: {currentLine}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowchartViewer;
import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';

type VisualizationMode = 'flowchart' | 'datastructure' | 'memory' | 'compare';

interface DataStructureState {
  arrays?: Array<{ name: string; values: unknown[]; highlightIndex?: number }>;
  trees?: unknown[];
}

interface MemoryState {
  stack?: Array<{ function: string; line: number }>;
  heap?: Array<{ type: string; value: string; id: string }>;
}

interface FlowchartViewerProps {
  data: string;
  currentLine?: number | null;
  dsState?: DataStructureState;
  memoryState?: MemoryState;
  compareMode?: boolean;
}

const FlowchartViewer: React.FC<FlowchartViewerProps> = ({
  data,
  currentLine,
  dsState,
  memoryState,
}) => {
  const [viewMode, setViewMode] = useState<VisualizationMode>('flowchart');
  const mermaidRef = useRef<HTMLDivElement>(null);

  // Initialize Mermaid on component mount
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  // Re-render when data changes
  useEffect(() => {
    if (mermaidRef.current && data && viewMode === 'flowchart') {
      try {
        mermaidRef.current.innerHTML = '';
        const id = `mermaid-${Date.now()}`;
        mermaid.render(id, data).then(result => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = result.svg;
          }
        });
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        // Fallback to text display
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<pre class="text-xs p-4 bg-gray-50 rounded">${data}</pre>`;
        }
      }
    }
  }, [data, viewMode]);

  const renderFlowchart = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">🔄</span>
        <h3 className="text-lg font-semibold text-blue-800">Code Flow Diagram</h3>
      </div>
      {data ? (
        <div
          ref={mermaidRef}
          className="w-full min-h-[200px] bg-white rounded-lg p-4 shadow-inner border border-blue-100"
        />
      ) : (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl mb-2 block">📝</span>
          <p>Write some Python code to see the flowchart visualization</p>
        </div>
      )}
    </div>
  );

  const renderDataStructure = () => (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 shadow-lg">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">🏗️</span>
        <h3 className="text-lg font-semibold text-green-800">Data Structures</h3>
      </div>
      {dsState?.arrays && dsState.arrays.length > 0 ? (
        <div className="space-y-6">
          {dsState.arrays.map((array, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-inner border border-green-100"
            >
              <h5 className="font-medium text-green-700 mb-3 flex items-center">
                <span className="text-lg mr-2">📊</span>
                {array.name}
              </h5>
              <div className="flex flex-wrap gap-2">
                {array.values.map((value, idx) => (
                  <div
                    key={idx}
                    className={`
                      px-3 py-2 rounded-lg border-2 transition-all duration-300
                      ${
                        idx === array.highlightIndex
                          ? 'bg-yellow-200 border-yellow-400 shadow-lg transform scale-105'
                          : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="text-xs text-gray-600">index {idx}</div>
                    <div className="font-mono text-sm font-semibold">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl mb-2 block">🔍</span>
          <p>No data structures detected</p>
        </div>
      )}
    </div>
  );

  const renderMemoryView = () => (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 shadow-lg">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">🧠</span>
        <h3 className="text-lg font-semibold text-purple-800">Memory Layout</h3>
      </div>
      {memoryState ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-inner border border-purple-100">
            <h5 className="font-medium text-purple-700 mb-3 flex items-center">
              <span className="text-lg mr-2">📚</span>
              Call Stack
            </h5>
            <div className="space-y-2">
              {memoryState.stack?.map((frame, idx) => (
                <div key={idx} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <div className="font-mono text-sm">{frame.function}</div>
                  <div className="text-xs text-purple-600">line {frame.line}</div>
                </div>
              )) || <p className="text-gray-500 text-sm">Empty stack</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-inner border border-purple-100">
            <h5 className="font-medium text-purple-700 mb-3 flex items-center">
              <span className="text-lg mr-2">💾</span>
              Heap Objects
            </h5>
            <div className="space-y-2">
              {memoryState.heap?.map((obj, idx) => (
                <div key={idx} className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                  <div className="font-mono text-sm">{obj.value}</div>
                  <div className="text-xs text-pink-600 flex justify-between">
                    <span>{obj.type}</span>
                    <span>{obj.id}</span>
                  </div>
                </div>
              )) || <p className="text-gray-500 text-sm">No heap objects</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl mb-2 block">🔍</span>
          <p>No memory state available</p>
        </div>
      )}
    </div>
  );

  const renderCompareMode = () => (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200 shadow-lg">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">⚖️</span>
        <h3 className="text-lg font-semibold text-orange-800">Algorithm Comparison</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-inner">
          <h5 className="font-medium text-orange-700 mb-2">Bubble Sort</h5>
          <div className="text-sm text-gray-600 mb-2">Time: O(n²) | Space: O(1)</div>
          <div className="bg-orange-50 p-2 rounded text-xs">
            Simple comparison-based algorithm, good for small datasets
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-inner">
          <h5 className="font-medium text-orange-700 mb-2">Quick Sort</h5>
          <div className="text-sm text-gray-600 mb-2">Time: O(n log n) | Space: O(log n)</div>
          <div className="bg-orange-50 p-2 rounded text-xs">
            Efficient divide-and-conquer algorithm, widely used
          </div>
        </div>
      </div>
    </div>
  );

  const renderModeSelector = () => (
    <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200 mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-wrap gap-2">
          {[
            { mode: 'flowchart' as VisualizationMode, label: '🔄 Flowchart', color: 'blue' },
            {
              mode: 'datastructure' as VisualizationMode,
              label: '🏗️ Data Structures',
              color: 'green',
            },
            { mode: 'memory' as VisualizationMode, label: '🧠 Memory', color: 'purple' },
            { mode: 'compare' as VisualizationMode, label: '⚖️ Compare', color: 'orange' },
          ].map(({ mode, label, color }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${
                viewMode === mode
                  ? `bg-${color}-100 text-${color}-800 border-2 border-${color}-300 shadow-md`
                  : 'bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-100'
              }
            `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'flowchart':
        return renderFlowchart();
      case 'datastructure':
        return renderDataStructure();
      case 'memory':
        return renderMemoryView();
      case 'compare':
        return renderCompareMode();
      default:
        return renderFlowchart();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {renderModeSelector()}
      <div className="flex-1 overflow-auto">{renderCurrentView()}</div>

      {currentLine && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <div className="flex items-center">
            <span className="text-lg mr-2">⏯️</span>
            <span className="font-medium">Currently executing line: {currentLine}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowchartViewer;

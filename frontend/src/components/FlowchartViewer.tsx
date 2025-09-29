import React, { useState, useEffect, useRef, useCallback } from 'react';
import mermaid from 'mermaid';

type VisualizationMode = 'flowchart' | 'datastructure' | 'memory' | 'compare' | 'performance' | '3d';
type AnimationSpeed = 'slow' | 'medium' | 'fast' | 'instant';
type Theme = 'default' | 'dark' | 'forest' | 'neutral';

interface DataStructureState {
  arrays?: Array<{ name: string; values: unknown[]; highlightIndex?: number }>;
  trees?: unknown[];
}

interface MemoryState {
  stack?: Array<{ function: string; line: number }>;
  heap?: Array<{ type: string; value: string; id: string }>;
}

interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  complexity: string;
  operations: number;
}

interface CollaborationState {
  users: Array<{ id: string; name: string; cursor: number; color: string }>;
  isLive: boolean;
}

interface FlowchartViewerProps {
  data: string;
  currentLine?: number | null;
  dsState?: DataStructureState;
  memoryState?: MemoryState;
  compareMode?: boolean;
  performanceMetrics?: PerformanceMetrics;
  collaborationState?: CollaborationState;
  onNodeClick?: (nodeId: string) => void;
  onAnimationComplete?: () => void;
}

const FlowchartViewer: React.FC<FlowchartViewerProps> = ({
  data,
  currentLine,
  dsState,
  memoryState,
  compareMode: _compareMode,
  performanceMetrics,
  collaborationState,
  onNodeClick,
  onAnimationComplete,
}) => {
  const [viewMode, setViewMode] = useState<VisualizationMode>('flowchart');
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>('medium');
  const [theme, setTheme] = useState<Theme>('default');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const mermaidRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Mermaid with enhanced configuration
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: theme,
      securityLevel: 'loose',
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        useMaxWidth: true,
        nodeSpacing: 50,
        rankSpacing: 50,
      },
      themeVariables: {
        primaryColor: theme === 'dark' ? '#1f2937' : '#3b82f6',
        primaryTextColor: theme === 'dark' ? '#f9fafb' : '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    });
  }, [theme]);

    const getAnimationDuration = useCallback(() => {
    switch (animationSpeed) {
      case 'slow': return 1500;
      case 'medium': return 800;
      case 'fast': return 400;
      case 'instant': return 0;
      default: return 800;
    }
  }, [animationSpeed]);

  // Enhanced animation system
  const animateExecution = useCallback((line: number) => {
    if (!mermaidRef.current) return;
    
    setIsAnimating(true);
    const duration = getAnimationDuration();
    const nodes = mermaidRef.current.querySelectorAll('[id^="node"]');
    
    nodes.forEach((node) => {
      const element = node as HTMLElement;
      element.style.transition = `all ${duration}ms ease-in-out`;
      element.style.filter = 'brightness(0.7)';
    });
    
    // Highlight current node
    const currentNode = Array.from(nodes).find(node => 
      node.getAttribute('data-line') === line.toString()
    ) as HTMLElement;
    
    if (currentNode) {
      currentNode.style.filter = 'brightness(1.2)';
      currentNode.style.transform = 'scale(1.1)';
      currentNode.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.5)';
      
      // Store timeout reference for cleanup
      const timeoutId = setTimeout(() => {
        currentNode.style.transform = 'scale(1)';
        setIsAnimating(false);
        onAnimationComplete?.();
      }, duration);
      
      animationRef.current = timeoutId;
    }
  }, [onAnimationComplete, getAnimationDuration]);

  // Use highlightedNodes for visual feedback
  useEffect(() => {
    if (mermaidRef.current && highlightedNodes.size > 0) {
      const nodes = mermaidRef.current.querySelectorAll('[data-node-id]');
      nodes.forEach((node) => {
        const element = node as HTMLElement;
        const nodeId = element.getAttribute('data-node-id');
        if (nodeId && highlightedNodes.has(nodeId)) {
          element.style.outline = '2px solid #3b82f6';
        }
      });
    }
  }, [highlightedNodes]);

  // Enhanced node click handler
  const handleNodeClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const nodeId = target.getAttribute('data-node-id');
    if (nodeId && onNodeClick) {
      onNodeClick(nodeId);
      setHighlightedNodes(prev => new Set(Array.from(prev).concat(nodeId)));
    }
  }, [onNodeClick]);

  // Enhanced mermaid rendering with interactions
  useEffect(() => {
    if (mermaidRef.current && data && viewMode === 'flowchart') {
      try {
        mermaidRef.current.innerHTML = '';
        const id = `mermaid-${Date.now()}`;
        mermaid.render(id, data).then(result => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = result.svg;
            
            // Add click handlers to nodes
            const nodes = mermaidRef.current.querySelectorAll('[id^="flowchart"] .node');
            nodes.forEach((node, index) => {
              const element = node as HTMLElement;
              element.style.cursor = 'pointer';
              element.setAttribute('data-node-id', `node${index}`);
              element.addEventListener('click', handleNodeClick);
            });
            
            // Trigger animation for current line
            if (currentLine) {
              animateExecution(currentLine);
            }
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
  }, [data, viewMode, currentLine, handleNodeClick, animateExecution]);

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

  const renderPerformanceView = () => {
    // Create alias to avoid linting error
    const metrics = performanceMetrics;
    
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 shadow-lg">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">📊</span>
          <h3 className="text-lg font-semibold text-indigo-800">Performance Metrics</h3>
        </div>
        {metrics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-indigo-100 text-center">
              <div className="text-2xl font-bold text-indigo-600">{metrics.executionTime}ms</div>
              <div className="text-sm text-gray-600">Execution Time</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-indigo-100 text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.memoryUsage}MB</div>
              <div className="text-sm text-gray-600">Memory Usage</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-indigo-100 text-center">
              <div className="text-xl font-bold text-pink-600">{metrics.complexity}</div>
              <div className="text-sm text-gray-600">Complexity</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-indigo-100 text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.operations}</div>
              <div className="text-sm text-gray-600">Operations</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <span className="text-4xl mb-2 block">📈</span>
            <p>Run code to see performance metrics</p>
          </div>
        )}
      </div>
    );
  };

  const render3DView = () => (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-200 shadow-lg">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">🎮</span>
        <h3 className="text-lg font-semibold text-cyan-800">3D Code Structure</h3>
      </div>
      <div className="text-center py-12 text-gray-500">
        <span className="text-4xl mb-2 block">🚧</span>
        <p>3D visualization coming soon</p>
        <div className="mt-4 text-sm text-cyan-600">
          Interactive 3D code flow visualization with WebGL
        </div>
      </div>
    </div>
  );

  const renderModeSelector = () => {
    const collaboration = collaborationState;
    
    return (
      <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 mb-4">
        {/* Visualization Mode Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { mode: 'flowchart' as VisualizationMode, label: '🔄 Flowchart' },
            { mode: 'datastructure' as VisualizationMode, label: '�️ Data Structures' },
            { mode: 'memory' as VisualizationMode, label: '🧠 Memory' },
            { mode: 'compare' as VisualizationMode, label: '⚖️ Compare' },
            { mode: 'performance' as VisualizationMode, label: '📊 Performance' },
            { mode: '3d' as VisualizationMode, label: '🎮 3D View' },
          ].map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${
                  viewMode === mode
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-md'
                    : 'bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-100'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
        
        {/* Control Panel */}
        <div className="border-t pt-3 flex flex-wrap gap-4 items-center">
          {/* Animation Speed */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Speed:</label>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(e.target.value as AnimationSpeed)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="slow">🐢 Slow</option>
              <option value="medium">🚶 Medium</option>
              <option value="fast">🏃 Fast</option>
              <option value="instant">⚡ Instant</option>
            </select>
          </div>
          
          {/* Theme Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Theme:</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="default">🌞 Default</option>
              <option value="dark">🌙 Dark</option>
              <option value="forest">🌲 Forest</option>
              <option value="neutral">⚪ Neutral</option>
            </select>
          </div>
          
          {/* Collaboration Status */}
          {collaboration?.isLive && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">
                {collaboration.users.length} online
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };  const renderCurrentView = () => {
    switch (viewMode) {
      case 'flowchart':
        return renderFlowchart();
      case 'datastructure':
        return renderDataStructure();
      case 'memory':
        return renderMemoryView();
      case 'compare':
        return renderCompareMode();
      case 'performance':
        return renderPerformanceView();
      case '3d':
        return render3DView();
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`text-lg mr-2 ${isAnimating ? 'animate-pulse' : ''}`}>⏯️</span>
              <span className="font-medium">Currently executing line: {currentLine}</span>
            </div>
            
            {/* Collaboration Cursors */}
            {collaborationState?.users.map((user) => (
              user.cursor === currentLine && (
                <div
                  key={user.id}
                  className="flex items-center gap-1 text-sm"
                  style={{ color: user.color }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: user.color }}></div>
                  <span>{user.name}</span>
                </div>
              )
            )) || null}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowchartViewer;

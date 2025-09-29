import React, { useState, useEffect, useCallback } from 'react';
import MonacoEditor from '../components/MonacoEditor';
import FlowchartViewer from '../components/FlowchartViewer';
import DebugPanel from '../components/DebugPanel';
import VariablePanel from '../components/VariablePanel';
import AIAssistant from '../components/AIAssistant';

interface PerformanceMetrics {
  executionTime: number;        <div className="w-1/2 relative">
          {isAnalyzing && (
            <div className="absolute top-2 right-2 z-10">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                <div className="animate-spin w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full"></div>
                Analyzing...
              </div>
            </div>
          )}
  memoryUsage: number;
  complexity: string;
  operations: number;
}

interface CollaborationState {
  users: Array<{ id: string; name: string; cursor: number; color: string }>;
  isLive: boolean;
}

interface CodeInsights {
  suggestions: string[];
  complexity: string;
  patterns: string[];
}

const EnhancedCodeEditor: React.FC = () => {
  const [code, setCode] = useState(`# 🚀 Welcome to PyFlow - Real-Time Code Visualizer!
# Start typing your Python code below to see live flowcharts...

`);

  const [flowchartData, setFlowchartData] = useState('');
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [variables, setVariables] = useState<Record<string, unknown>>({});
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDelay, setAnalysisDelay] = useState<NodeJS.Timeout | null>(null);
  const [dsState, setDsState] = useState<{
    arrays: Array<{ name: string; values: unknown[]; highlightIndex?: number }>;
  } | null>(null);
  const [memoryState, setMemoryState] = useState<{
    stack: Array<{ function: string; line: number }>;
    heap: Array<{ type: string; value: string; id: string }>;
  } | null>(null);
  const [collaborationState, setCollaborationState] = useState<CollaborationState>({
    users: [],
    isLive: false
  });
  const [codeInsights, setCodeInsights] = useState<CodeInsights | null>(null);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);

  // WebSocket connection for real-time collaboration
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/api/ws/');
      
      ws.onopen = () => {
        // Connected to collaboration server
        setCollaborationState(prev => ({ ...prev, isLive: true }));
      };
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'user_list':
            setCollaborationState(prev => ({ 
              ...prev, 
              users: message.users 
            }));
            break;
          case 'cursor_update':
            // Handle other users' cursor updates
            // User cursor update received
            break;
          case 'code_update':
            // Handle real-time code changes
            if (message.code !== code) {
              setCode(message.code);
            }
            break;
          case 'execution_update':
            // Sync execution state with other users
            setCurrentLine(message.current_line);
            break;
        }
      };
      
      ws.onclose = () => {
        // Disconnected from collaboration server
        setCollaborationState(prev => ({ ...prev, isLive: false, users: [] }));
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };
      
      setWsConnection(ws);
    };

    connectWebSocket();
    
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [wsConnection, code]);

  // 🚀 Real-time code analysis with debounced updates  
  const analyzeCode = useCallback(async () => {
    if (!code.trim() || code.trim().startsWith('# 🚀 Welcome to PyFlow')) {
      setFlowchartData('');
      setDsState(null);
      setMemoryState(null);
      setPerformanceMetrics(null);
      return;
    }

    setIsAnalyzing(true);

    try {
      // 🔄 Generate real-time flowchart
      const flowchartResponse = await fetch('http://localhost:8000/api/generate-flowchart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (flowchartResponse.ok) {
        const flowchartResult = await flowchartResponse.json();
        setFlowchartData(flowchartResult.mermaid);
        
        // 📊 Real-time performance metrics
        if (flowchartResult.performance_metrics) {
          setPerformanceMetrics({
            executionTime: flowchartResult.performance_metrics.execution_time || 0,
            memoryUsage: flowchartResult.performance_metrics.memory_usage || 0,
            complexity: flowchartResult.performance_metrics.complexity || 'O(1)',
            operations: flowchartResult.performance_metrics.operations || 0
          });
        }
      }

      // 🏗️ Real-time data structure analysis
      const dsResponse = await fetch('http://localhost:8000/api/analyze-ds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (dsResponse.ok) {
        const dsResult = await dsResponse.json();
        if (dsResult.variables && Object.keys(dsResult.variables).length > 0) {
          const arrays = Object.entries(dsResult.variables)
            .filter(([_, value]) => Array.isArray(value))
            .map(([name, value]) => ({
              name,
              values: value as unknown[],
              highlightIndex: undefined
            }));
          
          setDsState({ arrays });
          setVariables(dsResult.variables);

          // 🧠 Generate memory state visualization  
          setMemoryState({
            stack: dsResult.call_stack || [{ function: 'main', line: 1 }],
            heap: Object.entries(dsResult.variables).map(([_, value], index) => ({
              type: typeof value,
              value: String(value).slice(0, 20),
              id: `0x${(index + 1).toString(16).padStart(3, '0')}`
            }))
          });
        }
      }

      // 🤖 Real-time AI insights
      const aiResponse = await fetch('http://localhost:8000/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, question: 'analyze code quality and suggest improvements' }),
      });

      if (aiResponse.ok) {
        const aiResult = await aiResponse.json();
        setCodeInsights({
          suggestions: aiResult.suggestions || [],
          complexity: aiResult.complexity || 'Medium',
          patterns: aiResult.patterns || []
        });
      }
    } catch (error) {
      // Silent error handling for better UX
    } finally {
      setIsAnalyzing(false);
    }
  }, [code]);

  // 🔄 Real-time debounced analysis trigger
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    
    // Clear previous timeout
    if (analysisDelay) {
      clearTimeout(analysisDelay);
    }
    
    // Set new timeout for debounced analysis (300ms delay)
    const timeoutId = setTimeout(() => {
      analyzeCode();
    }, 300);
    
    setAnalysisDelay(timeoutId);
    
    // Broadcast code changes to collaborators
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'code_update',
        code: newCode,
        timestamp: Date.now()
      }));
    }
  }, [analysisDelay, analyzeCode, wsConnection]);

  // Enhanced debugging functions
  const startDebugging = useCallback(() => {
    setIsDebugging(true);
    setCurrentLine(1);
    setVariables({ n: 5, result: 'calculating...' });
    
    // Broadcast execution state to collaborators
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'execution_state',
        current_line: 1,
        is_running: true
      }));
    }
  }, [wsConnection]);

  const stopDebugging = useCallback(() => {
    setIsDebugging(false);
    setCurrentLine(null);
    setVariables({});
    
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'execution_state',
        current_line: null,
        is_running: false
      }));
    }
  }, [wsConnection]);

  const stepForward = useCallback(() => {
    if (!isDebugging) return;

    const nextLine = (currentLine || 0) + 1;
    const maxLines = code.split('\\n').length;
    
    if (nextLine <= maxLines) {
      setCurrentLine(nextLine);
      
      // Simulate variable updates
      if (nextLine === 5) {
        setVariables({ n: 5, result: 120 });
      }
      
      // Broadcast cursor movement
      if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
        wsConnection.send(JSON.stringify({
          type: 'cursor_move',
          line: nextLine
        }));
      }
    } else {
      stopDebugging();
    }
  }, [currentLine, isDebugging, code, stopDebugging, wsConnection]);

  // Handle code changes with collaboration
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    
    // Broadcast code changes to collaborators
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'code_change',
        code: newCode,
        timestamp: Date.now()
      }));
    }
    
    // Debounced analysis
    const timeoutId = setTimeout(() => {
      analyzeCode();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [wsConnection, analyzeCode]);

  // Auto-analyze code on mount
  useEffect(() => {
    analyzeCode();
  }, [analyzeCode]);

  const handleNodeClick = useCallback((_nodeId: string) => {
    // Handle node click
    // You can implement node-specific actions here
  }, []);

  const handleAnimationComplete = useCallback(() => {
    // Animation completed
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Enhanced Header with collaboration status */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">PyFlow Enhanced</h1>
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              v2.0 Pro
            </span>
          </div>
          
          {/* Collaboration indicator */}
          {collaborationState.isLive && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">
                {collaborationState.users.length} collaborator(s) online
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className="w-1/2 flex flex-col border-r border-gray-300">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Code Editor</h2>
              <div className="flex items-center space-x-2">
                {/* Quick stats */}
                <span className="text-xs text-gray-500">
                  Lines: {code.split('\\n').length}
                </span>
                {performanceMetrics && (
                  <span className="text-xs text-gray-500">
                    Complexity: {performanceMetrics.complexity}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <MonacoEditor
              value={code}
              onChange={handleCodeChange}
            />
          </div>
        </div>

        {/* Right Panel - Enhanced Flowchart Viewer */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">Interactive Visualization</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <FlowchartViewer
              data={flowchartData}
              currentLine={currentLine}
              dsState={dsState || undefined}
              memoryState={memoryState || undefined}
              performanceMetrics={performanceMetrics || undefined}
              collaborationState={collaborationState}
              onNodeClick={handleNodeClick}
              onAnimationComplete={handleAnimationComplete}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Panel */}
      <div className="h-80 border-t border-gray-300 flex bg-white">
        {/* Debug Controls */}
        <div className="w-1/3 border-r border-gray-300">
          <DebugPanel
            isDebugging={isDebugging}
            onStart={startDebugging}
            onStop={stopDebugging}
            onStep={stepForward}
            currentLine={currentLine}
          />
        </div>

        {/* Variable Inspector */}
        <div className="w-1/3 border-r border-gray-300">
          <VariablePanel variables={variables} />
        </div>

        {/* Enhanced AI Assistant */}
        <div className="w-1/3">
          <AIAssistant 
            code={code}
            insights={codeInsights}
            onSuggestionApply={(_suggestion) => {
              // Apply suggestion
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedCodeEditor;
import React, { useState, useEffect, useCallback } from 'react';
import MonacoEditor from '../components/MonacoEditor';
import FlowchartViewer from '../components/FlowchartViewer';
import DebugPanel from '../components/DebugPanel';
import VariablePanel from '../components/VariablePanel';
import AIAssistant from '../components/AIAssistant';

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

interface CodeInsights {
  suggestions: string[];
  complexity: string;
  patterns: string[];
}

const EnhancedCodeEditor: React.FC = () => {
  const [code, setCode] = useState(`# Welcome to PyFlow Enhanced!
def factorial(n):
    \"\"\"Calculate factorial using recursion\"\"\"
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Test the function
result = factorial(5)
print(f"Factorial of 5 is: {result}")

# Array example for data structure visualization
numbers = [1, 2, 3, 4, 5]
for i, num in enumerate(numbers):
    print(f"Index {i}: {num}")
`);

  const [flowchartData, setFlowchartData] = useState('');
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [variables, setVariables] = useState<Record<string, unknown>>({});
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [collaborationState, setCollaborationState] = useState<CollaborationState>({
    users: [],
    isLive: false
  });
  const [codeInsights, setCodeInsights] = useState<CodeInsights | null>(null);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);

  // Enhanced data structure state with animations
  const [dsState] = useState({
    arrays: [
      { 
        name: 'numbers', 
        values: [1, 2, 3, 4, 5], 
        highlightIndex: currentLine ? (currentLine % 5) : undefined 
      },
      { 
        name: 'result', 
        values: ['calculating...'], 
        highlightIndex: undefined 
      }
    ]
  });

  // Enhanced memory state
  const [memoryState] = useState({
    stack: [
      { function: 'main', line: 1 },
      { function: 'factorial', line: currentLine || 1 }
    ],
    heap: [
      { type: 'int', value: '5', id: '0x001' },
      { type: 'list', value: '[1,2,3,4,5]', id: '0x002' },
      { type: 'str', value: 'Factorial of 5 is: 120', id: '0x003' }
    ]
  });

  // WebSocket connection for real-time collaboration
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/api/ws/');
      
      ws.onopen = () => {
        console.log('Connected to collaboration server');
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
            console.log('User cursor update:', message);
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
        console.log('Disconnected from collaboration server');
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
  }, []);

  // Enhanced code analysis
  const analyzeCode = useCallback(async () => {
    try {
      // Generate flowchart with enhanced metrics
      const flowchartResponse = await fetch('http://localhost:8000/api/generate-flowchart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (flowchartResponse.ok) {
        const flowchartResult = await flowchartResponse.json();
        setFlowchartData(flowchartResult.mermaid);
        
        // Set performance metrics if available
        if (flowchartResult.performance_metrics) {
          setPerformanceMetrics({
            executionTime: flowchartResult.performance_metrics.execution_time || 0,
            memoryUsage: Math.floor(Math.random() * 50) + 10, // Mock memory usage
            complexity: flowchartResult.performance_metrics.complexity || 'O(n)',
            operations: flowchartResult.performance_metrics.operations || 0
          });
        }
      }

      // Get AI insights
      const aiResponse = await fetch('http://localhost:8000/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, question: 'analyze code quality' }),
      });

      if (aiResponse.ok) {
        const aiResult = await aiResponse.json();
        setCodeInsights({
          suggestions: aiResult.suggestions,
          complexity: 'Medium',
          patterns: aiResult.explanations
        });
      }
    } catch (error) {
      console.error('Error analyzing code:', error);
    }
  }, [code]);

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

  const handleNodeClick = useCallback((nodeId: string) => {
    console.log('Node clicked:', nodeId);
    // You can implement node-specific actions here
  }, []);

  const handleAnimationComplete = useCallback(() => {
    console.log('Animation completed');
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
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                renderWhitespace: 'boundary',
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
              }}
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
              dsState={dsState}
              memoryState={memoryState}
              performanceMetrics={performanceMetrics}
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
            onCurrentLineChange={setCurrentLine}
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
            onSuggestionApply={(suggestion) => {
              console.log('Applying suggestion:', suggestion);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedCodeEditor;
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

interface DataStructureState {
  arrays: Array<{ 
    name: string; 
    values: unknown[]; 
    highlightIndex?: number; 
  }>;
}

interface MemoryState {
  stack: Array<{ function: string; line: number }>;
  heap: Array<{ type: string; value: string; id: string }>;
}

interface CodeInsights {
  suggestions: string[];
  complexity: string;
  patterns: string[];
}

const RealTimeCodeEditor: React.FC = () => {
  // 🚀 Real-time state management
  const [code, setCode] = useState(`# 🚀 PyFlow Real-Time Code Visualizer
# Start typing your Python code to see live flowcharts & data structures!

`);
  
  const [flowchartData, setFlowchartData] = useState('');
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [variables, setVariables] = useState<Record<string, unknown>>({});
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [dsState, setDsState] = useState<DataStructureState | null>(null);
  const [memoryState, setMemoryState] = useState<MemoryState | null>(null);
  const [codeInsights, setCodeInsights] = useState<CodeInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisTimeout, setAnalysisTimeout] = useState<NodeJS.Timeout | null>(null);

  // 🔄 Real-time code analysis with debounced updates
  const analyzeCode = useCallback(async () => {
    const trimmedCode = code.trim();
    
    // Skip analysis for empty or welcome message
    if (!trimmedCode || trimmedCode.startsWith('# 🚀 PyFlow Real-Time Code Visualizer')) {
      setFlowchartData('');
      setDsState(null);
      setMemoryState(null);
      setPerformanceMetrics(null);
      setCodeInsights(null);
      return;
    }

    setIsAnalyzing(true);

    try {
      // 📊 Generate real-time flowchart
      const flowchartResponse = await fetch('http://localhost:8000/api/generate-flowchart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmedCode }),
      });

      if (flowchartResponse.ok) {
        const result = await flowchartResponse.json();
        setFlowchartData(result.mermaid || '');
        
        // Update performance metrics
        if (result.performance_metrics) {
          setPerformanceMetrics({
            executionTime: result.performance_metrics.execution_time || 0,
            memoryUsage: result.performance_metrics.memory_usage || 0,
            complexity: result.performance_metrics.complexity || 'O(1)',
            operations: result.performance_metrics.operations || 0,
          });
        }
      }

      // 🏗️ Real-time data structure analysis
      const dsResponse = await fetch('http://localhost:8000/api/analyze-ds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmedCode }),
      });

      if (dsResponse.ok) {
        const dsResult = await dsResponse.json();
        
        if (dsResult.variables) {
          // Extract arrays and lists for visualization
          const arrays = Object.entries(dsResult.variables)
            .filter(([_, value]) => Array.isArray(value))
            .map(([name, value]) => ({
              name,
              values: value as unknown[],
              highlightIndex: undefined,
            }));

          if (arrays.length > 0) {
            setDsState({ arrays });
          }
          
          setVariables(dsResult.variables);

          // Create memory visualization
          setMemoryState({
            stack: dsResult.call_stack || [{ function: 'main', line: 1 }],
            heap: Object.entries(dsResult.variables).map(([name, value], index) => ({
              type: Array.isArray(value) ? 'list' : typeof value,
              value: String(value).slice(0, 30) + (String(value).length > 30 ? '...' : ''),
              id: `${name}:0x${(index + 1).toString(16).padStart(3, '0')}`,
            })),
          });
        }
      }

      // 🤖 Get AI insights
      const aiResponse = await fetch('http://localhost:8000/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: trimmedCode, 
          question: 'Analyze code quality and suggest improvements'
        }),
      });

      if (aiResponse.ok) {
        const aiResult = await aiResponse.json();
        setCodeInsights({
          suggestions: aiResult.suggestions || [],
          complexity: aiResult.complexity || 'Medium',
          patterns: aiResult.patterns || [],
        });
      }

    } catch (error) {
      console.warn('Analysis temporarily unavailable:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [code]);

  // 🎯 Debounced code change handler
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    
    // Clear existing timeout
    if (analysisTimeout) {
      clearTimeout(analysisTimeout);
    }
    
    // Set new timeout for debounced analysis
    const timeoutId = setTimeout(() => {
      analyzeCode();
    }, 500); // 500ms delay for better performance
    
    setAnalysisTimeout(timeoutId);
  }, [analysisTimeout, analyzeCode]);

  // 🧪 Debugging functions
  const startDebugging = useCallback(() => {
    setIsDebugging(true);
    setCurrentLine(1);
  }, []);

  const stopDebugging = useCallback(() => {
    setIsDebugging(false);
    setCurrentLine(null);
  }, []);

  const stepDebugging = useCallback(() => {
    if (currentLine !== null) {
      setCurrentLine(prev => (prev || 0) + 1);
    }
  }, [currentLine]);

  const handleNodeClick = useCallback((nodeId: string) => {
    console.log('Node clicked:', nodeId);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    console.log('Animation completed');
  }, []);

  // 🎨 Cleanup on unmount
  useEffect(() => {
    return () => {
      if (analysisTimeout) {
        clearTimeout(analysisTimeout);
      }
    };
  }, [analysisTimeout]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PyFlow Real-Time Compiler
              </h1>
              <p className="text-sm text-gray-600">Dynamic Code Flow & Structure Visualization</p>
            </div>
          </div>
          
          {isAnalyzing && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full">
              <div className="animate-spin w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full"></div>
              <span className="text-sm font-medium">Analyzing...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className="w-1/2 border-r border-gray-300 flex flex-col">
          <div className="bg-gray-800 text-white p-3 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <span className="text-green-400">●</span>
                Python Editor
              </h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-gray-700 px-2 py-1 rounded">
                  {code.split('\\n').length} lines
                </span>
                {performanceMetrics && (
                  <span className="bg-blue-600 px-2 py-1 rounded">
                    {performanceMetrics.complexity}
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

        {/* Right Panel - Visualizations */}
        <div className="w-1/2 flex flex-col">
          {/* Flowchart Viewer */}
          <div className="flex-1 border-b border-gray-300">
            <FlowchartViewer
              data={flowchartData}
              currentLine={currentLine}
              dsState={dsState || undefined}
              memoryState={memoryState || undefined}
              performanceMetrics={performanceMetrics || undefined}
              onNodeClick={handleNodeClick}
              onAnimationComplete={handleAnimationComplete}
            />
          </div>

          {/* Bottom Panel - Debug & Variables */}
          <div className="h-48 flex border-t border-gray-300">
            {/* Debug Panel */}
            <div className="w-1/2 border-r border-gray-300">
              <DebugPanel
                isDebugging={isDebugging}
                onStart={startDebugging}
                onStop={stopDebugging}
                onStep={stepDebugging}
                currentLine={currentLine}
              />
            </div>

            {/* Variable Panel */}
            <div className="w-1/2">
              <VariablePanel variables={variables} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Assistant */}
      {codeInsights && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <AIAssistant
            code={code}
            insights={codeInsights}
            onSuggestionApply={(suggestion) => {
              setCode(suggestion.code);
            }}
          />
        </div>
      )}

      {/* Status Bar */}
      <div className="bg-gray-800 text-white px-4 py-2 text-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Ready
          </span>
          {performanceMetrics && (
            <>
              <span>⚡ {performanceMetrics.executionTime}ms</span>
              <span>🧠 {performanceMetrics.memoryUsage}MB</span>
              <span>📊 {performanceMetrics.operations} ops</span>
            </>
          )}
        </div>
        <div className="text-gray-400">
          Real-time analysis enabled
        </div>
      </div>
    </div>
  );
};

export default RealTimeCodeEditor;
import React, { useState, useEffect } from 'react';
import MonacoEditor from '../components/MonacoEditor';
import FlowchartViewer from '../components/FlowchartViewer';
import DebugPanel from '../components/DebugPanel';
import VariablePanel from '../components/VariablePanel';
import AIAssistant from '../components/AIAssistant';
import TimelineControls from '../components/TimelineControls';
import DataStructureViewer from '../components/DataStructureViewer';

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState(`# Welcome to PyFlow Enhanced! 
# Write your Python code here and see it visualized with data structures in real-time

# Example: Array operations
my_array = [3, 1, 4, 1, 5, 9, 2, 6]
print("Original array:", my_array)

# Bubble sort visualization
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Sort and visualize
sorted_array = bubble_sort(my_array.copy())
print("Sorted array:", sorted_array)

# Stack operations example
stack = []
stack.append(10)
stack.append(20)
stack.append(30)
print("Stack after pushes:", stack)

top_element = stack.pop()
print(f"Popped element: {top_element}")
print("Stack after pop:", stack)
`);

  const [flowchartData, setFlowchartData] = useState<string>('');
  const [dsState, setDsState] = useState<any>(null);
  const [memoryState, setMemoryState] = useState<any>(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [variables, setVariables] = useState<Record<string, any>>({});
  
  // Timeline controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [executionTimeline, setExecutionTimeline] = useState<any[]>([]);
  
  // View mode state
  const [compareMode, setCompareMode] = useState(false);

  // Generate flowchart when code changes
  useEffect(() => {
    // This will call the backend API to parse code and generate flowchart
    generateFlowchart(code);
  }, [code]);

  const generateFlowchart = async (pythonCode: string) => {
    try {
      // API call to backend for AST parsing and flowchart generation
      const response = await fetch('/api/generate-flowchart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: pythonCode }),
      });
      
      const data = await response.json();
      setFlowchartData(data.mermaid);
    } catch (error) {
      console.error('Error generating flowchart:', error);
    }
  };

  const startDebugging = () => {
    setIsDebugging(true);
    setCurrentLine(1);
    // Initialize debugging session
  };

  const stopDebugging = () => {
    setIsDebugging(false);
    setCurrentLine(null);
    setVariables({});
  };

  const stepForward = () => {
    // Step through code execution
    if (currentLine !== null) {
      setCurrentLine(currentLine + 1);
      // Update variables based on execution
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left Panel - Code Editor */}
        <div className="w-1/2 border-r border-gray-300">
          <div className="h-full flex flex-col">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h2 className="text-lg font-semibold">Python Code Editor</h2>
            </div>
            <div className="flex-1">
              <MonacoEditor
                value={code}
                onChange={setCode}
                currentLine={currentLine}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Flowchart */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-100 px-4 py-2 border-b">
            <h2 className="text-lg font-semibold">Flow Diagram</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <FlowchartViewer
              data={flowchartData}
              currentLine={currentLine}
            />
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="h-64 border-t border-gray-300 flex">
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

        {/* Variables Panel */}
        <div className="w-1/3 border-r border-gray-300">
          <VariablePanel variables={variables} />
        </div>

        {/* AI Assistant */}
        <div className="w-1/3">
          <AIAssistant code={code} />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
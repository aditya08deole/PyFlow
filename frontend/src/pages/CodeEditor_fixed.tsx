import React, { useState, useEffect } from 'react';
import MonacoEditor from '../components/MonacoEditor';
import FlowchartViewer from '../components/FlowchartViewer';
import DebugPanel from '../components/DebugPanel';
import VariablePanel from '../components/VariablePanel';
import AIAssistant from '../components/AIAssistant';

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState(`# 🐍 Welcome to PyFlow Enhanced! 
# Write your Python code here and see it visualized in real-time

# Example: Array operations and algorithms
def bubble_sort(arr):
    """Bubble sort with step-by-step visualization"""
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Initialize array
my_array = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", my_array)

# Check if array is sorted
if len(my_array) > 1:
    sorted_array = bubble_sort(my_array.copy())
    print("Sorted array:", sorted_array)
else:
    print("Array is too small to sort")

# Stack operations example
stack = []
for item in [10, 20, 30, 40]:
    stack.append(item)
    print(f"Pushed {item}, Stack: {stack}")

# Pop elements
while stack:
    popped = stack.pop()
    print(f"Popped {popped}, Stack: {stack}")

print("Stack operations complete!")`);

  const [flowchartData, setFlowchartData] = useState<string>('');
  const [isDebugging, setIsDebugging] = useState(false);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [variables, setVariables] = useState<Record<string, unknown>>({});

  // Sample data for visualization demo
  const sampleDsState = {
    arrays: [
      {
        name: 'my_array',
        values: [64, 34, 25, 12, 22, 11, 90],
        highlightIndex: 1,
      },
      {
        name: 'stack',
        values: [10, 20, 30],
        highlightIndex: 2,
      },
    ],
  };

  const sampleMemoryState = {
    stack: [
      { function: 'bubble_sort', line: 8 },
      { function: 'main', line: 15 },
    ],
    heap: [
      { type: 'list', value: '[64, 34, 25, 12, 22, 11, 90]', id: '0x7f8b8c' },
      { type: 'int', value: '64', id: '0x7f8b90' },
      { type: 'str', value: '"Original array:"', id: '0x7f8b94' },
    ],
  };

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

      if (response.ok) {
        const data = await response.json();
        setFlowchartData(data.mermaid);
      } else {
        console.error('Failed to generate flowchart:', response.statusText);
      }
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
              <MonacoEditor value={code} onChange={setCode} />
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
              dsState={sampleDsState}
              memoryState={sampleMemoryState}
              compareMode={true}
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

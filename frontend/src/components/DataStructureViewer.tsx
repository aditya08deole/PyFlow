import React from 'react';

interface ArrayData {
  name: string;
  values: unknown[];
  highlightIndex?: number;
  compareIndices?: number[];
  operation?: string;
}

interface LinkedListNode {
  value: string | number;
  next?: LinkedListNode;
  id?: string | number;
}

interface LinkedList {
  name: string;
  nodes: LinkedListNode[];
  highlightIndex?: number;
  operation?: string;
}

interface Stack {
  name: string;
  items: (string | number)[];
  highlightTop?: boolean;
  operation?: string;
}

interface TreeRoot {
  value: string | number;
}

interface Tree {
  name: string;
  root?: TreeRoot;
  nodeCount?: number;
  operation?: string;
}

interface Metrics {
  comparisons?: number;
  swaps?: number;
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface DataStructureViewerProps {
  dsState: {
    arrays?: ArrayData[];
    stacks?: Stack[];
    trees?: Tree[];
    linkedLists?: LinkedList[];
    metrics?: Metrics;
  };
}

const DataStructureViewer: React.FC<DataStructureViewerProps> = ({
  dsState
}) => {
  const renderArray = (arr: ArrayData) => (
    <div className="bg-white p-4 rounded border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-800">{arr.name || 'Array'}</h4>
        <span className="text-xs text-gray-500">Length: {arr.values.length}</span>
      </div>
      
      <div className="flex space-x-1 mb-2">
        {arr.values.map((val: unknown, i: number) => (
          <div 
            key={i}
            className={`w-12 h-12 border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              arr.highlightIndex === i 
                ? 'border-yellow-400 bg-yellow-100 transform scale-110' 
                : arr.compareIndices?.includes(i)
                ? 'border-red-400 bg-red-100'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
            title={`Index ${i}: ${val}`}
          >
            {String(val)}
          </div>
        ))}
      </div>
      
      {/* Index labels */}
      <div className="flex space-x-1">
        {arr.values.map((_: unknown, i: number) => (
          <div key={i} className="w-12 text-center text-xs text-gray-500">
            {i}
          </div>
        ))}
      </div>
      
      {/* Operation info */}
      {arr.operation && (
        <div className="mt-3 text-sm text-blue-600 bg-blue-50 p-2 rounded">
          {arr.operation}
        </div>
      )}
    </div>
  );

  const renderLinkedList = (list: LinkedList) => (
    <div className="bg-white p-4 rounded border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-800">{list.name || 'Linked List'}</h4>
        <span className="text-xs text-gray-500">Nodes: {list.nodes.length}</span>
      </div>
      
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {list.nodes.map((node: LinkedListNode, i: number) => (
          <React.Fragment key={i}>
            <div 
              className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                list.highlightIndex === i 
                  ? 'border-yellow-400 bg-yellow-100 transform scale-110' 
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="text-sm font-medium">{node.value}</div>
              <div className="text-xs text-gray-500">#{node.id || i}</div>
            </div>
            {i < list.nodes.length - 1 && (
              <div className="flex-shrink-0 text-gray-400">→</div>
            )}
          </React.Fragment>
        ))}
        {list.nodes.length === 0 && (
          <div className="text-gray-500 text-sm">Empty list</div>
        )}
      </div>
      
      {list.operation && (
        <div className="mt-3 text-sm text-blue-600 bg-blue-50 p-2 rounded">
          {list.operation}
        </div>
      )}
    </div>
  );

  const renderStack = (stack: Stack) => (
    <div className="bg-white p-4 rounded border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-800">{stack.name || 'Stack'}</h4>
        <span className="text-xs text-gray-500">Size: {stack.items.length}</span>
      </div>
      
      <div className="flex flex-col-reverse space-y-reverse space-y-1 min-h-32">
        {stack.items.map((item: unknown, i: number) => (
          <div 
            key={i}
            className={`w-full h-10 border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              i === stack.items.length - 1 && stack.highlightTop
                ? 'border-yellow-400 bg-yellow-100' 
                : 'border-gray-300 bg-white hover:bg-gray-50'
            }`}
          >
            {String(item)}
          </div>
        ))}
        {stack.items.length === 0 && (
          <div className="w-full h-10 border-2 border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">
            Empty stack
          </div>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        ↑ Top of stack
      </div>
      
      {stack.operation && (
        <div className="mt-3 text-sm text-blue-600 bg-blue-50 p-2 rounded">
          {stack.operation}
        </div>
      )}
    </div>
  );

  const renderBinaryTree = (tree: Tree) => (
    <div className="bg-white p-4 rounded border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-800">{tree.name || 'Binary Tree'}</h4>
        <span className="text-xs text-gray-500">Nodes: {tree.nodeCount || 0}</span>
      </div>
      
      <div className="min-h-32 flex items-center justify-center">
        {tree.root ? (
          <div className="text-center">
            {/* Simplified tree visualization - in real implementation, use proper tree layout */}
            <div className="text-sm text-gray-600">
              Tree structure visualization
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Root: {tree.root.value}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Empty tree</div>
        )}
      </div>
      
      {tree.operation && (
        <div className="mt-3 text-sm text-blue-600 bg-blue-50 p-2 rounded">
          {tree.operation}
        </div>
      )}
    </div>
  );

  if (!dsState) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="mb-4">
          <div className="text-4xl mb-2">🏗️</div>
          <h3 className="text-lg font-medium">No Data Structures Detected</h3>
        </div>
        <p className="text-sm">
          Create arrays, lists, stacks, or other data structures in your code to see them visualized here!
        </p>
        <div className="mt-4 text-xs text-gray-400">
          Try: <code className="bg-gray-100 px-2 py-1 rounded">my_list = [1, 2, 3]</code>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Arrays */}
      {dsState.arrays?.map((arr: ArrayData, idx: number) => (
        <div key={`array-${idx}`}>
          {renderArray(arr)}
        </div>
      ))}
      
      {/* Linked Lists */}
      {dsState.linkedLists?.map((list: LinkedList, idx: number) => (
        <div key={`list-${idx}`}>
          {renderLinkedList(list)}
        </div>
      ))}
      
      {/* Stacks */}
      {dsState.stacks?.map((stack: Stack, idx: number) => (
        <div key={`stack-${idx}`}>
          {renderStack(stack)}
        </div>
      ))}
      
      {/* Binary Trees */}
      {dsState.trees?.map((tree: Tree, idx: number) => (
        <div key={`tree-${idx}`}>
          {renderBinaryTree(tree)}
        </div>
      ))}
      
      {/* Algorithm Metrics */}
      {dsState.metrics && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded border">
          <h4 className="font-medium text-gray-800 mb-3">Algorithm Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {dsState.metrics.comparisons && (
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {dsState.metrics.comparisons}
                </div>
                <div className="text-gray-600">Comparisons</div>
              </div>
            )}
            {dsState.metrics.swaps && (
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {dsState.metrics.swaps}
                </div>
                <div className="text-gray-600">Swaps</div>
              </div>
            )}
            {dsState.metrics.timeComplexity && (
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">
                  {dsState.metrics.timeComplexity}
                </div>
                <div className="text-gray-600">Time Complexity</div>
              </div>
            )}
            {dsState.metrics.spaceComplexity && (
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {dsState.metrics.spaceComplexity}
                </div>
                <div className="text-gray-600">Space Complexity</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataStructureViewer;
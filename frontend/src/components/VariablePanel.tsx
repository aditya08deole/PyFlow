import React from 'react';

interface VariablePanelProps {
  variables: Record<string, any>;
}

const VariablePanel: React.FC<VariablePanelProps> = ({ variables }) => {
  return (
    <div className="h-full p-4 bg-gray-50">
      <h3 className="text-lg font-medium mb-4">Variables</h3>
      
      <div className="space-y-2">
        {Object.keys(variables).length === 0 ? (
          <p className="text-gray-500 text-sm">No variables to display</p>
        ) : (
          Object.entries(variables).map(([name, value]) => (
            <div key={name} className="bg-white p-2 rounded border">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-blue-600">{name}</span>
                <span className="text-xs text-gray-500">{typeof value}</span>
              </div>
              <div className="mt-1 font-mono text-xs text-gray-800">
                {JSON.stringify(value)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VariablePanel;
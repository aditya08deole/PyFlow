import React from 'react';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  currentLine?: number | null;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ 
  value, 
  onChange, 
  currentLine 
}) => {
  return (
    <div className="w-full h-full">
      <textarea
        className="w-full h-full p-4 font-mono text-sm border-none outline-none resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your Python code here..."
        style={{
          backgroundColor: '#1e1e1e',
          color: '#d4d4d4',
          fontFamily: 'Monaco, "Courier New", monospace'
        }}
      />
    </div>
  );
};

export default MonacoEditor;
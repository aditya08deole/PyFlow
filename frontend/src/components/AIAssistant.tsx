import React, { useState } from 'react';

interface AIAssistantProps {
  code: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ code }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAISuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">AI Assistant</h3>
        <button
          onClick={getAISuggestions}
          disabled={isLoading || !code.trim()}
          className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Loading...' : 'Get Help'}
        </button>
      </div>

      <div className="space-y-3">
        {suggestions.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Click "Get Help" for AI-powered suggestions about your code
          </p>
        ) : (
          suggestions.map((suggestion, index) => (
            <div key={index} className="bg-white p-3 rounded border">
              <p className="text-sm text-gray-800">{suggestion}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AIAssistant;

import React, { useState, useEffect, useCallback } from 'react';

interface CodeInsights {
  suggestions: string[];
  complexity: string;
  patterns: string[];
}

interface AIAssistantProps {
  code: string;
  insights?: CodeInsights | null;
  onSuggestionApply?: (suggestion: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  code, 
  insights,
  onSuggestionApply
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'analysis' | 'chat'>('suggestions');
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const [chatInput, setChatInput] = useState('');

  const getAISuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8002/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      setSuggestions(['Unable to connect to AI service. Please check your connection.']);
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  const handleChatSubmit = useCallback(async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }]);
    setChatInput('');
    
    try {
      const response = await fetch('http://localhost:8002/api/explain-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, question: userMessage }),
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        message: data.explanation || 'I can help you understand your code better!' 
      }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        message: 'Sorry, I encountered an issue. Please try again.' 
      }]);
    }
  }, [chatInput, code]);

  // Auto-fetch suggestions when insights are available
  useEffect(() => {
    if (insights?.suggestions) {
      setSuggestions(insights.suggestions);
    }
  }, [insights]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Enhanced Header with Tabs */}
      <div className="bg-white border-b border-gray-200 p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-purple-800 flex items-center">
            <span className="text-xl mr-2">🤖</span>
            AI Assistant
          </h3>
          <button
            onClick={getAISuggestions}
            disabled={isLoading || !code.trim()}
            className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
              isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              '🔍 Analyze'
            )}
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1">
          {[
            { id: 'suggestions' as const, label: '💡 Suggestions', count: suggestions.length },
            { id: 'analysis' as const, label: '📊 Analysis', count: insights?.patterns.length || 0 },
            { id: 'chat' as const, label: '💬 Chat', count: chatMessages.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 bg-purple-500 text-white text-xs rounded-full px-1">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'suggestions' && (
          <div className="space-y-3">
            {suggestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">🎯</span>
                <p className="text-sm">Click "Analyze" for AI-powered suggestions</p>
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-800 flex-1">{suggestion}</p>
                    {onSuggestionApply && (
                      <button
                        onClick={() => onSuggestionApply(suggestion)}
                        className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded hover:bg-purple-200 transition-colors duration-200"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-4">
            {insights ? (
              <>
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <h4 className="font-medium text-indigo-800 mb-2 flex items-center">
                    <span className="mr-2">⚡</span>
                    Code Complexity
                  </h4>
                  <div className="text-sm text-gray-700">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {insights.complexity}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <h4 className="font-medium text-indigo-800 mb-2 flex items-center">
                    <span className="mr-2">🔍</span>
                    Code Patterns
                  </h4>
                  <div className="space-y-2">
                    {insights.patterns.map((pattern, index) => (
                      <div key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {pattern}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">📊</span>
                <p className="text-sm">Run analysis to see code insights</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 space-y-3 mb-4 max-h-48 overflow-y-auto">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">💬</span>
                  <p className="text-sm">Ask me anything about your code!</p>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Chat Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Ask about your code..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim()}
                className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:bg-gray-300 transition-colors duration-200"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;

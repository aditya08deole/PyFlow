import React, { useState, useCallback } from 'react';

interface TimelineControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  playbackSpeed: number;
  onPlay: () => void;
  onPause: () => void;
  onStop?: () => void;
  onStep: (direction: 'forward' | 'backward') => void;
  onSeek: (step: number) => void;
  onSpeedChange: (speed: number) => void;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  isPlaying,
  currentStep,
  totalSteps,
  playbackSpeed,
  onPlay,
  onPause,
  onStop,
  onStep,
  onSeek,
  onSpeedChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const step = parseInt(event.target.value, 10);
    onSeek(step);
  }, [onSeek]);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const formatTime = useCallback((step: number) => {
    const minutes = Math.floor(step / 60);
    const seconds = step % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {/* Enhanced Playback Controls */}
          {onStop && (
            <button
              onClick={onStop}
              className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
              title="Stop"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          <button
            onClick={() => onStep('backward')}
            disabled={currentStep <= 0}
            className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-300 transition-colors duration-200"
            title="Step Backward"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className={`p-2 rounded-lg text-white hover:opacity-90 transition-all duration-200 ${
              isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={() => onStep('forward')}
            disabled={currentStep >= totalSteps - 1}
            className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-300 transition-colors duration-200"
            title="Step Forward"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Enhanced Speed Control */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Speed:</label>
            <select
              value={playbackSpeed}
              onChange={e => onSpeedChange(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
            >
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>
          </div>

          {/* Enhanced Step Counter with Time */}
          <div className="text-sm text-gray-600 font-mono">
            {formatTime(currentStep)} / {formatTime(totalSteps)}
          </div>
        </div>
      </div>

      {/* Enhanced Timeline Slider */}
      <div className="w-full">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-xs text-gray-500 font-mono min-w-[3rem]">
            {formatTime(currentStep)}
          </span>
          
          <div className="flex-1 relative">
            <input
              type="range"
              min={0}
              max={totalSteps - 1}
              value={currentStep}
              onChange={handleSliderChange}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className={`
                w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer
                ${isDragging ? 'scale-105' : ''}
                transition-transform duration-200
              `}
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((currentStep) / (totalSteps - 1)) * 100}%, #e5e7eb ${((currentStep) / (totalSteps - 1)) * 100}%, #e5e7eb 100%)`
              }}
            />
            
            {/* Progress markers */}
            {totalSteps <= 20 && (
              <div className="absolute top-0 left-0 w-full h-3 pointer-events-none">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-px h-3 bg-gray-400"
                    style={{ left: `${(i / (totalSteps - 1)) * 100}%` }}
                  />
                ))}
              </div>
            )}
          </div>
          
          <span className="text-xs text-gray-500 font-mono min-w-[3rem]">
            {formatTime(totalSteps)}
          </span>
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>🎯 Start</span>
          <span className="flex items-center space-x-4">
            <span>⏱️ Interactive Timeline</span>
            <span>🔍 Step Analysis</span>
          </span>
          <span>🏁 End</span>
        </div>
      </div>

      {/* Status indicator */}
      {isPlaying && (
        <div className="mt-2 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-xs text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Playing at {playbackSpeed}x speed</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineControls;

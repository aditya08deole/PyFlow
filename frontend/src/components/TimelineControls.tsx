import React from 'react';

interface TimelineControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  playbackSpeed: number;
  onPlay: () => void;
  onPause: () => void;
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
  onStep,
  onSeek,
  onSpeedChange,
}) => {
  return (
    <div className="bg-gray-100 p-4 border-t">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {/* Playback Controls */}
          <button
            onClick={() => onStep('backward')}
            disabled={currentStep <= 0}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
            title="Step Backward"
          >
            ⏮
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>

          <button
            onClick={() => onStep('forward')}
            disabled={currentStep >= totalSteps - 1}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
            title="Step Forward"
          >
            ⏭
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Speed Control */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Speed:</label>
            <select
              value={playbackSpeed}
              onChange={e => onSpeedChange(Number(e.target.value))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          {/* Step Counter */}
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="w-full">
        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStep}
          onChange={e => onSeek(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Start</span>
          <span>End</span>
        </div>
      </div>
    </div>
  );
};

export default TimelineControls;

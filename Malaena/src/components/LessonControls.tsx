import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  Maximize, 
  Minimize,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface LessonControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isRotating: boolean;
  isFullscreen: boolean;
  zoom: number;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onRotateToggle: () => void;
  onFullscreenToggle: () => void;
  onZoomChange: (zoom: number) => void;
}

export function LessonControls({
  isPlaying,
  isMuted,
  isRotating,
  isFullscreen,
  zoom,
  onPlayPause,
  onMuteToggle,
  onRotateToggle,
  onFullscreenToggle,
  onZoomChange
}: LessonControlsProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 rounded-lg p-4">
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onPlayPause}
            className="bg-[#415A77] hover:bg-[#778DA9] rounded-full p-3 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-[#E0E1DD]" />
            ) : (
              <Play className="w-5 h-5 text-[#E0E1DD]" />
            )}
          </button>

          <button
            onClick={onMuteToggle}
            className="bg-[#415A77] hover:bg-[#778DA9] rounded-full p-3 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-[#E0E1DD]" />
            ) : (
              <Volume2 className="w-5 h-5 text-[#E0E1DD]" />
            )}
          </button>

          <button
            onClick={onRotateToggle}
            className={`rounded-full p-3 transition-colors ${
              isRotating 
                ? 'bg-[#778DA9] text-[#E0E1DD]' 
                : 'bg-[#415A77] hover:bg-[#778DA9] text-[#E0E1DD]'
            }`}
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        {/* Center - Zoom Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            className="bg-[#415A77] hover:bg-[#778DA9] rounded-full p-2 transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-[#E0E1DD]" />
          </button>
          
          <span className="text-[#E0E1DD] text-sm font-medium min-w-[60px] text-center">
            {zoom}%
          </span>
          
          <button
            onClick={() => onZoomChange(Math.min(200, zoom + 10))}
            className="bg-[#415A77] hover:bg-[#778DA9] rounded-full p-2 transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-[#E0E1DD]" />
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onFullscreenToggle}
            className="bg-[#415A77] hover:bg-[#778DA9] rounded-full p-3 transition-colors"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5 text-[#E0E1DD]" />
            ) : (
              <Maximize className="w-5 h-5 text-[#E0E1DD]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
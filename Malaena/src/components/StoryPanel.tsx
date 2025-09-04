import { ChevronLeft, ChevronRight, List, X } from 'lucide-react';
interface Scene {
  id: number;
  title: string;
  content: string;
  sceneType: 'pyramid' | 'atom' | 'dna' | 'solar-system';
}
interface StoryPanelProps {
  scenes: Scene[];
  currentScene: number;
  onSceneChange: (sceneIndex: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function StoryPanel({ scenes, currentScene, onSceneChange, isOpen, onToggle }: StoryPanelProps) {
  const handlePrevious = () => {
    if (currentScene > 0) {
      onSceneChange(currentScene - 1);
    }
  };

  const handleNext = () => {
    if (currentScene < scenes.length - 1) {
      onSceneChange(currentScene + 1);
    }
  };

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50 bg-[#415A77] hover:bg-[#778DA9] rounded-full p-3 transition-all duration-300 shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5 text-[#E0E1DD]" /> : <List className="w-5 h-5 text-[#E0E1DD]" />}
      </button>

      <div className={`
        fixed top-0 right-0 h-full w-80 bg-[#1B263B] border-l border-[#415A77] z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#415A77]">
            <h3 className="text-lg font-semibold text-[#E0E1DD] mb-2">Lesson Scenes</h3>
            <p className="text-sm text-[#778DA9]">Scene {currentScene + 1} of {scenes.length}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  onClick={() => onSceneChange(index)}
                  className={`
                    w-full text-left p-4 rounded-lg transition-all duration-200
                    ${index === currentScene 
                      ? 'bg-[#415A77] border-l-4 border-[#778DA9]' 
                      : 'bg-[#0D1B2A] hover:bg-[#415A77]'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#E0E1DD]">
                      Scene {index + 1}
                    </span>
                    {index === currentScene && (
                      <div className="w-2 h-2 bg-[#778DA9] rounded-full animate-pulse" />
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-[#E0E1DD] mb-1">
                    {scene.title}
                  </h4>
                  <p className="text-xs text-[#778DA9] line-clamp-2">
                    {scene.content.substring(0, 80)}...
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-[#415A77]">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentScene === 0}
                className={`
                  flex items-center px-4 py-2 rounded-lg transition-colors
                  ${currentScene === 0 
                    ? 'bg-[#415A77] opacity-50 cursor-not-allowed' 
                    : 'bg-[#415A77] hover:bg-[#778DA9]'
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4 mr-2 text-[#E0E1DD]" />
                <span className="text-sm text-[#E0E1DD]">Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentScene === scenes.length - 1}
                className={`
                  flex items-center px-4 py-2 rounded-lg transition-colors
                  ${currentScene === scenes.length - 1 
                    ? 'bg-[#415A77] opacity-50 cursor-not-allowed' 
                    : 'bg-[#415A77] hover:bg-[#778DA9]'
                  }
                `}
              >
                <span className="text-sm text-[#E0E1DD]">Next</span>
                <ChevronRight className="w-4 h-4 ml-2 text-[#E0E1DD]" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
}
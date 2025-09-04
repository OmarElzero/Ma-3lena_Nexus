import{ useState, useEffect, useRef } from 'react';
import { Scene3D } from './Scene3D';
import { StoryPanel } from '../StoryPanel';
import { LessonControls } from '../LessonControls';
import { ArrowLeft } from 'lucide-react';

interface Scene {
  id: number;
  title: string;
  content: string;
  sceneType: 'pyramid' | 'atom' | 'dna' | 'solar-system';
}

interface LessonViewerProps {
  lessonTitle: string;
  scenes: Scene[];
  onBack: () => void;
}

export function LessonViewer({ lessonTitle, scenes, onBack }: LessonViewerProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isStoryPanelOpen, setIsStoryPanelOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [highlightedText, setHighlightedText] = useState('');
  
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('hazel') ||
        voice.gender === 'female'
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = isMuted ? 0 : 1;
      
      // Highlight text as it's being spoken
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const words = text.split(' ');
          const currentWordIndex = Math.floor(event.charIndex / (text.length / words.length));
          setHighlightedText(words.slice(0, currentWordIndex + 1).join(' '));
        }
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        setHighlightedText('');
        // Auto advance to next scene
        if (currentScene < scenes.length - 1) {
          setTimeout(() => {
            setCurrentScene(prev => prev + 1);
          }, 1000);
        }
      };
      
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setHighlightedText('');
    } else {
      setIsPlaying(true);
      speakText(scenes[currentScene].content);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (speechRef.current) {
      speechRef.current.volume = !isMuted ? 0 : 1;
    }
  };

  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleSceneChange = (sceneIndex: number) => {
    setCurrentScene(sceneIndex);
    setIsPlaying(false);
    setHighlightedText('');
    window.speechSynthesis.cancel();
  };
  const renderHighlightedText = (text: string, highlighted: string) => {
    if (!highlighted) return text;
    
    const parts = text.split(new RegExp(`(${highlighted})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlighted.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 bg-opacity-30 rounded px-1">
          {part}
        </span>
      ) : part
    );
  };
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);
  useEffect(() => {
    if (speechRef.current) {
      speechRef.current.volume = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  const currentSceneData = scenes[currentScene];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0D1B2A] relative">
      <div className="bg-[#1B263B] border-b border-[#415A77] p-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-lg hover:bg-[#415A77] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#E0E1DD]" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-[#E0E1DD]">{lessonTitle}</h1>
            <p className="text-sm text-[#778DA9]">
              Scene {currentScene + 1} of {scenes.length}: {currentSceneData.title}
            </p>
          </div>
        </div>
      </div>
      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 p-6 relative">
          <div className="h-full relative">
            <Scene3D
              sceneType={currentSceneData.sceneType}
              isRotating={isRotating}
              zoom={zoom}
            />
            
            <LessonControls
              isPlaying={isPlaying}
              isMuted={isMuted}
              isRotating={isRotating}
              isFullscreen={isFullscreen}
              zoom={zoom}
              onPlayPause={handlePlayPause}
              onMuteToggle={handleMuteToggle}
              onRotateToggle={() => setIsRotating(!isRotating)}
              onFullscreenToggle={handleFullscreenToggle}
              onZoomChange={setZoom}
            />
          </div>
        </div>
        <div className="w-96 p-6 bg-[#1B263B] border-l border-r border-[#415A77] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#E0E1DD] mb-4">
                {currentSceneData.title}
              </h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-[#E0E1DD] leading-relaxed text-lg">
                  {renderHighlightedText(currentSceneData.content, highlightedText)}
                </p>
              </div>
            </div>
            <div className="bg-[#0D1B2A] rounded-lg p-4">
              <div className="flex justify-between text-sm text-[#778DA9] mb-2">
                <span>Scene Progress</span>
                <span>{currentScene + 1} / {scenes.length}</span>
              </div>
              <div className="w-full bg-[#415A77] rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => currentScene > 0 && handleSceneChange(currentScene - 1)}
                disabled={currentScene === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentScene === 0
                    ? 'bg-[#415A77] opacity-50 cursor-not-allowed'
                    : 'bg-[#415A77] hover:bg-[#778DA9]'
                }`}
              >
                <span className="text-[#E0E1DD] text-sm">Previous Scene</span>
              </button>
              
              <button
                onClick={() => currentScene < scenes.length - 1 && handleSceneChange(currentScene + 1)}
                disabled={currentScene === scenes.length - 1}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentScene === scenes.length - 1
                    ? 'bg-[#415A77] opacity-50 cursor-not-allowed'
                    : 'bg-[#415A77] hover:bg-[#778DA9]'
                }`}
              >
                <span className="text-[#E0E1DD] text-sm">Next Scene</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <StoryPanel
        scenes={scenes}
        currentScene={currentScene}
        onSceneChange={handleSceneChange}
        isOpen={isStoryPanelOpen}
        onToggle={() => setIsStoryPanelOpen(!isStoryPanelOpen)}
      />
    </div>
  );
}
import { useRef, useEffect, useState } from 'react';
import { Music } from 'lucide-react';

interface AudioManagerProps {
  sceneType: 'pyramid' | 'atom' | 'dna' | 'solar-system';
  isPlaying: boolean;
  isMuted: boolean;
  onMuteToggle: () => void;
}
export function AudioManager({ sceneType,  isMuted }: AudioManagerProps) {
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);
  const [isBackgroundMusicEnabled, setIsBackgroundMusicEnabled] = useState(false);

  const getBackgroundMusic = () => {
    switch (sceneType) {
      case 'pyramid':
        return '/audio/egypt.mp3';
      case 'atom':
      case 'dna':
        return '/audio/egypt.mp3';
      case 'solar-system':
        return '/audio/egypt.mp3';
      default:
        return '/audio/egypt.mp3';
    }
  };

  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.src = getBackgroundMusic();
      backgroundAudioRef.current.volume = 0.3;
      backgroundAudioRef.current.loop = true;

      if (isBackgroundMusicEnabled && !isMuted) {
        backgroundAudioRef.current.play().catch(console.error);
      } else {
        backgroundAudioRef.current.pause();
      }
    }
  }, [sceneType, isBackgroundMusicEnabled, isMuted]);

  const toggleBackgroundMusic = () => {
    setIsBackgroundMusicEnabled(!isBackgroundMusicEnabled);
  };

  return (
    <div className="absolute top-4 right-4 flex space-x-2">
      <button
        onClick={toggleBackgroundMusic}
        className={`p-3 rounded-full transition-all duration-300 ${
          isBackgroundMusicEnabled 
            ? 'bg-[#778DA9] text-[#E0E1DD]' 
            : 'bg-[#415A77] hover:bg-[#778DA9] text-[#E0E1DD]'
        }`}
      >
        <Music className="w-5 h-5" />
      </button>

      <audio ref={backgroundAudioRef} />
    </div>
  );
}
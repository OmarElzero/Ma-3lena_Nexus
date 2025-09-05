import { useState, useEffect, useRef } from "react";
import { Scene3D } from "./Scene3D";
import { StoryPanel } from "../StoryPanel";
import { LessonControls } from "../LessonControls";
import { ArrowLeft, List, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Scene {
  id: number;
  title: string;
  content: string;
  sceneType: "pyramid" | "atom" | "dna" | "solar-system";
}

interface LessonViewerProps {
  lessonTitle: string;
  scenes: Scene[];
  onBack: () => void;
}

export function LessonViewer({
  lessonTitle,
  scenes,
  onBack,
}: LessonViewerProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isStoryPanelOpen, setIsStoryPanelOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [highlightedText, setHighlightedText] = useState("");

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("zira") ||
          voice.name.toLowerCase().includes("hazel") ||
          voice.gender === "female"
      );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = isMuted ? 0 : 1;

      utterance.onboundary = (event) => {
        if (event.name === "word") {
          const words = text.split(" ");
          const currentWordIndex = Math.floor(
            event.charIndex / (text.length / words.length)
          );
          setHighlightedText(words.slice(0, currentWordIndex + 1).join(" "));
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setHighlightedText("");
        if (currentScene < scenes.length - 1) {
          setTimeout(() => {
            setCurrentScene((prev) => prev + 1);
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
      setHighlightedText("");
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
    setHighlightedText("");
    window.speechSynthesis.cancel();
  };

  const renderHighlightedText = (text: string, highlighted: string) => {
    if (!highlighted) return text;
    const parts = text.split(new RegExp(`(${highlighted})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlighted.toLowerCase() ? (
        <span key={index} className="bg-yellow-700 bg-opacity-30 rounded px-1">
          {part}
        </span>
      ) : (
        part
      )
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
    <div
      ref={containerRef}
      className={`min-h-screen  bg-[#0D1B2A] relative ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {!isFullscreen && (
        <div className="bg-[#1B263B] border-b border-[#415A77] p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-lg hover:bg-[#415A77] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#E0E1DD]" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-[#E0E1DD]">
                {lessonTitle}
              </h1>
              <p className="text-xs sm:text-sm text-[#778DA9]">
                Scene {currentScene + 1} of {scenes.length}:{" "}
                {currentSceneData.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/chatbot")}
              className="p-2 rounded-lg hover:bg-[#415A77] transition-colors"
              title="Chatbot"
            >
              <Bot className="w-6 h-6 text-[#E0E1DD]" />
            </button>
            <button
              onClick={() => setIsStoryPanelOpen(true)}
              className="p-2 rounded-lg hover:bg-[#415A77] transition-colors"
              title="Scenes List"
            >
              <List className="w-6 h-6 text-[#E0E1DD]" />
            </button>
          </div>
        </div>
      )}
      <div
        className={`${
          isFullscreen ? "h-screen" : "h-[calc(100vh-80px)]"
        } flex flex-col lg:flex-row`}
      >
        <div
          className={`${
            isFullscreen ? "w-full" : "w-full lg:w-[calc(100%-34rem)]"
          } p-4 sm:p-6 relative`}
        >
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
        {!isFullscreen && (
          <div className="w-full lg:w-[34rem] flex-1 flex flex-col bg-[#1B263B] border-t lg:border-t-0 lg:border-l lg:border-r border-[#415A77]">
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#E0E1DD] mb-4">
                      {currentSceneData.title}
                    </h2>

                    <div className="prose prose-invert max-w-none">
                      <p className="text-[#E0E1DD] leading-relaxed text-base sm:text-lg">
                        {renderHighlightedText(
                          currentSceneData.content,
                          highlightedText
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="bg-[#0D1B2A] rounded-lg p-4 mt-6">
                <div className="flex justify-between text-xs sm:text-sm text-[#778DA9] mb-2">
                  <span>Scene Progress</span>
                  <span>
                    {currentScene + 1} / {scenes.length}
                  </span>
                </div>
                <div className="w-full bg-[#415A77] rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                    style={{
                      width: `${((currentScene + 1) / scenes.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() =>
                    currentScene > 0 && handleSceneChange(currentScene - 1)
                  }
                  disabled={currentScene === 0}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                    currentScene === 0
                      ? "bg-[#415A77] opacity-50 cursor-not-allowed"
                      : "bg-[#415A77] hover:bg-[#778DA9]"
                  }`}
                >
                  <span className="text-[#E0E1DD] text-xs sm:text-sm">
                    Previous Scene
                  </span>
                </button>

                <button
                  onClick={() =>
                    currentScene < scenes.length - 1 &&
                    handleSceneChange(currentScene + 1)
                  }
                  disabled={currentScene === scenes.length - 1}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                    currentScene === scenes.length - 1
                      ? "bg-[#415A77] opacity-50 cursor-not-allowed"
                      : "bg-[#415A77] hover:bg-[#778DA9]"
                  }`}
                >
                  <span className="text-[#E0E1DD] text-xs sm:text-sm">
                    Next Scene
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {!isFullscreen && (
        <StoryPanel
          scenes={scenes}
          currentScene={currentScene}
          onSceneChange={handleSceneChange}
          isOpen={isStoryPanelOpen}
          onToggle={() => setIsStoryPanelOpen(!isStoryPanelOpen)}
        />
      )}
    </div>
  );
}

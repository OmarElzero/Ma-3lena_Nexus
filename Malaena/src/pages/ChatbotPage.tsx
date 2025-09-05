import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  ArrowLeft,
  Bot,
  Sparkles,
  Zap,
  Brain,
  MessageCircle,
  Star,
  Volume2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Scene3D } from "../components/lesson/Scene3D";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sceneType?: "pyramid" | "atom" | "dna" | "solar-system";
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [currentScene, setCurrentScene] = useState<
    "pyramid" | "atom" | "dna" | "solar-system"
  >("atom");
  const [isTyping, setIsTyping] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSceneFromMessage = (
    text: string
  ): "pyramid" | "atom" | "dna" | "solar-system" => {
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes("pyramid") ||
      lowerText.includes("egypt") ||
      lowerText.includes("ancient")
    ) {
      return "pyramid";
    } else if (
      lowerText.includes("dna") ||
      lowerText.includes("biology") ||
      lowerText.includes("genetic")
    ) {
      return "dna";
    } else if (
      lowerText.includes("solar") ||
      lowerText.includes("planet") ||
      lowerText.includes("space")
    ) {
      return "solar-system";
    }
    return "atom";
  };

  const simulateAIResponse = (userMessage: string): string => {
    const responses = [
      "That's a fascinating question! Let me explain this concept in detail. The atomic structure consists of protons, neutrons, and electrons arranged in specific patterns that define the element's properties.",
      "Great question! In ancient Egyptian civilization, the pyramids were built using advanced engineering techniques that we're still studying today. These monuments showcase incredible mathematical precision.",
      "Excellent inquiry! DNA is the blueprint of life, containing genetic information that determines all biological characteristics. It's a double helix structure with complementary base pairs.",
      "Wonderful question! Our solar system contains eight planets, each with unique characteristics and orbital patterns around the Sun. Each celestial body has its own fascinating properties.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    if (!isActive) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsActive(true);
        setShowPreview(true);
        setIsTransitioning(false);
      }, 400);
    }

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);
    const sceneType = getSceneFromMessage(currentInput);
    setCurrentScene(sceneType);
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        text: simulateAIResponse(currentInput),
        isUser: false,
        timestamp: new Date(),
        sceneType: sceneType,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const suggestions = [
    { text: "Explain atomic structure", icon: <Zap className="w-4 h-4" /> },
    {
      text: "Tell me about Egyptian pyramids",
      icon: <Star className="w-4 h-4" />,
    },
    { text: "How does DNA work?", icon: <Brain className="w-4 h-4" /> },
    {
      text: "Show me the solar system",
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0D1B2A] to-[#1B263B] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#415A77] rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-48 h-48 bg-[#778DA9] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#415A77] rounded-full blur-3xl opacity-20" />
      </div>
      <div className="relative z-10 bg-[#0D1B2A]/90 backdrop-blur-xl border-b border-[#415A77]/30 p-4">
        <div className="flex items-center max-w-7xl ">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-xl hover:bg-[#415A77]/20 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 text-[#E0E1DD]" />
          </button>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#415A77] to-[#778DA9] rounded-2xl flex items-center justify-center mr-3 pulse-glow">
              <Bot className="w-6 h-6 text-[#E0E1DD]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#E0E1DD] tracking-tight">
                Neural Learning Assistant
              </h1>
              <p className="text-sm text-[#778DA9] font-medium">
                Advanced AI • Interactive Learning
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-50 ">
        {!isActive ? (
          <div
            className={`h-[120vh] flex items-center justify-center p-8 transition-all duration-800 ${
              isTransitioning ? "idle-to-active" : ""
            }`}
          >
            <div className="text-center max-w-4xl mx-auto">
              <div className="relative mt-28">
                <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#E0E1DD] via-[#778DA9] to-[#415A77] mb-6 leading-tight">
                  Ask Anything
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-[#778DA9] mb-8">
                  Learn Everything
                </h3>
                <p className="text-xl text-[#778DA9] mb-12 leading-relaxed max-w-2xl mx-auto font-light">
                  Experience the future of learning with our AI-powered
                  assistant. Get instant answers with interactive 3D
                  visualizations.
                </p>
              </div>
              <div className="relative mb-12 max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="What would you like to learn today?"
                    className="w-full bg-[#1B263B]/60 backdrop-blur-sm border-2 border-[#415A77]/30 rounded-2xl px-6 py-4 text-[#E0E1DD] placeholder-[#778DA9] focus:outline-none focus:border-[#778DA9] transition-all duration-300 text-lg font-medium pr-16"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#415A77] to-[#778DA9] hover:from-[#778DA9] hover:to-[#E0E1DD] disabled:opacity-30 disabled:cursor-not-allowed rounded-xl p-3 transition-all duration-300 hover:scale-105"
                  >
                    <Send className="w-5 h-5 text-[#0D1B2A]" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputText(suggestion.text);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="group bg-[#1B263B]/40 backdrop-blur-sm border border-[#415A77]/30 rounded-2xl p-6 text-left hover:bg-[#415A77]/20 transition-all duration-500 hover:scale-[1.02] hover:border-[#778DA9]/50"
                  >
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-[#415A77]/30 rounded-xl mr-3 group-hover:bg-[#778DA9]/30 transition-colors">
                        {suggestion.icon}
                      </div>
                      <div className="w-full h-px bg-gradient-to-r from-[#415A77] to-transparent" />
                    </div>
                    <p className="text-[#E0E1DD] font-semibold text-lg mb-2">
                      {suggestion.text}
                    </p>
                    <p className="text-[#778DA9] text-sm">
                      Interactive 3D visualization included
                    </p>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-8 text-[#778DA9] text-sm mb-10">
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Intelligent Responses
                </div>
                <div className="w-px h-4 bg-[#415A77]" />
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  3D Visualizations
                </div>
                <div className="w-px h-4 bg-[#415A77]" />
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Adaptive Learning
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex transition-all duration-500 h-[100vh]">
            <div
              className={`flex flex-col transition-all duration-500 ${
                showPreview ? "flex-1" : "w-full"
              }`}
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    } message-enter message-enter-active`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-4 max-w-[80%]">
                      {!message.isUser && (
                        <div className="w-10 h-10 bg-gradient-to-br from-[#415A77] to-[#778DA9] rounded-2xl flex items-center justify-center flex-shrink-0 pulse-glow">
                          <Bot className="w-5 h-5 text-[#E0E1DD]" />
                        </div>
                      )}
                      {message.isUser ? (
                        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#415A77] to-[#778DA9] text-[#E0E1DD] rounded-br-lg shadow-xl">
                          <p className="text-sm leading-relaxed font-medium">
                            {message.text}
                          </p>
                          <p className="text-xs text-[#E0E1DD]/70 mt-3 font-medium">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      ) : (
                        <div className="w-full p-5 rounded-3xl  text-[#E0E1DD]  rounded-bl-lg  relative">
                          <p className="text-base leading-loose font-light whitespace-pre-line">
                            {message.text}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <p className="text-xs text-[#778DA9] font-medium">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <button
                              onClick={() => {
                                window.speechSynthesis.cancel();
                                const utterance = new SpeechSynthesisUtterance(
                                  message.text
                                );
                                const voices =
                                  window.speechSynthesis.getVoices();
                                const femaleVoice =
                                  voices.find((v) =>
                                    v.name.toLowerCase().includes("female")
                                  ) ||
                                  voices.find((v) =>
                                    v.name.toLowerCase().includes("zira")
                                  ) ||
                                  voices.find((v) =>
                                    v.name.toLowerCase().includes("hazel")
                                  );
                                if (femaleVoice) utterance.voice = femaleVoice;
                                utterance.rate = 0.95;
                                utterance.pitch = 1.1;
                                window.speechSynthesis.speak(utterance);
                              }}
                              className="text-[#778DA9] hover:text-[#E0E1DD] transition"
                              title="Read aloud"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {message.isUser && (
                        <div className="w-10 h-10 bg-gradient-to-br from-[#778DA9] to-[#E0E1DD] rounded-2xl flex items-center justify-center flex-shrink-0">
                          <span className="text-[#0D1B2A] text-sm font-bold">
                            U
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#415A77] to-[#778DA9] rounded-2xl flex items-center justify-center pulse-glow">
                        <Bot className="w-5 h-5 text-[#E0E1DD]" />
                      </div>
                      <div className="bg-[#1B263B]/60 backdrop-blur-sm border border-[#415A77]/30 p-5 rounded-3xl rounded-bl-lg shadow-xl">
                        <div className="flex space-x-2 items-center">
                          <div className="w-2 h-2 bg-[#778DA9] rounded-full typing-dots" />
                          <div className="w-2 h-2 bg-[#778DA9] rounded-full typing-dots" />
                          <div className="w-2 h-2 bg-[#778DA9] rounded-full typing-dots" />
                          <span className="text-[#778DA9] text-sm ml-2 font-medium">
                            AI is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-6 border-t border-[#415A77]/30 bg-[#1B263B]/40 backdrop-blur-xl">
                <div className="flex space-x-4 max-w-4xl mx-auto">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Continue the conversation..."
                      className="w-full bg-[#0D1B2A]/60 backdrop-blur-sm border-2 border-[#415A77]/30 rounded-2xl px-6 py-4 text-[#E0E1DD] placeholder-[#778DA9] focus:outline-none focus:border-[#778DA9] transition-all duration-300 text-base font-medium pr-16"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#415A77] to-[#778DA9] hover:from-[#778DA9] hover:to-[#E0E1DD] disabled:opacity-30 disabled:cursor-not-allowed rounded-xl p-3 transition-all duration-300 hover:scale-105"
                    >
                      <Send className="w-5 h-5 text-[#0D1B2A]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {showPreview && (
              <div className="w-[40%] bg-[#1B263B]/60 backdrop-blur-xl border-l border-[#415A77]/30 p-6 preview-panel-enter preview-panel-enter-active">
                <div className="h-full flex flex-col">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-[#E0E1DD]">
                        3D Visualization
                      </h3>
                      <div className="w-3 h-3 bg-[#778DA9] rounded-full animate-pulse" />
                    </div>
                    <p className="text-sm text-[#778DA9] font-medium">
                      Interactive model • Real-time rendering
                    </p>
                  </div>

                  <div className="flex-1 relative rounded-2xl overflow-hidden border border-[#415A77]/30 bg-[#0D1B2A]/40">
                    <Scene3D
                      sceneType={currentScene}
                      isRotating={true}
                      zoom={100}
                    />
                    <div className="absolute top-4 right-4 bg-[#1B263B]/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs text-[#778DA9] font-medium">
                        Live Preview
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-[#0D1B2A]/40 rounded-2xl border border-[#415A77]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#E0E1DD] capitalize mb-1">
                          {currentScene.replace("-", " ")} Model
                        </p>
                        <p className="text-xs text-[#778DA9]">
                          Interactive • Zoom & Rotate
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#778DA9] rounded-full animate-pulse" />
                        <div
                          className="w-2 h-2 bg-[#415A77] rounded-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

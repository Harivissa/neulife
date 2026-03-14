import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AIOrb } from "./AIOrb";
import { SafeVoiceInput } from "./SafeVoiceInput";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const FloatingAIChat = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [orbState, setOrbState] = useState<"idle" | "listening" | "responding">("idle");
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const { speak, stop, isPlaying, isLoading: ttsLoading } = useTextToSpeech();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setOrbState("responding");

    try {
      const { data, error } = await supabase.functions.invoke("medical-ai-chat", {
        body: {
          message: userMessage.content,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || t("chat.errorResponse", "I couldn't process that. Please try again."),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: t("chat.errorResponse", "I'm having trouble responding. Please try again."),
        },
      ]);
    } finally {
      setIsLoading(false);
      setOrbState("idle");
    }
  };

  const handleVoiceResult = (text: string) => {
    setInput(text);
    setShowVoice(false);
    setOrbState("idle");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSpeak = (msg: Message) => {
    if (isPlaying && speakingMessageId === msg.id) {
      stop();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(msg.id);
      speak(msg.content).then(() => setSpeakingMessageId(null));
    }
  };

  const handleChatClick = () => {
    setIsExpanded(false);
    setShowVoice(false);
    setIsOpen(true);
  };

  const handleVoiceClick = () => {
    setIsExpanded(false);
    setShowVoice(true);
    setIsOpen(true);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const gradientStyle = {
    background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(280, 70%, 50%) 50%, hsl(190, 90%, 50%) 100%)",
    boxShadow: `
      0 4px 20px hsl(var(--primary) / 0.3),
      0 8px 40px hsl(var(--primary) / 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
  };

  return (
    <TooltipProvider delayDuration={100}>
      {/* Floating AI Hub */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-50">
            {/* Expanded options */}
            <AnimatePresence>
              {isExpanded && (
                <>
                  {/* Chat button - positioned to the upper-left */}
                  <motion.div
                    className="absolute bottom-16 right-12"
                    initial={{ opacity: 0, scale: 0.5, x: 10, y: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: 10, y: 10 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          onClick={handleChatClick}
                          className="relative h-12 w-12 rounded-full flex items-center justify-center"
                          style={gradientStyle}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={t("chat.tooltip", "Chat Assistant")}
                        >
                          <MessageCircle className="h-5 w-5 text-white" strokeWidth={2} />
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="font-medium">
                        {t("chat.tooltip", "Chat Assistant")}
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>

                  {/* Voice button - positioned to the upper-right */}
                  <motion.div
                    className="absolute bottom-16 -right-1"
                    initial={{ opacity: 0, scale: 0.5, x: -10, y: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: -10, y: 10 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          onClick={handleVoiceClick}
                          className="relative h-12 w-12 rounded-full flex items-center justify-center"
                          style={gradientStyle}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={t("voice.tooltip", "Voice Assistant")}
                        >
                          <Mic className="h-5 w-5 text-white" strokeWidth={2} />
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="font-medium">
                        {t("voice.tooltip", "Voice Assistant")}
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main AI button */}
            <motion.button
              onClick={toggleExpand}
              className="relative h-14 w-14 rounded-full flex items-center justify-center group"
              style={gradientStyle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -4, 0],
                rotate: isExpanded ? 45 : 0,
              }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
                rotate: { duration: 0.3 },
              }}
              initial={{ opacity: 0, y: 20 }}
              aria-label="AI Assistant"
            >
              <Sparkles className="h-6 w-6 text-white" strokeWidth={2} />
              {/* Status indicator */}
              <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-background animate-pulse" />
              {/* Glow on hover */}
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
                  transform: "scale(1.5)",
                }}
              />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <motion.div
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-[400px] h-[70vh] max-h-[600px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-purple-500/10">
                <div className="flex items-center gap-3">
                  <AIOrb state={orbState} size="sm" />
                  <div>
                    <h3 className="font-semibold text-foreground">NeuLife AI</h3>
                    <p className="text-xs text-muted-foreground">{t("chat.healthAssistant", "Health Assistant")}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
                    <AIOrb state="idle" size="md" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">{t("chat.greeting", "How can I help you today?")}</p>
                      <p className="text-xs text-muted-foreground max-w-[250px]">
                        {t("chat.disclaimer", "I provide general health information, not medical diagnosis.")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} group`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="flex-1">{msg.content}</span>
                            {msg.role === "assistant" && (
                              <button
                                onClick={() => handleSpeak(msg)}
                                className="flex-shrink-0 p-1 rounded-full hover:bg-background/20 transition-colors opacity-0 group-hover:opacity-100"
                                title={isPlaying && speakingMessageId === msg.id ? t("chat.stopSpeaking", "Stop") : t("chat.speak", "Listen")}
                              >
                                {ttsLoading && speakingMessageId === msg.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : isPlaying && speakingMessageId === msg.id ? (
                                  <VolumeX className="h-4 w-4" />
                                ) : (
                                  <Volume2 className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted px-4 py-2.5 rounded-2xl rounded-bl-md">
                          <div className="flex gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Voice Input Panel */}
              {showVoice && (
                <div className="p-4 border-t border-border bg-muted/30">
                  <SafeVoiceInput onTranscription={handleVoiceResult} />
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowVoice(!showVoice)}
                    className={showVoice ? "text-primary" : "text-muted-foreground"}
                  >
                    {showVoice ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={t("chat.inputPlaceholder", "Type your health question...")}
                    className="flex-1 rounded-full"
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="rounded-full"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
};

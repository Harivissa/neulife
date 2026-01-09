import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIOrb } from "./AIOrb";
import { SafeVoiceInput } from "./SafeVoiceInput";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const FloatingAIChat = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [orbState, setOrbState] = useState<"idle" | "listening" | "responding">("idle");

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

  const handleListeningStateChange = (listening: boolean) => {
    setOrbState(listening ? "listening" : "idle");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-primary via-purple-500 to-cyan-500 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? 20 : 0, pointerEvents: isOpen ? "none" : "auto" }}
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-400 animate-pulse" />
      </motion.button>

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
              className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-md h-[70vh] max-h-[600px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
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
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          {msg.content}
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
                  <SafeVoiceInput
                    onTranscription={handleVoiceResult}
                  />
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
    </>
  );
};

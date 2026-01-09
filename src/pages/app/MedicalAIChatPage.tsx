import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Loader2, 
  User, 
  Heart,
  AlertTriangle,
  LogIn,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { AIOrb, SafeVoiceInput } from '@/components/chat';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/medical-ai-chat`;
const FREE_MESSAGE_LIMIT = 10;
const MESSAGE_COUNT_KEY = 'neulife_chat_message_count';

const suggestedQuestions = [
  "What should I do if I have a headache?",
  "How can I tell if a fever is serious?",
  "What are common causes of stomach pain?",
  "How much water should I drink daily?",
  "What helps with muscle soreness?",
];

const MedicalAIChatPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(() => {
    const stored = localStorage.getItem(MESSAGE_COUNT_KEY);
    return stored ? parseInt(stored, 10) : 0;
  });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Determine AI orb state
  const orbState = isLoading ? 'responding' : 'idle';

  // Check if user has reached limit
  const hasReachedLimit = !isAuthenticated && messageCount >= FREE_MESSAGE_LIMIT;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Reset message count if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem(MESSAGE_COUNT_KEY);
      setMessageCount(0);
      setShowLoginPrompt(false);
    }
  }, [isAuthenticated]);

  const streamChat = async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      if (resp.status === 429) {
        throw new Error(t('chat.tooManyRequests', 'Too many requests. Please wait a moment and try again.'));
      }
      if (resp.status === 402) {
        throw new Error(t('chat.creditsExhausted', 'AI credits exhausted. Please try again later.'));
      }
      throw new Error(errorData.error || t('chat.failedResponse', 'Failed to get response'));
    }

    if (!resp.body) throw new Error('No response body');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';
    let assistantContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === 'assistant') {
                return prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: 'assistant', content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + '\n' + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    // Check message limit for unauthenticated users
    if (!isAuthenticated && messageCount >= FREE_MESSAGE_LIMIT) {
      setShowLoginPrompt(true);
      return;
    }

    const userMessage: Message = { role: 'user', content: trimmedInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Increment message count for unauthenticated users
    if (!isAuthenticated) {
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      localStorage.setItem(MESSAGE_COUNT_KEY, newCount.toString());
      
      // Show login prompt after reaching limit
      if (newCount >= FREE_MESSAGE_LIMIT) {
        setShowLoginPrompt(true);
      }
    }

    try {
      await streamChat(updatedMessages);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : t('chat.sendFailed', 'Failed to send message'));
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    // Voice input populates the text field - user must confirm by pressing Send
    setInput(prev => prev ? `${prev} ${text}` : text);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-3.5rem)] flex flex-col max-w-4xl mx-auto">
      {/* Header with AI Orb */}
      <div className="flex items-center gap-4 mb-4">
        <AIOrb state={orbState} size="sm" />
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{t('chat.title', 'NeuLife Medical AI')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('chat.subtitle', 'Ask health questions in simple words')}
          </p>
        </div>
      </div>

      {/* Login prompt overlay */}
      {showLoginPrompt && !isAuthenticated && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setShowLoginPrompt(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="flex flex-col items-center text-center">
              <AIOrb state="idle" size="md" className="mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                {t('chat.loginRequired', 'Continue with NeuLife')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('chat.loginMessage', "You've used your 10 free messages. Sign in to unlock unlimited access to NeuLife AI and all health features.")}
              </p>
              <Button onClick={() => navigate('/auth')} className="w-full gap-2">
                <LogIn className="h-4 w-4" />
                {t('chat.signIn', 'Sign In to Continue')}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Chat area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <AIOrb state="idle" size="lg" className="mb-6" />
              <h2 className="text-xl font-semibold mb-2">{t('chat.welcome', 'Welcome to NeuLife AI')}</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                {t('chat.welcomeMessage', "I'm here to help you understand health topics in simple terms. Ask me anything about symptoms, wellness, or general health questions.")}
              </p>
              
              {/* Message count for unauthenticated users */}
              {!isAuthenticated && (
                <p className="text-xs text-muted-foreground mb-4">
                  {t('chat.freeMessages', 'Free messages remaining: {{count}}', { count: FREE_MESSAGE_LIMIT - messageCount })}
                </p>
              )}
              
              {/* Suggested questions */}
              <div className="w-full max-w-md space-y-2">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  {t('chat.tryAsking', 'Try asking:')}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((question, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-secondary" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input area with voice input */}
        <div className="border-t p-4">
          {/* Voice input helper text */}
          <p className="text-xs text-muted-foreground text-center mb-2">
            {t('chat.voiceHelper', 'Use voice to type, then review and press Send')}
          </p>
          
          <div className="flex gap-2 items-end">
            {/* Voice input - populates text field */}
            <SafeVoiceInput 
              onTranscription={handleVoiceTranscription}
              disabled={isLoading || hasReachedLimit}
            />
            
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder', 'Type your health question...')}
              className="min-h-[44px] max-h-32 resize-none flex-1"
              rows={1}
              disabled={isLoading || hasReachedLimit}
            />
            
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || hasReachedLimit}
              size="icon"
              className="h-11 w-11 flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Clear input button when there's text */}
          {input && (
            <div className="flex justify-center mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInput('')}
                className="text-xs text-muted-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                {t('chat.clearInput', 'Clear')}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">{t('chat.important', 'Important:')}</strong> {t('chat.disclaimer', 'This AI provides general health information only. It does not diagnose conditions or prescribe treatments. Always consult a healthcare professional for medical advice.')}
        </p>
      </div>
    </div>
  );
};

export default MedicalAIChatPage;

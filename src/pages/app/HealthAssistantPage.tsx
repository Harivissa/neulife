import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Loader2, 
  Thermometer, 
  HeartPulse, 
  Activity,
  Droplets,
  Wind,
  Cookie,
  Scale,
  User,
  Bot,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Heart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useHealthStorage } from '@/hooks/useHealthStorage';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { VirtualThermometer } from '@/components/demo/VirtualThermometer';
import { VirtualBPMachine } from '@/components/demo/VirtualBPMachine';
import { VirtualHeartRate } from '@/components/demo/VirtualHeartRate';
import { VirtualOximeter } from '@/components/demo/VirtualOximeter';
import { VirtualGlucose } from '@/components/demo/VirtualGlucose';
import { VirtualRespiratoryRate } from '@/components/demo/VirtualRespiratoryRate';
import { VirtualBMI } from '@/components/demo/VirtualBMI';
import { InteractiveBodyMap, RegionData } from '@/components/InteractiveBodyMap';
import { cn } from '@/lib/utils';

type MessageRole = 'user' | 'assistant';
type RequestedTool = 'TEMPERATURE' | 'BLOOD_PRESSURE' | 'HEART_RATE' | 'OXYGEN_LEVEL' | 'GLUCOSE' | 'RESPIRATORY_RATE' | 'BODY_MAP' | 'BMI' | null;
type RiskLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | null;

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface CollectedVitals {
  temperature?: { value: number; unit: string };
  bloodPressure?: { systolic: number; diastolic: number };
  heartRate?: { value: number };
  oxygenLevel?: { value: number };
  glucose?: { value: number };
  respiratoryRate?: { value: number };
  bmi?: { weight: number; height: number; bmi: number };
}

const HealthAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestedTool, setRequestedTool] = useState<RequestedTool>(null);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(null);
  const [collectedVitals, setCollectedVitals] = useState<CollectedVitals>({});
  const [bodyMapData, setBodyMapData] = useState<RegionData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addVital, addSymptom } = useHealthStorage();
  const { profile } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Parse AI response for tool requests and risk levels
  const parseAIResponse = (content: string): { cleanContent: string; tool: RequestedTool; risk: RiskLevel } => {
    let cleanContent = content;
    let tool: RequestedTool = null;
    let risk: RiskLevel = null;

    // Check for tool requests
    const toolMatches = content.match(/\[REQUEST:(TEMPERATURE|BLOOD_PRESSURE|HEART_RATE|OXYGEN_LEVEL|GLUCOSE|RESPIRATORY_RATE|BODY_MAP|BMI)\]/g);
    if (toolMatches && toolMatches.length > 0) {
      tool = toolMatches[0].match(/REQUEST:(\w+)/)?.[1] as RequestedTool;
      cleanContent = cleanContent.replace(/\[REQUEST:\w+\]/g, '').trim();
    }

    // Check for risk levels
    const riskMatch = content.match(/\[RISK:(GREEN|YELLOW|ORANGE|RED)\]/);
    if (riskMatch) {
      risk = riskMatch[1] as RiskLevel;
      cleanContent = cleanContent.replace(/\[RISK:\w+\]/g, '').trim();
    }

    return { cleanContent, tool, risk };
  };

  const streamChat = async (userMessage: string) => {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/guided-triage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
          role: m.role,
          content: m.content,
        })),
        vitals: collectedVitals,
        bodyMapData,
        userProfile: profile ? { age: profile.age, sex: profile.sex } : null,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get response');
    }

    return response;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setRequestedTool(null);

    try {
      const response = await streamChat(userMessage.content);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let assistantContent = '';
      const assistantId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }]);

      if (reader) {
        let buffer = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          let newlineIndex;
          while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
            const line = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 1);
            
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              if (jsonStr === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantContent += content;
                  setMessages(prev => 
                    prev.map(m => m.id === assistantId 
                      ? { ...m, content: assistantContent }
                      : m
                    )
                  );
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Parse the final response for tools and risk
      const { cleanContent, tool, risk } = parseAIResponse(assistantContent);
      
      setMessages(prev => 
        prev.map(m => m.id === assistantId 
          ? { ...m, content: cleanContent }
          : m
        )
      );
      
      if (tool) {
        setRequestedTool(tool);
      }
      
      if (risk) {
        setRiskLevel(risk);
        // Save assessment to database
        saveAssessment(risk, cleanContent);
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAssessment = async (risk: RiskLevel, summary: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: card } = await supabase
        .from('health_cards')
        .select('hcid')
        .eq('user_id', user.id)
        .maybeSingle();

      const assessmentData = {
        user_id: user.id,
        hcid: card?.hcid || null,
        input_data: {
          vitals: collectedVitals,
          bodyMapData,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        },
        ai_result: { summary, riskLevel: risk },
        triage_level: risk?.toLowerCase() || 'unknown',
        easy_text: summary,
      };

      await supabase.from('assessments').insert(assessmentData as any);
      
      toast.success('Assessment saved to your health card');
    } catch (error) {
      console.error('Failed to save assessment:', error);
    }
  };

  // Tool handlers
  const handleTemperature = (value: number, unit: string) => {
    setCollectedVitals(prev => ({ ...prev, temperature: { value, unit } }));
    addVital({ type: 'temperature', value, unit });
    setRequestedTool(null);
    
    // Send the reading to AI
    const readingMessage = `My temperature is ${value}${unit}`;
    setInput(readingMessage);
    setTimeout(() => handleSend(), 100);
  };

  const handleBP = (systolic: number, diastolic: number) => {
    setCollectedVitals(prev => ({ ...prev, bloodPressure: { systolic, diastolic } }));
    addVital({ type: 'blood_pressure', value: { systolic, diastolic }, unit: 'mmHg' });
    setRequestedTool(null);
    
    const readingMessage = `My blood pressure is ${systolic}/${diastolic} mmHg`;
    setInput(readingMessage);
    setTimeout(() => handleSend(), 100);
  };

  const handleHeartRate = (bpm: number) => {
    setCollectedVitals(prev => ({ ...prev, heartRate: { value: bpm } }));
    addVital({ type: 'heart_rate', value: bpm, unit: 'BPM' });
    setRequestedTool(null);
    
    const readingMessage = `My heart rate is ${bpm} BPM`;
    setInput(readingMessage);
    setTimeout(() => handleSend(), 100);
  };

  const handleOxygen = (spo2: number) => {
    setCollectedVitals(prev => ({ ...prev, oxygenLevel: { value: spo2 } }));
    addVital({ type: 'oxygen', value: spo2, unit: '%' });
    setRequestedTool(null);
    
    const readingMessage = `My oxygen level (SpO2) is ${spo2}%`;
    setInput(readingMessage);
    setTimeout(() => handleSend(), 100);
  };

  const handleGlucose = (value: number) => {
    setCollectedVitals(prev => ({ ...prev, glucose: { value } }));
    addVital({ type: 'glucose', value, unit: 'mg/dL' });
    setRequestedTool(null);
    
    const readingMessage = `My blood sugar level is ${value} mg/dL`;
    setInput(readingMessage);
    setTimeout(() => handleSend(), 100);
  };

  const handleRespiratory = (rate: number) => {
    setCollectedVitals(prev => ({ ...prev, respiratoryRate: { value: rate } }));
    addVital({ type: 'respiratory', value: rate, unit: 'breaths/min' });
    setRequestedTool(null);
    
    const readingMessage = `My respiratory rate is ${rate} breaths per minute`;
    setInput(readingMessage);
    setTimeout(() => handleSend(), 100);
  };

  const handleBMI = (weight: number, height: number, bmi: number) => {
    setCollectedVitals(prev => ({ ...prev, bmi: { weight, height, bmi } }));
    addVital({ type: 'bmi', value: { weight, height, bmi }, unit: 'kg/m²' });
    setRequestedTool(null);
    
    const readingMessage = `My BMI is ${bmi.toFixed(1)} (weight: ${weight}kg, height: ${height}cm)`;
    setInput(readingMessage);
    setTimeout(() => handleSend(), 100);
  };

  const handleBodyMap = (regionData: RegionData) => {
    setBodyMapData(regionData);
    addSymptom({
      region: regionData.region,
      regionLabel: regionData.regionLabel,
      layer: regionData.layer,
      severity: regionData.severity,
      gender: regionData.gender,
      view: regionData.view,
    });
    setRequestedTool(null);
    
    const readingMessage = `I'm feeling pain in my ${regionData.regionLabel} (${regionData.layer} layer, severity ${regionData.severity}/10)`;
    setInput(readingMessage);
    setTimeout(() => handleSend(), 100);
  };

  const getRiskBadge = () => {
    if (!riskLevel) return null;
    
    const configs = {
      GREEN: { icon: CheckCircle2, label: 'Safe', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
      YELLOW: { icon: AlertCircle, label: 'Monitor', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      ORANGE: { icon: AlertTriangle, label: 'Consult Soon', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
      RED: { icon: XCircle, label: 'Urgent', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    };
    
    const config = configs[riskLevel];
    const Icon = config.icon;
    
    return (
      <Badge className={cn('gap-1', config.className)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const renderTool = () => {
    if (!requestedTool) return null;

    const toolComponents: Record<string, JSX.Element> = {
      TEMPERATURE: <VirtualThermometer onReading={handleTemperature} />,
      BLOOD_PRESSURE: <VirtualBPMachine onReading={handleBP} />,
      HEART_RATE: <VirtualHeartRate onReading={handleHeartRate} />,
      OXYGEN_LEVEL: <VirtualOximeter onReading={handleOxygen} />,
      GLUCOSE: <VirtualGlucose onReading={handleGlucose} />,
      RESPIRATORY_RATE: <VirtualRespiratoryRate onReading={handleRespiratory} />,
      BMI: <VirtualBMI onReading={handleBMI} />,
      BODY_MAP: (
        <InteractiveBodyMap
          onRegionSelect={handleBodyMap}
          initialGender={profile?.sex === 'female' ? 'female' : 'male'}
        />
      ),
    };

    return (
      <div className="mt-4 animate-in slide-in-from-bottom-4 duration-300">
        <Card className="p-4 border-primary/30 bg-primary/5">
          <div className="flex items-center gap-2 mb-4">
            {requestedTool === 'BODY_MAP' ? (
              <Activity className="h-5 w-5 text-primary" />
            ) : (
              <Thermometer className="h-5 w-5 text-primary" />
            )}
            <span className="font-medium text-sm">
              Please provide the requested reading
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-xs"
              onClick={() => setRequestedTool(null)}
            >
              Skip
            </Button>
          </div>
          <div className={requestedTool === 'BODY_MAP' ? '' : 'max-w-sm'}>
            {toolComponents[requestedTool]}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
          <Heart className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Health Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Tell me what you're feeling, I'll guide you step by step
          </p>
        </div>
        {getRiskBadge()}
      </div>

      {/* Collected vitals summary */}
      {Object.keys(collectedVitals).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {collectedVitals.temperature && (
            <Badge variant="outline" className="gap-1">
              <Thermometer className="h-3 w-3" />
              {collectedVitals.temperature.value}{collectedVitals.temperature.unit}
            </Badge>
          )}
          {collectedVitals.bloodPressure && (
            <Badge variant="outline" className="gap-1">
              <Activity className="h-3 w-3" />
              {collectedVitals.bloodPressure.systolic}/{collectedVitals.bloodPressure.diastolic}
            </Badge>
          )}
          {collectedVitals.heartRate && (
            <Badge variant="outline" className="gap-1">
              <HeartPulse className="h-3 w-3" />
              {collectedVitals.heartRate.value} BPM
            </Badge>
          )}
          {collectedVitals.oxygenLevel && (
            <Badge variant="outline" className="gap-1">
              <Droplets className="h-3 w-3" />
              SpO2: {collectedVitals.oxygenLevel.value}%
            </Badge>
          )}
          {collectedVitals.glucose && (
            <Badge variant="outline" className="gap-1">
              <Cookie className="h-3 w-3" />
              {collectedVitals.glucose.value} mg/dL
            </Badge>
          )}
          {collectedVitals.respiratoryRate && (
            <Badge variant="outline" className="gap-1">
              <Wind className="h-3 w-3" />
              {collectedVitals.respiratoryRate.value}/min
            </Badge>
          )}
          {collectedVitals.bmi && (
            <Badge variant="outline" className="gap-1">
              <Scale className="h-3 w-3" />
              BMI: {collectedVitals.bmi.bmi.toFixed(1)}
            </Badge>
          )}
          {bodyMapData && (
            <Badge variant="outline" className="gap-1">
              <Activity className="h-3 w-3" />
              {bodyMapData.regionLabel}: {bodyMapData.severity}/10
            </Badge>
          )}
        </div>
      )}

      {/* Messages */}
      <Card className="flex-1 mb-4 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">How can I help you today?</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Describe what you're feeling and I'll guide you through checking your health step by step.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "I have a headache and feel tired",
                  "I feel dizzy when I stand up",
                  "I have chest discomfort",
                  "I have a fever and body aches"
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setInput(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-2 max-w-[80%]',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
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
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-2xl px-4 py-2 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Tool panel */}
      {renderTool()}

      {/* Input */}
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what you're feeling..."
          className="min-h-[60px] resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="h-auto px-6"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center mt-3">
        This is for guidance only and does not replace professional medical advice.
      </p>
    </div>
  );
};

export default HealthAssistantPage;

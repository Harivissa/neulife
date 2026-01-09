import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface SafeVoiceInputProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function SafeVoiceInput({ 
  onTranscription, 
  disabled,
  className 
}: SafeVoiceInputProps) {
  const { t } = useTranslation();
  const [state, setState] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setState('listening');
    } catch (err) {
      console.error('Error starting recording:', err);
      toast.error(t('voiceInput.microphoneError', 'Failed to access microphone'));
      setState('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state === 'listening') {
      mediaRecorderRef.current.stop();
      setState('processing');
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error('Failed to convert audio');
        }

        const { data, error: apiError } = await supabase.functions.invoke(
          'speech-to-text',
          { body: { audio: base64Audio } }
        );

        if (apiError) throw apiError;

        if (data?.text) {
          onTranscription(data.text);
          setError(null);
        } else {
          // Show error recovery message - don't assume correctness
          setError(t('voiceInput.unclearMessage', "I may not have understood that clearly. You can edit or try again."));
          toast.warning(t('voiceInput.reviewText', 'Please review the text before sending'));
        }
        
        setState('idle');
      };
    } catch (err: any) {
      console.error('Error processing audio:', err);
      setError(t('voiceInput.processingError', 'Could not process audio. Please try again or type instead.'));
      setState('idle');
    }
  };

  const handleClick = () => {
    if (state === 'listening') {
      stopRecording();
    } else if (state === 'idle') {
      startRecording();
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <Button
        type="button"
        variant={state === 'listening' ? 'destructive' : 'outline'}
        size="icon"
        className={cn(
          'h-11 w-11 rounded-full transition-all',
          state === 'listening' && 'animate-pulse'
        )}
        onClick={handleClick}
        disabled={disabled || state === 'processing'}
      >
        {state === 'processing' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : state === 'listening' ? (
          <Square className="h-4 w-4" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
      
      {/* Status text - simple, no waveforms */}
      {state === 'listening' && (
        <span className="text-xs text-muted-foreground animate-pulse">
          {t('voiceInput.listening', 'Listening...')}
        </span>
      )}
      {state === 'processing' && (
        <span className="text-xs text-muted-foreground">
          {t('voiceInput.processing', 'Processing...')}
        </span>
      )}
      
      {/* Error message for recovery */}
      {error && state === 'idle' && (
        <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 max-w-[200px] text-center">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MessageCircle, ChevronRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ClarifyingQuestion {
  id: string;
  question: string;
  options: string[];
  category: 'cardiac' | 'respiratory' | 'gastrointestinal' | 'neurological' | 'menstrual' | 'general';
}

interface ClarifyingQuestionsProps {
  questions: ClarifyingQuestion[];
  onComplete: (answers: Record<string, string>) => void;
  onSkip: () => void;
}

export const ClarifyingQuestions = ({ questions, onComplete, onSkip }: ClarifyingQuestionsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentAnswer = answers[currentQuestion?.id];

  const handleNext = () => {
    if (!currentAnswer) return;
    
    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  if (!currentQuestion) return null;

  const categoryColors = {
    cardiac: 'text-rose-400 bg-rose-500/20',
    respiratory: 'text-sky-400 bg-sky-500/20',
    gastrointestinal: 'text-amber-400 bg-amber-500/20',
    neurological: 'text-purple-400 bg-purple-500/20',
    menstrual: 'text-pink-400 bg-pink-500/20',
    general: 'text-emerald-400 bg-emerald-500/20',
  };

  return (
    <Card className="p-6 space-y-6 border-primary/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Clarifying Questions</h3>
            <p className="text-sm text-muted-foreground">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium capitalize', categoryColors[currentQuestion.category])}>
          {currentQuestion.category}
        </span>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i < currentIndex ? 'bg-primary' : i === currentIndex ? 'bg-primary/50' : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Question */}
      <div className="py-4">
        <p className="text-lg font-medium">{currentQuestion.question}</p>
      </div>

      {/* Options */}
      <RadioGroup value={currentAnswer} onValueChange={handleAnswer} className="space-y-3">
        {currentQuestion.options.map((option, i) => (
          <div key={i} className="flex items-center space-x-3">
            <RadioGroupItem value={option} id={`option-${i}`} />
            <Label htmlFor={`option-${i}`} className="cursor-pointer flex-1 text-sm">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onSkip}>
          Skip Questions
        </Button>
        <Button onClick={handleNext} disabled={!currentAnswer}>
          {isLastQuestion ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

// Generate clarifying questions based on symptoms and region
export const generateClarifyingQuestions = (
  region: string,
  gender: string,
  severity: number,
  vitals: any[]
): ClarifyingQuestion[] => {
  const questions: ClarifyingQuestion[] = [];
  const regionLower = region.toLowerCase();
  
  // Check vitals for concerning patterns
  const hasHighBP = vitals.some(v => 
    v.type === 'blood_pressure' && 
    (v.value as any)?.systolic > 140
  );
  const hasHighHR = vitals.some(v => 
    v.type === 'heart_rate' && 
    (v.value as number) > 100
  );
  const hasFever = vitals.some(v => 
    v.type === 'temperature' && 
    (v.value as number) > 99.5
  );

  // Chest-related questions
  if (regionLower.includes('chest') || regionLower.includes('sternum')) {
    questions.push({
      id: 'chest_pain_type',
      question: 'How would you describe the chest discomfort?',
      options: [
        'Sharp or stabbing pain',
        'Pressure or squeezing sensation',
        'Dull ache',
        'Burning sensation',
        'Tightness',
      ],
      category: 'cardiac',
    });

    questions.push({
      id: 'chest_radiation',
      question: 'Does the discomfort spread to other areas?',
      options: [
        'No, stays in one place',
        'Radiates to left arm',
        'Radiates to jaw or neck',
        'Radiates to back',
        'Radiates to both arms',
      ],
      category: 'cardiac',
    });

    if (hasHighBP || hasHighHR) {
      questions.push({
        id: 'chest_exertion',
        question: 'Did this begin during or after physical activity?',
        options: [
          'Started during exercise',
          'Started after exercise',
          'Started at rest',
          'Started during stress',
          'Not sure',
        ],
        category: 'cardiac',
      });
    }
  }

  // Abdominal questions
  if (regionLower.includes('abdomen') || regionLower.includes('stomach')) {
    questions.push({
      id: 'abdominal_location',
      question: 'Where exactly is the abdominal discomfort?',
      options: [
        'Upper right (near liver)',
        'Upper left (near stomach)',
        'Lower right (near appendix)',
        'Lower left',
        'Around the navel',
        'All over',
      ],
      category: 'gastrointestinal',
    });

    if (gender === 'female') {
      questions.push({
        id: 'menstrual_related',
        question: 'Could this be related to your menstrual cycle?',
        options: [
          'Yes, I am on my period',
          'Period is expected soon',
          'No, unrelated to cycle',
          'Not applicable',
          'Not sure',
        ],
        category: 'menstrual',
      });
    }

    questions.push({
      id: 'abdominal_eating',
      question: 'Is the discomfort related to eating?',
      options: [
        'Worse after eating',
        'Better after eating',
        'No change with eating',
        'Worse when hungry',
      ],
      category: 'gastrointestinal',
    });
  }

  // Head/neurological questions
  if (regionLower.includes('head') || regionLower.includes('temple') || regionLower.includes('forehead')) {
    questions.push({
      id: 'headache_type',
      question: 'What type of headache is this?',
      options: [
        'Throbbing or pulsing',
        'Pressure or band-like',
        'Sharp or stabbing',
        'Dull constant ache',
        'Comes in waves',
      ],
      category: 'neurological',
    });

    questions.push({
      id: 'headache_symptoms',
      question: 'Are you experiencing any of these with the headache?',
      options: [
        'Sensitivity to light',
        'Nausea or vomiting',
        'Vision changes',
        'Dizziness',
        'None of these',
      ],
      category: 'neurological',
    });

    questions.push({
      id: 'hydration_status',
      question: 'How has your fluid intake been today?',
      options: [
        'Less than usual',
        'About normal',
        'More than usual',
        'Not sure',
      ],
      category: 'general',
    });
  }

  // Respiratory questions
  if (regionLower.includes('lung') || regionLower.includes('respiratory')) {
    questions.push({
      id: 'breathing_difficulty',
      question: 'How would you describe your breathing?',
      options: [
        'Mild shortness of breath',
        'Difficulty with deep breaths',
        'Wheezing or whistling',
        'Rapid breathing',
        'Normal breathing but with cough',
      ],
      category: 'respiratory',
    });

    questions.push({
      id: 'cough_type',
      question: 'If you have a cough, what type is it?',
      options: [
        'Dry cough',
        'Wet/productive cough',
        'Cough with blood',
        'No cough',
      ],
      category: 'respiratory',
    });
  }

  // Add severity-based general question for high severity
  if (severity >= 7) {
    questions.push({
      id: 'onset_timing',
      question: 'When did this symptom start?',
      options: [
        'Within the last hour',
        'Today (several hours ago)',
        'Yesterday',
        'Several days ago',
        'More than a week ago',
      ],
      category: 'general',
    });
  }

  // Limit to 5 questions max
  return questions.slice(0, 5);
};

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Droplets, 
  Moon, 
  Brain,
  Activity,
  Utensils,
  ChevronRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WellnessCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  questions: {
    question: string;
    options: { label: string; score: number }[];
  }[];
}

const wellnessCategories: WellnessCategory[] = [
  {
    id: 'hydration',
    name: 'Hydration',
    icon: Droplets,
    color: 'text-cyan-400 bg-cyan-500/20',
    questions: [
      {
        question: 'How many glasses of water have you had today?',
        options: [
          { label: 'Less than 2', score: 25 },
          { label: '2-4 glasses', score: 50 },
          { label: '5-7 glasses', score: 75 },
          { label: '8 or more', score: 100 },
        ],
      },
      {
        question: 'What color is your urine?',
        options: [
          { label: 'Dark yellow/amber', score: 25 },
          { label: 'Yellow', score: 50 },
          { label: 'Light yellow', score: 75 },
          { label: 'Pale/clear', score: 100 },
        ],
      },
      {
        question: 'Are you experiencing any signs of dehydration?',
        options: [
          { label: 'Headache and dry mouth', score: 25 },
          { label: 'Slightly dry lips', score: 50 },
          { label: 'Feeling slightly thirsty', score: 75 },
          { label: 'No symptoms', score: 100 },
        ],
      },
    ],
  },
  {
    id: 'sleep',
    name: 'Sleep Quality',
    icon: Moon,
    color: 'text-indigo-400 bg-indigo-500/20',
    questions: [
      {
        question: 'How many hours did you sleep last night?',
        options: [
          { label: 'Less than 5 hours', score: 25 },
          { label: '5-6 hours', score: 50 },
          { label: '6-7 hours', score: 75 },
          { label: '7-9 hours', score: 100 },
        ],
      },
      {
        question: 'How would you rate your sleep quality?',
        options: [
          { label: 'Very poor - woke up multiple times', score: 25 },
          { label: 'Poor - hard to fall asleep', score: 50 },
          { label: 'Fair - some interruptions', score: 75 },
          { label: 'Good - restful sleep', score: 100 },
        ],
      },
      {
        question: 'How do you feel upon waking?',
        options: [
          { label: 'Exhausted', score: 25 },
          { label: 'Still tired', score: 50 },
          { label: 'Somewhat rested', score: 75 },
          { label: 'Refreshed and alert', score: 100 },
        ],
      },
    ],
  },
  {
    id: 'stress',
    name: 'Stress Level',
    icon: Brain,
    color: 'text-purple-400 bg-purple-500/20',
    questions: [
      {
        question: 'How stressed have you felt today?',
        options: [
          { label: 'Extremely stressed', score: 25 },
          { label: 'Quite stressed', score: 50 },
          { label: 'Mildly stressed', score: 75 },
          { label: 'Relaxed', score: 100 },
        ],
      },
      {
        question: 'How is your concentration?',
        options: [
          { label: 'Cannot focus at all', score: 25 },
          { label: 'Easily distracted', score: 50 },
          { label: 'Occasional lapses', score: 75 },
          { label: 'Sharp and focused', score: 100 },
        ],
      },
      {
        question: 'How are you handling challenges today?',
        options: [
          { label: 'Feeling overwhelmed', score: 25 },
          { label: 'Struggling a bit', score: 50 },
          { label: 'Managing okay', score: 75 },
          { label: 'Handling well', score: 100 },
        ],
      },
    ],
  },
  {
    id: 'nutrition',
    name: 'Food & Digestion',
    icon: Utensils,
    color: 'text-amber-400 bg-amber-500/20',
    questions: [
      {
        question: 'How have you been eating today?',
        options: [
          { label: 'Skipped meals', score: 25 },
          { label: 'Mostly snacks', score: 50 },
          { label: 'One good meal', score: 75 },
          { label: 'Regular balanced meals', score: 100 },
        ],
      },
      {
        question: 'Any digestive discomfort?',
        options: [
          { label: 'Significant discomfort', score: 25 },
          { label: 'Some bloating/discomfort', score: 50 },
          { label: 'Mild discomfort', score: 75 },
          { label: 'No issues', score: 100 },
        ],
      },
      {
        question: 'How is your appetite?',
        options: [
          { label: 'No appetite', score: 25 },
          { label: 'Reduced appetite', score: 50 },
          { label: 'Normal', score: 75 },
          { label: 'Healthy appetite', score: 100 },
        ],
      },
    ],
  },
  {
    id: 'activity',
    name: 'Physical Activity',
    icon: Activity,
    color: 'text-emerald-400 bg-emerald-500/20',
    questions: [
      {
        question: 'How active have you been today?',
        options: [
          { label: 'Completely sedentary', score: 25 },
          { label: 'Mostly sitting', score: 50 },
          { label: 'Some light activity', score: 75 },
          { label: 'Active/exercised', score: 100 },
        ],
      },
      {
        question: 'Any muscle or joint discomfort?',
        options: [
          { label: 'Significant pain', score: 25 },
          { label: 'Moderate discomfort', score: 50 },
          { label: 'Mild stiffness', score: 75 },
          { label: 'Feeling good', score: 100 },
        ],
      },
      {
        question: 'Energy levels today?',
        options: [
          { label: 'Very low energy', score: 25 },
          { label: 'Below average', score: 50 },
          { label: 'Average', score: 75 },
          { label: 'High energy', score: 100 },
        ],
      },
    ],
  },
];

interface WellnessResult {
  categoryId: string;
  score: number;
  insights: string[];
}

export const WellnessInsights = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [results, setResults] = useState<WellnessResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const category = wellnessCategories.find(c => c.id === activeCategory);

  const handleStartCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentQuestion(0);
    setAnswers(prev => ({ ...prev, [categoryId]: [] }));
  };

  const handleAnswer = (score: number) => {
    const categoryAnswers = answers[activeCategory!] || [];
    const newAnswers = [...categoryAnswers, score];
    setAnswers(prev => ({ ...prev, [activeCategory!]: newAnswers }));

    if (category && currentQuestion < category.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate result for this category
      const avgScore = Math.round(newAnswers.reduce((a, b) => a + b, 0) / newAnswers.length);
      const insights = generateInsights(activeCategory!, avgScore);
      
      setResults(prev => [...prev.filter(r => r.categoryId !== activeCategory), {
        categoryId: activeCategory!,
        score: avgScore,
        insights,
      }]);
      
      setActiveCategory(null);
      setCurrentQuestion(0);
    }
  };

  const generateInsights = (categoryId: string, score: number): string[] => {
    const insights: string[] = [];
    
    if (categoryId === 'hydration') {
      if (score < 50) {
        insights.push('Consider increasing water intake throughout the day');
        insights.push('Set reminders to drink water every hour');
      } else if (score < 75) {
        insights.push('Good start! Try to add 2-3 more glasses today');
      } else {
        insights.push('Excellent hydration! Keep up the good work');
      }
    } else if (categoryId === 'sleep') {
      if (score < 50) {
        insights.push('Consider establishing a consistent bedtime routine');
        insights.push('Limit screen time 1 hour before bed');
      } else if (score < 75) {
        insights.push('Sleep quality could improve with minor adjustments');
      } else {
        insights.push('Great sleep habits! Rest is essential for health');
      }
    } else if (categoryId === 'stress') {
      if (score < 50) {
        insights.push('Consider deep breathing exercises');
        insights.push('Take short breaks every 30-60 minutes');
      } else if (score < 75) {
        insights.push('Some stress is normal - practice mindfulness');
      } else {
        insights.push('Good stress management! Stay balanced');
      }
    } else if (categoryId === 'nutrition') {
      if (score < 50) {
        insights.push('Try to include protein with each meal');
        insights.push('Avoid skipping meals for stable energy');
      } else if (score < 75) {
        insights.push('Consider adding more vegetables to meals');
      } else {
        insights.push('Great nutritional habits!');
      }
    } else if (categoryId === 'activity') {
      if (score < 50) {
        insights.push('Try a short 10-minute walk');
        insights.push('Stretch every hour if sitting long periods');
      } else if (score < 75) {
        insights.push('Good activity level - aim for consistency');
      } else {
        insights.push('Excellent activity level! Stay active');
      }
    }
    
    return insights;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-secondary';
    if (score >= 50) return 'text-amber-400';
    return 'text-orange-400';
  };

  const overallScore = results.length > 0
    ? Math.round(results.reduce((a, b) => a + b.score, 0) / results.length)
    : null;

  if (activeCategory && category) {
    const question = category.questions[currentQuestion];
    
    return (
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', category.color)}>
            <category.icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">{category.name} Check</h3>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {category.questions.length}
            </p>
          </div>
        </div>

        <Progress value={((currentQuestion + 1) / category.questions.length) * 100} />

        <div className="py-4">
          <p className="text-lg font-medium">{question.question}</p>
        </div>

        <div className="space-y-3">
          {question.options.map((option, i) => (
            <Button
              key={i}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3"
              onClick={() => handleAnswer(option.score)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <Button variant="ghost" onClick={() => setActiveCategory(null)}>
          Cancel
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Wellness Insights</h2>
          <p className="text-sm text-muted-foreground">
            Quick wellness checks for your day
          </p>
        </div>
      </div>

      {/* Overall Score */}
      {overallScore !== null && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className={cn('h-8 w-8', getScoreColor(overallScore))} />
              <div>
                <div className="font-semibold">Overall Wellness Score</div>
                <div className={cn('text-2xl font-bold', getScoreColor(overallScore))}>
                  {overallScore}/100
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              setResults([]);
              setAnswers({});
            }}>
              Reset All
            </Button>
          </div>
        </Card>
      )}

      {/* Category Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wellnessCategories.map((cat) => {
          const result = results.find(r => r.categoryId === cat.id);
          
          return (
            <Card key={cat.id} className="p-4 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleStartCategory(cat.id)}>
              <div className="flex items-center justify-between mb-3">
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', cat.color)}>
                  <cat.icon className="h-5 w-5" />
                </div>
                {result ? (
                  <span className={cn('text-xl font-bold', getScoreColor(result.score))}>
                    {result.score}%
                  </span>
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-semibold mb-1">{cat.name}</h3>
              {result ? (
                <div className="space-y-1">
                  {result.insights.slice(0, 2).map((insight, i) => (
                    <p key={i} className="text-xs text-muted-foreground">• {insight}</p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {cat.questions.length} quick questions
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-muted/30 rounded-lg border border-border text-sm text-muted-foreground">
        <strong className="text-foreground">Note:</strong> These wellness checks are for general awareness only and do not constitute medical advice. For health concerns, please consult a healthcare professional.
      </div>
    </div>
  );
};

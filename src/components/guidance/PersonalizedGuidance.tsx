import { Card } from '@/components/ui/card';
import { 
  Droplets, 
  Moon, 
  Heart, 
  Pill, 
  Brain,
  Sparkles 
} from 'lucide-react';

export const PersonalizedGuidance = () => {
  const tips = [
    {
      icon: Droplets,
      title: 'Hydration',
      color: 'text-cyan-400 bg-cyan-500/20',
      tips: [
        'Aim for 8-10 glasses of water daily',
        'Increase intake during exercise or hot weather',
        'Watch for signs of dehydration: dry mouth, dark urine',
        'Herbal teas and water-rich foods count too',
      ],
    },
    {
      icon: Moon,
      title: 'Sleep Quality',
      color: 'text-indigo-400 bg-indigo-500/20',
      tips: [
        'Maintain consistent sleep and wake times',
        'Aim for 7-9 hours of sleep per night',
        'Limit screen time 1 hour before bed',
        'Keep your bedroom cool and dark',
      ],
    },
    {
      icon: Brain,
      title: 'Stress Management',
      color: 'text-purple-400 bg-purple-500/20',
      tips: [
        'Practice deep breathing exercises',
        'Take regular breaks during work',
        'Consider mindfulness or meditation',
        'Stay connected with friends and family',
      ],
    },
    {
      icon: Heart,
      title: 'First Aid Basics',
      color: 'text-rose-400 bg-rose-500/20',
      tips: [
        'For minor cuts: Clean, apply pressure, bandage',
        'For burns: Cool with water for 10-20 minutes',
        'For sprains: Rest, Ice, Compression, Elevation',
        'Keep a first aid kit accessible at home',
      ],
    },
  ];

  const medicationInfo = [
    { name: 'Paracetamol', use: 'Fever, mild pain', caution: 'Max 4g/day for adults' },
    { name: 'Ibuprofen', use: 'Pain, inflammation', caution: 'Take with food' },
    { name: 'Antihistamines', use: 'Allergies, itching', caution: 'May cause drowsiness' },
    { name: 'Antacids', use: 'Heartburn, indigestion', caution: 'Space from other meds' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Personalized Guidance</h2>
          <p className="text-sm text-muted-foreground">
            General wellness tips and first-aid information
          </p>
        </div>
      </div>

      {/* Wellness tips grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {tips.map((category) => (
          <Card key={category.title} className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-10 w-10 rounded-lg ${category.color} flex items-center justify-center`}>
                <category.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{category.title}</h3>
            </div>
            <ul className="space-y-2">
              {category.tips.map((tip, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* Medication info */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Pill className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold">Common Medications Reference</h3>
            <p className="text-xs text-muted-foreground">
              General information only - consult a pharmacist or doctor
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {medicationInfo.map((med) => (
            <div key={med.name} className="p-3 bg-muted/50 rounded-lg">
              <div className="font-medium text-sm">{med.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{med.use}</div>
              <div className="text-xs text-amber-400 mt-1">⚠️ {med.caution}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="p-4 bg-muted/30 rounded-lg border border-border text-sm text-muted-foreground">
        <strong className="text-foreground">Disclaimer:</strong> This information is for general wellness guidance only and does not constitute medical advice. Always consult a healthcare professional for medical concerns. Do not use this app for emergency situations - call emergency services immediately if needed.
      </div>
    </div>
  );
};

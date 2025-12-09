import { useHealthStorage, VitalReading } from '@/hooks/useHealthStorage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Trash2, 
  Activity, 
  Thermometer,
  Heart,
  Gauge,
  Droplets,
  Wind,
  Droplet,
  Scale,
  Clock,
  TrendingUp,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { PersonalizedGuidance } from '@/components/guidance/PersonalizedGuidance';
import { VitalTrendAnalysis } from '@/components/health/VitalTrendAnalysis';

const getVitalIcon = (type: VitalReading['type']) => {
  switch (type) {
    case 'temperature': return Thermometer;
    case 'blood_pressure': return Gauge;
    case 'oxygen': return Droplets;
    case 'heart_rate': return Heart;
    case 'respiratory': return Wind;
    case 'glucose': return Droplet;
    case 'bmi': return Scale;
    default: return Activity;
  }
};

const getVitalColor = (type: VitalReading['type']) => {
  switch (type) {
    case 'temperature': return 'text-orange-400 bg-orange-500/20';
    case 'blood_pressure': return 'text-rose-400 bg-rose-500/20';
    case 'oxygen': return 'text-cyan-400 bg-cyan-500/20';
    case 'heart_rate': return 'text-red-400 bg-red-500/20';
    case 'respiratory': return 'text-sky-400 bg-sky-500/20';
    case 'glucose': return 'text-purple-400 bg-purple-500/20';
    case 'bmi': return 'text-emerald-400 bg-emerald-500/20';
    default: return 'text-primary bg-primary/20';
  }
};

const formatVitalValue = (vital: VitalReading) => {
  if (vital.type === 'blood_pressure') {
    const bp = vital.value as { systolic: number; diastolic: number };
    return `${bp.systolic}/${bp.diastolic}`;
  }
  if (vital.type === 'bmi') {
    const bmi = vital.value as { weight: number; height: number; bmi: number };
    return bmi.bmi.toFixed(1);
  }
  return vital.value.toString();
};

const HealthCardPage = () => {
  const { healthData, removeVital, removeSymptom, clearAll } = useHealthStorage();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Health Card</h1>
            <p className="text-muted-foreground">
              Your health history stored locally
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => {
            if (confirm('Clear all health data? This cannot be undone.')) {
              clearAll();
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Trend Analysis
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <VitalTrendAnalysis vitals={healthData.vitals} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Vitals history */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Vitals History (Last 10)</h3>
            {healthData.vitals.length > 0 ? (
              <div className="space-y-2">
                {healthData.vitals.slice(0, 10).map((vital) => {
                  const Icon = getVitalIcon(vital.type);
                  const colorClass = getVitalColor(vital.type);
                  return (
                    <div
                      key={vital.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', colorClass)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium capitalize text-sm">
                            {vital.type.replace('_', ' ')}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(vital.timestamp), 'MMM d, HH:mm')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-mono font-bold">
                            {formatVitalValue(vital)}
                          </div>
                          <div className="text-xs text-muted-foreground">{vital.unit}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeVital(vital.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No vitals recorded yet</p>
              </div>
            )}
          </Card>

          {/* Symptoms history */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Symptom History (Last 10)</h3>
            {healthData.symptoms.length > 0 ? (
              <div className="space-y-2">
                {healthData.symptoms.slice(0, 10).map((symptom) => (
                  <div
                    key={symptom.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{symptom.regionLabel}</div>
                        <div className="text-xs text-muted-foreground">
                          {symptom.layer} layer • Severity: {symptom.severity}/10
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(symptom.timestamp), 'MMM d, HH:mm')}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeSymptom(symptom.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No symptoms logged yet</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Personalized Guidance */}
      <PersonalizedGuidance />
    </div>
  );
};

export default HealthCardPage;

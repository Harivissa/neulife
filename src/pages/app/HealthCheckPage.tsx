import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Activity,
  Thermometer,
  Heart,
  Droplets,
  Wind,
  Gauge,
  Droplet,
  Info,
  RotateCcw,
  AlertCircle,
  Check,
  Stethoscope,
  User,
  UserRound,
  Layers,
  Eye,
  Scale,
  AlertTriangle,
  FileText,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { MiniECG } from '@/components/demo/MiniECG';
import { cn } from '@/lib/utils';
import { InteractiveBodyMap } from '@/components/InteractiveBodyMap';
import { RegionData } from '@/components/InteractiveBodyMap/types';
import { HolographicBodyMap, PainMarker, BodyView, mapToInternalZone, calculateInternalRisk } from '@/components/HolographicBodyMap';
import { PainPoint } from '@/components/TouchableBodyMap/types';
import { getAnatomicalZone, calculateRiskLevel } from '@/components/TouchableBodyMap/anatomicalZones';
import { useHealthStorage } from '@/hooks/useHealthStorage';
import { useMedicalHistory } from '@/hooks/useMedicalHistory';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface VitalReadings {
  temperature?: number;
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  spo2?: number;
  glucose?: number;
  respiratoryRate?: number;
  bmiWeight?: number;
  bmiHeight?: number;
}

interface TriageResult {
  level: 'green' | 'yellow' | 'orange' | 'red';
  title: string;
  explanation: string;
  advice: string[];
}

// What affects each reading
const readingFactors: Record<string, string[]> = {
  temperature: ['Stress', 'Time of day', 'Physical activity', 'Recent food/drinks', 'Environment'],
  bp: ['Stress', 'Caffeine', 'Physical activity', 'Full bladder', 'Posture'],
  heartRate: ['Stress', 'Caffeine', 'Physical activity', 'Medication', 'Sleep quality'],
  spo2: ['Altitude', 'Cold hands', 'Nail polish', 'Movement', 'Breathing pattern'],
  glucose: ['Recent meal', 'Stress', 'Medication', 'Physical activity', 'Sleep'],
  bmi: ['Muscle mass', 'Age', 'Bone density', 'Hydration'],
};

const HealthCheckPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addVital, addSymptom } = useHealthStorage();
  
  // State
  const [symptoms, setSymptoms] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [painSeverity, setPainSeverity] = useState(5);
  const [vitals, setVitals] = useState<VitalReadings>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [simpleTone, setSimpleTone] = useState(false);
  const [useRealisticBody, setUseRealisticBody] = useState(true);
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [painMarkers, setPainMarkers] = useState<PainMarker[]>([]);
  const [bodyGender, setBodyGender] = useState<'male' | 'female'>('male');
  const [bodyView, setBodyView] = useState<BodyView>('front');
  
  // Medical history hook
  const { savePainPoints, saveSymptoms, saveVitals, saveTriageResult } = useMedicalHistory();

  // Temperature helpers
  const getTemperatureStatus = (temp?: number) => {
    if (!temp) return null;
    if (temp < 97) return { label: simpleTone ? t('simple.low', 'A bit cold') : t('low'), color: 'text-blue-400', hint: 'Below normal - could be due to cold exposure or early morning measurement' };
    if (temp <= 99) return { label: simpleTone ? t('simple.normal', 'Looking good!') : t('normal'), color: 'text-emerald-400', hint: 'Normal body temperature range' };
    if (temp <= 100.4) return { label: simpleTone ? 'Slightly warm' : t('mildFever'), color: 'text-amber-400', hint: 'Slightly elevated - monitor and rest' };
    if (temp <= 103) return { label: simpleTone ? 'You have a fever' : t('fever'), color: 'text-orange-400', hint: 'Fever present - consider medication and hydration' };
    return { label: simpleTone ? 'High fever - please see a doctor' : t('highFever'), color: 'text-red-400', hint: 'High fever - seek medical attention if persistent' };
  };

  // BP helpers
  const getBPStatus = (sys?: number, dia?: number) => {
    if (!sys || !dia) return null;
    if (sys < 90 || dia < 60) return { label: simpleTone ? 'Your BP is low' : t('low'), color: 'text-blue-400', hint: 'Blood pressure is low - may cause dizziness' };
    if (sys <= 120 && dia <= 80) return { label: simpleTone ? 'Your BP looks good!' : t('normal'), color: 'text-emerald-400', hint: 'Healthy blood pressure range' };
    if (sys <= 129 && dia <= 80) return { label: simpleTone ? 'BP is a little high' : t('elevated'), color: 'text-amber-400', hint: 'Slightly elevated - lifestyle changes recommended' };
    if (sys <= 139 || dia <= 89) return { label: simpleTone ? 'BP is higher than usual' : 'High Stage 1', color: 'text-orange-400', hint: 'Stage 1 hypertension - consult a doctor' };
    return { label: simpleTone ? 'BP is quite high - see a doctor' : t('high'), color: 'text-red-400', hint: 'High blood pressure - medical attention recommended' };
  };

  // Heart rate helpers
  const getHRStatus = (hr?: number) => {
    if (!hr) return null;
    if (hr < 60) return { label: simpleTone ? 'Heart is beating slowly' : t('low'), color: 'text-blue-400', hint: 'Lower than typical - could be normal for athletes' };
    if (hr <= 100) return { label: simpleTone ? 'Heart rate is good!' : t('normal'), color: 'text-emerald-400', hint: 'Normal resting heart rate' };
    if (hr <= 120) return { label: simpleTone ? 'Heart is beating faster' : t('elevated'), color: 'text-amber-400', hint: 'Elevated - could be due to activity or stress' };
    return { label: simpleTone ? 'Heart is racing - try to rest' : t('high'), color: 'text-red-400', hint: 'High heart rate - rest and monitor' };
  };

  // SpO2 helpers
  const getSpO2Status = (spo2?: number) => {
    if (!spo2) return null;
    if (spo2 >= 95) return { label: simpleTone ? 'Oxygen level is great!' : t('normal'), color: 'text-emerald-400', hint: 'Healthy oxygen levels' };
    if (spo2 >= 90) return { label: simpleTone ? 'Oxygen is a bit low' : t('low'), color: 'text-amber-400', hint: 'Below normal - monitor closely' };
    return { label: simpleTone ? 'Oxygen very low - get help now' : t('critical'), color: 'text-red-400', hint: 'Very low - seek immediate medical attention' };
  };

  // Glucose helpers
  const getGlucoseStatus = (glucose?: number) => {
    if (!glucose) return null;
    if (glucose < 70) return { label: simpleTone ? 'Blood sugar is low - eat something' : t('low'), color: 'text-blue-400', hint: 'Low blood sugar - eat something sweet' };
    if (glucose <= 100) return { label: simpleTone ? 'Blood sugar is normal!' : 'Normal (Fasting)', color: 'text-emerald-400', hint: 'Normal fasting range' };
    if (glucose <= 125) return { label: simpleTone ? 'Sugar is slightly high' : 'Prediabetes Range', color: 'text-amber-400', hint: 'Slightly elevated - monitor diet' };
    if (glucose <= 180) return { label: simpleTone ? 'Sugar is high (may be after food)' : 'High (Post-meal)', color: 'text-orange-400', hint: 'Can be normal after eating' };
    return { label: simpleTone ? 'Sugar is very high - see a doctor' : t('veryHigh'), color: 'text-red-400', hint: 'High blood sugar - consult a doctor' };
  };

  // BMI calculation and status
  const calculateBMI = (weight?: number, height?: number) => {
    if (!weight || !height || height === 0) return null;
    return weight / Math.pow(height / 100, 2);
  };

  const getBMIStatus = (bmi: number | null) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: simpleTone ? 'You may be underweight' : t('underweight'), color: 'text-blue-400', hint: 'Below healthy weight range' };
    if (bmi < 25) return { label: simpleTone ? 'Weight is healthy!' : t('normal'), color: 'text-emerald-400', hint: 'Healthy weight range' };
    if (bmi < 30) return { label: simpleTone ? 'Weight is a bit high' : t('overweight'), color: 'text-amber-400', hint: 'Above healthy weight range' };
    if (bmi < 35) return { label: simpleTone ? 'Weight needs attention' : 'Obese Class I', color: 'text-orange-400', hint: 'Consider lifestyle changes' };
    return { label: simpleTone ? 'Weight is high - talk to a doctor' : 'Obese Class II+', color: 'text-red-400', hint: 'Health risks - consult a doctor' };
  };

  const currentBMI = calculateBMI(vitals.bmiWeight, vitals.bmiHeight);
  const bmiScalePos = currentBMI ? Math.min(100, Math.max(0, ((currentBMI - 15) / 25) * 100)) : 50;

  // Assessment confidence calculation
  const assessmentConfidence = useMemo(() => {
    let confidence = 0;
    
    // Symptom text adds 20%
    if (symptoms.trim().length > 10) confidence += 20;
    else if (symptoms.trim().length > 0) confidence += 10;
    
    // Body map selection adds 20%
    if (selectedRegion) confidence += 20;
    
    // Each vital adds up to 60% total (10% each for 6 vitals)
    if (vitals.temperature) confidence += 10;
    if (vitals.systolic && vitals.diastolic) confidence += 10;
    if (vitals.heartRate) confidence += 10;
    if (vitals.spo2) confidence += 10;
    if (vitals.glucose) confidence += 10;
    if (currentBMI) confidence += 10;
    
    return Math.min(100, confidence);
  }, [symptoms, selectedRegion, vitals, currentBMI]);

  // Recheck suggestion logic
  const showRecheckSuggestion = useMemo(() => {
    const temp = vitals.temperature;
    const sys = vitals.systolic;
    const dia = vitals.diastolic;
    const glucose = vitals.glucose;
    
    const borderlineTemp = temp && temp >= 99 && temp <= 100.4;
    const borderlineBP = sys && dia && ((sys >= 120 && sys <= 139) || (dia >= 80 && dia <= 89));
    const borderlineGlucose = glucose && glucose >= 100 && glucose <= 125;
    
    return borderlineTemp || borderlineBP || borderlineGlucose;
  }, [vitals]);

  // Live summary generation
  const liveSummary = useMemo(() => {
    const items: string[] = [];

    if (symptoms.trim()) {
      items.push(`You mentioned: "${symptoms.trim().substring(0, 100)}${symptoms.length > 100 ? '...' : ''}"`);
    }

    if (selectedRegion) {
      items.push(`Pain marked on: ${selectedRegion.regionLabel} (${selectedRegion.view} view, severity ${painSeverity}/10)`);
    }

    if (vitals.temperature) {
      const status = getTemperatureStatus(vitals.temperature);
      items.push(`Temperature: ${vitals.temperature}°F - ${status?.label}. ${status?.hint}`);
    }

    if (vitals.systolic && vitals.diastolic) {
      const status = getBPStatus(vitals.systolic, vitals.diastolic);
      items.push(`Blood Pressure: ${vitals.systolic}/${vitals.diastolic} mmHg - ${status?.label}. ${status?.hint}`);
    }

    if (vitals.heartRate) {
      const status = getHRStatus(vitals.heartRate);
      items.push(`Heart Rate: ${vitals.heartRate} BPM - ${status?.label}. ${status?.hint}`);
    }

    if (vitals.spo2) {
      const status = getSpO2Status(vitals.spo2);
      items.push(`Oxygen Level: ${vitals.spo2}% - ${status?.label}. ${status?.hint}`);
    }

    if (vitals.glucose) {
      const status = getGlucoseStatus(vitals.glucose);
      items.push(`Blood Sugar: ${vitals.glucose} mg/dL - ${status?.label}. ${status?.hint}`);
    }

    if (currentBMI) {
      const status = getBMIStatus(currentBMI);
      items.push(`BMI: ${currentBMI.toFixed(1)} kg/m² - ${status?.label}. ${status?.hint}`);
    }

    return items;
  }, [symptoms, selectedRegion, painSeverity, vitals, currentBMI, simpleTone]);

  // Doctor Summary data
  const doctorSummary = useMemo(() => {
    const summary: { label: string; value: string }[] = [];
    
    if (symptoms.trim()) {
      summary.push({ label: t('mainSymptom'), value: symptoms.trim().substring(0, 50) + (symptoms.length > 50 ? '...' : '') });
    }
    
    if (selectedRegion) {
      summary.push({ label: t('bodyAreaAffected'), value: `${selectedRegion.regionLabel} (${painSeverity}/10)` });
    }
    
    const readings: string[] = [];
    if (vitals.temperature) readings.push(`Temp: ${vitals.temperature}°F`);
    if (vitals.systolic && vitals.diastolic) readings.push(`BP: ${vitals.systolic}/${vitals.diastolic}`);
    if (vitals.heartRate) readings.push(`HR: ${vitals.heartRate}`);
    if (vitals.spo2) readings.push(`SpO2: ${vitals.spo2}%`);
    if (vitals.glucose) readings.push(`Sugar: ${vitals.glucose}`);
    
    if (readings.length > 0) {
      summary.push({ label: t('keyReadings'), value: readings.join(', ') });
    }
    
    return summary;
  }, [symptoms, selectedRegion, painSeverity, vitals, t]);

  const hasAnyData = symptoms.trim() || selectedRegion || Object.keys(vitals).length > 0;

  const handleRegionSelect = (region: RegionData) => {
    setSelectedRegion({ ...region, severity: painSeverity });
  };

  const handlePainPointsChange = (points: PainPoint[]) => {
    setPainPoints(points);
    // Also update selectedRegion for compatibility with existing triage
    if (points.length > 0) {
      const latestPoint = points[points.length - 1];
      setSelectedRegion({
        region: latestPoint.anatomicalZone.name,
        regionLabel: latestPoint.anatomicalZone.name,
        view: 'front',
        layer: 'skin',
        severity: latestPoint.severity,
        gender: bodyGender,
      });
      setPainSeverity(latestPoint.severity);
    } else {
      setSelectedRegion(null);
    }
  };

  const updateVital = (key: keyof VitalReadings, value: number | undefined) => {
    setVitals(prev => {
      if (value === undefined) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  };

  const resetVital = (key: keyof VitalReadings) => {
    updateVital(key, undefined);
  };

  const generateTriage = async () => {
    if (!hasAnyData) {
      toast.error('Please enter some symptoms or readings first');
      return;
    }

    setIsGenerating(true);

    try {
      // Save readings to health storage
      if (vitals.temperature) {
        addVital({ type: 'temperature', value: vitals.temperature, unit: '°F' });
      }
      if (vitals.systolic && vitals.diastolic) {
        addVital({ type: 'blood_pressure', value: { systolic: vitals.systolic, diastolic: vitals.diastolic }, unit: 'mmHg' });
      }
      if (vitals.heartRate) {
        addVital({ type: 'heart_rate', value: vitals.heartRate, unit: 'BPM' });
      }
      if (vitals.spo2) {
        addVital({ type: 'oxygen', value: vitals.spo2, unit: '%' });
      }
      if (vitals.glucose) {
        addVital({ type: 'glucose', value: vitals.glucose, unit: 'mg/dL' });
      }
      if (symptoms.trim()) {
        addSymptom({ 
          region: selectedRegion?.region || 'general', 
          regionLabel: selectedRegion?.regionLabel || 'General',
          layer: selectedRegion?.layer || 'skin',
          severity: painSeverity,
          notes: symptoms.trim(),
        });
      }

      const inputData = {
        symptoms: symptoms.trim(),
        bodyMap: selectedRegion ? { ...selectedRegion, severity: painSeverity } : null,
        vitals,
      };

      const { data, error } = await supabase.functions.invoke('medical-triage', {
        body: inputData,
      });

      if (error) throw error;

      // Parse AI response to determine triage level
      const response = data?.result || '';
      let level: 'green' | 'yellow' | 'orange' | 'red' = 'green';
      
      const lowerResponse = response.toLowerCase();
      if (lowerResponse.includes('urgent') || lowerResponse.includes('emergency') || lowerResponse.includes('immediately')) {
        level = 'red';
      } else if (lowerResponse.includes('consult') || lowerResponse.includes('doctor') || lowerResponse.includes('soon')) {
        level = 'orange';
      } else if (lowerResponse.includes('monitor') || lowerResponse.includes('watch') || lowerResponse.includes('observe')) {
        level = 'yellow';
      }

      const levelTitles = {
        green: t('likelySafe'),
        yellow: t('monitorRest'),
        orange: t('consultSoon'),
        red: t('urgentCare'),
      };

      setTriageResult({
        level,
        title: levelTitles[level],
        explanation: response,
        advice: [
          t('notDiagnosis'),
          t('readingsAffected'),
          t('ifWorsens'),
        ],
      });

      // Save assessment to database
      if (user) {
        await supabase.from('assessments').insert([{
          user_id: user.id,
          input_data: inputData as any,
          ai_result: { result: response, level } as any,
          triage_level: level,
          confidence: assessmentConfidence,
          easy_text: response,
        }]);
      }

      toast.success('Assessment completed!');
    } catch (error) {
      console.error('Triage error:', error);
      toast.error('Failed to generate assessment. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetAll = () => {
    setSymptoms('');
    setSelectedRegion(null);
    setPainSeverity(5);
    setVitals({});
    setTriageResult(null);
  };

  const triageLevelColors = {
    green: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
    yellow: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
    orange: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
    red: 'bg-red-500/20 border-red-500/50 text-red-400',
  };

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t('healthCheck')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('healthCheckSubtitle')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Tone Selector */}
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
              <Label htmlFor="tone-toggle" className="text-sm text-muted-foreground">
                {t('toneNormal')}
              </Label>
              <Switch
                id="tone-toggle"
                checked={simpleTone}
                onCheckedChange={setSimpleTone}
              />
              <Label htmlFor="tone-toggle" className="text-sm font-medium">
                {t('toneSimple')}
              </Label>
            </div>
            <Button variant="outline" size="sm" onClick={resetAll} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              {t('resetAll')}
            </Button>
          </div>
        </div>

        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Symptoms & Body Map */}
          <Card className="p-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-foreground">{t('symptomsAndPain')}</h2>
                <p className="text-xs text-muted-foreground">{t('describeFeeling')}</p>
              </div>
              <InfoTooltip text={t('gadgetInfoText')} />
            </div>

            {/* Symptom Input */}
            <div className="space-y-2">
              <Label>{t('whatExperiencing')}</Label>
              <Textarea
                placeholder={t('symptomPlaceholder')}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Pain Severity */}
            {selectedRegion && (
              <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label>{t('painSeverity')}</Label>
                  <Badge variant="outline" className="font-mono">{painSeverity}/10</Badge>
                </div>
                <Slider
                  value={[painSeverity]}
                  onValueChange={([v]) => setPainSeverity(v)}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('mild')}</span>
                  <span>{t('severe')}</span>
                </div>
              </div>
            )}

            {/* Body Map Toggle */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{t('bodyMap')}</Label>
                <div className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-lg">
                  <Label htmlFor="body-type-toggle" className="text-xs text-muted-foreground">
                    Basic
                  </Label>
                  <Switch
                    id="body-type-toggle"
                    checked={useRealisticBody}
                    onCheckedChange={setUseRealisticBody}
                  />
                  <Label htmlFor="body-type-toggle" className="text-xs font-medium">
                    Realistic
                  </Label>
                </div>
              </div>

              {useRealisticBody ? (
                <HolographicBodyMap
                  gender={bodyGender}
                  onGenderChange={setBodyGender}
                  painMarkers={painMarkers}
                  currentView={bodyView}
                  onViewChange={setBodyView}
                  onPainMarkerAdd={(marker) => {
                    const internalZone = mapToInternalZone(marker.x, marker.y, marker.view);
                    const internalRisk = calculateInternalRisk(internalZone, marker.severity);
                    const newMarker: PainMarker = {
                      id: crypto.randomUUID(),
                      x: marker.x,
                      y: marker.y,
                      severity: marker.severity,
                      view: marker.view,
                      timestamp: new Date(),
                      _internalZone: internalZone.name,
                      _internalRiskLevel: internalRisk,
                    };
                    setPainMarkers(prev => [...prev, newMarker]);
                    // Also sync to legacy painPoints for triage compatibility
                    const legacyZone = getAnatomicalZone(marker.x, marker.y);
                    const legacyRisk = calculateRiskLevel(legacyZone, marker.severity);
                    const legacyPoint: PainPoint = {
                      id: newMarker.id,
                      x: marker.x,
                      y: marker.y,
                      severity: marker.severity,
                      anatomicalZone: legacyZone,
                      riskLevel: legacyRisk,
                      timestamp: new Date(),
                    };
                    handlePainPointsChange([...painPoints, legacyPoint]);
                  }}
                  onPainMarkerRemove={(id) => {
                    setPainMarkers(prev => prev.filter(m => m.id !== id));
                    handlePainPointsChange(painPoints.filter(p => p.id !== id));
                  }}
                  onPainMarkerUpdate={(id, severity) => {
                    setPainMarkers(prev => prev.map(m => 
                      m.id === id ? { ...m, severity } : m
                    ));
                    const newPoints = painPoints.map(p => 
                      p.id === id 
                        ? { ...p, severity, riskLevel: calculateRiskLevel(p.anatomicalZone, severity) }
                        : p
                    );
                    handlePainPointsChange(newPoints);
                  }}
                />
              ) : (
                <InteractiveBodyMap
                  onRegionSelect={handleRegionSelect}
                  symptoms={symptoms}
                  className="bg-transparent border-0 p-0"
                />
              )}
            </div>
          </Card>

          {/* CENTER: Demo Gadgets */}
          <Card className="p-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{t('electronicHealthScan')}</h2>
                <p className="text-xs text-muted-foreground">{t('enterReadings')}</p>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-320px)] pr-2">
              <div className="space-y-4">
                {/* Thermometer */}
                <GadgetCard
                  icon={<Thermometer className="h-5 w-5 text-orange-400" />}
                  title={t('thermometer')}
                  hint={t('thermometerHint')}
                  iconBg="bg-orange-500/20"
                  factors={readingFactors.temperature}
                >
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      step="0.1"
                      min="95"
                      max="108"
                      placeholder="98.6"
                      value={vitals.temperature || ''}
                      onChange={(e) => updateVital('temperature', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="font-mono text-lg"
                    />
                    <span className="text-muted-foreground">°F</span>
                    <Button variant="ghost" size="icon" onClick={() => resetVital('temperature')}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  {vitals.temperature && (
                    <StatusBadge status={getTemperatureStatus(vitals.temperature)} />
                  )}
                </GadgetCard>

                {/* BP Machine */}
                <GadgetCard
                  icon={<Gauge className="h-5 w-5 text-rose-400" />}
                  title={t('bloodPressure')}
                  hint={t('bpHint')}
                  iconBg="bg-rose-500/20"
                  factors={readingFactors.bp}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">{t('systolic')}</Label>
                      <Input
                        type="number"
                        min="60"
                        max="250"
                        placeholder="120"
                        value={vitals.systolic || ''}
                        onChange={(e) => updateVital('systolic', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">{t('diastolic')}</Label>
                      <Input
                        type="number"
                        min="40"
                        max="150"
                        placeholder="80"
                        value={vitals.diastolic || ''}
                        onChange={(e) => updateVital('diastolic', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  {vitals.systolic && vitals.diastolic && (
                    <div className="flex items-center justify-between mt-2">
                      <StatusBadge status={getBPStatus(vitals.systolic, vitals.diastolic)} />
                      <span className="text-2xl font-mono font-bold text-foreground">
                        {vitals.systolic}/{vitals.diastolic}
                      </span>
                    </div>
                  )}
                </GadgetCard>

                {/* Heart Rate */}
                <GadgetCard
                  icon={<Heart className="h-5 w-5 text-rose-400" />}
                  title={t('heartRate')}
                  hint={t('heartRateHint')}
                  iconBg="bg-rose-500/20"
                  factors={readingFactors.heartRate}
                >
                  <div className="space-y-3">
                    <Slider
                      value={[vitals.heartRate || 72]}
                      onValueChange={([v]) => updateVital('heartRate', v)}
                      min={40}
                      max={180}
                      step={1}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">40 BPM</span>
                      <span className="text-2xl font-mono font-bold text-rose-400">
                        {vitals.heartRate || 72} <span className="text-sm">BPM</span>
                      </span>
                      <span className="text-xs text-muted-foreground">180 BPM</span>
                    </div>
                  </div>
                  {vitals.heartRate && (
                    <StatusBadge status={getHRStatus(vitals.heartRate)} />
                  )}
                </GadgetCard>

                {/* Oximeter */}
                <GadgetCard
                  icon={<Droplets className="h-5 w-5 text-cyan-400" />}
                  title={t('oxygenLevel')}
                  hint={t('oxygenHint')}
                  iconBg="bg-cyan-500/20"
                  factors={readingFactors.spo2}
                >
                  <div className="space-y-3">
                    <Slider
                      value={[vitals.spo2 || 98]}
                      onValueChange={([v]) => updateVital('spo2', v)}
                      min={70}
                      max={100}
                      step={1}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">70%</span>
                      <span className="text-3xl font-mono font-bold text-cyan-400">
                        {vitals.spo2 || 98}%
                      </span>
                      <span className="text-xs text-muted-foreground">100%</span>
                    </div>
                  </div>
                  {vitals.spo2 && (
                    <StatusBadge status={getSpO2Status(vitals.spo2)} />
                  )}
                </GadgetCard>

                {/* Glucose */}
                <GadgetCard
                  icon={<Droplet className="h-5 w-5 text-purple-400" />}
                  title={t('bloodSugar')}
                  hint={t('bloodSugarHint')}
                  iconBg="bg-purple-500/20"
                  factors={readingFactors.glucose}
                >
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min="20"
                      max="500"
                      placeholder="100"
                      value={vitals.glucose || ''}
                      onChange={(e) => updateVital('glucose', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="font-mono text-lg"
                    />
                    <span className="text-muted-foreground">mg/dL</span>
                    <Button variant="ghost" size="icon" onClick={() => resetVital('glucose')}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  {vitals.glucose && (
                    <StatusBadge status={getGlucoseStatus(vitals.glucose)} />
                  )}
                </GadgetCard>

                {/* Respiratory Rate */}
                <GadgetCard
                  icon={<Wind className="h-5 w-5 text-sky-400" />}
                  title={t('respiratoryRate')}
                  hint={t('respiratoryHint')}
                  iconBg="bg-sky-500/20"
                >
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min="8"
                      max="40"
                      placeholder="16"
                      value={vitals.respiratoryRate || ''}
                      onChange={(e) => updateVital('respiratoryRate', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="font-mono text-lg"
                    />
                    <span className="text-muted-foreground">breaths/min</span>
                  </div>
                </GadgetCard>

                {/* Mini ECG Monitor */}
                <div className="p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-border transition-colors">
                  <MiniECG heartRate={vitals.heartRate || 72} />
                </div>

                {/* BMI Calculator */}
                <GadgetCard
                  icon={<Scale className="h-5 w-5 text-emerald-400" />}
                  title={t('bmiCalculator')}
                  hint={t('bmiHint')}
                  iconBg="bg-emerald-500/20"
                  factors={readingFactors.bmi}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">{t('weight')}</Label>
                      <Input
                        type="number"
                        min="20"
                        max="300"
                        placeholder="70"
                        value={vitals.bmiWeight || ''}
                        onChange={(e) => updateVital('bmiWeight', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">{t('height')}</Label>
                      <Input
                        type="number"
                        min="100"
                        max="250"
                        placeholder="170"
                        value={vitals.bmiHeight || ''}
                        onChange={(e) => updateVital('bmiHeight', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  {currentBMI && (
                    <>
                      <div className="text-center py-3 bg-muted/50 rounded-lg mt-3">
                        <div className="text-3xl font-mono font-bold text-foreground">
                          {currentBMI.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">kg/m²</div>
                      </div>
                      
                      {/* BMI Scale */}
                      <div className="relative h-3 rounded-full overflow-hidden mt-3">
                        <div className="absolute inset-0 flex">
                          <div className="flex-1 bg-blue-400" />
                          <div className="flex-1 bg-emerald-400" />
                          <div className="flex-1 bg-amber-400" />
                          <div className="flex-1 bg-orange-400" />
                          <div className="flex-1 bg-red-400" />
                        </div>
                        <div
                          className="absolute top-0 h-full w-1 bg-foreground rounded-full shadow-lg transition-all duration-300"
                          style={{ left: `${bmiScalePos}%`, transform: 'translateX(-50%)' }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>15</span>
                        <span>18.5</span>
                        <span>25</span>
                        <span>30</span>
                        <span>40</span>
                      </div>
                      
                      <StatusBadge status={getBMIStatus(currentBMI)} />
                    </>
                  )}
                </GadgetCard>
              </div>
            </ScrollArea>
          </Card>

          {/* RIGHT: Live Summary */}
          <Card className="p-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{t('liveHealthSummary')}</h2>
                <p className="text-xs text-muted-foreground">{t('realTimeAnalysis')}</p>
              </div>
            </div>

            {/* Assessment Confidence Meter */}
            <div className="p-3 bg-muted/30 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('assessmentConfidence')}</span>
                <span className="text-sm font-mono font-bold text-primary">{assessmentConfidence}%</span>
              </div>
              <Progress value={assessmentConfidence} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {assessmentConfidence < 30 && 'Add more symptoms or readings for better accuracy'}
                {assessmentConfidence >= 30 && assessmentConfidence < 60 && 'Good start! More data helps'}
                {assessmentConfidence >= 60 && assessmentConfidence < 80 && 'Good amount of data collected'}
                {assessmentConfidence >= 80 && 'Excellent! Comprehensive data for assessment'}
              </p>
            </div>

            {/* Recheck Suggestion */}
            {showRecheckSuggestion && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {t('recheckSuggestion')}
                </p>
              </div>
            )}

            <ScrollArea className="h-[200px]">
              {liveSummary.length > 0 ? (
                <div className="space-y-3">
                  {liveSummary.map((item, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg text-sm text-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                  <p>{t('noDataYet')}</p>
                  <p className="text-xs mt-1">{t('startByDescribing')}</p>
                </div>
              )}
            </ScrollArea>

            {/* Doctor Summary Box */}
            {doctorSummary.length > 0 && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <FileText className="h-4 w-4" />
                  <span>{t('doctorSummary')}</span>
                </div>
                <div className="space-y-1 text-sm">
                  {doctorSummary.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span><strong>{item.label}:</strong> {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={generateTriage}
                disabled={!hasAnyData || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Activity className="h-5 w-5 animate-spin" />
                    {t('analyzing')}
                  </>
                ) : (
                  <>
                    <Stethoscope className="h-5 w-5" />
                    {t('generateTriage')}
                  </>
                )}
              </Button>
            </div>

            {/* Triage Result */}
            {triageResult && (
              <div className={cn(
                'p-4 rounded-lg border-2 space-y-3 animate-fade-in',
                triageLevelColors[triageResult.level]
              )}>
                <div className="flex items-center gap-3">
                  <Badge className={cn('text-sm', triageLevelColors[triageResult.level])}>
                    {triageResult.level.toUpperCase()}
                  </Badge>
                  <span className="font-semibold">{triageResult.title}</span>
                </div>
                
                <p className="text-sm text-foreground/90">{triageResult.explanation}</p>
                
                <div className="space-y-2 pt-2 border-t border-current/20">
                  {triageResult.advice.map((advice, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{advice}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Trust Banner */}
        <div className="flex items-center justify-center gap-2 py-4 px-6 bg-primary/5 border border-primary/20 rounded-lg">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">{t('trustBanner')}</p>
        </div>
      </div>
    </div>
  );
};

// Info Tooltip Component
const InfoTooltip = ({ text }: { text: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button className="p-1 rounded-full hover:bg-muted transition-colors">
        <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
      </button>
    </TooltipTrigger>
    <TooltipContent side="left" className="max-w-[200px]">
      <p className="text-xs">{text}</p>
    </TooltipContent>
  </Tooltip>
);

// Gadget Card Component
const GadgetCard = ({ 
  icon, 
  title, 
  hint, 
  iconBg, 
  factors,
  children 
}: { 
  icon: React.ReactNode; 
  title: string; 
  hint: string; 
  iconBg: string; 
  factors?: string[];
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 bg-muted/30 rounded-xl space-y-3 border border-border/50 hover:border-border transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center', iconBg)}>
            {icon}
          </div>
          <span className="font-medium text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded-full hover:bg-muted transition-colors">
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px]">
              <p className="text-xs">{hint}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {children}
      
      {/* What affects this reading */}
      {factors && factors.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="h-3 w-3" />
              <span>{t('whatAffectsReading')}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-48 p-2">
            <div className="flex flex-wrap gap-1">
              {factors.map((factor, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {factor}
                </Badge>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: { label: string; color: string; hint: string } | null }) => {
  if (!status) return null;
  return (
    <Badge variant="outline" className={cn('mt-2', status.color)}>
      {status.label}
    </Badge>
  );
};

export default HealthCheckPage;

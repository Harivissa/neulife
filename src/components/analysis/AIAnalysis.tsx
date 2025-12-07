import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Brain, AlertCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VitalReading, SymptomEntry } from '@/hooks/useHealthStorage';
import { cn } from '@/lib/utils';

interface AIAnalysisProps {
  vitals: VitalReading[];
  symptoms: SymptomEntry[];
  additionalSymptoms?: string;
}

interface AnalysisResult {
  summary: string;
  riskLevel: 'green' | 'yellow' | 'orange' | 'red';
  riskLabel: string;
  vitalInterpretations: string[];
  patterns: string[];
  recommendations: string[];
  safetyQuestions?: string[];
}

export const AIAnalysis = ({ vitals, symptoms, additionalSymptoms }: AIAnalysisProps) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const formatVitals = () => {
    const latest: Record<string, any> = {};
    
    vitals.forEach((v) => {
      if (!latest[v.type]) {
        latest[v.type] = v;
      }
    });

    return Object.entries(latest).map(([type, reading]) => {
      if (type === 'blood_pressure') {
        const bp = reading.value as { systolic: number; diastolic: number };
        return `Blood Pressure: ${bp.systolic}/${bp.diastolic} mmHg`;
      }
      if (type === 'bmi') {
        const bmi = reading.value as { weight: number; height: number; bmi: number };
        return `BMI: ${bmi.bmi.toFixed(1)} kg/m² (Weight: ${bmi.weight}kg, Height: ${bmi.height}cm)`;
      }
      return `${type.replace('_', ' ')}: ${reading.value} ${reading.unit}`;
    }).join('\n');
  };

  const formatSymptoms = () => {
    return symptoms.map((s) => `${s.regionLabel} (${s.layer} layer) - Severity: ${s.severity}/10`).join('\n');
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const vitalsSummary = formatVitals();
      const symptomsSummary = formatSymptoms();

      const prompt = `You are a medical AI triage assistant. Analyze the following health data and provide a structured assessment.

VITALS:
${vitalsSummary || 'No vitals recorded'}

BODY MAP SYMPTOMS:
${symptomsSummary || 'No body map symptoms'}

ADDITIONAL SYMPTOMS:
${additionalSymptoms || 'None described'}

Provide your response in the following JSON format ONLY (no other text):
{
  "summary": "Brief health summary in 2-3 sentences",
  "riskLevel": "green" | "yellow" | "orange" | "red",
  "riskLabel": "Label for the risk level (e.g., 'Low Risk', 'Moderate Concern', etc.)",
  "vitalInterpretations": ["Interpretation of each vital sign"],
  "patterns": ["Any patterns detected in the data"],
  "recommendations": ["Personalized recommendations"],
  "safetyQuestions": ["Follow-up questions if risk is moderate or higher"]
}

Risk level guide:
- green: Normal/healthy, no concerns
- yellow: Minor concerns, monitor
- orange: Moderate concerns, consider medical advice
- red: Serious concerns, seek medical attention`;

      const { data, error } = await supabase.functions.invoke('medical-triage', {
        body: { symptoms: prompt, isAnalysis: true },
      });

      if (error) throw error;

      // Parse the response
      try {
        const jsonMatch = data.triage?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setResult(parsed);
        } else {
          // Fallback parsing
          setResult({
            summary: data.triage || 'Analysis complete',
            riskLevel: 'yellow',
            riskLabel: 'Analysis Complete',
            vitalInterpretations: [],
            patterns: [],
            recommendations: ['Please review the full assessment'],
          });
        }
      } catch {
        setResult({
          summary: data.triage || 'Analysis complete',
          riskLevel: 'yellow',
          riskLabel: 'Analysis Complete',
          vitalInterpretations: [],
          patterns: [],
          recommendations: [],
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to run analysis');
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = () => {
    switch (result?.riskLevel) {
      case 'green':
        return <CheckCircle className="h-8 w-8 text-secondary" />;
      case 'yellow':
        return <AlertCircle className="h-8 w-8 text-amber-400" />;
      case 'orange':
        return <AlertTriangle className="h-8 w-8 text-orange-400" />;
      case 'red':
        return <XCircle className="h-8 w-8 text-destructive" />;
      default:
        return null;
    }
  };

  const getRiskColor = () => {
    switch (result?.riskLevel) {
      case 'green':
        return 'bg-secondary/20 border-secondary/50';
      case 'yellow':
        return 'bg-amber-500/20 border-amber-500/50';
      case 'orange':
        return 'bg-orange-500/20 border-orange-500/50';
      case 'red':
        return 'bg-destructive/20 border-destructive/50';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI Health Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Analyze your vitals and symptoms
            </p>
          </div>
        </div>
        <Button onClick={runAnalysis} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Run Analysis'
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Risk indicator */}
          <div className={cn('p-4 rounded-lg border flex items-center gap-4', getRiskColor())}>
            {getRiskIcon()}
            <div>
              <div className="font-semibold">{result.riskLabel}</div>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </div>
          </div>

          {/* Vital interpretations */}
          {result.vitalInterpretations?.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Vital Signs Interpretation</h4>
              <ul className="space-y-1 text-sm">
                {result.vitalInterpretations.map((interp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {interp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Patterns */}
          {result.patterns?.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Patterns Detected</h4>
              <ul className="space-y-1 text-sm">
                {result.patterns.map((pattern, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-secondary">•</span>
                    {pattern}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations?.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Recommendations</h4>
              <ul className="space-y-1 text-sm">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety questions */}
          {result.safetyQuestions?.length > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                Follow-up Questions
              </h4>
              <ul className="space-y-1 text-sm">
                {result.safetyQuestions.map((q, i) => (
                  <li key={i}>{i + 1}. {q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Record vitals and symptoms, then run analysis</p>
        </div>
      )}
    </Card>
  );
};

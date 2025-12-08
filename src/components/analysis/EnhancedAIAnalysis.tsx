import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Brain, AlertCircle, CheckCircle, AlertTriangle, XCircle, Sparkles, Gauge } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VitalReading, SymptomEntry } from '@/hooks/useHealthStorage';
import { cn } from '@/lib/utils';
import { ClarifyingQuestions, ClarifyingQuestion, generateClarifyingQuestions } from './ClarifyingQuestions';
import { analyzeMultiSignalFusion, FusionResult } from './MultiSignalFusion';

interface EnhancedAIAnalysisProps {
  vitals: VitalReading[];
  symptoms: SymptomEntry[];
  additionalSymptoms?: string;
  gender?: string;
}

interface AnalysisResult {
  summary: string;
  riskLevel: 'green' | 'yellow' | 'orange' | 'red';
  riskLabel: string;
  vitalInterpretations: string[];
  patterns: string[];
  recommendations: string[];
  safetyQuestions?: string[];
  doctorSummary?: string;
}

export const EnhancedAIAnalysis = ({ vitals, symptoms, additionalSymptoms = '', gender = 'unknown' }: EnhancedAIAnalysisProps) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showClarifyingQuestions, setShowClarifyingQuestions] = useState(false);
  const [clarifyingAnswers, setClarifyingAnswers] = useState<Record<string, string>>({});
  const [fusionResult, setFusionResult] = useState<FusionResult | null>(null);

  // Run multi-signal fusion analysis
  const runFusionAnalysis = useMemo(() => {
    if (vitals.length === 0 && symptoms.length === 0 && !additionalSymptoms) {
      return null;
    }
    return analyzeMultiSignalFusion(vitals, symptoms, additionalSymptoms);
  }, [vitals, symptoms, additionalSymptoms]);

  // Generate clarifying questions based on current data
  const clarifyingQuestions = useMemo(() => {
    if (symptoms.length === 0) return [];
    const latestSymptom = symptoms[0];
    return generateClarifyingQuestions(
      latestSymptom.region,
      gender,
      latestSymptom.severity,
      vitals
    );
  }, [symptoms, gender, vitals]);

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

  const formatClarifyingAnswers = () => {
    return Object.entries(clarifyingAnswers)
      .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
      .join('\n\n');
  };

  const handleStartAnalysis = () => {
    // Check if clarifying questions are needed
    if (runFusionAnalysis?.requiresClarification && clarifyingQuestions.length > 0 && Object.keys(clarifyingAnswers).length === 0) {
      setFusionResult(runFusionAnalysis);
      setShowClarifyingQuestions(true);
      return;
    }
    
    runAnalysis();
  };

  const handleClarifyingComplete = (answers: Record<string, string>) => {
    setClarifyingAnswers(answers);
    setShowClarifyingQuestions(false);
    runAnalysis(answers);
  };

  const handleSkipClarifying = () => {
    setShowClarifyingQuestions(false);
    runAnalysis();
  };

  const runAnalysis = async (answers?: Record<string, string>) => {
    setLoading(true);
    try {
      const vitalsSummary = formatVitals();
      const symptomsSummary = formatSymptoms();
      const answersFormatted = answers ? formatClarifyingAnswers() : '';

      const fusionInsights = runFusionAnalysis
        ? `\nMULTI-SIGNAL FUSION ANALYSIS:\n- Risk Score: ${runFusionAnalysis.riskScore}/100\n- Primary Concerns: ${runFusionAnalysis.primaryConcerns.join(', ') || 'None identified'}\n- Patterns: ${runFusionAnalysis.patterns.join(', ') || 'None detected'}`
        : '';

      const prompt = `You are a medical AI triage assistant. Analyze the following health data and provide a structured assessment.

PATIENT INFO:
Gender: ${gender}

VITALS:
${vitalsSummary || 'No vitals recorded'}

BODY MAP SYMPTOMS:
${symptomsSummary || 'No body map symptoms'}

ADDITIONAL SYMPTOMS:
${additionalSymptoms || 'None described'}

${answersFormatted ? `CLARIFYING QUESTION RESPONSES:\n${answersFormatted}` : ''}
${fusionInsights}

Provide your response in the following JSON format ONLY (no other text):
{
  "summary": "Brief health summary in 2-3 sentences",
  "riskLevel": "green" | "yellow" | "orange" | "red",
  "riskLabel": "Label for the risk level (e.g., 'Low Risk', 'Moderate Concern', etc.)",
  "vitalInterpretations": ["Interpretation of each vital sign"],
  "patterns": ["Any patterns detected in the data"],
  "recommendations": ["Personalized recommendations - non-diagnostic, supportive guidance"],
  "safetyQuestions": ["Follow-up questions if risk is moderate or higher"],
  "doctorSummary": "A brief professional summary suitable for sharing with a healthcare provider"
}

IMPORTANT RULES:
- Never provide medical diagnosis
- Use calm, supportive language
- For red risk level, recommend seeking medical attention without causing panic
- Focus on actionable, safe guidance
- Consider all multi-signal patterns when assessing risk`;

      const { data, error } = await supabase.functions.invoke('medical-triage', {
        body: { symptoms: prompt, isAnalysis: true },
      });

      if (error) throw error;

      try {
        const jsonMatch = data.triage?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setResult(parsed);
        } else {
          setResult({
            summary: data.triage || 'Analysis complete',
            riskLevel: runFusionAnalysis?.riskLevel || 'yellow',
            riskLabel: 'Analysis Complete',
            vitalInterpretations: [],
            patterns: [],
            recommendations: ['Please review the full assessment'],
          });
        }
      } catch {
        setResult({
          summary: data.triage || 'Analysis complete',
          riskLevel: runFusionAnalysis?.riskLevel || 'yellow',
          riskLabel: 'Analysis Complete',
          vitalInterpretations: [],
          patterns: [],
          recommendations: [],
        });
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Failed to run analysis');
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = () => {
    const level = result?.riskLevel || fusionResult?.riskLevel;
    switch (level) {
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
    const level = result?.riskLevel || fusionResult?.riskLevel;
    switch (level) {
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

  // Show clarifying questions if needed
  if (showClarifyingQuestions && clarifyingQuestions.length > 0) {
    return (
      <div className="space-y-4">
        {fusionResult && (
          <Card className={cn('p-4 border', getRiskColor())}>
            <div className="flex items-center gap-3">
              <Gauge className="h-5 w-5" />
              <div>
                <div className="font-medium">Pre-Analysis Risk Score: {fusionResult.riskScore}/100</div>
                <p className="text-sm text-muted-foreground">
                  {fusionResult.clarificationReason}
                </p>
              </div>
            </div>
          </Card>
        )}
        <ClarifyingQuestions
          questions={clarifyingQuestions}
          onComplete={handleClarifyingComplete}
          onSkip={handleSkipClarifying}
        />
      </div>
    );
  }

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
              Multi-signal fusion analysis
            </p>
          </div>
        </div>
        <Button onClick={handleStartAnalysis} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Run Analysis
            </>
          )}
        </Button>
      </div>

      {/* Pre-analysis fusion preview */}
      {!result && runFusionAnalysis && (
        <div className={cn('p-4 rounded-lg border', getRiskColor())}>
          <div className="flex items-center gap-3 mb-2">
            <Gauge className="h-5 w-5" />
            <span className="font-medium">Pre-Analysis Score: {runFusionAnalysis.riskScore}/100</span>
          </div>
          {runFusionAnalysis.primaryConcerns.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Detected signals: {runFusionAnalysis.primaryConcerns.join(', ')}
            </div>
          )}
        </div>
      )}

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

          {/* Doctor Summary */}
          {result.doctorSummary && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium mb-2">Healthcare Provider Summary</h4>
              <p className="text-sm">{result.doctorSummary}</p>
            </div>
          )}
        </div>
      )}

      {!result && !loading && !runFusionAnalysis && (
        <div className="text-center py-8 text-muted-foreground">
          <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Record vitals and symptoms, then run analysis</p>
        </div>
      )}
    </Card>
  );
};

import { VitalReading, SymptomEntry } from '@/hooks/useHealthStorage';

export interface FusionResult {
  riskLevel: 'green' | 'yellow' | 'orange' | 'red';
  riskScore: number;
  primaryConcerns: string[];
  patterns: string[];
  fusionInsights: string[];
  requiresClarification: boolean;
  clarificationReason?: string;
}

interface VitalValues {
  temperature?: number;
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  oxygen?: number;
  respiratory?: number;
  glucose?: number;
  bmi?: number;
}

export const analyzeMultiSignalFusion = (
  vitals: VitalReading[],
  symptoms: SymptomEntry[],
  additionalSymptoms: string
): FusionResult => {
  const concerns: string[] = [];
  const patterns: string[] = [];
  const insights: string[] = [];
  let riskScore = 0;

  // Extract latest vital values
  const vitalValues: VitalValues = {};
  
  vitals.forEach(v => {
    if (!vitalValues[v.type as keyof VitalValues]) {
      if (v.type === 'blood_pressure') {
        const bp = v.value as { systolic: number; diastolic: number };
        vitalValues.systolic = bp.systolic;
        vitalValues.diastolic = bp.diastolic;
      } else if (v.type === 'bmi') {
        const bmi = v.value as { bmi: number };
        vitalValues.bmi = bmi.bmi;
      } else if (v.type === 'temperature') {
        vitalValues.temperature = v.value as number;
      } else if (v.type === 'heart_rate') {
        vitalValues.heartRate = v.value as number;
      } else if (v.type === 'oxygen') {
        vitalValues.oxygen = v.value as number;
      } else if (v.type === 'respiratory') {
        vitalValues.respiratory = v.value as number;
      } else if (v.type === 'glucose') {
        vitalValues.glucose = v.value as number;
      }
    }
  });

  // Check for symptom regions
  const hasChestSymptoms = symptoms.some(s => 
    s.region.toLowerCase().includes('chest') || 
    s.regionLabel.toLowerCase().includes('chest')
  );
  const hasAbdominalSymptoms = symptoms.some(s => 
    s.region.toLowerCase().includes('abdomen') || 
    s.regionLabel.toLowerCase().includes('abdomen')
  );
  const hasHeadSymptoms = symptoms.some(s => 
    s.region.toLowerCase().includes('head') || 
    s.regionLabel.toLowerCase().includes('head')
  );
  const highSeveritySymptom = symptoms.some(s => s.severity >= 7);

  // Multi-signal fusion rules

  // Rule 1: Chest pain + high BP + high HR = Cardiac concern
  if (hasChestSymptoms && vitalValues.systolic && vitalValues.systolic > 140 && vitalValues.heartRate && vitalValues.heartRate > 100) {
    concerns.push('Elevated cardiovascular indicators with chest symptoms');
    patterns.push('Chest discomfort combined with hypertension and tachycardia');
    insights.push('Multiple cardiovascular signals detected - clarifying questions recommended before assessment');
    riskScore += 40;
  }

  // Rule 2: Fever + respiratory symptoms
  if (vitalValues.temperature && vitalValues.temperature > 100.4) {
    riskScore += 15;
    if (vitalValues.oxygen && vitalValues.oxygen < 95) {
      concerns.push('Fever with reduced oxygen saturation');
      patterns.push('Temperature elevation with respiratory compromise');
      riskScore += 25;
    }
    if (vitalValues.respiratory && vitalValues.respiratory > 20) {
      insights.push('Elevated respiratory rate with fever may indicate infection');
      riskScore += 10;
    }
  }

  // Rule 3: Low oxygen saturation
  if (vitalValues.oxygen) {
    if (vitalValues.oxygen < 90) {
      concerns.push('Critically low oxygen saturation');
      riskScore += 50;
    } else if (vitalValues.oxygen < 94) {
      concerns.push('Below-normal oxygen levels');
      riskScore += 20;
    }
  }

  // Rule 4: Blood pressure assessment
  if (vitalValues.systolic) {
    if (vitalValues.systolic >= 180 || (vitalValues.diastolic && vitalValues.diastolic >= 120)) {
      concerns.push('Severely elevated blood pressure');
      riskScore += 35;
    } else if (vitalValues.systolic >= 140 || (vitalValues.diastolic && vitalValues.diastolic >= 90)) {
      patterns.push('Blood pressure above normal range');
      riskScore += 15;
    }
  }

  // Rule 5: Heart rate extremes
  if (vitalValues.heartRate) {
    if (vitalValues.heartRate > 120) {
      concerns.push('Significantly elevated heart rate');
      riskScore += 20;
    } else if (vitalValues.heartRate < 50) {
      concerns.push('Unusually low heart rate');
      riskScore += 20;
    }
  }

  // Rule 6: Blood glucose
  if (vitalValues.glucose) {
    if (vitalValues.glucose > 300) {
      concerns.push('Severely elevated blood glucose');
      riskScore += 30;
    } else if (vitalValues.glucose > 180) {
      patterns.push('Elevated blood glucose levels');
      riskScore += 15;
    } else if (vitalValues.glucose < 70) {
      concerns.push('Low blood glucose');
      riskScore += 25;
    }
  }

  // Rule 7: Head symptoms with high BP
  if (hasHeadSymptoms && vitalValues.systolic && vitalValues.systolic > 160) {
    concerns.push('Head symptoms with significantly elevated blood pressure');
    patterns.push('Potential hypertensive headache pattern');
    riskScore += 20;
  }

  // Rule 8: High severity symptom
  if (highSeveritySymptom) {
    insights.push('High severity symptom reported - detailed assessment recommended');
    riskScore += 15;
  }

  // Rule 9: Abdominal + fever combination
  if (hasAbdominalSymptoms && vitalValues.temperature && vitalValues.temperature > 100.4) {
    patterns.push('Abdominal symptoms with fever may indicate infection');
    riskScore += 15;
  }

  // Analyze additional symptoms text
  const symptomsLower = additionalSymptoms.toLowerCase();
  if (symptomsLower.includes('radiating') || symptomsLower.includes('spreading')) {
    insights.push('Radiating pain pattern detected - may need nerve assessment');
    riskScore += 10;
  }
  if (symptomsLower.includes('sudden') || symptomsLower.includes('abrupt')) {
    patterns.push('Sudden onset symptoms reported');
    riskScore += 10;
  }
  if (symptomsLower.includes('dizzy') || symptomsLower.includes('lightheaded')) {
    patterns.push('Dizziness/lightheadedness reported');
    riskScore += 10;
  }

  // Calculate risk level
  let riskLevel: 'green' | 'yellow' | 'orange' | 'red';
  if (riskScore >= 60) {
    riskLevel = 'red';
  } else if (riskScore >= 40) {
    riskLevel = 'orange';
  } else if (riskScore >= 20) {
    riskLevel = 'yellow';
  } else {
    riskLevel = 'green';
  }

  // Determine if clarification is needed
  const requiresClarification = riskScore >= 30 && concerns.length > 0;
  const clarificationReason = requiresClarification
    ? `Multiple concerning signals detected. Clarifying questions will help provide safer guidance.`
    : undefined;

  return {
    riskLevel,
    riskScore: Math.min(100, riskScore),
    primaryConcerns: concerns,
    patterns,
    fusionInsights: insights,
    requiresClarification,
    clarificationReason,
  };
};

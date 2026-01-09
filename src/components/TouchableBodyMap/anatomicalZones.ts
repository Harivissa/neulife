import { AnatomicalZone } from './types';

// Anatomical zones mapped by approximate coordinate ranges (as percentages)
// Format: { xMin, xMax, yMin, yMax }
interface ZoneBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

interface ZoneDefinition {
  bounds: ZoneBounds;
  zone: AnatomicalZone;
}

// Critical zones that require immediate attention
export const criticalZones: AnatomicalZone[] = [
  {
    id: 'chest-center',
    name: 'Chest (Heart Area)',
    riskLevel: 'critical',
    clarifyingQuestions: [
      'Is the pain sharp or dull?',
      'Does it spread to your arm, jaw, or back?',
      'Are you having difficulty breathing?',
      'Do you feel nauseous or sweaty?',
      'When did the pain start?'
    ]
  },
  {
    id: 'chest-left',
    name: 'Left Chest',
    riskLevel: 'critical',
    clarifyingQuestions: [
      'Is the pain getting worse?',
      'Does it feel like pressure or squeezing?',
      'Are you feeling dizzy or lightheaded?'
    ]
  },
  {
    id: 'head-front',
    name: 'Head (Front)',
    riskLevel: 'high',
    clarifyingQuestions: [
      'Is this the worst headache of your life?',
      'Do you have any vision changes?',
      'Any weakness or numbness?',
      'Did the headache start suddenly?'
    ]
  },
  {
    id: 'abdomen-upper',
    name: 'Upper Abdomen',
    riskLevel: 'high',
    clarifyingQuestions: [
      'Is the pain constant or comes and goes?',
      'Have you vomited?',
      'Is there any blood in your stool or vomit?'
    ]
  },
  {
    id: 'neck',
    name: 'Neck',
    riskLevel: 'high',
    clarifyingQuestions: [
      'Is your neck stiff?',
      'Do you have a fever?',
      'Any recent injury?'
    ]
  }
];

// Zone definitions with coordinate bounds
export const zoneDefinitions: ZoneDefinition[] = [
  // Head
  {
    bounds: { xMin: 35, xMax: 65, yMin: 0, yMax: 12 },
    zone: { id: 'head-top', name: 'Top of Head', riskLevel: 'medium' }
  },
  {
    bounds: { xMin: 35, xMax: 65, yMin: 12, yMax: 18 },
    zone: criticalZones.find(z => z.id === 'head-front')!
  },
  // Neck
  {
    bounds: { xMin: 40, xMax: 60, yMin: 18, yMax: 22 },
    zone: criticalZones.find(z => z.id === 'neck')!
  },
  // Shoulders
  {
    bounds: { xMin: 15, xMax: 35, yMin: 20, yMax: 28 },
    zone: { id: 'shoulder-left', name: 'Left Shoulder', riskLevel: 'low' }
  },
  {
    bounds: { xMin: 65, xMax: 85, yMin: 20, yMax: 28 },
    zone: { id: 'shoulder-right', name: 'Right Shoulder', riskLevel: 'low' }
  },
  // Chest - CRITICAL
  {
    bounds: { xMin: 35, xMax: 50, yMin: 22, yMax: 35 },
    zone: criticalZones.find(z => z.id === 'chest-left')!
  },
  {
    bounds: { xMin: 45, xMax: 55, yMin: 22, yMax: 35 },
    zone: criticalZones.find(z => z.id === 'chest-center')!
  },
  {
    bounds: { xMin: 50, xMax: 65, yMin: 22, yMax: 35 },
    zone: { id: 'chest-right', name: 'Right Chest', riskLevel: 'high', clarifyingQuestions: ['Any difficulty breathing?', 'Any coughing?'] }
  },
  // Upper arms
  {
    bounds: { xMin: 5, xMax: 20, yMin: 28, yMax: 42 },
    zone: { id: 'upper-arm-left', name: 'Left Upper Arm', riskLevel: 'low' }
  },
  {
    bounds: { xMin: 80, xMax: 95, yMin: 28, yMax: 42 },
    zone: { id: 'upper-arm-right', name: 'Right Upper Arm', riskLevel: 'low' }
  },
  // Abdomen - HIGH RISK
  {
    bounds: { xMin: 35, xMax: 65, yMin: 35, yMax: 45 },
    zone: criticalZones.find(z => z.id === 'abdomen-upper')!
  },
  {
    bounds: { xMin: 35, xMax: 65, yMin: 45, yMax: 55 },
    zone: { 
      id: 'abdomen-lower', 
      name: 'Lower Abdomen', 
      riskLevel: 'medium',
      clarifyingQuestions: ['Any changes in bowel movements?', 'Any urinary symptoms?', 'For women: Could you be pregnant?']
    }
  },
  // Lower back
  {
    bounds: { xMin: 35, xMax: 65, yMin: 40, yMax: 50 },
    zone: { 
      id: 'lower-back', 
      name: 'Lower Back (Lumbar)', 
      riskLevel: 'medium',
      clarifyingQuestions: ['Does the pain radiate down your leg?', 'Any numbness or tingling?', 'Any loss of bladder/bowel control?']
    }
  },
  // Forearms
  {
    bounds: { xMin: 0, xMax: 15, yMin: 42, yMax: 55 },
    zone: { id: 'forearm-left', name: 'Left Forearm', riskLevel: 'low' }
  },
  {
    bounds: { xMin: 85, xMax: 100, yMin: 42, yMax: 55 },
    zone: { id: 'forearm-right', name: 'Right Forearm', riskLevel: 'low' }
  },
  // Hands
  {
    bounds: { xMin: 0, xMax: 12, yMin: 55, yMax: 65 },
    zone: { id: 'hand-left', name: 'Left Hand', riskLevel: 'low' }
  },
  {
    bounds: { xMin: 88, xMax: 100, yMin: 55, yMax: 65 },
    zone: { id: 'hand-right', name: 'Right Hand', riskLevel: 'low' }
  },
  // Pelvis/Hip
  {
    bounds: { xMin: 25, xMax: 45, yMin: 52, yMax: 60 },
    zone: { id: 'hip-left', name: 'Left Hip', riskLevel: 'low' }
  },
  {
    bounds: { xMin: 55, xMax: 75, yMin: 52, yMax: 60 },
    zone: { id: 'hip-right', name: 'Right Hip', riskLevel: 'low' }
  },
  // Thighs
  {
    bounds: { xMin: 28, xMax: 45, yMin: 60, yMax: 75 },
    zone: { id: 'thigh-left', name: 'Left Thigh', riskLevel: 'low' }
  },
  {
    bounds: { xMin: 55, xMax: 72, yMin: 60, yMax: 75 },
    zone: { id: 'thigh-right', name: 'Right Thigh', riskLevel: 'low' }
  },
  // Knees
  {
    bounds: { xMin: 30, xMax: 45, yMin: 75, yMax: 80 },
    zone: { id: 'knee-left', name: 'Left Knee', riskLevel: 'low' }
  },
  {
    bounds: { xMin: 55, xMax: 70, yMin: 75, yMax: 80 },
    zone: { id: 'knee-right', name: 'Right Knee', riskLevel: 'low' }
  },
  // Calves
  {
    bounds: { xMin: 32, xMax: 45, yMin: 80, yMax: 92 },
    zone: { id: 'calf-left', name: 'Left Calf', riskLevel: 'low' }
  },
  {
    bounds: { xMin: 55, xMax: 68, yMin: 80, yMax: 92 },
    zone: { id: 'calf-right', name: 'Right Calf', riskLevel: 'low' }
  },
  // Feet
  {
    bounds: { xMin: 30, xMax: 45, yMin: 92, yMax: 100 },
    zone: { id: 'foot-left', name: 'Left Foot', riskLevel: 'low' }
  },
  {
    bounds: { xMin: 55, xMax: 70, yMin: 92, yMax: 100 },
    zone: { id: 'foot-right', name: 'Right Foot', riskLevel: 'low' }
  }
];

// Default zone for areas not explicitly defined
const defaultZone: AnatomicalZone = {
  id: 'general',
  name: 'General Area',
  riskLevel: 'low'
};

/**
 * Converts touch coordinates (as percentages) to an anatomical zone
 * This is the internal safety mapping - hidden from users
 */
export function getAnatomicalZone(x: number, y: number): AnatomicalZone {
  for (const definition of zoneDefinitions) {
    const { bounds, zone } = definition;
    if (
      x >= bounds.xMin && x <= bounds.xMax &&
      y >= bounds.yMin && y <= bounds.yMax
    ) {
      return zone;
    }
  }
  return defaultZone;
}

/**
 * Determines risk level based on zone and severity
 * Critical zones with high severity = critical risk
 */
export function calculateRiskLevel(
  zone: AnatomicalZone, 
  severity: number
): 'low' | 'medium' | 'high' | 'critical' {
  // Critical zone + high severity = immediate concern
  if (zone.riskLevel === 'critical' && severity >= 7) {
    return 'critical';
  }
  if (zone.riskLevel === 'critical' || (zone.riskLevel === 'high' && severity >= 8)) {
    return 'high';
  }
  if (zone.riskLevel === 'high' || severity >= 6) {
    return 'medium';
  }
  return 'low';
}

/**
 * Get all clarifying questions for a given zone
 */
export function getClarifyingQuestions(zoneId: string): string[] {
  const zone = zoneDefinitions.find(z => z.zone.id === zoneId)?.zone;
  return zone?.clarifyingQuestions || [];
}

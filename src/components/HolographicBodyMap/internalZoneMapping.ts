/**
 * Internal Zone Mapping - Hidden from users
 * Maps touch coordinates to anatomical zones for AI triage reasoning
 * Users only see the glow marker, never the zone labels
 */

import { BodyView } from './types';

interface ZoneBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

interface InternalZone {
  id: string;
  name: string; // For AI use only
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  cautionRequired?: boolean;
}

interface ZoneDefinition {
  bounds: ZoneBounds;
  zone: InternalZone;
}

// Front view zone definitions
const frontZones: ZoneDefinition[] = [
  // Head
  { bounds: { xMin: 35, xMax: 65, yMin: 0, yMax: 10 }, zone: { id: 'head-front', name: 'Head (Front)', riskLevel: 'high', cautionRequired: true } },
  // Neck
  { bounds: { xMin: 40, xMax: 60, yMin: 10, yMax: 15 }, zone: { id: 'neck-front', name: 'Neck', riskLevel: 'high', cautionRequired: true } },
  // Left Chest - CRITICAL
  { bounds: { xMin: 50, xMax: 70, yMin: 15, yMax: 30 }, zone: { id: 'chest-left', name: 'Left Chest (Heart Area)', riskLevel: 'critical', cautionRequired: true } },
  // Right Chest
  { bounds: { xMin: 30, xMax: 50, yMin: 15, yMax: 30 }, zone: { id: 'chest-right', name: 'Right Chest', riskLevel: 'high' } },
  // Upper Abdomen
  { bounds: { xMin: 35, xMax: 65, yMin: 30, yMax: 40 }, zone: { id: 'abdomen-upper', name: 'Upper Abdomen', riskLevel: 'high', cautionRequired: true } },
  // Lower Abdomen
  { bounds: { xMin: 35, xMax: 65, yMin: 40, yMax: 52 }, zone: { id: 'abdomen-lower', name: 'Lower Abdomen', riskLevel: 'medium' } },
  // Left Shoulder
  { bounds: { xMin: 70, xMax: 85, yMin: 15, yMax: 22 }, zone: { id: 'shoulder-left', name: 'Left Shoulder', riskLevel: 'low' } },
  // Right Shoulder
  { bounds: { xMin: 15, xMax: 30, yMin: 15, yMax: 22 }, zone: { id: 'shoulder-right', name: 'Right Shoulder', riskLevel: 'low' } },
  // Left Arm
  { bounds: { xMin: 75, xMax: 95, yMin: 22, yMax: 50 }, zone: { id: 'arm-left', name: 'Left Arm', riskLevel: 'low' } },
  // Right Arm
  { bounds: { xMin: 5, xMax: 25, yMin: 22, yMax: 50 }, zone: { id: 'arm-right', name: 'Right Arm', riskLevel: 'low' } },
  // Left Hip
  { bounds: { xMin: 50, xMax: 65, yMin: 48, yMax: 55 }, zone: { id: 'hip-left', name: 'Left Hip', riskLevel: 'low' } },
  // Right Hip
  { bounds: { xMin: 35, xMax: 50, yMin: 48, yMax: 55 }, zone: { id: 'hip-right', name: 'Right Hip', riskLevel: 'low' } },
  // Left Thigh
  { bounds: { xMin: 50, xMax: 65, yMin: 55, yMax: 75 }, zone: { id: 'thigh-left', name: 'Left Thigh', riskLevel: 'low' } },
  // Right Thigh
  { bounds: { xMin: 35, xMax: 50, yMin: 55, yMax: 75 }, zone: { id: 'thigh-right', name: 'Right Thigh', riskLevel: 'low' } },
  // Left Lower Leg
  { bounds: { xMin: 50, xMax: 62, yMin: 75, yMax: 95 }, zone: { id: 'leg-lower-left', name: 'Left Lower Leg', riskLevel: 'low' } },
  // Right Lower Leg
  { bounds: { xMin: 38, xMax: 50, yMin: 75, yMax: 95 }, zone: { id: 'leg-lower-right', name: 'Right Lower Leg', riskLevel: 'low' } },
];

// Back view zone definitions
const backZones: ZoneDefinition[] = [
  // Head Back
  { bounds: { xMin: 35, xMax: 65, yMin: 0, yMax: 10 }, zone: { id: 'head-back', name: 'Head (Back)', riskLevel: 'high' } },
  // Neck Back
  { bounds: { xMin: 40, xMax: 60, yMin: 10, yMax: 15 }, zone: { id: 'neck-back', name: 'Neck (Back)', riskLevel: 'high', cautionRequired: true } },
  // Upper Back
  { bounds: { xMin: 30, xMax: 70, yMin: 15, yMax: 32 }, zone: { id: 'back-upper', name: 'Upper Back', riskLevel: 'medium' } },
  // Spine
  { bounds: { xMin: 45, xMax: 55, yMin: 15, yMax: 52 }, zone: { id: 'spine', name: 'Spine', riskLevel: 'high', cautionRequired: true } },
  // Lower Back - Lumbar
  { bounds: { xMin: 35, xMax: 65, yMin: 35, yMax: 50 }, zone: { id: 'back-lower', name: 'Lower Back (Lumbar)', riskLevel: 'medium' } },
  // Buttocks
  { bounds: { xMin: 35, xMax: 65, yMin: 50, yMax: 58 }, zone: { id: 'buttocks', name: 'Buttocks', riskLevel: 'low' } },
];

// Side view zone definitions (apply to both left and right views)
const sideZones: ZoneDefinition[] = [
  // Head Side
  { bounds: { xMin: 30, xMax: 70, yMin: 0, yMax: 12 }, zone: { id: 'head-side', name: 'Head (Side)', riskLevel: 'high' } },
  // Neck Side
  { bounds: { xMin: 35, xMax: 65, yMin: 10, yMax: 16 }, zone: { id: 'neck-side', name: 'Neck (Side)', riskLevel: 'high' } },
  // Torso Side
  { bounds: { xMin: 25, xMax: 75, yMin: 16, yMax: 50 }, zone: { id: 'torso-side', name: 'Torso (Side)', riskLevel: 'medium' } },
  // Arm Side
  { bounds: { xMin: 10, xMax: 30, yMin: 18, yMax: 48 }, zone: { id: 'arm-side', name: 'Arm', riskLevel: 'low' } },
  { bounds: { xMin: 70, xMax: 90, yMin: 18, yMax: 48 }, zone: { id: 'arm-side-back', name: 'Arm', riskLevel: 'low' } },
  // Leg Side
  { bounds: { xMin: 30, xMax: 70, yMin: 52, yMax: 95 }, zone: { id: 'leg-side', name: 'Leg (Side)', riskLevel: 'low' } },
];

const defaultZone: InternalZone = {
  id: 'general',
  name: 'General Area',
  riskLevel: 'low'
};

/**
 * Internal function to map coordinates to anatomical zone
 * This is NEVER shown to users - only used for AI triage
 */
export function mapToInternalZone(x: number, y: number, view: BodyView): InternalZone {
  let zones: ZoneDefinition[];
  
  switch (view) {
    case 'front':
      zones = frontZones;
      break;
    case 'back':
      zones = backZones;
      break;
    case 'left':
    case 'right':
      zones = sideZones;
      break;
    default:
      zones = frontZones;
  }
  
  for (const def of zones) {
    const { bounds, zone } = def;
    if (x >= bounds.xMin && x <= bounds.xMax && y >= bounds.yMin && y <= bounds.yMax) {
      return zone;
    }
  }
  
  return defaultZone;
}

/**
 * Calculate internal risk level based on zone and severity
 * Higher severity in critical zones = higher risk
 */
export function calculateInternalRisk(
  zone: InternalZone,
  severity: number
): 'low' | 'medium' | 'high' | 'critical' {
  // Critical zone with high severity = critical
  if (zone.riskLevel === 'critical' && severity >= 6) {
    return 'critical';
  }
  if (zone.riskLevel === 'critical' || (zone.riskLevel === 'high' && severity >= 7)) {
    return 'high';
  }
  if (zone.riskLevel === 'high' || severity >= 5) {
    return 'medium';
  }
  return 'low';
}

/**
 * Check if zone requires extra caution
 */
export function requiresCaution(zone: InternalZone): boolean {
  return zone.cautionRequired === true;
}

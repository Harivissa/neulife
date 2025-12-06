import { BodyRegion, BodyLayer, BodyView } from './types';

// Region definitions with SVG paths for each body part
export const bodyRegions: BodyRegion[] = [
  // Head & Neck
  {
    id: 'head',
    label: 'Head',
    path: 'M150,30 C170,30 185,45 185,70 C185,95 170,115 150,115 C130,115 115,95 115,70 C115,45 130,30 150,30',
    views: ['front', 'back', 'left', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'brain',
    label: 'Brain',
    path: 'M150,40 C165,40 175,50 175,65 C175,80 165,90 150,90 C135,90 125,80 125,65 C125,50 135,40 150,40',
    views: ['front', 'left', 'right'],
    layers: ['organs', 'nervous'],
  },
  {
    id: 'neck',
    label: 'Neck',
    path: 'M140,115 L160,115 L158,140 L142,140 Z',
    views: ['front', 'back', 'left', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  // Torso
  {
    id: 'chest',
    label: 'Chest',
    path: 'M100,140 L200,140 L210,200 L90,200 Z',
    views: ['front'],
    layers: ['skin', 'muscles', 'skeleton'],
  },
  {
    id: 'upper-back',
    label: 'Upper Back',
    path: 'M100,140 L200,140 L210,200 L90,200 Z',
    views: ['back'],
    layers: ['skin', 'muscles', 'skeleton'],
  },
  {
    id: 'heart',
    label: 'Heart',
    path: 'M130,160 C140,150 160,150 170,160 C180,170 175,190 150,210 C125,190 120,170 130,160',
    views: ['front'],
    layers: ['organs'],
  },
  {
    id: 'lungs-left',
    label: 'Left Lung',
    path: 'M100,150 C95,160 95,190 100,200 L130,200 L130,155 Z',
    views: ['front'],
    layers: ['organs'],
  },
  {
    id: 'lungs-right',
    label: 'Right Lung',
    path: 'M200,150 C205,160 205,190 200,200 L170,200 L170,155 Z',
    views: ['front'],
    layers: ['organs'],
  },
  {
    id: 'abdomen',
    label: 'Abdomen',
    path: 'M90,200 L210,200 L205,280 L95,280 Z',
    views: ['front'],
    layers: ['skin', 'muscles', 'skeleton'],
  },
  {
    id: 'lower-back',
    label: 'Lower Back',
    path: 'M90,200 L210,200 L205,280 L95,280 Z',
    views: ['back'],
    layers: ['skin', 'muscles', 'skeleton'],
  },
  {
    id: 'stomach',
    label: 'Stomach',
    path: 'M130,210 C125,220 125,240 135,250 L165,250 C175,240 175,220 170,210 Z',
    views: ['front'],
    layers: ['organs'],
  },
  {
    id: 'liver',
    label: 'Liver',
    path: 'M160,205 L200,210 L195,245 L155,240 Z',
    views: ['front'],
    layers: ['organs'],
  },
  {
    id: 'kidneys',
    label: 'Kidneys',
    path: 'M105,230 C100,235 100,250 108,255 L122,255 C130,250 130,235 125,230 Z M175,230 C180,235 180,250 192,255 L178,255 C170,250 170,235 175,230 Z',
    views: ['front', 'back'],
    layers: ['organs'],
  },
  {
    id: 'intestines',
    label: 'Intestines',
    path: 'M115,250 Q150,260 185,250 Q190,270 150,280 Q110,270 115,250',
    views: ['front'],
    layers: ['organs'],
  },
  {
    id: 'pelvis',
    label: 'Pelvis',
    path: 'M95,280 L205,280 L195,320 L105,320 Z',
    views: ['front', 'back'],
    layers: ['skin', 'muscles', 'skeleton'],
  },
  {
    id: 'reproductive',
    label: 'Reproductive System',
    path: 'M130,285 L170,285 L165,310 L135,310 Z',
    views: ['front'],
    layers: ['organs'],
  },
  // Arms
  {
    id: 'shoulder-left',
    label: 'Left Shoulder',
    path: 'M70,140 L100,140 L95,165 L65,160 Z',
    views: ['front', 'back'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'shoulder-right',
    label: 'Right Shoulder',
    path: 'M200,140 L230,140 L235,160 L205,165 Z',
    views: ['front', 'back'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'upper-arm-left',
    label: 'Left Upper Arm',
    path: 'M65,160 L95,165 L90,220 L60,215 Z',
    views: ['front', 'back', 'left'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'upper-arm-right',
    label: 'Right Upper Arm',
    path: 'M205,165 L235,160 L240,215 L210,220 Z',
    views: ['front', 'back', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'elbow-left',
    label: 'Left Elbow',
    path: 'M60,215 L90,220 L88,235 L58,230 Z',
    views: ['front', 'back', 'left'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'elbow-right',
    label: 'Right Elbow',
    path: 'M210,220 L240,215 L242,230 L212,235 Z',
    views: ['front', 'back', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'forearm-left',
    label: 'Left Forearm',
    path: 'M58,230 L88,235 L80,300 L50,295 Z',
    views: ['front', 'back', 'left'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'forearm-right',
    label: 'Right Forearm',
    path: 'M212,235 L242,230 L250,295 L220,300 Z',
    views: ['front', 'back', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'wrist-left',
    label: 'Left Wrist',
    path: 'M50,295 L80,300 L78,315 L48,310 Z',
    views: ['front', 'back', 'left'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'wrist-right',
    label: 'Right Wrist',
    path: 'M220,300 L250,295 L252,310 L222,315 Z',
    views: ['front', 'back', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'hand-left',
    label: 'Left Hand',
    path: 'M48,310 L78,315 L75,350 L45,345 Z',
    views: ['front', 'back', 'left'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'hand-right',
    label: 'Right Hand',
    path: 'M222,315 L252,310 L255,345 L225,350 Z',
    views: ['front', 'back', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  // Legs
  {
    id: 'hip-left',
    label: 'Left Hip',
    path: 'M95,320 L145,320 L140,350 L100,350 Z',
    views: ['front', 'back', 'left'],
    layers: ['skin', 'muscles', 'skeleton'],
  },
  {
    id: 'hip-right',
    label: 'Right Hip',
    path: 'M155,320 L205,320 L200,350 L160,350 Z',
    views: ['front', 'back', 'right'],
    layers: ['skin', 'muscles', 'skeleton'],
  },
  {
    id: 'thigh-left',
    label: 'Left Thigh',
    path: 'M100,350 L140,350 L135,430 L105,430 Z',
    views: ['front', 'back', 'left'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'thigh-right',
    label: 'Right Thigh',
    path: 'M160,350 L200,350 L195,430 L165,430 Z',
    views: ['front', 'back', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'knee-left',
    label: 'Left Knee',
    path: 'M105,430 L135,430 L133,460 L107,460 Z',
    views: ['front', 'back', 'left'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'knee-right',
    label: 'Right Knee',
    path: 'M165,430 L195,430 L193,460 L167,460 Z',
    views: ['front', 'back', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'calf-left',
    label: 'Left Calf',
    path: 'M107,460 L133,460 L130,540 L110,540 Z',
    views: ['front', 'back', 'left'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'calf-right',
    label: 'Right Calf',
    path: 'M167,460 L193,460 L190,540 L170,540 Z',
    views: ['front', 'back', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'ankle-left',
    label: 'Left Ankle',
    path: 'M110,540 L130,540 L128,560 L112,560 Z',
    views: ['front', 'back', 'left'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'ankle-right',
    label: 'Right Ankle',
    path: 'M170,540 L190,540 L188,560 L172,560 Z',
    views: ['front', 'back', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'foot-left',
    label: 'Left Foot',
    path: 'M105,560 L135,560 L140,590 L100,590 Z',
    views: ['front', 'back', 'left'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  {
    id: 'foot-right',
    label: 'Right Foot',
    path: 'M165,560 L195,560 L200,590 L160,590 Z',
    views: ['front', 'back', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'nervous'],
  },
  // Spine (nervous system specific)
  {
    id: 'spine-cervical',
    label: 'Cervical Spine',
    path: 'M145,115 L155,115 L155,140 L145,140 Z',
    views: ['back'],
    layers: ['skeleton', 'nervous'],
  },
  {
    id: 'spine-thoracic',
    label: 'Thoracic Spine',
    path: 'M145,140 L155,140 L155,220 L145,220 Z',
    views: ['back'],
    layers: ['skeleton', 'nervous'],
  },
  {
    id: 'spine-lumbar',
    label: 'Lumbar Spine',
    path: 'M145,220 L155,220 L155,280 L145,280 Z',
    views: ['back'],
    layers: ['skeleton', 'nervous'],
  },
  {
    id: 'spine-sacral',
    label: 'Sacral Spine',
    path: 'M145,280 L155,280 L155,310 L145,310 Z',
    views: ['back'],
    layers: ['skeleton', 'nervous'],
  },
  // Side view specific regions
  {
    id: 'torso-side',
    label: 'Torso',
    path: 'M120,140 L180,140 L175,320 L125,320 Z',
    views: ['left', 'right'],
    layers: ['skin', 'muscles', 'skeleton', 'organs'],
  },
  // Breast regions (gender specific)
  {
    id: 'breast-left',
    label: 'Left Breast',
    path: 'M100,155 C95,170 100,185 115,185 C130,185 135,170 130,155 Z',
    views: ['front'],
    layers: ['skin'],
    femaleOnly: true,
  },
  {
    id: 'breast-right',
    label: 'Right Breast',
    path: 'M170,155 C165,170 170,185 185,185 C200,185 205,170 200,155 Z',
    views: ['front'],
    layers: ['skin'],
    femaleOnly: true,
  },
  // Prostate (male only)
  {
    id: 'prostate',
    label: 'Prostate',
    path: 'M140,295 C135,300 135,310 145,315 L155,315 C165,310 165,300 160,295 Z',
    views: ['front'],
    layers: ['organs'],
    maleOnly: true,
  },
  // Uterus (female only)
  {
    id: 'uterus',
    label: 'Uterus',
    path: 'M130,290 L170,290 L165,320 L135,320 Z',
    views: ['front'],
    layers: ['organs'],
    femaleOnly: true,
  },
  {
    id: 'ovaries',
    label: 'Ovaries',
    path: 'M115,295 C110,300 115,310 120,305 M180,295 C185,300 180,310 175,305',
    views: ['front'],
    layers: ['organs'],
    femaleOnly: true,
  },
];

// Layer-specific styling
export const layerStyles: Record<BodyLayer, { fill: string; stroke: string; hoverFill: string; activeFill: string }> = {
  skin: {
    fill: 'hsl(var(--muted))',
    stroke: 'hsl(var(--border))',
    hoverFill: 'hsl(var(--accent))',
    activeFill: 'hsl(var(--primary) / 0.3)',
  },
  muscles: {
    fill: 'hsl(0 65% 45% / 0.4)',
    stroke: 'hsl(0 65% 35%)',
    hoverFill: 'hsl(0 65% 50% / 0.6)',
    activeFill: 'hsl(0 70% 45% / 0.7)',
  },
  skeleton: {
    fill: 'hsl(45 20% 85% / 0.6)',
    stroke: 'hsl(45 15% 50%)',
    hoverFill: 'hsl(45 25% 75% / 0.8)',
    activeFill: 'hsl(45 30% 70%)',
  },
  organs: {
    fill: 'hsl(340 60% 50% / 0.5)',
    stroke: 'hsl(340 70% 40%)',
    hoverFill: 'hsl(340 65% 55% / 0.7)',
    activeFill: 'hsl(340 70% 50% / 0.8)',
  },
  nervous: {
    fill: 'hsl(45 90% 55% / 0.5)',
    stroke: 'hsl(45 85% 45%)',
    hoverFill: 'hsl(45 95% 60% / 0.7)',
    activeFill: 'hsl(45 100% 55% / 0.8)',
  },
  respiratory: {
    fill: 'hsl(200 70% 55% / 0.5)',
    stroke: 'hsl(200 75% 45%)',
    hoverFill: 'hsl(200 75% 60% / 0.7)',
    activeFill: 'hsl(200 80% 55% / 0.8)',
  },
};

// Get filtered regions based on current state
export const getFilteredRegions = (
  gender: 'male' | 'female',
  layer: BodyLayer,
  view: BodyView
): BodyRegion[] => {
  return bodyRegions.filter((region) => {
    // Filter by view
    if (!region.views.includes(view)) return false;
    
    // Filter by layer
    if (!region.layers.includes(layer)) return false;
    
    // Filter by gender
    if (region.maleOnly && gender !== 'male') return false;
    if (region.femaleOnly && gender !== 'female') return false;
    
    return true;
  });
};

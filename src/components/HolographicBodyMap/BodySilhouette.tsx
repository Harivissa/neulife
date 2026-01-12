import React from 'react';
import { Gender, BodyView, AnatomyLayer } from './types';
import { motion } from 'framer-motion';

interface BodySilhouetteProps {
  gender: Gender;
  view: BodyView;
  anatomyLayer: AnatomyLayer;
}

export const BodySilhouette: React.FC<BodySilhouetteProps> = ({ gender, view, anatomyLayer }) => {
  // Shared anatomical elements
  const renderVascularSystem = (isMale: boolean) => (
    <g className="vascular-system" opacity="0.9">
      {/* Heart - central */}
      <g className="heart">
        <path 
          d="M192,155 Q178,140 186,130 Q195,122 205,130 Q215,122 224,130 Q232,140 218,155 L205,175 Z"
          fill="rgba(180, 30, 60, 0.85)"
          stroke="rgba(220, 40, 70, 0.9)"
          strokeWidth="1.5"
        />
        {/* Heart chambers detail */}
        <path d="M195,142 Q205,148 215,142" fill="none" stroke="rgba(255,100,120,0.6)" strokeWidth="0.8"/>
        <ellipse cx="198" cy="150" rx="6" ry="8" fill="rgba(140,20,40,0.5)" />
        <ellipse cx="212" cy="150" rx="6" ry="8" fill="rgba(140,20,40,0.5)" />
      </g>

      {/* Aorta and major arteries */}
      <g stroke="rgba(200, 50, 80, 0.8)" strokeWidth="3" fill="none" className="arteries">
        {/* Ascending aorta */}
        <path d="M205,130 Q205,115 200,100 Q195,90 200,80"/>
        {/* Aortic arch */}
        <path d="M200,100 Q190,95 180,100 Q165,110 160,130"/>
        <path d="M200,100 Q210,95 220,100 Q235,110 240,130"/>
        {/* Descending aorta */}
        <path d="M205,155 L205,175 Q205,220 205,260 Q205,320 205,360"/>
      </g>

      {/* Carotid arteries to brain */}
      <g stroke="rgba(200, 50, 80, 0.7)" strokeWidth="2" fill="none">
        <path d="M195,90 Q192,70 190,55 Q188,40 195,30"/>
        <path d="M215,90 Q218,70 220,55 Q222,40 215,30"/>
      </g>

      {/* Major veins - blue tint */}
      <g stroke="rgba(70, 100, 180, 0.7)" strokeWidth="2.5" fill="none" className="veins">
        {/* Superior vena cava */}
        <path d="M215,130 Q220,115 225,100 Q230,85 235,75"/>
        <path d="M195,130 Q190,115 185,100 Q180,85 175,75"/>
        {/* Inferior vena cava */}
        <path d="M215,155 L218,175 Q220,220 218,260 Q215,320 212,360"/>
      </g>

      {/* Subclavian arteries to arms */}
      <g stroke="rgba(200, 50, 80, 0.6)" strokeWidth="2" fill="none">
        <path d="M160,130 Q140,135 120,145 Q100,160 80,180 Q65,210 55,260 Q50,300 50,340"/>
        <path d="M240,130 Q260,135 280,145 Q300,160 320,180 Q335,210 345,260 Q350,300 350,340"/>
      </g>

      {/* Arm veins */}
      <g stroke="rgba(70, 100, 180, 0.5)" strokeWidth="1.5" fill="none">
        <path d="M165,135 Q145,145 125,160 Q105,185 88,230 Q70,280 62,340"/>
        <path d="M235,135 Q255,145 275,160 Q295,185 312,230 Q330,280 338,340"/>
      </g>

      {/* Iliac arteries - pelvis */}
      <g stroke="rgba(200, 50, 80, 0.6)" strokeWidth="2" fill="none">
        <path d="M205,360 Q195,380 180,395 Q170,410 165,450 Q160,500 155,550 Q150,620 150,700"/>
        <path d="M205,360 Q215,380 230,395 Q240,410 245,450 Q250,500 255,550 Q260,620 260,700"/>
      </g>

      {/* Leg veins */}
      <g stroke="rgba(70, 100, 180, 0.5)" strokeWidth="1.5" fill="none">
        <path d="M195,365 Q185,385 175,405 Q168,450 162,520 Q158,600 155,690"/>
        <path d="M215,365 Q225,385 235,405 Q242,450 248,520 Q252,600 255,690"/>
      </g>

      {/* Pulmonary vessels */}
      <g stroke="rgba(150, 80, 120, 0.5)" strokeWidth="1.5" fill="none">
        <path d="M192,138 Q170,135 160,150 Q150,165 145,180"/>
        <path d="M218,138 Q230,135 240,150 Q250,165 255,180"/>
      </g>
    </g>
  );

  const renderSkeleton = (isMale: boolean) => (
    <g className="skeleton-layer" fill="none" stroke="rgba(180, 200, 230, 0.6)" strokeWidth="1">
      {/* Skull */}
      <ellipse cx="200" cy="40" rx={isMale ? 32 : 30} ry="38" strokeWidth="1.5" fill="rgba(180,200,230,0.08)"/>
      {/* Skull sutures */}
      <path d="M170,35 Q200,25 230,35" strokeOpacity="0.4"/>
      <path d="M200,10 L200,45" strokeOpacity="0.3"/>
      {/* Eye sockets */}
      <ellipse cx="185" cy="42" rx="10" ry="7" fill="rgba(10,20,40,0.4)"/>
      <ellipse cx="215" cy="42" rx="10" ry="7" fill="rgba(10,20,40,0.4)"/>
      {/* Nasal cavity */}
      <path d="M200,50 L195,62 L200,65 L205,62 Z" strokeOpacity="0.5" fill="rgba(10,20,40,0.3)"/>
      {/* Jaw/Mandible */}
      <path d="M170,52 Q165,70 175,82 Q190,90 200,92 Q210,90 225,82 Q235,70 230,52" strokeWidth="1.2"/>
      {/* Teeth hint */}
      <path d="M180,75 L220,75" strokeOpacity="0.3"/>

      {/* Cervical vertebrae */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={`c-vert-${i}`}>
          <rect x="194" y={95 + i * 6} width="12" height="5" rx="2" fill="rgba(180,200,230,0.1)" strokeOpacity="0.5"/>
        </g>
      ))}

      {/* Clavicles */}
      <path d="M200,138 Q170,132 135,145" strokeWidth="2.5" stroke="rgba(180,200,230,0.7)"/>
      <path d="M200,138 Q230,132 265,145" strokeWidth="2.5" stroke="rgba(180,200,230,0.7)"/>

      {/* Scapulae (behind, showing through) */}
      <path d="M140,145 Q135,180 145,210 Q155,215 165,195 Q168,165 155,145 Z" strokeOpacity="0.25" fill="rgba(180,200,230,0.03)"/>
      <path d="M260,145 Q265,180 255,210 Q245,215 235,195 Q232,165 245,145 Z" strokeOpacity="0.25" fill="rgba(180,200,230,0.03)"/>

      {/* Sternum */}
      <path d="M196,140 L196,230 Q198,238 200,240 Q202,238 204,230 L204,140 Z" fill="rgba(180,200,230,0.1)" strokeWidth="1.5"/>
      {/* Xiphoid process */}
      <path d="M198,230 L200,250 L202,230" strokeWidth="1"/>

      {/* Ribs - 12 pairs, curved anatomically */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const y = 145 + i * 8;
        const ribLength = i < 7 ? 60 + i * 3 : 55 - (i - 7) * 8;
        const curve = 10 + i * 1.5;
        return (
          <g key={`rib-${i}`} opacity={0.6 - i * 0.02}>
            <path d={`M196,${y} Q${175 - i * 2},${y + curve} ${140 - ribLength * 0.3},${y + 20 + i * 2}`} strokeWidth={i < 7 ? 1.2 : 1}/>
            <path d={`M204,${y} Q${225 + i * 2},${y + curve} ${260 + ribLength * 0.3},${y + 20 + i * 2}`} strokeWidth={i < 7 ? 1.2 : 1}/>
          </g>
        );
      })}

      {/* Thoracic & Lumbar spine */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
        <g key={`spine-${i}`}>
          <rect x="195" y={140 + i * 12} width="10" height="10" rx="2" fill="rgba(180,200,230,0.08)" strokeOpacity="0.5"/>
          {/* Spinous process */}
          <line x1="200" y1={140 + i * 12} x2="200" y2={148 + i * 12} strokeWidth="1.5" strokeOpacity="0.4"/>
        </g>
      ))}

      {/* Pelvis - Iliac bones */}
      <path d={`M200,345 Q160,340 145,360 Q130,385 140,420 Q155,440 175,435`} strokeWidth="2" fill="rgba(180,200,230,0.06)"/>
      <path d={`M200,345 Q240,340 255,360 Q270,385 260,420 Q245,440 225,435`} strokeWidth="2" fill="rgba(180,200,230,0.06)"/>
      {/* Sacrum */}
      <path d="M190,345 L195,395 L200,400 L205,395 L210,345 Z" fill="rgba(180,200,230,0.08)" strokeOpacity="0.6"/>
      {/* Pubic symphysis */}
      <ellipse cx="200" cy="415" rx="15" ry="8" strokeOpacity="0.4" fill="rgba(180,200,230,0.05)"/>

      {/* Humerus - upper arm */}
      <line x1="130" y1="155" x2="95" y2="270" strokeWidth="3" stroke="rgba(180,200,230,0.6)"/>
      <line x1="270" y1="155" x2="305" y2="270" strokeWidth="3" stroke="rgba(180,200,230,0.6)"/>
      {/* Humeral heads */}
      <circle cx="130" cy="155" r="8" fill="rgba(180,200,230,0.1)" strokeWidth="1"/>
      <circle cx="270" cy="155" r="8" fill="rgba(180,200,230,0.1)" strokeWidth="1"/>

      {/* Radius and Ulna - forearm */}
      <line x1="95" y1="275" x2="60" y2="360" strokeWidth="2.5" stroke="rgba(180,200,230,0.55)"/>
      <line x1="98" y1="275" x2="68" y2="355" strokeWidth="2" stroke="rgba(180,200,230,0.45)"/>
      <line x1="305" y1="275" x2="340" y2="360" strokeWidth="2.5" stroke="rgba(180,200,230,0.55)"/>
      <line x1="302" y1="275" x2="332" y2="355" strokeWidth="2" stroke="rgba(180,200,230,0.45)"/>

      {/* Hands - metacarpals/phalanges simplified */}
      <ellipse cx="55" cy="370" rx="15" ry="10" strokeOpacity="0.4" fill="rgba(180,200,230,0.05)"/>
      <ellipse cx="345" cy="370" rx="15" ry="10" strokeOpacity="0.4" fill="rgba(180,200,230,0.05)"/>
      {/* Finger bones hint */}
      {[-12, -6, 0, 6, 10].map((offset, idx) => (
        <g key={`lf-${idx}`}>
          <line x1={50 + offset} y1="375" x2={45 + offset} y2={385 + (idx === 0 ? 0 : 5)} strokeOpacity="0.3"/>
        </g>
      ))}
      {[12, 6, 0, -6, -10].map((offset, idx) => (
        <g key={`rf-${idx}`}>
          <line x1={350 + offset} y1="375" x2={355 + offset} y2={385 + (idx === 0 ? 0 : 5)} strokeOpacity="0.3"/>
        </g>
      ))}

      {/* Femur - thigh bones */}
      <line x1="175" y1="430" x2="165" y2="550" strokeWidth="4" stroke="rgba(180,200,230,0.6)"/>
      <line x1="225" y1="430" x2="235" y2="550" strokeWidth="4" stroke="rgba(180,200,230,0.6)"/>
      {/* Femoral heads */}
      <circle cx="175" cy="430" r="10" fill="rgba(180,200,230,0.08)" strokeWidth="1"/>
      <circle cx="225" cy="430" r="10" fill="rgba(180,200,230,0.08)" strokeWidth="1"/>

      {/* Patella - kneecaps */}
      <ellipse cx="163" cy="565" rx="12" ry="14" fill="rgba(180,200,230,0.1)" strokeWidth="1.2"/>
      <ellipse cx="237" cy="565" rx="12" ry="14" fill="rgba(180,200,230,0.1)" strokeWidth="1.2"/>

      {/* Tibia and Fibula */}
      <line x1="160" y1="580" x2="150" y2="695" strokeWidth="3" stroke="rgba(180,200,230,0.55)"/>
      <line x1="168" y1="580" x2="160" y2="690" strokeWidth="2" stroke="rgba(180,200,230,0.4)"/>
      <line x1="240" y1="580" x2="250" y2="695" strokeWidth="3" stroke="rgba(180,200,230,0.55)"/>
      <line x1="232" y1="580" x2="240" y2="690" strokeWidth="2" stroke="rgba(180,200,230,0.4)"/>

      {/* Feet - tarsals/metatarsals */}
      <ellipse cx="148" cy="708" rx="22" ry="10" strokeOpacity="0.4" fill="rgba(180,200,230,0.05)"/>
      <ellipse cx="252" cy="708" rx="22" ry="10" strokeOpacity="0.4" fill="rgba(180,200,230,0.05)"/>
    </g>
  );

  const renderOrgans = (isMale: boolean) => (
    <g className="organs-layer">
      {/* Brain - visible through skull */}
      <ellipse cx="200" cy="38" rx="25" ry="28" fill="rgba(255, 180, 190, 0.3)" stroke="rgba(255, 150, 170, 0.5)" strokeWidth="1"/>
      <path d="M182,32 Q200,22 218,32" fill="none" stroke="rgba(255,150,170,0.4)" strokeWidth="0.8"/>
      <path d="M180,42 Q200,35 220,42" fill="none" stroke="rgba(255,150,170,0.3)" strokeWidth="0.8"/>
      <path d="M200,15 L200,55" stroke="rgba(255,150,170,0.2)" strokeWidth="0.5"/>

      {/* Trachea */}
      <path d="M196,92 L196,140 M204,92 L204,140" stroke="rgba(200,180,200,0.4)" strokeWidth="1.5"/>
      <path d="M196,140 Q190,150 175,160" stroke="rgba(200,180,200,0.3)" strokeWidth="1"/>
      <path d="M204,140 Q210,150 225,160" stroke="rgba(200,180,200,0.3)" strokeWidth="1"/>

      {/* Lungs */}
      <path 
        d="M130,145 Q115,190 120,240 Q130,275 160,270 Q180,265 185,240 L185,145 Q160,138 130,145" 
        fill="rgba(255, 140, 170, 0.2)" 
        stroke="rgba(255, 120, 160, 0.5)" 
        strokeWidth="1"
      />
      <path 
        d="M270,145 Q285,190 280,240 Q270,275 240,270 Q220,265 215,240 L215,145 Q240,138 270,145" 
        fill="rgba(255, 140, 170, 0.2)" 
        stroke="rgba(255, 120, 160, 0.5)" 
        strokeWidth="1"
      />
      {/* Lung lobes */}
      <path d="M135,180 Q155,175 175,185" fill="none" stroke="rgba(255,120,160,0.3)" strokeWidth="0.8"/>
      <path d="M265,180 Q245,175 225,185" fill="none" stroke="rgba(255,120,160,0.3)" strokeWidth="0.8"/>
      <path d="M140,210 Q160,205 175,215" fill="none" stroke="rgba(255,120,160,0.25)" strokeWidth="0.8"/>
      <path d="M260,210 Q240,205 225,215" fill="none" stroke="rgba(255,120,160,0.25)" strokeWidth="0.8"/>

      {/* Diaphragm line */}
      <path d="M125,275 Q165,260 200,265 Q235,260 275,275" fill="none" stroke="rgba(180,160,180,0.4)" strokeWidth="1.5" strokeDasharray="4,4"/>

      {/* Liver */}
      <path 
        d="M140,280 Q125,300 130,330 Q145,360 190,355 L225,340 Q245,325 245,300 Q245,280 225,278 Q180,275 140,280" 
        fill="rgba(120, 60, 40, 0.35)" 
        stroke="rgba(150, 80, 50, 0.5)" 
        strokeWidth="1"
      />

      {/* Stomach */}
      <path 
        d="M210,290 Q250,295 260,325 Q260,360 235,375 Q205,385 195,355 Q185,320 210,290" 
        fill="rgba(230, 180, 150, 0.3)" 
        stroke="rgba(230, 160, 130, 0.5)" 
        strokeWidth="1"
      />

      {/* Spleen */}
      <ellipse cx="135" cy="315" rx="15" ry="25" fill="rgba(150, 80, 100, 0.3)" stroke="rgba(170, 100, 120, 0.5)" strokeWidth="1"/>

      {/* Kidneys */}
      <path d="M145,330 Q138,345 140,365 Q145,385 155,380 Q165,375 162,355 Q160,335 150,328 Z" fill="rgba(140, 90, 90, 0.4)" stroke="rgba(160, 100, 100, 0.5)" strokeWidth="1"/>
      <path d="M255,330 Q262,345 260,365 Q255,385 245,380 Q235,375 238,355 Q240,335 250,328 Z" fill="rgba(140, 90, 90, 0.4)" stroke="rgba(160, 100, 100, 0.5)" strokeWidth="1"/>

      {/* Large intestine - colon frame */}
      <path 
        d="M145,380 L145,420 Q145,445 170,445 L230,445 Q255,445 255,420 L255,380"
        fill="none"
        stroke="rgba(200, 160, 150, 0.4)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Small intestine - simplified coils */}
      <g stroke="rgba(220, 180, 170, 0.35)" strokeWidth="3" fill="none">
        <path d="M165,385 Q180,390 190,380 Q200,370 210,380 Q220,390 235,385"/>
        <path d="M170,400 Q185,405 195,395 Q205,385 215,395 Q225,405 240,400"/>
        <path d="M175,415 Q190,420 200,410 Q210,400 220,410 Q230,420 240,415"/>
      </g>

      {/* Bladder */}
      <ellipse cx="200" cy="455" rx="25" ry="18" fill="rgba(220, 200, 150, 0.25)" stroke="rgba(200, 180, 130, 0.4)" strokeWidth="1"/>
    </g>
  );

  const renderNervousSystem = () => (
    <g className="nervous-system" stroke="rgba(230, 220, 100, 0.4)" strokeWidth="0.8" fill="none">
      {/* Spinal cord */}
      <path d="M200,70 L200,400" strokeWidth="2" stroke="rgba(230,220,100,0.5)"/>
      
      {/* Brachial plexus - nerves to arms */}
      <path d="M200,130 Q180,140 160,155 Q130,180 100,220 Q75,270 55,340"/>
      <path d="M200,130 Q220,140 240,155 Q270,180 300,220 Q325,270 345,340"/>
      
      {/* Intercostal nerves */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={`nerve-${i}`} opacity={0.5 - i * 0.05}>
          <path d={`M200,${160 + i * 20} Q175,${165 + i * 20} 150,${170 + i * 20}`}/>
          <path d={`M200,${160 + i * 20} Q225,${165 + i * 20} 250,${170 + i * 20}`}/>
        </g>
      ))}
      
      {/* Lumbar plexus - to legs */}
      <path d="M200,360 Q185,380 175,420 Q165,480 160,560 Q155,640 152,700"/>
      <path d="M200,360 Q215,380 225,420 Q235,480 240,560 Q245,640 248,700"/>
      
      {/* Sciatic nerve branches */}
      <path d="M175,450 Q160,500 155,560" strokeOpacity="0.3"/>
      <path d="M225,450 Q240,500 245,560" strokeOpacity="0.3"/>
    </g>
  );

  const renderMuscleSystem = (isMale: boolean) => (
    <g className="muscle-layer" fill="rgba(140, 50, 50, 0.15)" stroke="rgba(160, 60, 60, 0.4)" strokeWidth="0.8">
      {/* Neck muscles - sternocleidomastoid */}
      <path d="M185,80 Q175,95 165,115 Q175,120 185,115 Q190,100 190,80 Z"/>
      <path d="M215,80 Q225,95 235,115 Q225,120 215,115 Q210,100 210,80 Z"/>
      
      {/* Trapezius */}
      <path d="M200,90 Q160,100 140,130 Q150,145 165,150 L200,125 L235,150 Q250,145 260,130 Q240,100 200,90"/>
      
      {/* Deltoids */}
      <ellipse cx="125" cy="160" rx={isMale ? 25 : 22} ry="35" />
      <ellipse cx="275" cy="160" rx={isMale ? 25 : 22} ry="35" />
      
      {/* Pectorals */}
      <path d={`M145,155 Q150,${isMale ? 185 : 190} 185,${isMale ? 200 : 210} L200,${isMale ? 190 : 200} L215,${isMale ? 200 : 210} Q250,${isMale ? 185 : 190} 255,155 Q200,145 145,155`}/>
      
      {/* Biceps */}
      <ellipse cx="105" cy="215" rx="18" ry="40" />
      <ellipse cx="295" cy="215" rx="18" ry="40" />
      
      {/* Forearm muscles */}
      <ellipse cx="78" cy="300" rx="14" ry="45" />
      <ellipse cx="322" cy="300" rx="14" ry="45" />
      
      {/* Rectus abdominis - 6-pack */}
      {[0, 1, 2].map((row) => (
        <g key={`abs-${row}`}>
          <rect x="178" y={220 + row * 30} width="20" height="25" rx="3"/>
          <rect x="202" y={220 + row * 30} width="20" height="25" rx="3"/>
        </g>
      ))}
      
      {/* Obliques */}
      <path d="M145,220 Q155,280 160,340" strokeWidth="1.5" fill="none"/>
      <path d="M255,220 Q245,280 240,340" strokeWidth="1.5" fill="none"/>
      
      {/* Serratus anterior */}
      {[0, 1, 2, 3].map((i) => (
        <g key={`serratus-${i}`} opacity="0.5">
          <path d={`M148,${195 + i * 18} Q160,${190 + i * 18} 172,${195 + i * 18}`}/>
          <path d={`M252,${195 + i * 18} Q240,${190 + i * 18} 228,${195 + i * 18}`}/>
        </g>
      ))}
      
      {/* Hip flexors / Iliopsoas area */}
      <ellipse cx="175" cy="405" rx="18" ry="25" opacity="0.4"/>
      <ellipse cx="225" cy="405" rx="18" ry="25" opacity="0.4"/>
      
      {/* Quadriceps */}
      <ellipse cx="165" cy="480" rx={isMale ? 22 : 20} ry="65" />
      <ellipse cx="235" cy="480" rx={isMale ? 22 : 20} ry="65" />
      
      {/* Inner thigh - adductors */}
      <ellipse cx="185" cy="475" rx="12" ry="50" opacity="0.4"/>
      <ellipse cx="215" cy="475" rx="12" ry="50" opacity="0.4"/>
      
      {/* Tibialis anterior */}
      <ellipse cx="158" cy="620" rx="10" ry="40" />
      <ellipse cx="242" cy="620" rx="10" ry="40" />
      
      {/* Gastrocnemius - calves */}
      <ellipse cx="155" cy="620" rx="15" ry="50" opacity="0.5"/>
      <ellipse cx="245" cy="620" rx="15" ry="50" opacity="0.5"/>
    </g>
  );

  const renderBodyOutline = (isMale: boolean) => (
    <g className="body-outline" fill="rgba(0, 180, 220, 0.03)" stroke="rgba(0, 200, 255, 0.25)" strokeWidth="1">
      {/* Head */}
      <ellipse cx="200" cy="42" rx={isMale ? 34 : 32} ry="42" />
      {/* Neck */}
      <rect x={isMale ? 185 : 187} y="82" width={isMale ? 30 : 26} height="30" rx="8" />
      {/* Torso */}
      {isMale ? (
        <path d="M135,112 L265,112 Q280,130 285,180 Q288,250 280,300 L265,350 L135,350 L120,300 Q112,250 115,180 Q120,130 135,112"/>
      ) : (
        <path d="M145,112 L255,112 Q268,130 272,170 Q268,210 260,240 Q265,280 260,320 L255,350 L145,350 L140,320 Q135,280 140,240 Q132,210 128,170 Q132,130 145,112"/>
      )}
      {/* Shoulders */}
      <ellipse cx={isMale ? 118 : 128} cy="130" rx={isMale ? 28 : 22} ry={isMale ? 20 : 16} />
      <ellipse cx={isMale ? 282 : 272} cy="130" rx={isMale ? 28 : 22} ry={isMale ? 20 : 16} />
      {/* Arms */}
      <path d={`M${isMale ? 90 : 106},135 Q${isMale ? 70 : 85},160 ${isMale ? 55 : 70},220 Q${isMale ? 45 : 58},280 ${isMale ? 42 : 55},340 L${isMale ? 55 : 68},345 L${isMale ? 68 : 80},340 Q${isMale ? 75 : 88},280 ${isMale ? 85 : 95},220 Q${isMale ? 95 : 102},165 ${isMale ? 105 : 112},140 Z`}/>
      <path d={`M${isMale ? 310 : 294},135 Q${isMale ? 330 : 315},160 ${isMale ? 345 : 330},220 Q${isMale ? 355 : 342},280 ${isMale ? 358 : 345},340 L${isMale ? 345 : 332},345 L${isMale ? 332 : 320},340 Q${isMale ? 325 : 312},280 ${isMale ? 315 : 305},220 Q${isMale ? 305 : 298},165 ${isMale ? 295 : 288},140 Z`}/>
      {/* Pelvis/Hips */}
      <path d={`M${isMale ? 140 : 135},345 L${isMale ? 260 : 265},345 Q${isMale ? 270 : 280},370 ${isMale ? 265 : 275},400 L${isMale ? 250 : 255},420 L${isMale ? 150 : 145},420 L${isMale ? 135 : 125},400 Q${isMale ? 130 : 120},370 ${isMale ? 140 : 135},345`}/>
      {/* Legs */}
      <path d="M150,415 Q145,480 142,550 Q140,620 138,700 L162,705 L180,700 Q178,620 176,550 Q174,480 172,420 Z"/>
      <path d="M228,420 Q226,480 224,550 Q222,620 220,700 L238,705 L262,700 Q260,620 258,550 Q255,480 250,415 Z"/>
    </g>
  );

  const renderBackView = (isMale: boolean) => (
    <g className="back-view">
      {/* Back outline */}
      <g fill="rgba(0, 180, 220, 0.03)" stroke="rgba(0, 200, 255, 0.25)" strokeWidth="1">
        <ellipse cx="200" cy="42" rx={isMale ? 34 : 32} ry="42" />
        <rect x={isMale ? 185 : 187} y="82" width={isMale ? 30 : 26} height="30" rx="8" />
        {isMale ? (
          <path d="M135,112 L265,112 Q280,130 285,180 Q288,250 280,300 L265,350 L135,350 L120,300 Q112,250 115,180 Q120,130 135,112"/>
        ) : (
          <path d="M145,112 L255,112 Q268,130 272,170 Q268,210 260,240 Q265,280 260,320 L255,350 L145,350 L140,320 Q135,280 140,240 Q132,210 128,170 Q132,130 145,112"/>
        )}
        <ellipse cx={isMale ? 118 : 128} cy="130" rx={isMale ? 28 : 22} ry={isMale ? 20 : 16} />
        <ellipse cx={isMale ? 282 : 272} cy="130" rx={isMale ? 28 : 22} ry={isMale ? 20 : 16} />
        <path d={`M${isMale ? 90 : 106},135 Q${isMale ? 70 : 85},160 ${isMale ? 55 : 70},220 Q${isMale ? 45 : 58},280 ${isMale ? 42 : 55},340 L${isMale ? 55 : 68},345 L${isMale ? 68 : 80},340 Q${isMale ? 75 : 88},280 ${isMale ? 85 : 95},220 Q${isMale ? 95 : 102},165 ${isMale ? 105 : 112},140 Z`}/>
        <path d={`M${isMale ? 310 : 294},135 Q${isMale ? 330 : 315},160 ${isMale ? 345 : 330},220 Q${isMale ? 355 : 342},280 ${isMale ? 358 : 345},340 L${isMale ? 345 : 332},345 L${isMale ? 332 : 320},340 Q${isMale ? 325 : 312},280 ${isMale ? 315 : 305},220 Q${isMale ? 305 : 298},165 ${isMale ? 295 : 288},140 Z`}/>
        <path d={`M${isMale ? 140 : 135},345 L${isMale ? 260 : 265},345 Q${isMale ? 270 : 280},370 ${isMale ? 265 : 275},400 L${isMale ? 250 : 255},420 L${isMale ? 150 : 145},420 L${isMale ? 135 : 125},400 Q${isMale ? 130 : 120},370 ${isMale ? 140 : 135},345`}/>
        <path d="M150,415 Q145,480 142,550 Q140,620 138,700 L162,705 L180,700 Q178,620 176,550 Q174,480 172,420 Z"/>
        <path d="M228,420 Q226,480 224,550 Q222,620 220,700 L238,705 L262,700 Q260,620 258,550 Q255,480 250,415 Z"/>
      </g>

      {/* Full spine - prominent from back */}
      <g stroke="rgba(180, 200, 230, 0.7)" strokeWidth="1.5" fill="rgba(180,200,230,0.1)">
        {[...Array(24)].map((_, i) => (
          <g key={`back-spine-${i}`}>
            <rect x="196" y={90 + i * 10} width="8" height="8" rx="2"/>
            <line x1="200" y1={90 + i * 10} x2="200" y2={97 + i * 10} strokeWidth="2"/>
            <line x1="188" y1={94 + i * 10} x2="212" y2={94 + i * 10} strokeOpacity="0.4"/>
          </g>
        ))}
      </g>

      {/* Scapulae - prominent */}
      <path d="M140,140 Q130,175 140,220 Q155,235 175,210 Q182,170 165,140 Z" 
        fill="rgba(180,200,230,0.08)" stroke="rgba(180,200,230,0.5)" strokeWidth="1.5"/>
      <path d="M260,140 Q270,175 260,220 Q245,235 225,210 Q218,170 235,140 Z" 
        fill="rgba(180,200,230,0.08)" stroke="rgba(180,200,230,0.5)" strokeWidth="1.5"/>
      {/* Scapula spines */}
      <line x1="142" y1="160" x2="175" y2="165" stroke="rgba(180,200,230,0.6)" strokeWidth="2"/>
      <line x1="258" y1="160" x2="225" y2="165" stroke="rgba(180,200,230,0.6)" strokeWidth="2"/>

      {/* Back muscles */}
      <g fill="rgba(140, 50, 50, 0.12)" stroke="rgba(160, 60, 60, 0.35)" strokeWidth="0.8">
        {/* Trapezius */}
        <path d="M200,85 Q150,100 130,150 Q145,180 180,175 L200,140 L220,175 Q255,180 270,150 Q250,100 200,85"/>
        {/* Latissimus dorsi */}
        <path d="M145,180 Q130,240 135,300 L175,300 Q170,260 165,200 Q160,180 145,180"/>
        <path d="M255,180 Q270,240 265,300 L225,300 Q230,260 235,200 Q240,180 255,180"/>
        {/* Erector spinae group */}
        <path d="M185,160 Q180,250 183,340" strokeWidth="1" fill="none" opacity="0.6"/>
        <path d="M215,160 Q220,250 217,340" strokeWidth="1" fill="none" opacity="0.6"/>
        {/* Gluteus maximus */}
        <ellipse cx="175" cy="410" rx="30" ry="35"/>
        <ellipse cx="225" cy="410" rx="30" ry="35"/>
        {/* Hamstrings */}
        <ellipse cx="165" cy="500" rx="18" ry="55"/>
        <ellipse cx="235" cy="500" rx="18" ry="55"/>
        {/* Calves - gastrocnemius */}
        <ellipse cx="155" cy="620" rx="15" ry="50"/>
        <ellipse cx="245" cy="620" rx="15" ry="50"/>
      </g>

      {/* Spinal nerves hint */}
      <g stroke="rgba(230, 220, 100, 0.3)" strokeWidth="0.5" fill="none">
        {[...Array(12)].map((_, i) => (
          <g key={`back-nerve-${i}`}>
            <path d={`M200,${120 + i * 18} Q175,${125 + i * 18} 145,${130 + i * 18}`}/>
            <path d={`M200,${120 + i * 18} Q225,${125 + i * 18} 255,${130 + i * 18}`}/>
          </g>
        ))}
      </g>
    </g>
  );

  const isMale = gender === 'male';
  const isBackView = view === 'back';

  return (
    <motion.svg
      viewBox="0 0 400 750"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ 
        pointerEvents: 'none',
        transform: view === 'right' ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      <defs>
        {/* Glow filters */}
        <filter id="anatomyGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="heartPulseFilter" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feFlood floodColor="rgba(220, 50, 80, 0.5)" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="veinGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Scan lines */}
        <pattern id="scanPattern" patternUnits="userSpaceOnUse" width="4" height="4">
          <line x1="0" y1="2" x2="4" y2="2" stroke="rgba(0, 200, 255, 0.05)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Subtle scan lines overlay */}
      <rect width="100%" height="100%" fill="url(#scanPattern)" opacity="0.5" />

      {/* Render based on view and layer */}
      {isBackView ? (
        <g filter="url(#anatomyGlow)">
          {renderBackView(isMale)}
        </g>
      ) : (
        <g filter="url(#anatomyGlow)">
          {/* Base body outline - always visible but subtle */}
          {renderBodyOutline(isMale)}
          
          {/* Skeleton - always visible, intensity based on layer */}
          <g opacity={anatomyLayer === 'skeleton' ? 1 : 0.4}>
            {renderSkeleton(isMale)}
          </g>
          
          {/* Vascular system - always visible, prominent in default */}
          <g opacity={anatomyLayer === 'organs' ? 1 : anatomyLayer === 'skin' ? 0.8 : 0.3} filter="url(#veinGlow)">
            {renderVascularSystem(isMale)}
          </g>
          
          {/* Organs - visible when organs layer selected or skin */}
          {(anatomyLayer === 'organs' || anatomyLayer === 'skin') && (
            <g opacity={anatomyLayer === 'organs' ? 1 : 0.5}>
              {renderOrgans(isMale)}
            </g>
          )}
          
          {/* Nervous system - subtle trace */}
          {(anatomyLayer === 'skeleton' || anatomyLayer === 'skin') && (
            <g opacity={0.5}>
              {renderNervousSystem()}
            </g>
          )}
          
          {/* Muscles - when muscle layer active */}
          {anatomyLayer === 'muscles' && (
            <g opacity={1}>
              {renderMuscleSystem(isMale)}
            </g>
          )}
        </g>
      )}

      {/* Animated heart pulse effect */}
      <style>
        {`
          @keyframes heartPulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.03); }
          }
          .heart {
            animation: heartPulse 1.2s ease-in-out infinite;
            transform-origin: center;
            filter: url(#heartPulseFilter);
          }
        `}
      </style>
    </motion.svg>
  );
};

export default BodySilhouette;
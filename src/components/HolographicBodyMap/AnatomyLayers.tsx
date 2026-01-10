import React from 'react';
import { Gender, BodyView, AnatomyLayer } from './types';
import { motion } from 'framer-motion';

interface AnatomyLayersProps {
  gender: Gender;
  view: BodyView;
  activeLayer: AnatomyLayer;
}

export const AnatomyLayers: React.FC<AnatomyLayersProps> = ({ gender, view, activeLayer }) => {
  // Only render for front and back views (side views show simplified anatomy)
  const showDetailedAnatomy = view === 'front' || view === 'back';

  const renderSkeletonFront = () => (
    <g className="skeleton-layer" fill="none" stroke="rgba(200, 220, 255, 0.7)" strokeWidth="1.2">
      {/* Skull */}
      <ellipse cx="200" cy="48" rx="28" ry="35" strokeWidth="1.5" />
      <ellipse cx="200" cy="55" rx="20" ry="18" strokeOpacity="0.5" />
      {/* Eye sockets */}
      <ellipse cx="188" cy="45" rx="8" ry="6" strokeOpacity="0.6" />
      <ellipse cx="212" cy="45" rx="8" ry="6" strokeOpacity="0.6" />
      {/* Nasal cavity */}
      <path d="M200,52 L196,62 L204,62 Z" strokeOpacity="0.5" />
      {/* Jaw */}
      <path d="M172,55 Q175,80 200,85 Q225,80 228,55" strokeOpacity="0.6" />
      
      {/* Cervical spine (neck) */}
      <rect x="195" y="88" width="10" height="5" rx="2" />
      <rect x="195" y="94" width="10" height="5" rx="2" />
      <rect x="195" y="100" width="10" height="5" rx="2" />
      
      {/* Clavicles */}
      <path d="M200,115 Q165,110 130,125" strokeWidth="2" />
      <path d="M200,115 Q235,110 270,125" strokeWidth="2" />
      
      {/* Sternum */}
      <rect x="195" y="115" width="10" height="80" rx="3" strokeWidth="2" />
      
      {/* Ribs - 12 pairs */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const y = 122 + i * 12;
        const curvature = 15 + i * 2;
        return (
          <g key={i}>
            <path d={`M195,${y} Q${150 - i * 2},${y + curvature} ${140 - i * 3},${y + 25 + i * 2}`} strokeOpacity={0.7 - i * 0.03} />
            <path d={`M205,${y} Q${250 + i * 2},${y + curvature} ${260 + i * 3},${y + 25 + i * 2}`} strokeOpacity={0.7 - i * 0.03} />
          </g>
        );
      })}
      
      {/* Thoracic & Lumbar Spine */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
        <rect key={`spine-${i}`} x="196" y={108 + i * 12} width="8" height="10" rx="2" strokeOpacity={0.6} />
      ))}
      
      {/* Pelvis */}
      <path d="M160,315 Q140,340 145,375" strokeWidth="2" />
      <path d="M240,315 Q260,340 255,375" strokeWidth="2" />
      <path d="M160,315 Q200,300 240,315" strokeWidth="2" />
      <ellipse cx="200" cy="340" rx="35" ry="25" strokeWidth="1.5" />
      {/* Sacrum */}
      <path d="M190,315 L195,365 L205,365 L210,315" strokeOpacity="0.7" />
      
      {/* Scapulae (shoulder blades) - visible hint */}
      <ellipse cx="155" cy="155" rx="18" ry="28" strokeOpacity="0.3" />
      <ellipse cx="245" cy="155" rx="18" ry="28" strokeOpacity="0.3" />
      
      {/* Humerus (upper arm bones) */}
      <line x1="115" y1="135" x2="85" y2="250" strokeWidth="2" />
      <line x1="285" y1="135" x2="315" y2="250" strokeWidth="2" />
      
      {/* Radius & Ulna (forearm) */}
      <line x1="85" y1="255" x2="55" y2="345" strokeWidth="1.5" />
      <line x1="88" y1="255" x2="65" y2="340" strokeWidth="1.5" />
      <line x1="315" y1="255" x2="345" y2="345" strokeWidth="1.5" />
      <line x1="312" y1="255" x2="335" y2="340" strokeWidth="1.5" />
      
      {/* Hands (simplified) */}
      <ellipse cx="52" cy="355" rx="12" ry="8" strokeOpacity="0.6" />
      <ellipse cx="348" cy="355" rx="12" ry="8" strokeOpacity="0.6" />
      
      {/* Femur (thigh bones) */}
      <line x1="165" y1="375" x2="155" y2="530" strokeWidth="2.5" />
      <line x1="235" y1="375" x2="245" y2="530" strokeWidth="2.5" />
      
      {/* Patella (kneecap) */}
      <ellipse cx="155" cy="545" rx="10" ry="12" strokeWidth="1.5" />
      <ellipse cx="245" cy="545" rx="10" ry="12" strokeWidth="1.5" />
      
      {/* Tibia & Fibula (lower leg) */}
      <line x1="152" y1="560" x2="145" y2="690" strokeWidth="2" />
      <line x1="158" y1="560" x2="155" y2="685" strokeWidth="1.5" />
      <line x1="248" y1="560" x2="255" y2="690" strokeWidth="2" />
      <line x1="242" y1="560" x2="245" y2="685" strokeWidth="1.5" />
      
      {/* Feet (simplified) */}
      <ellipse cx="145" cy="702" rx="18" ry="8" strokeOpacity="0.6" />
      <ellipse cx="255" cy="702" rx="18" ry="8" strokeOpacity="0.6" />
    </g>
  );

  const renderSkeletonBack = () => (
    <g className="skeleton-layer" fill="none" stroke="rgba(200, 220, 255, 0.7)" strokeWidth="1.2">
      {/* Skull back */}
      <ellipse cx="200" cy="48" rx="28" ry="35" strokeWidth="1.5" />
      
      {/* Full Spine - prominent from back */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((i) => (
        <g key={`spine-back-${i}`}>
          <rect x="196" y={88 + i * 10} width="8" height="8" rx="2" strokeWidth="1.5" />
          {/* Spinous processes */}
          <line x1="200" y1={88 + i * 10} x2="200" y2={88 + i * 10 + 8} strokeWidth="2" />
          {/* Transverse processes */}
          <line x1="188" y1={92 + i * 10} x2="212" y2={92 + i * 10} strokeOpacity="0.5" />
        </g>
      ))}
      
      {/* Scapulae (shoulder blades) - prominent from back */}
      <path d="M140,130 L155,120 L175,160 L170,200 L145,195 Z" strokeWidth="1.5" />
      <path d="M260,130 L245,120 L225,160 L230,200 L255,195 Z" strokeWidth="1.5" />
      {/* Scapula spines */}
      <line x1="145" y1="145" x2="175" y2="150" strokeWidth="1.5" />
      <line x1="255" y1="145" x2="225" y2="150" strokeWidth="1.5" />
      
      {/* Ribs from back */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const y = 122 + i * 12;
        return (
          <g key={`rib-back-${i}`}>
            <path d={`M196,${y} Q${160},${y + 5} ${130},${y + 20}`} strokeOpacity={0.5 - i * 0.02} />
            <path d={`M204,${y} Q${240},${y + 5} ${270},${y + 20}`} strokeOpacity={0.5 - i * 0.02} />
          </g>
        );
      })}
      
      {/* Pelvis from back */}
      <path d="M160,320 Q140,340 145,375" strokeWidth="2" />
      <path d="M240,320 Q260,340 255,375" strokeWidth="2" />
      <ellipse cx="200" cy="345" rx="38" ry="28" strokeWidth="1.5" />
      
      {/* Arms and legs similar to front */}
      <line x1="120" y1="135" x2="90" y2="250" strokeWidth="2" />
      <line x1="280" y1="135" x2="310" y2="250" strokeWidth="2" />
      <line x1="165" y1="375" x2="155" y2="530" strokeWidth="2.5" />
      <line x1="235" y1="375" x2="245" y2="530" strokeWidth="2.5" />
      <line x1="152" y1="560" x2="145" y2="690" strokeWidth="2" />
      <line x1="248" y1="560" x2="255" y2="690" strokeWidth="2" />
    </g>
  );

  const renderOrgansFront = () => (
    <g className="organs-layer">
      {/* Brain hint in skull */}
      <ellipse cx="200" cy="45" rx="22" ry="28" fill="rgba(255, 182, 193, 0.3)" stroke="rgba(255, 150, 170, 0.6)" strokeWidth="1" />
      <path d="M185,40 Q200,30 215,40" fill="none" stroke="rgba(255, 150, 170, 0.4)" />
      <path d="M185,50 Q200,45 215,50" fill="none" stroke="rgba(255, 150, 170, 0.4)" />
      
      {/* Trachea */}
      <rect x="196" y="90" width="8" height="25" rx="3" fill="rgba(200, 200, 220, 0.3)" stroke="rgba(180, 180, 200, 0.5)" />
      
      {/* Lungs */}
      <path 
        d="M135,135 Q125,180 130,230 Q140,260 165,255 L185,255 L185,135 Q160,130 135,135" 
        fill="rgba(255, 150, 180, 0.25)" 
        stroke="rgba(255, 120, 160, 0.6)" 
        strokeWidth="1.5"
      />
      <path 
        d="M265,135 Q275,180 270,230 Q260,260 235,255 L215,255 L215,135 Q240,130 265,135" 
        fill="rgba(255, 150, 180, 0.25)" 
        stroke="rgba(255, 120, 160, 0.6)" 
        strokeWidth="1.5"
      />
      {/* Lung details - bronchi */}
      <path d="M200,115 L185,130 L165,160" fill="none" stroke="rgba(255, 120, 160, 0.4)" />
      <path d="M200,115 L215,130 L235,160" fill="none" stroke="rgba(255, 120, 160, 0.4)" />
      
      {/* Heart - prominent with glow */}
      <defs>
        <filter id="heartGlowFilter" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feFlood floodColor="rgba(239, 68, 68, 0.5)" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#heartGlowFilter)">
        <path 
          d="M185,165 Q175,145 190,140 Q200,138 210,140 Q225,145 215,165 L200,200 Z" 
          fill="rgba(220, 50, 80, 0.5)" 
          stroke="rgba(239, 68, 68, 0.8)" 
          strokeWidth="2"
          className="animate-pulse"
        />
        {/* Aorta */}
        <path d="M200,140 Q200,120 190,110" fill="none" stroke="rgba(220, 80, 100, 0.6)" strokeWidth="3" />
        <path d="M200,140 Q205,125 220,115" fill="none" stroke="rgba(100, 100, 180, 0.6)" strokeWidth="2" />
      </g>
      
      {/* Liver */}
      <path 
        d="M145,245 Q135,260 140,285 Q150,305 190,305 L220,295 Q235,285 235,265 Q235,250 220,245 Z" 
        fill="rgba(139, 69, 19, 0.35)" 
        stroke="rgba(160, 82, 45, 0.6)" 
        strokeWidth="1.5"
      />
      
      {/* Stomach */}
      <path 
        d="M205,260 Q240,265 245,295 Q245,320 220,330 Q195,335 190,310 Q185,285 205,260" 
        fill="rgba(255, 200, 150, 0.3)" 
        stroke="rgba(255, 180, 130, 0.6)" 
        strokeWidth="1.5"
      />
      
      {/* Intestines (simplified) */}
      <g fill="rgba(255, 180, 170, 0.25)" stroke="rgba(255, 150, 140, 0.5)">
        <ellipse cx="200" cy="365" rx="40" ry="35" />
        <path d="M165,345 Q180,360 175,380 Q185,395 200,390 Q215,395 225,380 Q220,360 235,345" fill="none" strokeOpacity="0.5" />
      </g>
      
      {/* Kidneys */}
      <ellipse cx="155" cy="290" rx="12" ry="20" fill="rgba(139, 90, 90, 0.4)" stroke="rgba(160, 100, 100, 0.6)" />
      <ellipse cx="245" cy="290" rx="12" ry="20" fill="rgba(139, 90, 90, 0.4)" stroke="rgba(160, 100, 100, 0.6)" />
      
      {/* Bladder */}
      <ellipse cx="200" cy="410" rx="20" ry="15" fill="rgba(255, 220, 150, 0.3)" stroke="rgba(255, 200, 120, 0.5)" />
    </g>
  );

  const renderMusclesFront = () => (
    <g className="muscles-layer" fill="rgba(180, 60, 60, 0.2)" stroke="rgba(200, 80, 80, 0.5)" strokeWidth="1">
      {/* Trapezius */}
      <path d="M200,95 L140,135 L155,155 L200,125 L245,155 L260,135 Z" />
      
      {/* Deltoids */}
      <ellipse cx="120" cy="145" rx="22" ry="30" />
      <ellipse cx="280" cy="145" rx="22" ry="30" />
      
      {/* Pectorals */}
      <path d="M145,140 Q150,170 180,185 L200,175 L220,185 Q250,170 255,140 Q200,130 145,140" />
      
      {/* Biceps */}
      <ellipse cx="100" cy="200" rx="15" ry="35" />
      <ellipse cx="300" cy="200" rx="15" ry="35" />
      
      {/* Forearms */}
      <ellipse cx="75" cy="290" rx="12" ry="40" />
      <ellipse cx="325" cy="290" rx="12" ry="40" />
      
      {/* Abs */}
      <rect x="175" y="200" width="22" height="20" rx="3" />
      <rect x="203" y="200" width="22" height="20" rx="3" />
      <rect x="175" y="225" width="22" height="20" rx="3" />
      <rect x="203" y="225" width="22" height="20" rx="3" />
      <rect x="175" y="250" width="22" height="20" rx="3" />
      <rect x="203" y="250" width="22" height="20" rx="3" />
      
      {/* Obliques */}
      <path d="M145,200 Q150,250 155,290" strokeWidth="1.5" fill="none" />
      <path d="M255,200 Q250,250 245,290" strokeWidth="1.5" fill="none" />
      
      {/* Quadriceps */}
      <ellipse cx="165" cy="450" rx="20" ry="60" />
      <ellipse cx="235" cy="450" rx="20" ry="60" />
      
      {/* Calves */}
      <ellipse cx="155" cy="610" rx="15" ry="45" />
      <ellipse cx="245" cy="610" rx="15" ry="45" />
    </g>
  );

  const renderLayer = () => {
    if (!showDetailedAnatomy) return null;

    switch (activeLayer) {
      case 'skeleton':
        return view === 'front' ? renderSkeletonFront() : renderSkeletonBack();
      case 'organs':
        return view === 'front' ? renderOrgansFront() : null;
      case 'muscles':
        return view === 'front' ? renderMusclesFront() : null;
      default:
        return null;
    }
  };

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {renderLayer()}
    </motion.g>
  );
};

export default AnatomyLayers;

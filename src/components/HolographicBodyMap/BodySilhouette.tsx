import React from 'react';
import { Gender, BodyView } from './types';
import { motion } from 'framer-motion';

interface BodySilhouetteProps {
  gender: Gender;
  view: BodyView;
}

export const BodySilhouette: React.FC<BodySilhouetteProps> = ({ gender, view }) => {
  // Get rotation angle based on view
  const getViewTransform = () => {
    switch (view) {
      case 'front': return 'rotateY(0deg)';
      case 'back': return 'rotateY(180deg)';
      case 'left': return 'rotateY(-90deg)';
      case 'right': return 'rotateY(90deg)';
      default: return 'rotateY(0deg)';
    }
  };

  const renderMaleFront = () => (
    <g className="body-paths">
      {/* Head */}
      <ellipse cx="200" cy="50" rx="35" ry="42" />
      {/* Neck */}
      <rect x="185" y="88" width="30" height="25" rx="5" />
      {/* Torso */}
      <path d="M130,113 L270,113 L280,140 L285,200 L280,280 L265,320 L135,320 L120,280 L115,200 L120,140 Z" />
      {/* Shoulders - broader for male */}
      <ellipse cx="115" cy="130" rx="25" ry="18" />
      <ellipse cx="285" cy="130" rx="25" ry="18" />
      {/* Left Arm */}
      <path d="M90,130 L70,145 L55,200 L45,280 L40,340 L50,345 L65,345 L75,280 L85,200 L95,150 Z" />
      {/* Right Arm */}
      <path d="M310,130 L330,145 L345,200 L355,280 L360,340 L350,345 L335,345 L325,280 L315,200 L305,150 Z" />
      {/* Pelvis */}
      <path d="M140,315 L260,315 L265,350 L255,380 L145,380 L135,350 Z" />
      {/* Left Leg */}
      <path d="M145,375 L140,450 L135,530 L130,620 L125,700 L140,705 L160,700 L165,620 L168,530 L170,450 L170,380 Z" />
      {/* Right Leg */}
      <path d="M230,380 L230,450 L232,530 L235,620 L240,700 L260,705 L275,700 L270,620 L265,530 L260,450 L255,375 Z" />
      {/* Skeletal hints - ribs */}
      <path d="M140,150 Q200,140 260,150" strokeOpacity="0.3" fill="none" />
      <path d="M138,170 Q200,160 262,170" strokeOpacity="0.25" fill="none" />
      <path d="M136,190 Q200,180 264,190" strokeOpacity="0.2" fill="none" />
      {/* Heart glow area */}
      <ellipse cx="220" cy="180" rx="25" ry="20" className="heart-glow" />
    </g>
  );

  const renderMaleBack = () => (
    <g className="body-paths">
      {/* Head */}
      <ellipse cx="200" cy="50" rx="35" ry="42" />
      {/* Neck */}
      <rect x="185" y="88" width="30" height="25" rx="5" />
      {/* Torso - Back */}
      <path d="M130,113 L270,113 L280,140 L285,200 L280,280 L265,320 L135,320 L120,280 L115,200 L120,140 Z" />
      {/* Spine indication */}
      <line x1="200" y1="113" x2="200" y2="315" strokeOpacity="0.4" strokeWidth="3" strokeDasharray="8,4" />
      {/* Shoulder blades */}
      <ellipse cx="160" cy="170" rx="30" ry="25" strokeOpacity="0.3" fill="none" />
      <ellipse cx="240" cy="170" rx="30" ry="25" strokeOpacity="0.3" fill="none" />
      {/* Shoulders */}
      <ellipse cx="115" cy="130" rx="25" ry="18" />
      <ellipse cx="285" cy="130" rx="25" ry="18" />
      {/* Arms */}
      <path d="M90,130 L70,145 L55,200 L45,280 L40,340 L50,345 L65,345 L75,280 L85,200 L95,150 Z" />
      <path d="M310,130 L330,145 L345,200 L355,280 L360,340 L350,345 L335,345 L325,280 L315,200 L305,150 Z" />
      {/* Pelvis */}
      <path d="M140,315 L260,315 L265,350 L255,380 L145,380 L135,350 Z" />
      {/* Legs */}
      <path d="M145,375 L140,450 L135,530 L130,620 L125,700 L140,705 L160,700 L165,620 L168,530 L170,450 L170,380 Z" />
      <path d="M230,380 L230,450 L232,530 L235,620 L240,700 L260,705 L275,700 L270,620 L265,530 L260,450 L255,375 Z" />
    </g>
  );

  const renderMaleSide = () => (
    <g className="body-paths">
      {/* Head - side profile */}
      <ellipse cx="200" cy="50" rx="28" ry="42" />
      {/* Face protrusion for side view */}
      <ellipse cx="225" cy="55" rx="15" ry="25" />
      {/* Neck */}
      <rect x="190" y="88" width="25" height="25" rx="5" />
      {/* Torso - side */}
      <path d="M170,113 L230,113 L245,140 L250,200 L245,280 L235,320 L165,320 L155,280 L150,200 L155,140 Z" />
      {/* Arm - visible from side */}
      <path d="M160,125 L140,145 L125,200 L115,280 L110,340 L120,345 L135,345 L145,280 L155,200 L160,150 Z" />
      {/* Back arm hint */}
      <path d="M235,130 L250,150 L260,200 L265,280 L268,340 Z" strokeOpacity="0.3" fill="none" />
      {/* Buttocks */}
      <ellipse cx="175" cy="340" rx="25" ry="30" />
      {/* Leg - side */}
      <path d="M175,365 L172,450 L170,530 L168,620 L165,700 L180,705 L200,700 L202,620 L205,530 L208,450 L210,380 L200,355 Z" />
      {/* Back leg hint */}
      <path d="M190,370 L188,450 L186,530 L184,620 L182,700" strokeOpacity="0.2" fill="none" />
    </g>
  );

  const renderFemaleFront = () => (
    <g className="body-paths">
      {/* Head - slightly smaller */}
      <ellipse cx="200" cy="48" rx="32" ry="40" />
      {/* Neck - slimmer */}
      <rect x="188" y="85" width="24" height="22" rx="5" />
      {/* Torso - feminine shape with waist */}
      <path d="M145,107 L255,107 L265,130 L270,170 L260,210 L255,240 L260,280 L255,320 L145,320 L140,280 L145,240 L140,210 L130,170 L135,130 Z" />
      {/* Shoulders - narrower */}
      <ellipse cx="128" cy="120" rx="20" ry="15" />
      <ellipse cx="272" cy="120" rx="20" ry="15" />
      {/* Chest indication */}
      <ellipse cx="175" cy="155" rx="22" ry="20" strokeOpacity="0.4" />
      <ellipse cx="225" cy="155" rx="22" ry="20" strokeOpacity="0.4" />
      {/* Waist curve */}
      <path d="M145,200 Q200,185 255,200" fill="none" strokeOpacity="0.3" />
      {/* Left Arm - slimmer */}
      <path d="M108,120 L92,135 L78,190 L68,265 L63,330 L72,335 L85,335 L92,265 L100,190 L108,140 Z" />
      {/* Right Arm */}
      <path d="M292,120 L308,135 L322,190 L332,265 L337,330 L328,335 L315,335 L308,265 L300,190 L292,140 Z" />
      {/* Hips - wider */}
      <path d="M140,315 L260,315 L275,355 L268,390 L132,390 L125,355 Z" />
      {/* Left Leg - feminine proportions */}
      <path d="M135,385 L132,460 L128,540 L125,630 L122,710 L138,715 L155,710 L158,630 L160,540 L162,460 L162,390 Z" />
      {/* Right Leg */}
      <path d="M238,390 L238,460 L240,540 L242,630 L245,710 L262,715 L278,710 L275,630 L272,540 L268,460 L265,385 Z" />
      {/* Heart area */}
      <ellipse cx="215" cy="170" rx="22" ry="18" className="heart-glow" />
    </g>
  );

  const renderFemaleBack = () => (
    <g className="body-paths">
      {/* Head */}
      <ellipse cx="200" cy="48" rx="32" ry="40" />
      {/* Neck */}
      <rect x="188" y="85" width="24" height="22" rx="5" />
      {/* Torso - back view with waist */}
      <path d="M145,107 L255,107 L265,130 L270,170 L260,210 L255,240 L260,280 L255,320 L145,320 L140,280 L145,240 L140,210 L130,170 L135,130 Z" />
      {/* Spine */}
      <line x1="200" y1="107" x2="200" y2="320" strokeOpacity="0.35" strokeWidth="2.5" strokeDasharray="6,4" />
      {/* Shoulder blades - smaller */}
      <ellipse cx="165" cy="160" rx="25" ry="22" strokeOpacity="0.25" fill="none" />
      <ellipse cx="235" cy="160" rx="25" ry="22" strokeOpacity="0.25" fill="none" />
      {/* Shoulders */}
      <ellipse cx="128" cy="120" rx="20" ry="15" />
      <ellipse cx="272" cy="120" rx="20" ry="15" />
      {/* Arms */}
      <path d="M108,120 L92,135 L78,190 L68,265 L63,330 L72,335 L85,335 L92,265 L100,190 L108,140 Z" />
      <path d="M292,120 L308,135 L322,190 L332,265 L337,330 L328,335 L315,335 L308,265 L300,190 L292,140 Z" />
      {/* Hips */}
      <path d="M140,315 L260,315 L275,355 L268,390 L132,390 L125,355 Z" />
      {/* Legs */}
      <path d="M135,385 L132,460 L128,540 L125,630 L122,710 L138,715 L155,710 L158,630 L160,540 L162,460 L162,390 Z" />
      <path d="M238,390 L238,460 L240,540 L242,630 L245,710 L262,715 L278,710 L275,630 L272,540 L268,460 L265,385 Z" />
    </g>
  );

  const renderFemaleSide = () => (
    <g className="body-paths">
      {/* Head - side */}
      <ellipse cx="200" cy="48" rx="25" ry="40" />
      <ellipse cx="222" cy="52" rx="12" ry="22" />
      {/* Neck */}
      <rect x="192" y="85" width="20" height="22" rx="5" />
      {/* Torso - side with curves */}
      <path d="M175,107 L225,107 L238,130 L245,165 L240,200 L235,240 L242,280 L238,320 L162,320 L158,280 L165,240 L160,200 L155,165 L162,130 Z" />
      {/* Chest curve - side view */}
      <ellipse cx="235" cy="155" rx="18" ry="22" strokeOpacity="0.3" />
      {/* Arm */}
      <path d="M165,118 L148,135 L135,185 L125,255 L120,320 L130,325 L142,325 L150,255 L160,185 L168,138 Z" />
      {/* Buttocks */}
      <ellipse cx="172" cy="345" rx="22" ry="28" />
      {/* Leg */}
      <path d="M178,368 L175,450 L172,535 L170,625 L168,712 L182,717 L200,712 L202,625 L205,535 L208,450 L210,380 L198,355 Z" />
    </g>
  );

  const renderBody = () => {
    if (gender === 'male') {
      switch (view) {
        case 'front': return renderMaleFront();
        case 'back': return renderMaleBack();
        case 'left':
        case 'right': return renderMaleSide();
        default: return renderMaleFront();
      }
    } else {
      switch (view) {
        case 'front': return renderFemaleFront();
        case 'back': return renderFemaleBack();
        case 'left':
        case 'right': return renderFemaleSide();
        default: return renderFemaleFront();
      }
    }
  };

  return (
    <motion.svg
      viewBox="0 0 400 750"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ 
        pointerEvents: 'none',
        transform: view === 'right' ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      <defs>
        {/* Holographic gradient */}
        <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0, 212, 255, 0.15)" />
          <stop offset="50%" stopColor="rgba(59, 130, 246, 0.1)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.15)" />
        </linearGradient>
        
        {/* Outer glow */}
        <filter id="holoGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="rgba(0, 212, 255, 0.6)" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Neon stroke glow */}
        <filter id="neonGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Heart pulse glow */}
        <filter id="heartPulse" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feFlood floodColor="rgba(239, 68, 68, 0.4)" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Scan line pattern */}
        <pattern id="scanLines" patternUnits="userSpaceOnUse" width="4" height="4">
          <line x1="0" y1="0" x2="4" y2="0" stroke="rgba(0, 212, 255, 0.1)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Background scan lines overlay */}
      <rect width="100%" height="100%" fill="url(#scanLines)" opacity="0.5" />

      {/* Main body group with holographic styling */}
      <g
        fill="url(#holoGradient)"
        stroke="rgba(0, 212, 255, 0.8)"
        strokeWidth="1.5"
        filter="url(#neonGlow)"
      >
        {renderBody()}
      </g>

      {/* Animated pulse effect for heart area */}
      <style>
        {`
          .heart-glow {
            fill: rgba(239, 68, 68, 0.15);
            stroke: rgba(239, 68, 68, 0.4);
            stroke-width: 1;
            filter: url(#heartPulse);
            animation: heartbeat 1.5s ease-in-out infinite;
          }
          @keyframes heartbeat {
            0%, 100% { opacity: 0.3; transform-origin: center; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
        `}
      </style>
    </motion.svg>
  );
};

export default BodySilhouette;

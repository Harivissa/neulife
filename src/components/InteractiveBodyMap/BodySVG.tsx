import React, { useState, useEffect } from 'react';
import { Gender, BodyLayer, BodyView, BodyRegion } from './types';
import { getFilteredRegions, layerStyles } from './regionConfig';
import { cn } from '@/lib/utils';

interface BodySVGProps {
  gender: Gender;
  layer: BodyLayer;
  view: BodyView;
  selectedRegion: string | null;
  onRegionClick: (region: BodyRegion) => void;
  xrayMode: boolean;
  hasLungSymptoms: boolean;
}

export const BodySVG: React.FC<BodySVGProps> = ({
  gender,
  layer,
  view,
  selectedRegion,
  onRegionClick,
  xrayMode,
  hasLungSymptoms,
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const [bloodFlowPhase, setBloodFlowPhase] = useState(0);
  const regions = getFilteredRegions(gender, layer, view);
  const styles = layerStyles[layer];

  // Breathing animation for respiratory system
  useEffect(() => {
    if (layer === 'respiratory' || hasLungSymptoms) {
      const interval = setInterval(() => {
        setBreathPhase((prev) => (prev + 1) % 100);
      }, 40);
      return () => clearInterval(interval);
    }
  }, [layer, hasLungSymptoms]);

  // Blood flow animation for circulatory system
  useEffect(() => {
    if (layer === 'circulatory') {
      const interval = setInterval(() => {
        setBloodFlowPhase((prev) => (prev + 1) % 100);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [layer]);

  // Calculate breathing scale (sine wave for smooth breathing)
  const breathScale = 1 + Math.sin((breathPhase / 100) * Math.PI * 2) * 0.08;
  const breathOpacity = 0.5 + Math.sin((breathPhase / 100) * Math.PI * 2) * 0.3;

  // Transform for different views
  const getViewTransform = () => {
    switch (view) {
      case 'back':
        return 'scale(-1, 1) translate(-300, 0)';
      case 'left':
        return 'scale(0.8, 1) translate(30, 0)';
      case 'right':
        return 'scale(-0.8, 1) translate(-270, 0)';
      default:
        return '';
    }
  };

  // Get X-ray filter styles
  const getXrayStyles = () => {
    if (!xrayMode) return {};
    return {
      filter: 'url(#xrayFilter)',
    };
  };

  // Render body outline based on gender
  const renderBodyOutline = () => {
    const isFemale = gender === 'female';
    const strokeColor = xrayMode ? 'hsl(200 80% 70%)' : 'currentColor';
    const fillOpacity = xrayMode ? 0.05 : 0.15;
    
    return (
      <g className="body-outline" opacity={fillOpacity} stroke={strokeColor} strokeWidth={xrayMode ? 1.5 : 0}>
        {/* Head */}
        <ellipse cx="150" cy="70" rx={isFemale ? 32 : 35} ry={isFemale ? 38 : 40} fill={xrayMode ? 'none' : 'currentColor'} />
        {/* Neck */}
        <rect x="140" y="108" width="20" height={isFemale ? 28 : 32} rx="3" fill={xrayMode ? 'none' : 'currentColor'} />
        {/* Torso */}
        <path
          d={
            isFemale
              ? 'M95,140 Q75,145 70,160 L65,215 Q63,235 68,255 L75,310 Q80,340 100,350 L130,355 L150,358 L170,355 L200,350 Q220,340 225,310 L232,255 Q237,235 235,215 L230,160 Q225,145 205,140 Z'
              : 'M90,140 Q65,145 60,165 L55,220 Q53,245 60,270 L70,320 Q75,350 100,360 L130,365 L150,368 L170,365 L200,360 Q225,350 230,320 L240,270 Q247,245 245,220 L240,165 Q235,145 210,140 Z'
          }
          fill={xrayMode ? 'none' : 'currentColor'}
        />
        {/* Arms */}
        <path
          d={
            isFemale
              ? 'M70,160 Q55,165 50,180 L42,250 Q38,280 40,310 L42,345 M230,160 Q245,165 250,180 L258,250 Q262,280 260,310 L258,345'
              : 'M60,165 Q40,170 35,190 L28,260 Q22,295 25,330 L28,365 M240,165 Q260,170 265,190 L272,260 Q278,295 275,330 L272,365'
          }
          fill="none"
          strokeWidth={xrayMode ? 1.5 : 2}
        />
        {/* Legs */}
        <path
          d={
            isFemale
              ? 'M100,350 Q95,380 100,430 L105,490 Q108,530 110,560 L108,590 M200,350 Q205,380 200,430 L195,490 Q192,530 190,560 L192,590'
              : 'M100,360 Q90,395 95,450 L100,510 Q103,550 105,580 L102,610 M200,360 Q210,395 205,450 L200,510 Q197,550 195,580 L198,610'
          }
          fill="none"
          strokeWidth={xrayMode ? 1.5 : 2}
        />
      </g>
    );
  };

  // Render X-ray skeleton
  const renderXraySkeleton = () => {
    if (!xrayMode) return null;
    
    return (
      <g className="xray-skeleton" opacity="0.9">
        {/* Skull */}
        <ellipse cx="150" cy="65" rx="28" ry="32" fill="none" stroke="hsl(200 70% 75%)" strokeWidth="2" />
        <ellipse cx="150" cy="55" rx="22" ry="20" fill="none" stroke="hsl(200 60% 65%)" strokeWidth="1" opacity="0.5" />
        {/* Eye sockets */}
        <ellipse cx="140" cy="60" rx="8" ry="6" fill="hsl(200 80% 15%)" stroke="hsl(200 70% 65%)" strokeWidth="1" />
        <ellipse cx="160" cy="60" rx="8" ry="6" fill="hsl(200 80% 15%)" stroke="hsl(200 70% 65%)" strokeWidth="1" />
        {/* Jaw */}
        <path d="M130,80 Q150,100 170,80" fill="none" stroke="hsl(200 70% 70%)" strokeWidth="2" />
        
        {/* Cervical spine */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={`cervical-${i}`} x="146" y={112 + i * 4} width="8" height="3" rx="1" fill="hsl(200 60% 70%)" opacity="0.8" />
        ))}
        
        {/* Clavicles */}
        <path d="M150,140 Q120,135 95,145" fill="none" stroke="hsl(200 70% 75%)" strokeWidth="3" />
        <path d="M150,140 Q180,135 205,145" fill="none" stroke="hsl(200 70% 75%)" strokeWidth="3" />
        
        {/* Ribcage */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <g key={`rib-${i}`}>
            <ellipse
              cx="150"
              cy={152 + i * 10}
              rx={50 - i * 2}
              ry="4"
              fill="none"
              stroke="hsl(200 70% 70%)"
              strokeWidth="2"
              opacity={0.7 - i * 0.03}
            />
          </g>
        ))}
        
        {/* Sternum */}
        <rect x="147" y="145" width="6" height="80" rx="2" fill="hsl(200 65% 65%)" opacity="0.7" />
        
        {/* Thoracic spine */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <rect key={`thoracic-${i}`} x="145" y={145 + i * 8} width="10" height="6" rx="2" fill="hsl(200 60% 72%)" opacity="0.85" />
        ))}
        
        {/* Lumbar spine */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={`lumbar-${i}`} x="143" y={240 + i * 12} width="14" height="10" rx="3" fill="hsl(200 60% 70%)" opacity="0.9" />
        ))}
        
        {/* Pelvis */}
        <path
          d="M100,300 Q120,280 150,285 Q180,280 200,300 Q210,330 195,350 L105,350 Q90,330 100,300"
          fill="none"
          stroke="hsl(200 70% 72%)"
          strokeWidth="3"
        />
        <ellipse cx="120" cy="320" rx="15" ry="18" fill="hsl(200 80% 15%)" stroke="hsl(200 65% 68%)" strokeWidth="2" />
        <ellipse cx="180" cy="320" rx="15" ry="18" fill="hsl(200 80% 15%)" stroke="hsl(200 65% 68%)" strokeWidth="2" />
        
        {/* Sacrum */}
        <path d="M140,300 L160,300 L155,340 L145,340 Z" fill="hsl(200 60% 65%)" opacity="0.7" />
        
        {/* Femurs */}
        <line x1="120" y1="350" x2="115" y2="450" stroke="hsl(200 70% 72%)" strokeWidth="6" strokeLinecap="round" />
        <line x1="180" y1="350" x2="185" y2="450" stroke="hsl(200 70% 72%)" strokeWidth="6" strokeLinecap="round" />
        
        {/* Knees */}
        <ellipse cx="115" cy="455" rx="12" ry="8" fill="hsl(200 65% 65%)" />
        <ellipse cx="185" cy="455" rx="12" ry="8" fill="hsl(200 65% 65%)" />
        
        {/* Tibia/Fibula */}
        <line x1="115" y1="465" x2="118" y2="550" stroke="hsl(200 70% 70%)" strokeWidth="5" strokeLinecap="round" />
        <line x1="112" y1="465" x2="115" y2="545" stroke="hsl(200 60% 60%)" strokeWidth="2" strokeLinecap="round" />
        <line x1="185" y1="465" x2="182" y2="550" stroke="hsl(200 70% 70%)" strokeWidth="5" strokeLinecap="round" />
        <line x1="188" y1="465" x2="185" y2="545" stroke="hsl(200 60% 60%)" strokeWidth="2" strokeLinecap="round" />
        
        {/* Feet */}
        <path d="M105,555 L130,555 L135,580 L100,580 Z" fill="none" stroke="hsl(200 65% 68%)" strokeWidth="2" />
        <path d="M170,555 L195,555 L200,580 L165,580 Z" fill="none" stroke="hsl(200 65% 68%)" strokeWidth="2" />
        
        {/* Arms - Humerus */}
        <line x1="95" y1="150" x2="75" y2="230" stroke="hsl(200 70% 70%)" strokeWidth="5" strokeLinecap="round" />
        <line x1="205" y1="150" x2="225" y2="230" stroke="hsl(200 70% 70%)" strokeWidth="5" strokeLinecap="round" />
        
        {/* Elbows */}
        <ellipse cx="73" cy="235" rx="8" ry="6" fill="hsl(200 65% 65%)" />
        <ellipse cx="227" cy="235" rx="8" ry="6" fill="hsl(200 65% 65%)" />
        
        {/* Radius/Ulna */}
        <line x1="73" y1="240" x2="60" y2="320" stroke="hsl(200 70% 68%)" strokeWidth="4" strokeLinecap="round" />
        <line x1="70" y1="240" x2="55" y2="315" stroke="hsl(200 60% 58%)" strokeWidth="2" strokeLinecap="round" />
        <line x1="227" y1="240" x2="240" y2="320" stroke="hsl(200 70% 68%)" strokeWidth="4" strokeLinecap="round" />
        <line x1="230" y1="240" x2="245" y2="315" stroke="hsl(200 60% 58%)" strokeWidth="2" strokeLinecap="round" />
        
        {/* Hands */}
        <path d="M50,320 L70,320 L72,350 L48,350 Z" fill="none" stroke="hsl(200 65% 65%)" strokeWidth="2" />
        <path d="M230,320 L250,320 L252,350 L228,350 Z" fill="none" stroke="hsl(200 65% 65%)" strokeWidth="2" />
      </g>
    );
  };

  // Render respiratory system
  const renderRespiratorySystem = () => {
    if (layer !== 'respiratory' && !hasLungSymptoms) return null;
    
    const isActive = layer === 'respiratory' || hasLungSymptoms;
    const lungColor = isActive ? `hsl(200 70% 55% / ${breathOpacity})` : 'hsl(200 60% 50% / 0.4)';
    
    return (
      <g className="respiratory-system">
        {/* Trachea */}
        <path
          d="M145,100 L155,100 L155,150 L145,150 Z"
          fill="hsl(200 50% 60% / 0.6)"
          stroke="hsl(200 60% 45%)"
          strokeWidth="1"
        />
        
        {/* Bronchi */}
        <path
          d="M150,150 Q130,160 110,175"
          fill="none"
          stroke="hsl(200 60% 50%)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M150,150 Q170,160 190,175"
          fill="none"
          stroke="hsl(200 60% 50%)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Bronchioles */}
        <g opacity="0.6">
          <path d="M110,175 Q100,185 95,200" fill="none" stroke="hsl(200 55% 55%)" strokeWidth="2" />
          <path d="M110,175 Q115,190 120,205" fill="none" stroke="hsl(200 55% 55%)" strokeWidth="2" />
          <path d="M190,175 Q200,185 205,200" fill="none" stroke="hsl(200 55% 55%)" strokeWidth="2" />
          <path d="M190,175 Q185,190 180,205" fill="none" stroke="hsl(200 55% 55%)" strokeWidth="2" />
        </g>
        
        {/* Left Lung */}
        <g transform={`translate(110, 180) scale(${breathScale})`} style={{ transformOrigin: '110px 180px' }}>
          <path
            d="M-20,-10 Q-35,0 -40,30 Q-42,60 -35,80 Q-25,95 0,95 Q20,90 25,70 Q30,40 20,10 Q10,-5 -20,-10"
            fill={lungColor}
            stroke="hsl(200 65% 45%)"
            strokeWidth="1.5"
          >
            {isActive && (
              <animate
                attributeName="opacity"
                values="0.5;0.8;0.5"
                dur="3s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </g>
        
        {/* Right Lung */}
        <g transform={`translate(190, 180) scale(${breathScale})`} style={{ transformOrigin: '190px 180px' }}>
          <path
            d="M20,-10 Q35,0 40,30 Q42,60 35,80 Q25,95 0,95 Q-20,90 -25,70 Q-30,40 -20,10 Q-10,-5 20,-10"
            fill={lungColor}
            stroke="hsl(200 65% 45%)"
            strokeWidth="1.5"
          >
            {isActive && (
              <animate
                attributeName="opacity"
                values="0.5;0.8;0.5"
                dur="3s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </g>
        
        {/* Diaphragm */}
        <path
          d={`M80,${275 - breathPhase * 0.1} Q150,${290 - breathPhase * 0.15} 220,${275 - breathPhase * 0.1}`}
          fill="none"
          stroke="hsl(340 50% 55%)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        
        {/* Alveoli indicators (tiny circles in lungs) */}
        {isActive && (
          <g opacity={breathOpacity * 0.6}>
            {[...Array(12)].map((_, i) => (
              <circle
                key={`alveoli-l-${i}`}
                cx={85 + (i % 4) * 10}
                cy={185 + Math.floor(i / 4) * 15}
                r={2 + Math.sin((breathPhase + i * 10) / 100 * Math.PI * 2)}
                fill="hsl(200 80% 70%)"
              />
            ))}
            {[...Array(12)].map((_, i) => (
              <circle
                key={`alveoli-r-${i}`}
                cx={185 + (i % 4) * 10}
                cy={185 + Math.floor(i / 4) * 15}
                r={2 + Math.sin((breathPhase + i * 10) / 100 * Math.PI * 2)}
                fill="hsl(200 80% 70%)"
              />
            ))}
          </g>
        )}
        
        {/* Oxygen particles animation */}
        {isActive && (
          <g className="oxygen-particles">
            {[...Array(8)].map((_, i) => {
              const progress = ((breathPhase + i * 12.5) % 100) / 100;
              const y = 100 + progress * 180;
              const x = i < 4 ? 100 + Math.sin(progress * Math.PI) * 20 : 200 - Math.sin(progress * Math.PI) * 20;
              return (
                <circle
                  key={`o2-${i}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="hsl(200 90% 65%)"
                  opacity={1 - progress}
                />
              );
            })}
          </g>
        )}
      </g>
    );
  };

  // Render nervous system background lines
  const renderNervousSystemLines = () => {
    if (layer !== 'nervous') return null;
    
    return (
      <g className="nervous-system-lines" opacity="0.3">
        {/* Spinal cord */}
        <line x1="150" y1="90" x2="150" y2="320" stroke="hsl(45 90% 55%)" strokeWidth="3" />
        {/* Major nerve branches */}
        <path
          d="M150,150 Q120,160 90,180 M150,150 Q180,160 210,180"
          stroke="hsl(45 90% 55%)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M150,200 Q130,210 100,230 M150,200 Q170,210 200,230"
          stroke="hsl(45 90% 55%)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M150,320 Q130,350 120,400 L115,500 M150,320 Q170,350 180,400 L185,500"
          stroke="hsl(45 90% 55%)"
          strokeWidth="2"
          fill="none"
        />
      </g>
    );
  };

  // Render circulatory system with blood flow animation
  const renderCirculatorySystem = () => {
    if (layer !== 'circulatory') return null;
    
    const progress = bloodFlowPhase / 100;
    
    // Artery paths (red - oxygenated blood from heart)
    const arteryPaths = [
      // Aorta
      { d: 'M150,180 L150,160 Q150,145 160,145 L180,145', type: 'main' },
      { d: 'M150,180 L150,200 L150,250 L150,300', type: 'main' },
      // Carotid arteries (to head)
      { d: 'M160,145 Q165,130 160,115 L160,80', type: 'branch' },
      { d: 'M150,145 Q135,130 140,115 L140,80', type: 'branch' },
      // Subclavian arteries (to arms)
      { d: 'M180,145 Q200,140 210,160 L225,230 L235,300', type: 'branch' },
      { d: 'M150,145 Q100,140 90,160 L75,230 L65,300', type: 'branch' },
      // Iliac arteries (to legs)
      { d: 'M150,300 Q145,310 130,320 L120,400 L115,500', type: 'branch' },
      { d: 'M150,300 Q155,310 170,320 L180,400 L185,500', type: 'branch' },
    ];
    
    // Vein paths (blue - deoxygenated blood to heart)
    const veinPaths = [
      // Vena cava
      { d: 'M140,180 L140,160 Q140,145 130,145 L110,145', type: 'main' },
      { d: 'M140,180 L140,200 L140,250 L140,300', type: 'main' },
      // Jugular veins (from head)
      { d: 'M130,145 Q125,130 130,115 L130,80', type: 'branch' },
      { d: 'M145,145 Q150,130 145,115 L145,80', type: 'branch' },
      // From arms
      { d: 'M110,145 Q85,140 75,160 L60,230 L50,300', type: 'branch' },
      { d: 'M140,145 Q215,140 225,160 L240,230 L250,300', type: 'branch' },
      // From legs
      { d: 'M140,300 Q135,310 120,320 L110,400 L105,500', type: 'branch' },
      { d: 'M140,300 Q145,310 160,320 L170,400 L175,500', type: 'branch' },
    ];

    return (
      <g className="circulatory-system">
        {/* Heart - central pump */}
        <g className="heart">
          <path
            d="M130,165 C115,155 115,175 130,190 L150,210 L170,190 C185,175 185,155 170,165 C160,155 140,155 130,165"
            fill="hsl(0 70% 45%)"
            stroke="hsl(0 80% 35%)"
            strokeWidth="2"
          >
            <animate
              attributeName="transform"
              values="scale(1);scale(1.05);scale(1)"
              dur="0.8s"
              repeatCount="indefinite"
              keyTimes="0;0.15;1"
            />
          </path>
          {/* Atria */}
          <ellipse cx="140" cy="162" rx="12" ry="8" fill="hsl(0 60% 55%)" opacity="0.8" />
          <ellipse cx="160" cy="162" rx="12" ry="8" fill="hsl(0 60% 55%)" opacity="0.8" />
        </g>

        {/* Arteries (oxygenated - red) */}
        <g className="arteries">
          {arteryPaths.map((path, i) => (
            <path
              key={`artery-${i}`}
              d={path.d}
              fill="none"
              stroke="hsl(0 80% 50%)"
              strokeWidth={path.type === 'main' ? 4 : 2.5}
              strokeLinecap="round"
              opacity={0.8}
            />
          ))}
        </g>

        {/* Veins (deoxygenated - blue) */}
        <g className="veins">
          {veinPaths.map((path, i) => (
            <path
              key={`vein-${i}`}
              d={path.d}
              fill="none"
              stroke="hsl(220 70% 50%)"
              strokeWidth={path.type === 'main' ? 3.5 : 2}
              strokeLinecap="round"
              opacity={0.7}
            />
          ))}
        </g>

        {/* Capillary networks */}
        <g className="capillaries" opacity="0.4">
          {/* Head capillaries */}
          <circle cx="150" cy="70" r="20" fill="none" stroke="hsl(280 50% 60%)" strokeWidth="0.5" strokeDasharray="2,2" />
          {/* Hand capillaries */}
          <circle cx="60" cy="320" r="15" fill="none" stroke="hsl(280 50% 60%)" strokeWidth="0.5" strokeDasharray="2,2" />
          <circle cx="240" cy="320" r="15" fill="none" stroke="hsl(280 50% 60%)" strokeWidth="0.5" strokeDasharray="2,2" />
          {/* Foot capillaries */}
          <circle cx="115" cy="560" r="12" fill="none" stroke="hsl(280 50% 60%)" strokeWidth="0.5" strokeDasharray="2,2" />
          <circle cx="185" cy="560" r="12" fill="none" stroke="hsl(280 50% 60%)" strokeWidth="0.5" strokeDasharray="2,2" />
        </g>

        {/* Animated blood cells in arteries */}
        <g className="blood-cells-arteries">
          {[...Array(12)].map((_, i) => {
            const pathIndex = i % arteryPaths.length;
            const offset = ((progress * 100 + i * 8.3) % 100) / 100;
            return (
              <circle
                key={`arterial-cell-${i}`}
                r="3"
                fill="hsl(0 90% 55%)"
                opacity={0.9}
              >
                <animateMotion
                  dur={`${2 + pathIndex * 0.3}s`}
                  repeatCount="indefinite"
                  path={arteryPaths[pathIndex].d}
                  begin={`${i * 0.2}s`}
                />
              </circle>
            );
          })}
        </g>

        {/* Animated blood cells in veins */}
        <g className="blood-cells-veins">
          {[...Array(10)].map((_, i) => {
            const pathIndex = i % veinPaths.length;
            return (
              <circle
                key={`venous-cell-${i}`}
                r="2.5"
                fill="hsl(220 80% 45%)"
                opacity={0.85}
              >
                <animateMotion
                  dur={`${2.5 + pathIndex * 0.3}s`}
                  repeatCount="indefinite"
                  path={veinPaths[pathIndex].d}
                  begin={`${i * 0.25}s`}
                />
              </circle>
            );
          })}
        </g>

        {/* Pulse waves */}
        <g className="pulse-waves">
          {[0, 1, 2].map((i) => {
            const delay = i * 0.3;
            return (
              <circle
                key={`pulse-${i}`}
                cx="150"
                cy="185"
                r="10"
                fill="none"
                stroke="hsl(0 80% 60%)"
                strokeWidth="2"
                opacity="0"
              >
                <animate
                  attributeName="r"
                  values="10;40"
                  dur="1.5s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0"
                  dur="1.5s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}
        </g>
      </g>
    );
  };

  // Render skeleton background
  const renderSkeletonBackground = () => {
    if (layer !== 'skeleton' || xrayMode) return null;
    
    return (
      <g className="skeleton-bg" opacity="0.2">
        {/* Ribcage */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse
            key={i}
            cx="150"
            cy={155 + i * 12}
            rx={55 - i * 3}
            ry="5"
            stroke="hsl(45 15% 50%)"
            strokeWidth="2"
            fill="none"
          />
        ))}
        {/* Spine */}
        <line x1="150" y1="115" x2="150" y2="310" stroke="hsl(45 15% 50%)" strokeWidth="4" />
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 300 620"
      className="w-full h-full max-h-[500px]"
      style={xrayMode ? { background: 'linear-gradient(180deg, hsl(210 30% 8%) 0%, hsl(210 25% 12%) 100%)' } : undefined}
    >
      <defs>
        {/* Glow filter for hover effects */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* X-ray filter */}
        <filter id="xrayFilter" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix
            type="matrix"
            values="0.3 0.6 0.1 0 0
                    0.3 0.6 0.1 0 0
                    0.4 0.7 0.2 0 0.1
                    0   0   0   1 0"
          />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        
        {/* X-ray glow */}
        <filter id="xrayGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="hsl(200 80% 60%)" floodOpacity="0.3" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* CT scan lines pattern */}
        <pattern id="ctScanLines" patternUnits="userSpaceOnUse" width="300" height="4">
          <line x1="0" y1="0" x2="300" y2="0" stroke="hsl(200 50% 50%)" strokeWidth="0.5" opacity="0.1" />
        </pattern>
        
        {/* Gradient for organs */}
        <linearGradient id="organGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(340 60% 55%)" />
          <stop offset="100%" stopColor="hsl(340 60% 40%)" />
        </linearGradient>
        
        {/* Pattern for muscles */}
        <pattern id="musclePattern" patternUnits="userSpaceOnUse" width="8" height="8">
          <line x1="0" y1="0" x2="8" y2="8" stroke="hsl(0 50% 35%)" strokeWidth="0.5" opacity="0.3" />
        </pattern>
        
        {/* Breathing gradient for lungs */}
        <radialGradient id="lungGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(200 70% 65%)" />
          <stop offset="100%" stopColor="hsl(200 60% 45%)" />
        </radialGradient>
      </defs>

      {/* X-ray scan lines overlay */}
      {xrayMode && (
        <rect x="0" y="0" width="300" height="620" fill="url(#ctScanLines)" />
      )}

      <g transform={getViewTransform()} style={getXrayStyles()}>
        {/* X-ray skeleton (rendered first, behind everything else) */}
        {xrayMode && renderXraySkeleton()}
        
        {/* Background body outline */}
        {renderBodyOutline()}
        
        {/* Layer-specific backgrounds */}
        {!xrayMode && renderSkeletonBackground()}
        {renderNervousSystemLines()}
        
        {/* Respiratory system with breathing animation */}
        {renderRespiratorySystem()}
        
        {/* Circulatory system with blood flow */}
        {renderCirculatorySystem()}

        {/* Interactive regions */}
        {!xrayMode && regions.map((region) => {
          const isHovered = hoveredRegion === region.id;
          const isSelected = selectedRegion === region.id;
          
          let fill = styles.fill;
          if (isSelected) fill = styles.activeFill;
          else if (isHovered) fill = styles.hoverFill;

          return (
            <g key={region.id}>
              <path
                d={region.path}
                fill={fill}
                stroke={styles.stroke}
                strokeWidth={isHovered || isSelected ? 2 : 1}
                className={cn(
                  'cursor-pointer transition-all duration-200',
                  isHovered && 'filter-none'
                )}
                filter={isSelected ? 'url(#glow)' : undefined}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => onRegionClick(region)}
              />
              
              {/* Muscle fiber pattern overlay */}
              {layer === 'muscles' && (
                <path
                  d={region.path}
                  fill="url(#musclePattern)"
                  pointerEvents="none"
                  opacity="0.5"
                />
              )}
            </g>
          );
        })}
      </g>

      {/* X-ray vignette effect */}
      {xrayMode && (
        <g>
          <defs>
            <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
              <stop offset="60%" stopColor="transparent" />
              <stop offset="100%" stopColor="hsl(210 30% 5% / 0.8)" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="300" height="620" fill="url(#vignette)" pointerEvents="none" />
        </g>
      )}

      {/* Hover tooltip */}
      {hoveredRegion && !xrayMode && (
        <g className="pointer-events-none">
          <rect
            x="10"
            y="580"
            width="280"
            height="30"
            rx="6"
            fill="hsl(var(--popover))"
            stroke="hsl(var(--border))"
          />
          <text
            x="150"
            y="600"
            textAnchor="middle"
            fill="hsl(var(--popover-foreground))"
            fontSize="14"
            fontWeight="500"
          >
            {regions.find((r) => r.id === hoveredRegion)?.label || ''}
          </text>
        </g>
      )}
      
      {/* X-ray mode label */}
      {xrayMode && (
        <g className="pointer-events-none">
          <text
            x="150"
            y="600"
            textAnchor="middle"
            fill="hsl(200 70% 60%)"
            fontSize="12"
            fontFamily="monospace"
          >
            X-RAY MODE • CT SCAN VIEW
          </text>
        </g>
      )}
    </svg>
  );
};

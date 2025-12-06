import React, { useState } from 'react';
import { Gender, BodyLayer, BodyView, RegionData, BodyRegion } from './types';
import { getFilteredRegions, layerStyles } from './regionConfig';
import { cn } from '@/lib/utils';

interface BodySVGProps {
  gender: Gender;
  layer: BodyLayer;
  view: BodyView;
  selectedRegion: string | null;
  onRegionClick: (region: BodyRegion) => void;
}

export const BodySVG: React.FC<BodySVGProps> = ({
  gender,
  layer,
  view,
  selectedRegion,
  onRegionClick,
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const regions = getFilteredRegions(gender, layer, view);
  const styles = layerStyles[layer];

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

  // Render body outline based on gender
  const renderBodyOutline = () => {
    const isFemale = gender === 'female';
    
    return (
      <g className="body-outline" opacity="0.15">
        {/* Head */}
        <ellipse cx="150" cy="70" rx={isFemale ? 32 : 35} ry={isFemale ? 38 : 40} />
        {/* Neck */}
        <rect x="140" y="108" width="20" height={isFemale ? 28 : 32} rx="3" />
        {/* Torso */}
        <path
          d={
            isFemale
              ? 'M95,140 Q75,145 70,160 L65,215 Q63,235 68,255 L75,310 Q80,340 100,350 L130,355 L150,358 L170,355 L200,350 Q220,340 225,310 L232,255 Q237,235 235,215 L230,160 Q225,145 205,140 Z'
              : 'M90,140 Q65,145 60,165 L55,220 Q53,245 60,270 L70,320 Q75,350 100,360 L130,365 L150,368 L170,365 L200,360 Q225,350 230,320 L240,270 Q247,245 245,220 L240,165 Q235,145 210,140 Z'
          }
        />
        {/* Arms */}
        <path
          d={
            isFemale
              ? 'M70,160 Q55,165 50,180 L42,250 Q38,280 40,310 L42,345 M230,160 Q245,165 250,180 L258,250 Q262,280 260,310 L258,345'
              : 'M60,165 Q40,170 35,190 L28,260 Q22,295 25,330 L28,365 M240,165 Q260,170 265,190 L272,260 Q278,295 275,330 L272,365'
          }
        />
        {/* Legs */}
        <path
          d={
            isFemale
              ? 'M100,350 Q95,380 100,430 L105,490 Q108,530 110,560 L108,590 M200,350 Q205,380 200,430 L195,490 Q192,530 190,560 L192,590'
              : 'M100,360 Q90,395 95,450 L100,510 Q103,550 105,580 L102,610 M200,360 Q210,395 205,450 L200,510 Q197,550 195,580 L198,610'
          }
        />
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

  // Render skeleton background
  const renderSkeletonBackground = () => {
    if (layer !== 'skeleton') return null;
    
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
      style={{ filter: layer === 'skeleton' ? 'contrast(1.1)' : undefined }}
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
        
        {/* Gradient for organs */}
        <linearGradient id="organGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(340 60% 55%)" />
          <stop offset="100%" stopColor="hsl(340 60% 40%)" />
        </linearGradient>
        
        {/* Pattern for muscles */}
        <pattern id="musclePattern" patternUnits="userSpaceOnUse" width="8" height="8">
          <line x1="0" y1="0" x2="8" y2="8" stroke="hsl(0 50% 35%)" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>

      <g transform={getViewTransform()}>
        {/* Background body outline */}
        {renderBodyOutline()}
        
        {/* Layer-specific backgrounds */}
        {renderSkeletonBackground()}
        {renderNervousSystemLines()}

        {/* Interactive regions */}
        {regions.map((region) => {
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

      {/* Hover tooltip */}
      {hoveredRegion && (
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
    </svg>
  );
};

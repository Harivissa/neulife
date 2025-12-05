import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Eye, Layers, Heart } from "lucide-react";

type BodyLayer = "skin" | "muscle" | "skeleton" | "organs";

interface BodyPart {
  name: string;
  anatomicalName: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  symptoms: string[];
  colors: Record<Exclude<BodyLayer, "organs">, string>;
  shape: "sphere" | "capsule" | "cylinder" | "box";
}

interface Organ {
  name: string;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  symptoms: string[];
  shape: "sphere" | "capsule" | "box" | "kidney";
}

const organs: Organ[] = [
  {
    name: "Heart",
    position: [-0.06, 1.05, 0.05],
    scale: [0.08, 0.1, 0.06],
    color: "#DC2626",
    symptoms: ["heart palpitations", "chest pain", "irregular heartbeat", "heart racing", "cardiac pain"],
    shape: "sphere",
  },
  {
    name: "Left Lung",
    position: [-0.15, 1.0, 0],
    scale: [0.1, 0.18, 0.08],
    color: "#F472B6",
    symptoms: ["difficulty breathing", "shortness of breath", "lung pain", "cough", "wheezing"],
    shape: "capsule",
  },
  {
    name: "Right Lung",
    position: [0.15, 1.0, 0],
    scale: [0.12, 0.2, 0.1],
    color: "#F472B6",
    symptoms: ["difficulty breathing", "shortness of breath", "lung pain", "cough", "wheezing"],
    shape: "capsule",
  },
  {
    name: "Liver",
    position: [0.12, 0.72, 0.03],
    scale: [0.14, 0.1, 0.08],
    color: "#92400E",
    symptoms: ["liver pain", "jaundice", "abdominal pain right side", "nausea", "fatigue"],
    shape: "box",
  },
  {
    name: "Stomach",
    position: [-0.08, 0.7, 0.04],
    scale: [0.1, 0.08, 0.06],
    color: "#FCD34D",
    symptoms: ["stomach pain", "nausea", "indigestion", "bloating", "acid reflux"],
    shape: "kidney",
  },
  {
    name: "Left Kidney",
    position: [-0.12, 0.6, -0.05],
    scale: [0.05, 0.08, 0.04],
    color: "#7C3AED",
    symptoms: ["kidney pain", "back pain", "urinary issues", "kidney stones"],
    shape: "kidney",
  },
  {
    name: "Right Kidney",
    position: [0.12, 0.58, -0.05],
    scale: [0.05, 0.08, 0.04],
    color: "#7C3AED",
    symptoms: ["kidney pain", "back pain", "urinary issues", "kidney stones"],
    shape: "kidney",
  },
  {
    name: "Intestines",
    position: [0, 0.5, 0.02],
    scale: [0.18, 0.12, 0.08],
    color: "#FB923C",
    symptoms: ["abdominal cramps", "digestive issues", "constipation", "diarrhea", "bloating"],
    shape: "capsule",
  },
];

const bodyParts: BodyPart[] = [
  // Head
  { 
    name: "Head", 
    anatomicalName: "Cranium", 
    position: [0, 1.65, 0], 
    scale: [0.22, 0.28, 0.24], 
    symptoms: ["headache", "dizziness", "migraine", "head pain", "vision problems"], 
    colors: { skin: "#F8D9C4", muscle: "#C94C4C", skeleton: "#E8E4D9" },
    shape: "sphere" 
  },
  
  // Neck
  { 
    name: "Neck", 
    anatomicalName: "Cervical Spine", 
    position: [0, 1.32, 0], 
    scale: [0.08, 0.12, 0.08], 
    symptoms: ["neck pain", "stiff neck", "sore throat", "difficulty swallowing"], 
    colors: { skin: "#F8D9C4", muscle: "#B84A4A", skeleton: "#D9D5C8" },
    shape: "cylinder" 
  },
  
  // Torso
  { 
    name: "Chest", 
    anatomicalName: "Thorax / Ribcage", 
    position: [0, 1.0, 0], 
    scale: [0.32, 0.28, 0.18], 
    symptoms: ["chest pain", "difficulty breathing", "heart palpitations", "shortness of breath", "cough"], 
    colors: { skin: "#F8D9C4", muscle: "#C94C4C", skeleton: "#E8E4D9" },
    shape: "capsule" 
  },
  { 
    name: "Abdomen", 
    anatomicalName: "Abdominal Region", 
    position: [0, 0.65, 0], 
    scale: [0.28, 0.22, 0.16], 
    symptoms: ["stomach pain", "nausea", "bloating", "abdominal cramps", "indigestion"], 
    colors: { skin: "#F8D9C4", muscle: "#D45A5A", skeleton: "#D9D5C8" },
    shape: "capsule" 
  },
  { 
    name: "Pelvis", 
    anatomicalName: "Pelvic Girdle", 
    position: [0, 0.38, 0], 
    scale: [0.3, 0.15, 0.16], 
    symptoms: ["pelvic pain", "hip pain", "groin pain", "urinary issues"], 
    colors: { skin: "#F8D9C4", muscle: "#C94C4C", skeleton: "#E8E4D9" },
    shape: "capsule" 
  },
  
  // Back
  { 
    name: "Upper Back", 
    anatomicalName: "Thoracic Spine", 
    position: [0, 1.0, -0.1], 
    scale: [0.3, 0.26, 0.1], 
    symptoms: ["upper back pain", "spine pain", "shoulder blade pain", "posture pain"], 
    colors: { skin: "#E8C9B4", muscle: "#B84A4A", skeleton: "#D9D5C8" },
    shape: "box" 
  },
  { 
    name: "Lower Back", 
    anatomicalName: "Lumbar Spine", 
    position: [0, 0.55, -0.09], 
    scale: [0.26, 0.22, 0.1], 
    symptoms: ["lower back pain", "sciatica", "lumbar pain", "back stiffness"], 
    colors: { skin: "#E8C9B4", muscle: "#C94C4C", skeleton: "#E8E4D9" },
    shape: "box" 
  },
  
  // Arms
  { 
    name: "Left Shoulder", 
    anatomicalName: "L. Deltoid", 
    position: [-0.38, 1.12, 0], 
    scale: [0.1, 0.1, 0.1], 
    symptoms: ["left shoulder pain", "shoulder stiffness", "rotator cuff pain"], 
    colors: { skin: "#F8D9C4", muscle: "#D45A5A", skeleton: "#E8E4D9" },
    shape: "sphere" 
  },
  { 
    name: "Right Shoulder", 
    anatomicalName: "R. Deltoid", 
    position: [0.38, 1.12, 0], 
    scale: [0.1, 0.1, 0.1], 
    symptoms: ["right shoulder pain", "shoulder stiffness", "rotator cuff pain"], 
    colors: { skin: "#F8D9C4", muscle: "#D45A5A", skeleton: "#E8E4D9" },
    shape: "sphere" 
  },
  { 
    name: "Left Upper Arm", 
    anatomicalName: "L. Biceps / Triceps", 
    position: [-0.45, 0.88, 0], 
    scale: [0.07, 0.2, 0.07], 
    symptoms: ["left arm pain", "bicep pain", "arm weakness"], 
    colors: { skin: "#F8D9C4", muscle: "#C94C4C", skeleton: "#D9D5C8" },
    shape: "capsule" 
  },
  { 
    name: "Right Upper Arm", 
    anatomicalName: "R. Biceps / Triceps", 
    position: [0.45, 0.88, 0], 
    scale: [0.07, 0.2, 0.07], 
    symptoms: ["right arm pain", "bicep pain", "arm weakness"], 
    colors: { skin: "#F8D9C4", muscle: "#C94C4C", skeleton: "#D9D5C8" },
    shape: "capsule" 
  },
  { 
    name: "Left Forearm", 
    anatomicalName: "L. Radius / Ulna", 
    position: [-0.48, 0.55, 0], 
    scale: [0.055, 0.18, 0.055], 
    symptoms: ["left forearm pain", "elbow pain", "arm tingling"], 
    colors: { skin: "#F8D9C4", muscle: "#B84A4A", skeleton: "#E8E4D9" },
    shape: "capsule" 
  },
  { 
    name: "Right Forearm", 
    anatomicalName: "R. Radius / Ulna", 
    position: [0.48, 0.55, 0], 
    scale: [0.055, 0.18, 0.055], 
    symptoms: ["right forearm pain", "elbow pain", "arm tingling"], 
    colors: { skin: "#F8D9C4", muscle: "#B84A4A", skeleton: "#E8E4D9" },
    shape: "capsule" 
  },
  { 
    name: "Left Hand", 
    anatomicalName: "L. Carpals / Phalanges", 
    position: [-0.5, 0.3, 0], 
    scale: [0.06, 0.1, 0.03], 
    symptoms: ["left hand pain", "finger numbness", "wrist pain", "hand swelling", "carpal tunnel"], 
    colors: { skin: "#F8D9C4", muscle: "#D45A5A", skeleton: "#E8E4D9" },
    shape: "box" 
  },
  { 
    name: "Right Hand", 
    anatomicalName: "R. Carpals / Phalanges", 
    position: [0.5, 0.3, 0], 
    scale: [0.06, 0.1, 0.03], 
    symptoms: ["right hand pain", "finger numbness", "wrist pain", "hand swelling", "carpal tunnel"], 
    colors: { skin: "#F8D9C4", muscle: "#D45A5A", skeleton: "#E8E4D9" },
    shape: "box" 
  },
  
  // Legs
  { 
    name: "Left Thigh", 
    anatomicalName: "L. Quadriceps / Femur", 
    position: [-0.14, 0.08, 0], 
    scale: [0.1, 0.28, 0.1], 
    symptoms: ["left thigh pain", "quad pain", "hip pain"], 
    colors: { skin: "#F8D9C4", muscle: "#C94C4C", skeleton: "#D9D5C8" },
    shape: "capsule" 
  },
  { 
    name: "Right Thigh", 
    anatomicalName: "R. Quadriceps / Femur", 
    position: [0.14, 0.08, 0], 
    scale: [0.1, 0.28, 0.1], 
    symptoms: ["right thigh pain", "quad pain", "hip pain"], 
    colors: { skin: "#F8D9C4", muscle: "#C94C4C", skeleton: "#D9D5C8" },
    shape: "capsule" 
  },
  { 
    name: "Left Knee", 
    anatomicalName: "L. Patella", 
    position: [-0.14, -0.22, 0], 
    scale: [0.08, 0.08, 0.08], 
    symptoms: ["left knee pain", "knee swelling", "knee stiffness"], 
    colors: { skin: "#F8D9C4", muscle: "#B84A4A", skeleton: "#E8E4D9" },
    shape: "sphere" 
  },
  { 
    name: "Right Knee", 
    anatomicalName: "R. Patella", 
    position: [0.14, -0.22, 0], 
    scale: [0.08, 0.08, 0.08], 
    symptoms: ["right knee pain", "knee swelling", "knee stiffness"], 
    colors: { skin: "#F8D9C4", muscle: "#B84A4A", skeleton: "#E8E4D9" },
    shape: "sphere" 
  },
  { 
    name: "Left Calf", 
    anatomicalName: "L. Gastrocnemius / Tibia", 
    position: [-0.14, -0.48, 0], 
    scale: [0.065, 0.22, 0.065], 
    symptoms: ["left calf pain", "leg cramps", "shin pain"], 
    colors: { skin: "#F8D9C4", muscle: "#C94C4C", skeleton: "#D9D5C8" },
    shape: "capsule" 
  },
  { 
    name: "Right Calf", 
    anatomicalName: "R. Gastrocnemius / Tibia", 
    position: [0.14, -0.48, 0], 
    scale: [0.065, 0.22, 0.065], 
    symptoms: ["right calf pain", "leg cramps", "shin pain"], 
    colors: { skin: "#F8D9C4", muscle: "#C94C4C", skeleton: "#D9D5C8" },
    shape: "capsule" 
  },
  { 
    name: "Left Foot", 
    anatomicalName: "L. Tarsals / Metatarsals", 
    position: [-0.14, -0.78, 0.04], 
    scale: [0.065, 0.05, 0.12], 
    symptoms: ["left foot pain", "ankle pain", "heel pain", "plantar fasciitis"], 
    colors: { skin: "#F8D9C4", muscle: "#D45A5A", skeleton: "#E8E4D9" },
    shape: "box" 
  },
  { 
    name: "Right Foot", 
    anatomicalName: "R. Tarsals / Metatarsals", 
    position: [0.14, -0.78, 0.04], 
    scale: [0.065, 0.05, 0.12], 
    symptoms: ["right foot pain", "ankle pain", "heel pain", "plantar fasciitis"], 
    colors: { skin: "#F8D9C4", muscle: "#D45A5A", skeleton: "#E8E4D9" },
    shape: "box" 
  },
];

// Heart-related keywords for heartbeat animation
const heartKeywords = ["heart", "cardiac", "chest pain", "palpitation", "heartbeat", "racing heart"];

interface BodyPartMeshProps {
  part: BodyPart;
  layer: Exclude<BodyLayer, "organs">;
  isHighlighted: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
  hasHeartSymptom?: boolean;
}

function CapsuleGeometry({ scale }: { scale: [number, number, number] }) {
  const radius = Math.max(scale[0], scale[2]);
  const height = scale[1] * 2;
  return <capsuleGeometry args={[radius, height - radius * 2, 8, 16]} />;
}

// Heartbeat animation component for chest area
function HeartbeatPulse({ position, active }: { position: [number, number, number]; active: boolean }) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (active && pulseRef.current) {
      timeRef.current += delta * 4; // heartbeat speed
      // Simulate heartbeat: quick expand, quick contract, pause
      const beat = Math.sin(timeRef.current) > 0.7 ? 1.2 : 1;
      pulseRef.current.scale.setScalar(beat);
      const material = pulseRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = beat > 1 ? 0.6 : 0.2;
    }
  });

  if (!active) return null;

  return (
    <mesh ref={pulseRef} position={[position[0] - 0.06, position[1] + 0.05, position[2] + 0.1]}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshBasicMaterial color="#DC2626" transparent opacity={0.3} />
    </mesh>
  );
}

function BodyPartMesh({ part, layer, isHighlighted, isHovered, onClick, onHover, hasHeartSymptom }: BodyPartMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);
  
  useFrame((state, delta) => {
    if (isHighlighted && glowRef.current) {
      pulseRef.current += delta * 3;
      const pulse = Math.sin(pulseRef.current) * 0.5 + 0.5;
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + pulse * 0.4;
      glowRef.current.scale.setScalar(1.15 + pulse * 0.15);
    }
  });

  const highlightColor = "#22C55E";
  const hoverColor = "#FBBF24";
  const baseColor = part.colors[layer];
  const activeColor = isHighlighted ? highlightColor : isHovered ? hoverColor : baseColor;
  const isChest = part.name === "Chest";

  const materialProps = useMemo(() => {
    switch (layer) {
      case "skeleton":
        return { roughness: 0.9, metalness: 0.0 };
      case "muscle":
        return { roughness: 0.5, metalness: 0.1 };
      default:
        return { roughness: 0.6, metalness: 0.1 };
    }
  }, [layer]);

  const renderGeometry = () => {
    switch (part.shape) {
      case "sphere":
        return <sphereGeometry args={[part.scale[0], 32, 32]} />;
      case "capsule":
        return <CapsuleGeometry scale={part.scale} />;
      case "cylinder":
        return <cylinderGeometry args={[part.scale[0], part.scale[0], part.scale[1] * 2, 16]} />;
      case "box":
      default:
        return <boxGeometry args={[part.scale[0] * 2, part.scale[1] * 2, part.scale[2] * 2]} />;
    }
  };

  const renderGlowGeometry = () => {
    switch (part.shape) {
      case "sphere":
        return <sphereGeometry args={[part.scale[0] * 1.3, 32, 32]} />;
      case "capsule":
        return <CapsuleGeometry scale={[part.scale[0] * 1.3, part.scale[1] * 1.3, part.scale[2] * 1.3]} />;
      case "cylinder":
        return <cylinderGeometry args={[part.scale[0] * 1.3, part.scale[0] * 1.3, part.scale[1] * 2.6, 16]} />;
      case "box":
      default:
        return <boxGeometry args={[part.scale[0] * 2.6, part.scale[1] * 2.6, part.scale[2] * 2.6]} />;
    }
  };

  return (
    <group position={part.position} rotation={part.rotation || [0, 0, 0]}>
      {/* Glow effect for highlighted parts */}
      {isHighlighted && (
        <mesh ref={glowRef}>
          {renderGlowGeometry()}
          <meshBasicMaterial
            color={highlightColor}
            transparent
            opacity={0.4}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Anatomical label on hover */}
      {isHovered && (
        <Html
          position={[0, part.scale[1] + 0.15, 0]}
          center
          distanceFactor={3}
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-2 py-1 bg-card/95 backdrop-blur-sm rounded-md border border-primary/50 shadow-lg whitespace-nowrap animate-fade-in">
            <p className="text-xs font-bold text-primary">{part.anatomicalName}</p>
            <p className="text-[10px] text-muted-foreground">{part.name}</p>
          </div>
        </Html>
      )}
      
      {/* Main body part mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(false);
          document.body.style.cursor = "auto";
        }}
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={activeColor}
          roughness={materialProps.roughness}
          metalness={materialProps.metalness}
          emissive={isHighlighted ? highlightColor : isHovered ? hoverColor : "#000000"}
          emissiveIntensity={isHighlighted ? 0.5 : isHovered ? 0.3 : 0}
          transparent={layer === "skeleton"}
          opacity={layer === "skeleton" ? 0.9 : 1}
        />
      </mesh>
      
      {/* Additional outer glow ring for highlighted */}
      {isHighlighted && (
        <mesh scale={[1.5, 1.5, 1.5]}>
          {renderGlowGeometry()}
          <meshBasicMaterial
            color={highlightColor}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Heartbeat pulse for chest area */}
      {isChest && <HeartbeatPulse position={[0, 0, 0]} active={!!hasHeartSymptom} />}
    </group>
  );
}

// Organ mesh component
interface OrganMeshProps {
  organ: Organ;
  isHovered: boolean;
  isHighlighted: boolean;
  isHeartBeating: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

function OrganMesh({ organ, isHovered, isHighlighted, isHeartBeating, onClick, onHover }: OrganMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);
  const isHeart = organ.name === "Heart";

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Heartbeat animation
    if (isHeart && isHeartBeating) {
      pulseRef.current += delta * 6;
      const beat = Math.sin(pulseRef.current);
      const scale = beat > 0.7 ? 1.25 : 1;
      meshRef.current.scale.setScalar(scale);
    } else if (isHeart) {
      // Subtle idle heartbeat
      pulseRef.current += delta * 1.2;
      const idleBeat = Math.sin(pulseRef.current) * 0.05 + 1;
      meshRef.current.scale.setScalar(idleBeat);
    }
  });

  const highlightColor = "#22C55E";
  const hoverColor = "#FBBF24";
  const activeColor = isHighlighted ? highlightColor : isHovered ? hoverColor : organ.color;

  const renderGeometry = () => {
    switch (organ.shape) {
      case "sphere":
        return <sphereGeometry args={[organ.scale[0], 32, 32]} />;
      case "capsule":
        return <CapsuleGeometry scale={organ.scale} />;
      case "kidney":
        return <sphereGeometry args={[organ.scale[0], 16, 16]} />;
      case "box":
      default:
        return <boxGeometry args={[organ.scale[0] * 2, organ.scale[1] * 2, organ.scale[2] * 2]} />;
    }
  };

  return (
    <group position={organ.position}>
      {isHovered && (
        <Html
          position={[0, organ.scale[1] + 0.1, 0]}
          center
          distanceFactor={3}
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-2 py-1 bg-card/95 backdrop-blur-sm rounded-md border border-primary/50 shadow-lg whitespace-nowrap animate-fade-in">
            <p className="text-xs font-bold text-primary">{organ.name}</p>
            <p className="text-[10px] text-muted-foreground">{organ.symptoms[0]}</p>
          </div>
        </Html>
      )}
      
      {/* Glow for highlighted organs */}
      {(isHighlighted || (isHeart && isHeartBeating)) && (
        <mesh scale={[1.4, 1.4, 1.4]}>
          {renderGeometry()}
          <meshBasicMaterial
            color={isHeart && isHeartBeating ? "#DC2626" : highlightColor}
            transparent
            opacity={0.4}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(false);
          document.body.style.cursor = "auto";
        }}
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={activeColor}
          roughness={0.4}
          metalness={0.2}
          emissive={isHighlighted ? highlightColor : isHeart && isHeartBeating ? "#DC2626" : isHovered ? hoverColor : "#000000"}
          emissiveIntensity={isHighlighted ? 0.5 : isHeart && isHeartBeating ? 0.8 : isHovered ? 0.3 : 0}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

interface HumanBodyProps {
  symptoms: string;
  layer: BodyLayer;
  onPartClick: (symptoms: string[]) => void;
  hoveredPart: string | null;
  setHoveredPart: (part: string | null) => void;
}

function HumanBody({ symptoms, layer, onPartClick, hoveredPart, setHoveredPart }: HumanBodyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const symptomsLower = symptoms.toLowerCase();

  const hasHeartSymptom = useMemo(() => {
    return heartKeywords.some(keyword => symptomsLower.includes(keyword));
  }, [symptomsLower]);

  const highlightedParts = useMemo(() => {
    if (!symptomsLower.trim()) return [];
    return bodyParts.filter(part => 
      part.symptoms.some(symptom => {
        const words = symptom.toLowerCase().split(" ");
        return words.some(word => symptomsLower.includes(word) && word.length > 3);
      })
    ).map(part => part.name);
  }, [symptomsLower]);

  const highlightedOrgans = useMemo(() => {
    if (!symptomsLower.trim()) return [];
    return organs.filter(organ => 
      organ.symptoms.some(symptom => {
        const words = symptom.toLowerCase().split(" ");
        return words.some(word => symptomsLower.includes(word) && word.length > 3);
      })
    ).map(organ => organ.name);
  }, [symptomsLower]);

  if (layer === "organs") {
    return (
      <group ref={groupRef} position={[0, 0.3, 0]}>
        {/* Semi-transparent body outline */}
        <mesh position={[0, 0.85, 0]}>
          <capsuleGeometry args={[0.25, 0.9, 8, 16]} />
          <meshStandardMaterial color="#3B82F6" transparent opacity={0.15} roughness={0.8} />
        </mesh>
        
        {organs.map((organ) => (
          <OrganMesh
            key={organ.name}
            organ={organ}
            isHovered={hoveredPart === organ.name}
            isHighlighted={highlightedOrgans.includes(organ.name)}
            isHeartBeating={hasHeartSymptom}
            onClick={() => onPartClick(organ.symptoms)}
            onHover={(hovered) => setHoveredPart(hovered ? organ.name : null)}
          />
        ))}
      </group>
    );
  }

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {bodyParts.map((part) => (
        <BodyPartMesh
          key={part.name}
          part={part}
          layer={layer}
          isHighlighted={highlightedParts.includes(part.name)}
          isHovered={hoveredPart === part.name}
          hasHeartSymptom={hasHeartSymptom}
          onClick={() => onPartClick(part.symptoms)}
          onHover={(hovered) => setHoveredPart(hovered ? part.name : null)}
        />
      ))}
    </group>
  );
}

interface BodyVisualization3DProps {
  symptoms: string;
  onSymptomSelect: (symptom: string) => void;
}

const layerConfig: Record<BodyLayer, { label: string; icon: string; bgColor: string }> = {
  skin: { label: "Skin", icon: "👤", bgColor: "from-amber-900/30 to-orange-900/30" },
  muscle: { label: "Muscle", icon: "💪", bgColor: "from-red-900/40 to-rose-900/40" },
  skeleton: { label: "Skeleton", icon: "🦴", bgColor: "from-slate-800/50 to-gray-900/50" },
  organs: { label: "Organs", icon: "🫀", bgColor: "from-indigo-900/40 to-purple-900/40" },
};

export function BodyVisualization3D({ symptoms, onSymptomSelect }: BodyVisualization3DProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [layer, setLayer] = useState<BodyLayer>("skin");
  const controlsRef = useRef<any>(null);

  const handlePartClick = (partSymptoms: string[]) => {
    const symptomText = partSymptoms.slice(0, 2).join(", ");
    onSymptomSelect(symptomText);
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const setView = (view: "front" | "back" | "left" | "right") => {
    if (controlsRef.current) {
      const positions: Record<string, [number, number, number]> = {
        front: [0, 0.5, 3],
        back: [0, 0.5, -3],
        left: [-3, 0.5, 0],
        right: [3, 0.5, 0],
      };
      controlsRef.current.object.position.set(...positions[view]);
      controlsRef.current.target.set(0, 0.3, 0);
      controlsRef.current.update();
    }
  };

  const cycleLayer = () => {
    const layers: BodyLayer[] = ["skin", "muscle", "skeleton", "organs"];
    const currentIndex = layers.indexOf(layer);
    setLayer(layers[(currentIndex + 1) % layers.length]);
  };

  const hoveredPartData = layer === "organs" 
    ? organs.find(o => o.name === hoveredPart) 
    : bodyParts.find(p => p.name === hoveredPart);
  const hoveredOrganData = organs.find(o => o.name === hoveredPart);
  const currentLayerConfig = layerConfig[layer];

  return (
    <Card className="p-4 border-border/50 h-full min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Interactive Body Map</h3>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={cycleLayer} 
            title="Toggle Layer"
            className="gap-1"
          >
            <Layers className="h-4 w-4" />
            <span className="text-xs">{currentLayerConfig.icon} {currentLayerConfig.label}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={resetCamera} title="Reset View">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex gap-1 mb-3 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => setView("front")} className="text-xs">
          <Eye className="h-3 w-3 mr-1" /> Front
        </Button>
        <Button variant="outline" size="sm" onClick={() => setView("back")} className="text-xs">
          <Eye className="h-3 w-3 mr-1" /> Back
        </Button>
        <Button variant="outline" size="sm" onClick={() => setView("left")} className="text-xs">
          <Eye className="h-3 w-3 mr-1" /> Left
        </Button>
        <Button variant="outline" size="sm" onClick={() => setView("right")} className="text-xs">
          <Eye className="h-3 w-3 mr-1" /> Right
        </Button>
      </div>

      <div className={`flex-1 rounded-lg overflow-hidden bg-gradient-to-b ${currentLayerConfig.bgColor} relative border border-border/30 transition-colors duration-500`}>
        <Canvas camera={{ position: [0, 0.5, 3], fov: 45 }}>
          <color attach="background" args={[layer === "skeleton" ? "#1a1a2e" : layer === "muscle" ? "#1f1015" : layer === "organs" ? "#0f0f2a" : "#0f172a"]} />
          <fog attach="fog" args={[layer === "skeleton" ? "#1a1a2e" : layer === "muscle" ? "#1f1015" : layer === "organs" ? "#0f0f2a" : "#0f172a", 4, 10]} />
          
          <ambientLight intensity={layer === "skeleton" ? 0.6 : layer === "organs" ? 0.5 : 0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} color={layer === "muscle" ? "#ff6b6b" : layer === "organs" ? "#a855f7" : "#60a5fa"} />
          <pointLight position={[0, 3, 2]} intensity={0.5} color={layer === "organs" ? "#dc2626" : "#22c55e"} />
          <pointLight position={[0, -1, 2]} intensity={0.3} color="#fbbf24" />
          
          <HumanBody
            symptoms={symptoms}
            layer={layer}
            onPartClick={handlePartClick}
            hoveredPart={hoveredPart}
            setHoveredPart={setHoveredPart}
          />
          
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={1.5}
            maxDistance={5}
            target={[0, 0.3, 0]}
            autoRotate={false}
          />
        </Canvas>
        
        {hoveredPart && (hoveredPartData || hoveredOrganData) && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 bg-card/95 backdrop-blur-md rounded-xl border border-border shadow-xl max-w-xs">
            <p className="text-sm font-semibold text-foreground mb-0.5">{hoveredPart}</p>
            {layer !== "organs" && hoveredPartData && 'anatomicalName' in hoveredPartData && (
              <p className="text-xs font-medium text-primary mb-1">{hoveredPartData.anatomicalName}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {(hoveredPartData || hoveredOrganData)?.symptoms.slice(0, 3).join(" • ")}
            </p>
            <p className="text-xs text-secondary mt-1.5">Click to add symptoms</p>
          </div>
        )}
        
        {/* Layer indicator */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-card/80 backdrop-blur-sm rounded-md border border-border/50">
          <p className="text-xs text-muted-foreground">
            {currentLayerConfig.icon} {currentLayerConfig.label} Layer
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        🖱️ Drag to rotate • 📜 Scroll to zoom • 👆 Click body parts • 🔄 Toggle layers
      </p>
    </Card>
  );
}

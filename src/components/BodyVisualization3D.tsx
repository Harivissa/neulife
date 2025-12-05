import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Eye, Layers } from "lucide-react";

type BodyLayer = "skin" | "muscle" | "skeleton" | "organs" | "nervous";

interface BodyPart {
  name: string;
  anatomicalName: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  symptoms: string[];
  colors: Record<Exclude<BodyLayer, "organs" | "nervous">, string>;
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

interface NervePart {
  name: string;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  symptoms: string[];
  shape: "sphere" | "capsule" | "cylinder";
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

const nerveParts: NervePart[] = [
  {
    name: "Brain",
    position: [0, 1.7, 0],
    scale: [0.18, 0.16, 0.18],
    color: "#F472B6",
    symptoms: ["headache", "migraine", "confusion", "memory problems", "dizziness", "seizures"],
    shape: "sphere",
  },
  {
    name: "Brainstem",
    position: [0, 1.45, -0.02],
    scale: [0.04, 0.1, 0.04],
    color: "#EC4899",
    symptoms: ["balance issues", "coordination problems", "swallowing difficulty"],
    shape: "capsule",
  },
  {
    name: "Spinal Cord",
    position: [0, 0.85, -0.08],
    scale: [0.025, 0.55, 0.025],
    color: "#A855F7",
    symptoms: ["back pain", "numbness", "paralysis", "tingling", "spinal pain"],
    shape: "capsule",
  },
  {
    name: "Cervical Nerves",
    position: [0, 1.25, -0.06],
    scale: [0.02, 0.08, 0.02],
    color: "#C084FC",
    symptoms: ["neck pain", "arm numbness", "shoulder pain"],
    shape: "capsule",
  },
  {
    name: "Brachial Plexus Left",
    position: [-0.2, 1.15, 0],
    scale: [0.12, 0.02, 0.02],
    color: "#D946EF",
    symptoms: ["arm weakness", "arm numbness", "shoulder pain"],
    shape: "cylinder",
  },
  {
    name: "Brachial Plexus Right",
    position: [0.2, 1.15, 0],
    scale: [0.12, 0.02, 0.02],
    color: "#D946EF",
    symptoms: ["arm weakness", "arm numbness", "shoulder pain"],
    shape: "cylinder",
  },
  {
    name: "Sciatic Nerve Left",
    position: [-0.1, 0.15, -0.03],
    scale: [0.015, 0.35, 0.015],
    color: "#8B5CF6",
    symptoms: ["sciatica", "leg pain", "lower back pain", "leg numbness"],
    shape: "capsule",
  },
  {
    name: "Sciatic Nerve Right",
    position: [0.1, 0.15, -0.03],
    scale: [0.015, 0.35, 0.015],
    color: "#8B5CF6",
    symptoms: ["sciatica", "leg pain", "lower back pain", "leg numbness"],
    shape: "capsule",
  },
  {
    name: "Femoral Nerve Left",
    position: [-0.12, 0.1, 0.02],
    scale: [0.012, 0.25, 0.012],
    color: "#A78BFA",
    symptoms: ["thigh pain", "knee weakness", "leg numbness"],
    shape: "capsule",
  },
  {
    name: "Femoral Nerve Right",
    position: [0.12, 0.1, 0.02],
    scale: [0.012, 0.25, 0.012],
    color: "#A78BFA",
    symptoms: ["thigh pain", "knee weakness", "leg numbness"],
    shape: "capsule",
  },
  {
    name: "Ulnar Nerve Left",
    position: [-0.48, 0.65, -0.01],
    scale: [0.008, 0.35, 0.008],
    color: "#C4B5FD",
    symptoms: ["elbow pain", "finger numbness", "hand weakness"],
    shape: "capsule",
  },
  {
    name: "Ulnar Nerve Right",
    position: [0.48, 0.65, -0.01],
    scale: [0.008, 0.35, 0.008],
    color: "#C4B5FD",
    symptoms: ["elbow pain", "finger numbness", "hand weakness"],
    shape: "capsule",
  },
];

// Blood vessel paths for circulatory animation
const bloodVesselPaths = {
  aorta: [
    [0, 1.05, 0.08],
    [0, 0.9, 0.06],
    [0, 0.7, 0.04],
    [0, 0.5, 0.02],
    [0, 0.35, 0],
  ] as [number, number, number][],
  leftArm: [
    [-0.1, 1.05, 0.05],
    [-0.25, 1.1, 0.02],
    [-0.4, 1.0, 0],
    [-0.48, 0.7, 0],
    [-0.5, 0.4, 0],
  ] as [number, number, number][],
  rightArm: [
    [0.1, 1.05, 0.05],
    [0.25, 1.1, 0.02],
    [0.4, 1.0, 0],
    [0.48, 0.7, 0],
    [0.5, 0.4, 0],
  ] as [number, number, number][],
  leftLeg: [
    [-0.08, 0.35, 0],
    [-0.12, 0.1, 0],
    [-0.14, -0.2, 0],
    [-0.14, -0.5, 0],
    [-0.14, -0.75, 0],
  ] as [number, number, number][],
  rightLeg: [
    [0.08, 0.35, 0],
    [0.12, 0.1, 0],
    [0.14, -0.2, 0],
    [0.14, -0.5, 0],
    [0.14, -0.75, 0],
  ] as [number, number, number][],
  headNeck: [
    [0, 1.05, 0.05],
    [0, 1.2, 0.03],
    [0, 1.35, 0.02],
    [0, 1.5, 0],
    [0, 1.65, 0],
  ] as [number, number, number][],
};

const bodyParts: BodyPart[] = [
  { 
    name: "Head", 
    anatomicalName: "Cranium", 
    position: [0, 1.65, 0], 
    scale: [0.22, 0.28, 0.24], 
    symptoms: ["headache", "dizziness", "migraine", "head pain", "vision problems"], 
    colors: { skin: "#F8D9C4", muscle: "#C94C4C", skeleton: "#E8E4D9" },
    shape: "sphere" 
  },
  { 
    name: "Neck", 
    anatomicalName: "Cervical Spine", 
    position: [0, 1.32, 0], 
    scale: [0.08, 0.12, 0.08], 
    symptoms: ["neck pain", "stiff neck", "sore throat", "difficulty swallowing"], 
    colors: { skin: "#F8D9C4", muscle: "#B84A4A", skeleton: "#D9D5C8" },
    shape: "cylinder" 
  },
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

const heartKeywords = ["heart", "cardiac", "chest pain", "palpitation", "heartbeat", "racing heart", "blood pressure", "circulation", "cardiovascular"];
const nervousKeywords = ["nerve", "numbness", "tingling", "paralysis", "brain", "headache", "migraine", "sciatica", "neurological"];

interface BodyPartMeshProps {
  part: BodyPart;
  layer: Exclude<BodyLayer, "organs" | "nervous">;
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

// Blood flow particle component
function BloodParticle({ path, delay, speed }: { path: [number, number, number][]; delay: number; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(delay);

  useFrame((_, delta) => {
    if (!meshRef.current || path.length < 2) return;
    
    progressRef.current += delta * speed;
    const t = (progressRef.current % 1);
    
    // Interpolate along path
    const totalSegments = path.length - 1;
    const segmentProgress = t * totalSegments;
    const segmentIndex = Math.min(Math.floor(segmentProgress), totalSegments - 1);
    const segmentT = segmentProgress - segmentIndex;
    
    const start = path[segmentIndex];
    const end = path[Math.min(segmentIndex + 1, path.length - 1)];
    
    meshRef.current.position.set(
      start[0] + (end[0] - start[0]) * segmentT,
      start[1] + (end[1] - start[1]) * segmentT + 0.3,
      start[2] + (end[2] - start[2]) * segmentT
    );
    
    // Pulsing size
    const pulse = Math.sin(progressRef.current * 8) * 0.3 + 1;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.012, 8, 8]} />
      <meshBasicMaterial color="#EF4444" transparent opacity={0.9} />
    </mesh>
  );
}

// Blood flow animation system
function BloodFlowSystem({ active }: { active: boolean }) {
  const particles = useMemo(() => {
    if (!active) return [];
    
    const allParticles: { path: [number, number, number][]; delay: number; speed: number }[] = [];
    
    Object.values(bloodVesselPaths).forEach((path) => {
      // Add multiple particles per vessel
      for (let i = 0; i < 4; i++) {
        allParticles.push({
          path,
          delay: i * 0.25,
          speed: 0.4 + Math.random() * 0.2,
        });
      }
    });
    
    return allParticles;
  }, [active]);

  if (!active) return null;

  return (
    <group>
      {/* Vessel lines */}
      {Object.values(bloodVesselPaths).map((path, idx) => (
        <Line
          key={idx}
          points={path.map(p => [p[0], p[1] + 0.3, p[2]] as [number, number, number])}
          color="#991B1B"
          lineWidth={1.5}
          transparent
          opacity={0.4}
        />
      ))}
      
      {/* Blood particles */}
      {particles.map((particle, idx) => (
        <BloodParticle key={idx} {...particle} />
      ))}
    </group>
  );
}

// Neural signal animation
function NeuralSignal({ startPos, endPos, delay }: { startPos: [number, number, number]; endPos: [number, number, number]; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(delay);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    progressRef.current += delta * 1.5;
    const t = (progressRef.current % 1);
    
    meshRef.current.position.set(
      startPos[0] + (endPos[0] - startPos[0]) * t,
      startPos[1] + (endPos[1] - startPos[1]) * t,
      startPos[2] + (endPos[2] - startPos[2]) * t
    );
    
    // Fade in and out
    const opacity = Math.sin(t * Math.PI);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.8;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.015, 8, 8]} />
      <meshBasicMaterial color="#F0ABFC" transparent opacity={0.8} />
    </mesh>
  );
}

// Nerve mesh component
interface NerveMeshProps {
  nerve: NervePart;
  isHovered: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

function NerveMesh({ nerve, isHovered, isHighlighted, onClick, onHover }: NerveMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    pulseRef.current += delta * 2;
    
    // Subtle electrical pulse effect
    const pulse = Math.sin(pulseRef.current) * 0.1 + 1;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = isHighlighted ? 0.6 + Math.sin(pulseRef.current * 3) * 0.3 : 0.2 + pulse * 0.1;
  });

  const highlightColor = "#22C55E";
  const hoverColor = "#FBBF24";
  const activeColor = isHighlighted ? highlightColor : isHovered ? hoverColor : nerve.color;

  const isCylinder = nerve.shape === "cylinder";
  
  const renderGeometry = () => {
    switch (nerve.shape) {
      case "sphere":
        return <sphereGeometry args={[nerve.scale[0], 24, 24]} />;
      case "capsule":
        return <CapsuleGeometry scale={nerve.scale} />;
      case "cylinder":
        return <cylinderGeometry args={[nerve.scale[1], nerve.scale[1], nerve.scale[0] * 2, 12]} />;
      default:
        return <sphereGeometry args={[nerve.scale[0], 16, 16]} />;
    }
  };

  return (
    <group position={nerve.position} rotation={isCylinder ? [0, 0, Math.PI / 2] : [0, 0, 0]}>
      {isHovered && (
        <Html
          position={[0, nerve.scale[1] + 0.08, 0]}
          center
          distanceFactor={3}
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-2 py-1 bg-card/95 backdrop-blur-sm rounded-md border border-purple-500/50 shadow-lg whitespace-nowrap animate-fade-in">
            <p className="text-xs font-bold text-purple-400">{nerve.name}</p>
            <p className="text-[10px] text-muted-foreground">{nerve.symptoms[0]}</p>
          </div>
        </Html>
      )}
      
      {isHighlighted && (
        <mesh scale={[1.3, 1.3, 1.3]}>
          {renderGeometry()}
          <meshBasicMaterial color={highlightColor} transparent opacity={0.3} side={THREE.BackSide} />
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
          roughness={0.3}
          metalness={0.4}
          emissive={nerve.color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

function HeartbeatPulse({ position, active }: { position: [number, number, number]; active: boolean }) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (active && pulseRef.current) {
      timeRef.current += delta * 4;
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
  
  useFrame((_, delta) => {
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
      {isHighlighted && (
        <mesh ref={glowRef}>
          {renderGlowGeometry()}
          <meshBasicMaterial color={highlightColor} transparent opacity={0.4} side={THREE.BackSide} />
        </mesh>
      )}
      
      {isHovered && (
        <Html position={[0, part.scale[1] + 0.15, 0]} center distanceFactor={3} style={{ pointerEvents: 'none' }}>
          <div className="px-2 py-1 bg-card/95 backdrop-blur-sm rounded-md border border-primary/50 shadow-lg whitespace-nowrap animate-fade-in">
            <p className="text-xs font-bold text-primary">{part.anatomicalName}</p>
            <p className="text-[10px] text-muted-foreground">{part.name}</p>
          </div>
        </Html>
      )}
      
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { onHover(false); document.body.style.cursor = "auto"; }}
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
      
      {isHighlighted && (
        <mesh scale={[1.5, 1.5, 1.5]}>
          {renderGlowGeometry()}
          <meshBasicMaterial color={highlightColor} transparent opacity={0.15} side={THREE.BackSide} />
        </mesh>
      )}
      
      {isChest && <HeartbeatPulse position={[0, 0, 0]} active={!!hasHeartSymptom} />}
    </group>
  );
}

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

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    if (isHeart && isHeartBeating) {
      pulseRef.current += delta * 6;
      const beat = Math.sin(pulseRef.current);
      const scale = beat > 0.7 ? 1.25 : 1;
      meshRef.current.scale.setScalar(scale);
    } else if (isHeart) {
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
        <Html position={[0, organ.scale[1] + 0.1, 0]} center distanceFactor={3} style={{ pointerEvents: 'none' }}>
          <div className="px-2 py-1 bg-card/95 backdrop-blur-sm rounded-md border border-primary/50 shadow-lg whitespace-nowrap animate-fade-in">
            <p className="text-xs font-bold text-primary">{organ.name}</p>
            <p className="text-[10px] text-muted-foreground">{organ.symptoms[0]}</p>
          </div>
        </Html>
      )}
      
      {(isHighlighted || (isHeart && isHeartBeating)) && (
        <mesh scale={[1.4, 1.4, 1.4]}>
          {renderGeometry()}
          <meshBasicMaterial color={isHeart && isHeartBeating ? "#DC2626" : highlightColor} transparent opacity={0.4} side={THREE.BackSide} />
        </mesh>
      )}
      
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { onHover(false); document.body.style.cursor = "auto"; }}
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

  const hasNervousSymptom = useMemo(() => {
    return nervousKeywords.some(keyword => symptomsLower.includes(keyword));
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

  const highlightedNerves = useMemo(() => {
    if (!symptomsLower.trim()) return [];
    return nerveParts.filter(nerve => 
      nerve.symptoms.some(symptom => {
        const words = symptom.toLowerCase().split(" ");
        return words.some(word => symptomsLower.includes(word) && word.length > 3);
      })
    ).map(nerve => nerve.name);
  }, [symptomsLower]);

  // Nervous system layer
  if (layer === "nervous") {
    return (
      <group ref={groupRef} position={[0, 0.3, 0]}>
        {/* Semi-transparent body outline */}
        <mesh position={[0, 0.85, 0]}>
          <capsuleGeometry args={[0.25, 0.9, 8, 16]} />
          <meshStandardMaterial color="#6366F1" transparent opacity={0.08} roughness={0.9} />
        </mesh>
        
        {/* Head outline */}
        <mesh position={[0, 1.65, 0]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color="#8B5CF6" transparent opacity={0.1} roughness={0.8} />
        </mesh>
        
        {nerveParts.map((nerve) => (
          <NerveMesh
            key={nerve.name}
            nerve={nerve}
            isHovered={hoveredPart === nerve.name}
            isHighlighted={highlightedNerves.includes(nerve.name)}
            onClick={() => onPartClick(nerve.symptoms)}
            onHover={(hovered) => setHoveredPart(hovered ? nerve.name : null)}
          />
        ))}
        
        {/* Neural signal animations when nervous symptoms present */}
        {hasNervousSymptom && (
          <>
            <NeuralSignal startPos={[0, 1.7, 0]} endPos={[0, 1.45, -0.02]} delay={0} />
            <NeuralSignal startPos={[0, 1.45, -0.02]} endPos={[0, 0.85, -0.08]} delay={0.3} />
            <NeuralSignal startPos={[0, 1.2, -0.06]} endPos={[-0.2, 1.15, 0]} delay={0.5} />
            <NeuralSignal startPos={[0, 1.2, -0.06]} endPos={[0.2, 1.15, 0]} delay={0.5} />
            <NeuralSignal startPos={[0, 0.5, -0.08]} endPos={[-0.1, 0.15, -0.03]} delay={0.7} />
            <NeuralSignal startPos={[0, 0.5, -0.08]} endPos={[0.1, 0.15, -0.03]} delay={0.7} />
          </>
        )}
      </group>
    );
  }

  // Organs layer
  if (layer === "organs") {
    return (
      <group ref={groupRef} position={[0, 0.3, 0]}>
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
        
        {/* Blood flow animation when cardiovascular symptoms present */}
        <BloodFlowSystem active={hasHeartSymptom} />
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
      
      {/* Blood flow visible on other layers when cardiovascular symptoms present */}
      <BloodFlowSystem active={hasHeartSymptom} />
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
  nervous: { label: "Nervous", icon: "🧠", bgColor: "from-violet-900/40 to-fuchsia-900/40" },
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
    const layers: BodyLayer[] = ["skin", "muscle", "skeleton", "organs", "nervous"];
    const currentIndex = layers.indexOf(layer);
    setLayer(layers[(currentIndex + 1) % layers.length]);
  };

  const currentLayerConfig = layerConfig[layer];
  const hoveredPartData = layer === "organs" 
    ? organs.find(o => o.name === hoveredPart) 
    : layer === "nervous"
    ? nerveParts.find(n => n.name === hoveredPart)
    : bodyParts.find(p => p.name === hoveredPart);

  return (
    <Card className="p-4 border-border/50 h-full min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Interactive Body Map</h3>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={cycleLayer} title="Toggle Layer" className="gap-1">
            <Layers className="h-4 w-4" />
            <span className="text-xs">{currentLayerConfig.icon} {currentLayerConfig.label}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={resetCamera} title="Reset View">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex gap-1 mb-3 flex-wrap">
        {["front", "back", "left", "right"].map((view) => (
          <Button key={view} variant="outline" size="sm" onClick={() => setView(view as any)} className="text-xs">
            <Eye className="h-3 w-3 mr-1" /> {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        ))}
      </div>

      <div className={`flex-1 rounded-lg overflow-hidden bg-gradient-to-b ${currentLayerConfig.bgColor} relative border border-border/30 transition-colors duration-500`}>
        <Canvas camera={{ position: [0, 0.5, 3], fov: 45 }}>
          <color attach="background" args={[
            layer === "skeleton" ? "#1a1a2e" : 
            layer === "muscle" ? "#1f1015" : 
            layer === "organs" ? "#0f0f2a" : 
            layer === "nervous" ? "#120a1f" : "#0f172a"
          ]} />
          <fog attach="fog" args={[
            layer === "skeleton" ? "#1a1a2e" : 
            layer === "muscle" ? "#1f1015" : 
            layer === "organs" ? "#0f0f2a" : 
            layer === "nervous" ? "#120a1f" : "#0f172a", 4, 10
          ]} />
          
          <ambientLight intensity={layer === "skeleton" ? 0.6 : layer === "organs" ? 0.5 : layer === "nervous" ? 0.4 : 0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} color={
            layer === "muscle" ? "#ff6b6b" : 
            layer === "organs" ? "#a855f7" : 
            layer === "nervous" ? "#d946ef" : "#60a5fa"
          } />
          <pointLight position={[0, 3, 2]} intensity={0.5} color={
            layer === "organs" ? "#dc2626" : 
            layer === "nervous" ? "#a855f7" : "#22c55e"
          } />
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
        
        {hoveredPart && hoveredPartData && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 bg-card/95 backdrop-blur-md rounded-xl border border-border shadow-xl max-w-xs">
            <p className="text-sm font-semibold text-foreground mb-0.5">{hoveredPart}</p>
            {'anatomicalName' in hoveredPartData && (
              <p className="text-xs font-medium text-primary mb-1">{hoveredPartData.anatomicalName}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {hoveredPartData.symptoms.slice(0, 3).join(" • ")}
            </p>
            <p className="text-xs text-secondary mt-1.5">Click to add symptoms</p>
          </div>
        )}
        
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

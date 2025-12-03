import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Eye } from "lucide-react";

interface BodyPart {
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  symptoms: string[];
  color: string;
}

const bodyParts: BodyPart[] = [
  { name: "Head", position: [0, 1.6, 0], size: [0.25, 0.3, 0.25], symptoms: ["headache", "dizziness", "migraine", "head pain"], color: "#8B5CF6" },
  { name: "Neck", position: [0, 1.25, 0], size: [0.12, 0.15, 0.12], symptoms: ["neck pain", "stiff neck", "sore throat", "difficulty swallowing"], color: "#06B6D4" },
  { name: "Chest", position: [0, 0.85, 0], size: [0.4, 0.35, 0.2], symptoms: ["chest pain", "difficulty breathing", "heart palpitations", "shortness of breath"], color: "#EF4444" },
  { name: "Abdomen", position: [0, 0.4, 0], size: [0.35, 0.35, 0.18], symptoms: ["stomach pain", "nausea", "bloating", "abdominal cramps"], color: "#F59E0B" },
  { name: "Lower Abdomen", position: [0, 0.05, 0], size: [0.3, 0.2, 0.15], symptoms: ["pelvic pain", "lower back pain", "urinary issues", "groin pain"], color: "#10B981" },
  { name: "Left Shoulder", position: [-0.35, 1.05, 0], size: [0.15, 0.12, 0.12], symptoms: ["left shoulder pain", "shoulder stiffness", "arm weakness"], color: "#3B82F6" },
  { name: "Right Shoulder", position: [0.35, 1.05, 0], size: [0.15, 0.12, 0.12], symptoms: ["right shoulder pain", "shoulder stiffness", "arm weakness"], color: "#3B82F6" },
  { name: "Left Arm", position: [-0.45, 0.65, 0], size: [0.1, 0.4, 0.1], symptoms: ["left arm pain", "arm numbness", "elbow pain", "arm tingling"], color: "#6366F1" },
  { name: "Right Arm", position: [0.45, 0.65, 0], size: [0.1, 0.4, 0.1], symptoms: ["right arm pain", "arm numbness", "elbow pain", "arm tingling"], color: "#6366F1" },
  { name: "Left Hand", position: [-0.48, 0.25, 0], size: [0.08, 0.12, 0.05], symptoms: ["left hand pain", "finger numbness", "wrist pain", "hand swelling"], color: "#EC4899" },
  { name: "Right Hand", position: [0.48, 0.25, 0], size: [0.08, 0.12, 0.05], symptoms: ["right hand pain", "finger numbness", "wrist pain", "hand swelling"], color: "#EC4899" },
  { name: "Left Leg", position: [-0.15, -0.5, 0], size: [0.12, 0.55, 0.12], symptoms: ["left leg pain", "leg cramps", "knee pain", "thigh pain"], color: "#14B8A6" },
  { name: "Right Leg", position: [0.15, -0.5, 0], size: [0.12, 0.55, 0.12], symptoms: ["right leg pain", "leg cramps", "knee pain", "thigh pain"], color: "#14B8A6" },
  { name: "Left Foot", position: [-0.15, -0.95, 0.05], size: [0.08, 0.1, 0.15], symptoms: ["left foot pain", "ankle pain", "heel pain", "toe numbness"], color: "#F97316" },
  { name: "Right Foot", position: [0.15, -0.95, 0.05], size: [0.08, 0.1, 0.15], symptoms: ["right foot pain", "ankle pain", "heel pain", "toe numbness"], color: "#F97316" },
  { name: "Upper Back", position: [0, 0.85, -0.12], size: [0.38, 0.35, 0.08], symptoms: ["upper back pain", "spine pain", "shoulder blade pain"], color: "#8B5CF6" },
  { name: "Lower Back", position: [0, 0.3, -0.1], size: [0.32, 0.3, 0.08], symptoms: ["lower back pain", "sciatica", "lumbar pain", "back stiffness"], color: "#DC2626" },
];

interface BodyPartMeshProps {
  part: BodyPart;
  isHighlighted: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

function BodyPartMesh({ part, isHighlighted, isHovered, onClick, onHover }: BodyPartMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const color = useMemo(() => {
    if (isHighlighted) return "#22C55E";
    if (isHovered) return "#FBBF24";
    return part.color;
  }, [isHighlighted, isHovered, part.color]);

  return (
    <mesh
      ref={meshRef}
      position={part.position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(false);
        document.body.style.cursor = "auto";
      }}
    >
      <boxGeometry args={part.size} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={isHighlighted ? 0.9 : isHovered ? 0.8 : 0.6}
        emissive={color}
        emissiveIntensity={isHighlighted ? 0.3 : isHovered ? 0.2 : 0.1}
      />
    </mesh>
  );
}

interface HumanBodyProps {
  symptoms: string;
  onPartClick: (symptoms: string[]) => void;
  hoveredPart: string | null;
  setHoveredPart: (part: string | null) => void;
}

function HumanBody({ symptoms, onPartClick, hoveredPart, setHoveredPart }: HumanBodyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const symptomsLower = symptoms.toLowerCase();

  const highlightedParts = useMemo(() => {
    return bodyParts.filter(part => 
      part.symptoms.some(symptom => symptomsLower.includes(symptom.split(" ")[0]))
    ).map(part => part.name);
  }, [symptomsLower]);

  return (
    <group ref={groupRef}>
      {bodyParts.map((part) => (
        <BodyPartMesh
          key={part.name}
          part={part}
          isHighlighted={highlightedParts.includes(part.name)}
          isHovered={hoveredPart === part.name}
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

export function BodyVisualization3D({ symptoms, onSymptomSelect }: BodyVisualization3DProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
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

  return (
    <Card className="p-4 border-border/50 h-full min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Interactive Body Map</h3>
        <div className="flex gap-1">
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

      <div className="flex-1 rounded-lg overflow-hidden bg-gradient-to-b from-card to-background relative">
        <Canvas camera={{ position: [0, 0.5, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          <pointLight position={[0, 3, 0]} intensity={0.3} />
          
          <HumanBody
            symptoms={symptoms}
            onPartClick={handlePartClick}
            hoveredPart={hoveredPart}
            setHoveredPart={setHoveredPart}
          />
          
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={6}
            target={[0, 0.3, 0]}
          />
        </Canvas>
        
        {hoveredPart && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border shadow-lg">
            <p className="text-sm font-medium text-foreground">{hoveredPart}</p>
            <p className="text-xs text-muted-foreground">Click to add symptoms</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        Drag to rotate • Scroll to zoom • Click body parts to add symptoms
      </p>
    </Card>
  );
}

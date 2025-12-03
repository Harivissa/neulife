import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Eye } from "lucide-react";

interface BodyPart {
  name: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  symptoms: string[];
  baseColor: string;
  shape: "sphere" | "capsule" | "cylinder" | "box";
}

const bodyParts: BodyPart[] = [
  // Head
  { name: "Head", position: [0, 1.65, 0], scale: [0.22, 0.28, 0.24], symptoms: ["headache", "dizziness", "migraine", "head pain", "vision problems"], baseColor: "#F8D9C4", shape: "sphere" },
  
  // Neck
  { name: "Neck", position: [0, 1.32, 0], scale: [0.08, 0.12, 0.08], symptoms: ["neck pain", "stiff neck", "sore throat", "difficulty swallowing"], baseColor: "#F8D9C4", shape: "cylinder" },
  
  // Torso
  { name: "Chest", position: [0, 1.0, 0], scale: [0.32, 0.28, 0.18], symptoms: ["chest pain", "difficulty breathing", "heart palpitations", "shortness of breath", "cough"], baseColor: "#F8D9C4", shape: "capsule" },
  { name: "Abdomen", position: [0, 0.65, 0], scale: [0.28, 0.22, 0.16], symptoms: ["stomach pain", "nausea", "bloating", "abdominal cramps", "indigestion"], baseColor: "#F8D9C4", shape: "capsule" },
  { name: "Pelvis", position: [0, 0.38, 0], scale: [0.3, 0.15, 0.16], symptoms: ["pelvic pain", "hip pain", "groin pain", "urinary issues"], baseColor: "#F8D9C4", shape: "capsule" },
  
  // Back
  { name: "Upper Back", position: [0, 1.0, -0.1], scale: [0.3, 0.26, 0.1], symptoms: ["upper back pain", "spine pain", "shoulder blade pain", "posture pain"], baseColor: "#E8C9B4", shape: "box" },
  { name: "Lower Back", position: [0, 0.55, -0.09], scale: [0.26, 0.22, 0.1], symptoms: ["lower back pain", "sciatica", "lumbar pain", "back stiffness"], baseColor: "#E8C9B4", shape: "box" },
  
  // Arms
  { name: "Left Shoulder", position: [-0.38, 1.12, 0], scale: [0.1, 0.1, 0.1], symptoms: ["left shoulder pain", "shoulder stiffness", "rotator cuff pain"], baseColor: "#F8D9C4", shape: "sphere" },
  { name: "Right Shoulder", position: [0.38, 1.12, 0], scale: [0.1, 0.1, 0.1], symptoms: ["right shoulder pain", "shoulder stiffness", "rotator cuff pain"], baseColor: "#F8D9C4", shape: "sphere" },
  { name: "Left Upper Arm", position: [-0.45, 0.88, 0], scale: [0.07, 0.2, 0.07], symptoms: ["left arm pain", "bicep pain", "arm weakness"], baseColor: "#F8D9C4", shape: "capsule" },
  { name: "Right Upper Arm", position: [0.45, 0.88, 0], scale: [0.07, 0.2, 0.07], symptoms: ["right arm pain", "bicep pain", "arm weakness"], baseColor: "#F8D9C4", shape: "capsule" },
  { name: "Left Forearm", position: [-0.48, 0.55, 0], scale: [0.055, 0.18, 0.055], symptoms: ["left forearm pain", "elbow pain", "arm tingling"], baseColor: "#F8D9C4", shape: "capsule" },
  { name: "Right Forearm", position: [0.48, 0.55, 0], scale: [0.055, 0.18, 0.055], symptoms: ["right forearm pain", "elbow pain", "arm tingling"], baseColor: "#F8D9C4", shape: "capsule" },
  { name: "Left Hand", position: [-0.5, 0.3, 0], scale: [0.06, 0.1, 0.03], symptoms: ["left hand pain", "finger numbness", "wrist pain", "hand swelling", "carpal tunnel"], baseColor: "#F8D9C4", shape: "box" },
  { name: "Right Hand", position: [0.5, 0.3, 0], scale: [0.06, 0.1, 0.03], symptoms: ["right hand pain", "finger numbness", "wrist pain", "hand swelling", "carpal tunnel"], baseColor: "#F8D9C4", shape: "box" },
  
  // Legs
  { name: "Left Thigh", position: [-0.14, 0.08, 0], scale: [0.1, 0.28, 0.1], symptoms: ["left thigh pain", "quad pain", "hip pain"], baseColor: "#F8D9C4", shape: "capsule" },
  { name: "Right Thigh", position: [0.14, 0.08, 0], scale: [0.1, 0.28, 0.1], symptoms: ["right thigh pain", "quad pain", "hip pain"], baseColor: "#F8D9C4", shape: "capsule" },
  { name: "Left Knee", position: [-0.14, -0.22, 0], scale: [0.08, 0.08, 0.08], symptoms: ["left knee pain", "knee swelling", "knee stiffness"], baseColor: "#F8D9C4", shape: "sphere" },
  { name: "Right Knee", position: [0.14, -0.22, 0], scale: [0.08, 0.08, 0.08], symptoms: ["right knee pain", "knee swelling", "knee stiffness"], baseColor: "#F8D9C4", shape: "sphere" },
  { name: "Left Calf", position: [-0.14, -0.48, 0], scale: [0.065, 0.22, 0.065], symptoms: ["left calf pain", "leg cramps", "shin pain"], baseColor: "#F8D9C4", shape: "capsule" },
  { name: "Right Calf", position: [0.14, -0.48, 0], scale: [0.065, 0.22, 0.065], symptoms: ["right calf pain", "leg cramps", "shin pain"], baseColor: "#F8D9C4", shape: "capsule" },
  { name: "Left Foot", position: [-0.14, -0.78, 0.04], scale: [0.065, 0.05, 0.12], symptoms: ["left foot pain", "ankle pain", "heel pain", "plantar fasciitis"], baseColor: "#F8D9C4", shape: "box" },
  { name: "Right Foot", position: [0.14, -0.78, 0.04], scale: [0.065, 0.05, 0.12], symptoms: ["right foot pain", "ankle pain", "heel pain", "plantar fasciitis"], baseColor: "#F8D9C4", shape: "box" },
];

interface BodyPartMeshProps {
  part: BodyPart;
  isHighlighted: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

function CapsuleGeometry({ scale }: { scale: [number, number, number] }) {
  const radius = Math.max(scale[0], scale[2]);
  const height = scale[1] * 2;
  return <capsuleGeometry args={[radius, height - radius * 2, 8, 16]} />;
}

function BodyPartMesh({ part, isHighlighted, isHovered, onClick, onHover }: BodyPartMeshProps) {
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
  const activeColor = isHighlighted ? highlightColor : isHovered ? hoverColor : part.baseColor;

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
          roughness={0.6}
          metalness={0.1}
          emissive={isHighlighted ? highlightColor : isHovered ? hoverColor : "#000000"}
          emissiveIntensity={isHighlighted ? 0.5 : isHovered ? 0.3 : 0}
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
    </group>
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
    if (!symptomsLower.trim()) return [];
    return bodyParts.filter(part => 
      part.symptoms.some(symptom => {
        const words = symptom.toLowerCase().split(" ");
        return words.some(word => symptomsLower.includes(word) && word.length > 3);
      })
    ).map(part => part.name);
  }, [symptomsLower]);

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
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

  const hoveredPartData = bodyParts.find(p => p.name === hoveredPart);

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

      <div className="flex-1 rounded-lg overflow-hidden bg-gradient-to-b from-slate-900/50 to-slate-800/50 relative border border-border/30">
        <Canvas camera={{ position: [0, 0.5, 3], fov: 45 }}>
          <color attach="background" args={["#0f172a"]} />
          <fog attach="fog" args={["#0f172a", 4, 10]} />
          
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#60a5fa" />
          <pointLight position={[0, 3, 2]} intensity={0.5} color="#22c55e" />
          <pointLight position={[0, -1, 2]} intensity={0.3} color="#fbbf24" />
          
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
            minDistance={1.5}
            maxDistance={5}
            target={[0, 0.3, 0]}
            autoRotate={false}
          />
        </Canvas>
        
        {hoveredPart && hoveredPartData && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 bg-card/95 backdrop-blur-md rounded-xl border border-border shadow-xl max-w-xs">
            <p className="text-sm font-semibold text-foreground mb-1">{hoveredPart}</p>
            <p className="text-xs text-muted-foreground">
              {hoveredPartData.symptoms.slice(0, 3).join(" • ")}
            </p>
            <p className="text-xs text-primary mt-1">Click to add symptoms</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        🖱️ Drag to rotate • 📜 Scroll to zoom • 👆 Click body parts to add symptoms
      </p>
    </Card>
  );
}

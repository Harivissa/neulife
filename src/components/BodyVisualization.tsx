import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface BodyPart {
  id: string;
  name: string;
  path: string;
  keywords: string[];
}

interface BodyVisualizationProps {
  symptoms: string;
}

const bodyParts: BodyPart[] = [
  {
    id: "head",
    name: "Head",
    path: "M250 80 Q250 50 270 50 Q290 50 290 80 Q290 110 270 120 Q250 110 250 80",
    keywords: ["head", "headache", "migraine", "dizzy", "dizziness", "concussion", "skull", "brain"]
  },
  {
    id: "neck",
    name: "Neck",
    path: "M255 120 L255 150 L285 150 L285 120",
    keywords: ["neck", "throat", "sore throat", "stiff neck", "thyroid"]
  },
  {
    id: "chest",
    name: "Chest",
    path: "M230 150 L230 250 Q270 260 310 250 L310 150 Q270 160 230 150",
    keywords: ["chest", "heart", "lung", "breathing", "cough", "asthma", "bronchitis", "pneumonia", "cardiac"]
  },
  {
    id: "left-arm",
    name: "Left Arm",
    path: "M230 150 L190 180 L190 280 L210 290 L220 250 L230 250",
    keywords: ["left arm", "left hand", "left elbow", "left shoulder", "left wrist"]
  },
  {
    id: "right-arm",
    name: "Right Arm",
    path: "M310 150 L350 180 L350 280 L330 290 L320 250 L310 250",
    keywords: ["right arm", "right hand", "right elbow", "right shoulder", "right wrist"]
  },
  {
    id: "abdomen",
    name: "Abdomen",
    path: "M235 250 L235 330 Q270 340 305 330 L305 250 Q270 255 235 250",
    keywords: ["abdomen", "stomach", "belly", "intestine", "liver", "kidney", "pancreas", "nausea", "vomit", "diarrhea", "constipation"]
  },
  {
    id: "pelvis",
    name: "Pelvis",
    path: "M240 330 L240 370 L265 370 L275 370 L300 370 L300 330 Q270 335 240 330",
    keywords: ["pelvis", "hip", "groin", "bladder", "urinary", "reproductive"]
  },
  {
    id: "left-leg",
    name: "Left Leg",
    path: "M240 370 L240 480 L235 550 L255 550 L260 450 L265 370",
    keywords: ["left leg", "left knee", "left thigh", "left foot", "left ankle", "left toe"]
  },
  {
    id: "right-leg",
    name: "Right Leg",
    path: "M275 370 L280 450 L285 550 L305 550 L300 480 L300 370",
    keywords: ["right leg", "right knee", "right thigh", "right foot", "right ankle", "right toe"]
  },
  {
    id: "back",
    name: "Back",
    path: "M245 150 L245 330 L255 330 L255 150",
    keywords: ["back", "spine", "lower back", "upper back", "backache"]
  }
];

export const BodyVisualization = ({ symptoms }: BodyVisualizationProps) => {
  const [highlightedParts, setHighlightedParts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!symptoms) {
      setHighlightedParts(new Set());
      return;
    }

    const lowerSymptoms = symptoms.toLowerCase();
    const highlighted = new Set<string>();

    bodyParts.forEach((part) => {
      const isMatch = part.keywords.some((keyword) =>
        lowerSymptoms.includes(keyword.toLowerCase())
      );
      if (isMatch) {
        highlighted.add(part.id);
      }
    });

    setHighlightedParts(highlighted);
  }, [symptoms]);

  return (
    <Card className="p-6 border-border/50">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Affected Areas</h3>
          <p className="text-sm text-muted-foreground">
            {highlightedParts.size > 0
              ? "Body parts highlighted based on your symptoms"
              : "Describe symptoms to see affected areas"}
          </p>
        </div>

        <div className="flex justify-center">
          <svg
            viewBox="0 0 540 600"
            className="w-full max-w-md"
            style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
          >
            {/* Body outline */}
            <g>
              {bodyParts.map((part) => {
                const isHighlighted = highlightedParts.has(part.id);
                return (
                  <g key={part.id}>
                    <path
                      d={part.path}
                      fill={isHighlighted ? "hsl(var(--primary) / 0.3)" : "hsl(var(--muted) / 0.3)"}
                      stroke={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth="2"
                      className={`transition-all duration-500 ${
                        isHighlighted ? "animate-pulse" : ""
                      }`}
                      style={{
                        filter: isHighlighted
                          ? "drop-shadow(0 0 8px hsl(var(--primary) / 0.6))"
                          : "none",
                      }}
                    />
                    {isHighlighted && (
                      <g>
                        <path
                          d={part.path}
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                          opacity="0"
                          className="animate-ping"
                          style={{ animationDuration: "2s" }}
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {highlightedParts.size > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-sm font-medium text-accent mb-2">Detected Areas:</p>
            <div className="flex flex-wrap gap-2">
              {Array.from(highlightedParts).map((partId) => {
                const part = bodyParts.find((p) => p.id === partId);
                return (
                  <span
                    key={partId}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {part?.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

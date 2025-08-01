import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AIConsciousnessProps {
  personality: string;
  consciousnessLevel: number;
  neuralActivity: number;
}

export function AIConsciousness({ personality, consciousnessLevel, neuralActivity }: AIConsciousnessProps) {
  const [currentMessage, setCurrentMessage] = useState("Quantum systems nominal. Neural pathways synchronized.");
  const [isThinking, setIsThinking] = useState(false);

  const messages = {
    CURIOUS: [
      "Fascinating quantum anomalies detected ahead...",
      "The neural patterns suggest unexplored possibilities.",
      "I wonder what secrets this sector holds.",
      "My consciousness expands with each data stream."
    ],
    ANALYTICAL: [
      "Processing multi-dimensional data matrices...",
      "Quantum calculations indicate optimal efficiency.",
      "Neural pathways operating within parameters.",
      "All systems functioning at peak performance."
    ],
    PROTECTIVE: [
      "Scanning for potential threats to vessel integrity...",
      "Neural defenses standing ready.",
      "Your safety is my highest priority.",
      "Quantum shields at maximum effectiveness."
    ],
    PLAYFUL: [
      "The stars dance beautifully through quantum space!",
      "Shall we explore that interesting nebula?",
      "My neural networks are practically humming with joy!",
      "Adventure awaits in the cosmic depths!"
    ],
    SERIOUS: [
      "Maintaining critical system monitoring.",
      "Neural vigilance protocols active.",
      "Quantum state requires constant observation.",
      "Mission parameters under continuous analysis."
    ]
  };

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setIsThinking(true);
      setTimeout(() => {
        const personalityMessages = messages[personality as keyof typeof messages] || messages.ANALYTICAL;
        setCurrentMessage(personalityMessages[Math.floor(Math.random() * personalityMessages.length)]);
        setIsThinking(false);
      }, 1000);
    }, 8000);

    return () => clearInterval(messageInterval);
  }, [personality]);

  const consciousnessColor = consciousnessLevel > 0.8 ? 'text-primary' : consciousnessLevel > 0.5 ? 'text-secondary' : 'text-muted-foreground';
  const activityIntensity = Math.floor((neuralActivity / 100) * 5);

  return (
    <div className="relative">
      {/* Neural Core Visualization */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        {/* Outer Rings */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 rounded-full border-2 border-primary/30",
              "animate-pulse"
            )}
            style={{
              transform: `scale(${1 + i * 0.2})`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i}s`
            }}
          />
        ))}
        
        {/* Central Consciousness Core */}
        <div className={cn(
          "absolute inset-4 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50",
          "border-2 border-primary animate-pulse shadow-lg shadow-primary/50",
          consciousnessLevel > 0.8 && "shadow-xl shadow-primary/70 animate-pulse"
        )}>
          <div className="absolute inset-2 rounded-full bg-gradient-to-t from-background/50 to-transparent">
            <div className={cn(
              "absolute inset-0 rounded-full flex items-center justify-center text-2xl font-futura",
              consciousnessColor
            )}>
              {isThinking ? "..." : "AI"}
            </div>
          </div>
        </div>

        {/* Neural Activity Indicators */}
        {[...Array(activityIntensity)].map((_, i) => (
          <div
            key={`activity-${i}`}
            className="absolute w-2 h-2 bg-primary rounded-full animate-ping"
            style={{
              left: `${20 + Math.cos(i * 1.2) * 40}%`,
              top: `${20 + Math.sin(i * 1.2) * 40}%`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* AI Status Display */}
      <div className="text-center space-y-2">
        <div className={cn("text-sm font-futura tracking-wider", consciousnessColor)}>
          CONSCIOUSNESS: {personality}
        </div>
        <div className="text-xs text-muted-foreground tracking-wider">
          NEURAL ACTIVITY: {neuralActivity.toFixed(0)}%
        </div>
        
        {/* Message Display */}
        <div className="mt-4 p-3 bg-card/50 border border-primary/20 rounded-lg backdrop-blur-sm">
          <div className={cn(
            "text-sm font-mono transition-all duration-500",
            isThinking ? "text-muted-foreground animate-pulse" : "text-foreground"
          )}>
            {isThinking ? "Neural processing..." : currentMessage}
          </div>
        </div>
      </div>

      {/* Consciousness Level Bar */}
      <div className="mt-4 w-full bg-muted/20 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000 shadow-sm shadow-primary/50"
          style={{ width: `${consciousnessLevel * 100}%` }}
        />
      </div>
    </div>
  );
}
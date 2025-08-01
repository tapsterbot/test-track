import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { QuantumCore } from '@/components/quantum/QuantumCore';
import { HolographicDisplay } from '@/components/quantum/HolographicDisplay';
import { NeuralInterface } from '@/components/quantum/NeuralInterface';
import { ParticleField } from '@/components/quantum/ParticleField';
import { AIConsciousness } from '@/components/quantum/AIConsciousness';
import { DimensionalControls } from '@/components/quantum/DimensionalControls';
import { ModuleHeader } from '@/components/ModuleHeader';
import { useToast } from '@/hooks/use-toast';

export function QuantumBridge() {
  const { toast } = useToast();
  const [shipStatus, setShipStatus] = useState('OPTIMAL');
  const [quantumCharge, setQuantumCharge] = useState(87);
  const [neuralActivity, setNeuralActivity] = useState(94);
  const [dimensionalPhase, setDimensionalPhase] = useState('STABLE');
  const [aiPersonality, setAiPersonality] = useState('CURIOUS');
  const [temporalFlow, setTemporalFlow] = useState(1.0);
  const [consciousnessLevel, setConsciousnessLevel] = useState(0.78);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Simulate quantum fluctuations
    const interval = setInterval(() => {
      setQuantumCharge(prev => prev + (Math.random() - 0.5) * 5);
      setNeuralActivity(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 8)));
      
      if (Math.random() < 0.1) {
        const phases = ['STABLE', 'FLUCTUATING', 'RESONANT', 'CHAOTIC'];
        setDimensionalPhase(phases[Math.floor(Math.random() * phases.length)]);
      }

      if (Math.random() < 0.05) {
        const personalities = ['CURIOUS', 'ANALYTICAL', 'PROTECTIVE', 'PLAYFUL', 'SERIOUS'];
        setAiPersonality(personalities[Math.floor(Math.random() * personalities.length)]);
      }
    }, 2000);

    // Consciousness evolution
    const consciousnessInterval = setInterval(() => {
      setConsciousnessLevel(prev => Math.max(0, Math.min(1, prev + (Math.random() - 0.5) * 0.1)));
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(consciousnessInterval);
    };
  }, []);

  const handleQuantumJump = () => {
    toast({
      title: "🌌 Quantum Jump Initiated",
      description: "Folding space-time continuum...",
    });
    
    setTemporalFlow(0.1);
    setTimeout(() => setTemporalFlow(2.0), 1000);
    setTimeout(() => setTemporalFlow(1.0), 3000);
  };

  const handleNeuralSync = () => {
    toast({
      title: "🧠 Neural Synchronization",
      description: "Interfacing with ship consciousness...",
    });
    
    setConsciousnessLevel(1.0);
    setNeuralActivity(100);
  };

  const handleEmergencyProtocol = () => {
    toast({
      title: "⚡ Emergency Protocol Activated", 
      description: "All systems entering defensive mode...",
      variant: "destructive",
    });
    
    setShipStatus('CRITICAL');
    setDimensionalPhase('CHAOTIC');
    setTimeout(() => {
      setShipStatus('OPTIMAL');
      setDimensionalPhase('STABLE');
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ParticleField count={2000} />
        </Canvas>
      </div>

      {/* Main Interface */}
      <div className="relative z-10 p-6 space-y-6">
        <ModuleHeader 
          moduleNumber="QX-2387"
          title="QUANTUM NEURAL COMMAND BRIDGE"
          description="2387 Deep Space Exploration Vessel"
        />

        {/* AI Consciousness Header */}
        <div className="flex justify-center mb-8">
          <AIConsciousness 
            personality={aiPersonality}
            consciousnessLevel={consciousnessLevel}
            neuralActivity={neuralActivity}
          />
        </div>

        {/* Main Control Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Left Panel - Quantum Systems */}
          <div className="space-y-6">
            <div className="backdrop-blur-sm bg-card/80 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-futura text-primary mb-4 tracking-wider">QUANTUM MATRIX</h3>
              <QuantumCore 
                charge={quantumCharge}
                onQuantumJump={handleQuantumJump}
                temporalFlow={temporalFlow}
              />
            </div>

            <div className="backdrop-blur-sm bg-card/80 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-futura text-primary mb-4 tracking-wider">NEURAL INTERFACE</h3>
              <NeuralInterface 
                activity={neuralActivity}
                onNeuralSync={handleNeuralSync}
                consciousnessLevel={consciousnessLevel}
              />
            </div>
          </div>

          {/* Center Panel - Holographic Display */}
          <div className="space-y-6">
            <div className="backdrop-blur-sm bg-card/80 border border-primary/20 rounded-lg p-6 h-96">
              <h3 className="text-lg font-futura text-primary mb-4 tracking-wider">HOLOGRAPHIC PROJECTION</h3>
              <div className="h-full">
                <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
                  <HolographicDisplay 
                    shipStatus={shipStatus}
                    dimensionalPhase={dimensionalPhase}
                    quantumCharge={quantumCharge}
                  />
                </Canvas>
              </div>
            </div>
          </div>

          {/* Right Panel - Dimensional Controls */}
          <div className="space-y-6">
            <div className="backdrop-blur-sm bg-card/80 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-futura text-primary mb-4 tracking-wider">DIMENSIONAL MATRIX</h3>
              <DimensionalControls 
                phase={dimensionalPhase}
                onEmergencyProtocol={handleEmergencyProtocol}
                temporalFlow={temporalFlow}
              />
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="backdrop-blur-sm bg-card/80 border border-primary/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-futura text-primary tracking-wider">{quantumCharge.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground tracking-wider">QUANTUM CHARGE</div>
              </div>
              <div className="backdrop-blur-sm bg-card/80 border border-primary/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-futura text-primary tracking-wider">{(consciousnessLevel * 100).toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground tracking-wider">AI CONSCIOUSNESS</div>
              </div>
              <div className="backdrop-blur-sm bg-card/80 border border-primary/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-futura text-secondary tracking-wider">{dimensionalPhase}</div>
                <div className="text-sm text-muted-foreground tracking-wider">PHASE STATUS</div>
              </div>
              <div className="backdrop-blur-sm bg-card/80 border border-primary/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-futura text-accent tracking-wider">{temporalFlow.toFixed(1)}x</div>
                <div className="text-sm text-muted-foreground tracking-wider">TEMPORAL FLOW</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio for Immersion */}
      <audio ref={audioRef} loop>
        <source src="/quantum-ambience.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
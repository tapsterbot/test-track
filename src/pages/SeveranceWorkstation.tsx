import React, { useState, useEffect } from 'react';
import { ModuleHeader } from '@/components/ModuleHeader';
import { MDRInterface } from '@/components/severance/MDRInterface';
import { TemperDisplay } from '@/components/severance/TemperDisplay';
import { NumberGrid } from '@/components/severance/NumberGrid';
import { useToast } from '@/hooks/use-toast';

export function SeveranceWorkstation() {
  const { toast } = useToast();
  
  const [currentNumbers] = useState([
    137, 892, 445, 729, 283, 956, 671, 384, 
    517, 203, 748, 621, 859, 394, 176, 825,
    463, 702, 318, 597, 481, 736, 259, 614,
    387, 923, 541, 806, 275, 638, 419, 784
  ]);

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [targetTemper, setTargetTemper] = useState('WRATH');
  const [quotaProgress, setQuotaProgress] = useState(73);
  const [sessionScore, setSessionScore] = useState(147);

  const tempers = [
    { name: 'WRATH', color: '#ff4444', description: 'Anger, hostility, aggression' },
    { name: 'FROLIC', color: '#44ff44', description: 'Joy, playfulness, mirth' },
    { name: 'DREAD', color: '#4444ff', description: 'Fear, anxiety, apprehension' },
    { name: 'MALICE', color: '#ff44ff', description: 'Spite, cruelty, ill-will' }
  ];

  const [timeRemaining, setTimeRemaining] = useState("06:42:18");

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const [hours, minutes, seconds] = prev.split(':').map(Number);
        let totalSeconds = hours * 3600 + minutes * 60 + seconds - 1;
        
        if (totalSeconds <= 0) {
          toast({
            title: "WORK DAY COMPLETE",
            description: "Please proceed to elevator for departure.",
          });
          totalSeconds = 0;
        }
        
        const newHours = Math.floor(totalSeconds / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = totalSeconds % 60;
        
        return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [toast]);

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleRefinement = () => {
    if (selectedNumbers.length === 0) {
      toast({
        title: "NO NUMBERS SELECTED",
        description: "Please select numbers that evoke the target temper.",
        variant: "destructive"
      });
      return;
    }

    // Simulate refinement
    const isCorrect = Math.random() > 0.3; // 70% success rate
    
    if (isCorrect) {
      setSessionScore(prev => prev + selectedNumbers.length);
      setQuotaProgress(prev => Math.min(100, prev + (selectedNumbers.length * 2)));
      toast({
        title: "REFINEMENT SUCCESSFUL",
        description: `${selectedNumbers.length} numbers refined for ${targetTemper}`,
      });
    } else {
      toast({
        title: "REFINEMENT FAILED",
        description: "Those numbers do not evoke the target temper.",
        variant: "destructive"
      });
    }
    
    setSelectedNumbers([]);
    
    // Rotate target temper
    const currentIndex = tempers.findIndex(t => t.name === targetTemper);
    const nextIndex = (currentIndex + 1) % tempers.length;
    setTargetTemper(tempers[nextIndex].name);
  };

  return (
    <div className="min-h-screen bg-[#2a3c5c] text-[#e8f4f8]">
      <ModuleHeader 
        moduleNumber="MDR-01"
        title="MACRODATA REFINEMENT TERMINAL"
        description="Lumon Industries - Sublevel C"
      />

      <div className="container mx-auto p-4 space-y-4">
        {/* Main MDR Interface */}
        <div className="bg-[#1e2a3a] border-4 border-[#4a6b8a] rounded-lg shadow-2xl">
          {/* Header Bar */}
          <div className="bg-[#4a6b8a] px-6 py-3 border-b-2 border-[#6a8baa]">
            <div className="flex justify-between items-center">
              <div className="font-mono text-lg font-bold text-white">
                LUMON INDUSTRIES MDR TERMINAL v2.1.4
              </div>
              <div className="font-mono text-sm text-[#a8c8e8]">
                SESSION TIME: {timeRemaining}
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-[#2a3c5c] px-6 py-2 border-b border-[#4a6b8a]">
            <div className="grid grid-cols-4 gap-4 text-center text-sm font-mono">
              <div>
                <span className="text-[#a8c8e8]">QUOTA: </span>
                <span className="text-white">{quotaProgress}%</span>
              </div>
              <div>
                <span className="text-[#a8c8e8]">SCORE: </span>
                <span className="text-white">{sessionScore}</span>
              </div>
              <div>
                <span className="text-[#a8c8e8]">SELECTED: </span>
                <span className="text-white">{selectedNumbers.length}</span>
              </div>
              <div>
                <span className="text-[#a8c8e8]">TARGET: </span>
                <span 
                  className="text-white font-bold"
                  style={{ color: tempers.find(t => t.name === targetTemper)?.color }}
                >
                  {targetTemper}
                </span>
              </div>
            </div>
          </div>

          {/* Main Interface Area */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Temper Display */}
              <div className="lg:col-span-1">
                <TemperDisplay 
                  tempers={tempers}
                  currentTemper={targetTemper}
                />
              </div>

              {/* Number Grid */}
              <div className="lg:col-span-2">
                <NumberGrid 
                  numbers={currentNumbers}
                  selectedNumbers={selectedNumbers}
                  onNumberSelect={handleNumberSelect}
                  targetTemper={targetTemper}
                />
              </div>

              {/* Controls */}
              <div className="lg:col-span-1">
                <MDRInterface 
                  selectedCount={selectedNumbers.length}
                  onRefinement={handleRefinement}
                  quotaProgress={quotaProgress}
                  sessionScore={sessionScore}
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-[#1e2a3a] px-6 py-4 border-t border-[#4a6b8a]">
            <div className="text-center font-mono text-sm text-[#a8c8e8]">
              SELECT NUMBERS THAT EVOKE {targetTemper} • CLICK TO SELECT/DESELECT • PRESS REFINE TO SUBMIT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
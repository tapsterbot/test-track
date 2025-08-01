import React from 'react';
import { cn } from '@/lib/utils';

interface NumberGridProps {
  numbers: number[];
  selectedNumbers: number[];
  onNumberSelect: (number: number) => void;
  targetTemper: string;
}

export function NumberGrid({ numbers, selectedNumbers, onNumberSelect, targetTemper }: NumberGridProps) {
  // Function to determine if a number might be "scary" or evoke certain emotions
  const getNumberIntensity = (number: number, temper: string) => {
    // This is a simplified logic - in the actual show it's more mysterious
    switch (temper) {
      case 'WRATH':
        return number % 13 === 0 || number.toString().includes('666') || number > 800;
      case 'DREAD':
        return number < 200 || number.toString().includes('13') || number % 7 === 0;
      case 'MALICE':
        return number.toString().includes('4') || number % 11 === 0;
      case 'FROLIC':
        return number % 3 === 0 || number.toString().includes('7') || (number > 400 && number < 600);
      default:
        return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1e2a3a] border-2 border-[#4a6b8a] rounded p-4">
        <div className="font-mono text-sm text-[#e8f4f8] mb-4 text-center">
          NUMBER GRID - SELECT NUMBERS THAT EVOKE {targetTemper}
        </div>
        
        {/* Number Grid */}
        <div className="grid grid-cols-8 gap-2">
          {numbers.map((number) => {
            const isSelected = selectedNumbers.includes(number);
            const hasIntensity = getNumberIntensity(number, targetTemper);
            
            return (
              <button
                key={number}
                onClick={() => onNumberSelect(number)}
                className={cn(
                  "h-16 font-mono text-lg font-bold border-2 rounded transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  isSelected 
                    ? "bg-[#4a6b8a] border-[#6a8baa] text-white shadow-lg transform scale-105" 
                    : "bg-[#2a3c5c] border-[#4a6b8a] text-[#e8f4f8] hover:bg-[#3a4c6c]",
                  hasIntensity && !isSelected && "border-yellow-400 text-yellow-200 animate-pulse"
                )}
                style={{
                  textShadow: isSelected ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                }}
              >
                {number}
              </button>
            );
          })}
        </div>
        
        {/* Selection Helper */}
        <div className="mt-4 text-center">
          <div className="text-xs font-mono text-[#a8c8e8]">
            Click numbers to select • Selected numbers will be refined for {targetTemper}
          </div>
          {selectedNumbers.length > 0 && (
            <div className="mt-2 text-sm font-mono text-white">
              Selected: {selectedNumbers.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Hint System */}
      <div className="bg-[#2a3c5c] border border-[#4a6b8a] rounded p-3">
        <div className="text-xs font-mono text-[#a8c8e8] text-center">
          Some numbers may feel more intense. Trust your emotional response.
        </div>
      </div>
    </div>
  );
}
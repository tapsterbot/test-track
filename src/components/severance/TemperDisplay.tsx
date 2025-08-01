import React from 'react';

interface Temper {
  name: string;
  color: string;
  description: string;
}

interface TemperDisplayProps {
  tempers: Temper[];
  currentTemper: string;
}

export function TemperDisplay({ tempers, currentTemper }: TemperDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="bg-[#1e2a3a] border-2 border-[#4a6b8a] rounded p-4">
        <div className="font-mono text-sm text-[#e8f4f8] mb-4 text-center">
          TARGET TEMPER
        </div>
        
        <div className="text-center mb-6">
          <div 
            className="text-4xl font-mono font-bold mb-2"
            style={{ color: tempers.find(t => t.name === currentTemper)?.color }}
          >
            {currentTemper}
          </div>
          <div className="text-xs text-[#a8c8e8]">
            {tempers.find(t => t.name === currentTemper)?.description}
          </div>
        </div>
      </div>

      {/* All Tempers Reference */}
      <div className="bg-[#1e2a3a] border-2 border-[#4a6b8a] rounded p-4">
        <div className="font-mono text-sm text-[#e8f4f8] mb-4 text-center">
          THE FOUR TEMPERS
        </div>
        
        <div className="space-y-3">
          {tempers.map((temper) => (
            <div 
              key={temper.name}
              className={`p-3 border rounded ${
                temper.name === currentTemper 
                  ? 'border-2 bg-opacity-20' 
                  : 'border border-[#4a6b8a] bg-[#2a3c5c]'
              }`}
              style={{
                borderColor: temper.name === currentTemper ? temper.color : '#4a6b8a',
                backgroundColor: temper.name === currentTemper ? `${temper.color}20` : '#2a3c5c'
              }}
            >
              <div 
                className="font-mono font-bold text-sm"
                style={{ color: temper.color }}
              >
                {temper.name}
              </div>
              <div className="text-xs text-[#a8c8e8] mt-1">
                {temper.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-[#2a3c5c] border border-[#4a6b8a] rounded p-3">
        <div className="text-xs font-mono text-[#a8c8e8] text-center">
          Numbers that feel "{currentTemper.toLowerCase()}" should be selected
        </div>
      </div>
    </div>
  );
}
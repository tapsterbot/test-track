import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface MDRInterfaceProps {
  selectedCount: number;
  onRefinement: () => void;
  quotaProgress: number;
  sessionScore: number;
}

export function MDRInterface({ selectedCount, onRefinement, quotaProgress, sessionScore }: MDRInterfaceProps) {
  return (
    <div className="space-y-6">
      {/* Refinement Controls */}
      <div className="bg-[#1e2a3a] border-2 border-[#4a6b8a] rounded p-4">
        <div className="text-center space-y-4">
          <div className="font-mono text-lg text-[#e8f4f8] mb-4">
            REFINEMENT CONTROLS
          </div>
          
          <div className="text-3xl font-mono text-white">
            {selectedCount}
          </div>
          <div className="text-sm text-[#a8c8e8]">
            NUMBERS SELECTED
          </div>
          
          <Button
            onClick={onRefinement}
            className="w-full h-16 text-xl font-mono bg-[#4a6b8a] hover:bg-[#5a7b9a] text-white border-2 border-[#6a8baa] rounded-none"
          >
            REFINE
          </Button>
        </div>
      </div>

      {/* Quota Progress */}
      <div className="bg-[#1e2a3a] border-2 border-[#4a6b8a] rounded p-4">
        <div className="space-y-3">
          <div className="font-mono text-sm text-[#e8f4f8]">
            QUOTA PROGRESS
          </div>
          <Progress 
            value={quotaProgress} 
            className="h-4 bg-[#2a3c5c]"
          />
          <div className="text-center font-mono text-lg text-white">
            {quotaProgress}%
          </div>
        </div>
      </div>

      {/* Session Stats */}
      <div className="bg-[#1e2a3a] border-2 border-[#4a6b8a] rounded p-4">
        <div className="space-y-4">
          <div className="font-mono text-sm text-[#e8f4f8] mb-3">
            SESSION STATISTICS
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#a8c8e8]">Score:</span>
              <span className="text-white font-mono">{sessionScore}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-[#a8c8e8]">Accuracy:</span>
              <span className="text-white font-mono">94.2%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-[#a8c8e8]">Rate:</span>
              <span className="text-white font-mono">12.3/hr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-[#2a3c5c] border border-[#4a6b8a] rounded p-3">
        <div className="text-xs font-mono text-[#a8c8e8] text-center leading-relaxed">
          Select numbers that evoke the target emotion. Trust your instincts.
        </div>
      </div>
    </div>
  );
}
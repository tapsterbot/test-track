import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SeveranceTerminalProps {
  onDataRefinement: () => void;
  currentFile: string;
  progress: number;
}

export function SeveranceTerminal({ onDataRefinement, currentFile, progress }: SeveranceTerminalProps) {
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Initialize terminal with welcome message
    setTerminalOutput([
      "LUMON INDUSTRIES MACRODATA REFINEMENT TERMINAL v2.1.4",
      "Copyright 1982-2023 Lumon Industries. All rights reserved.",
      "",
      "Please select a task from the menu below.",
      "Remember: Work is life. Life is work.",
      ""
    ]);
  }, []);

  const handleRefinement = async () => {
    setIsProcessing(true);
    
    const newOutput = [
      ...terminalOutput,
      `> PROCESSING FILE: ${currentFile}`,
      "Analyzing data structure...",
      "Applying refinement algorithms...",
    ];
    setTerminalOutput(newOutput);

    // Simulate processing time
    setTimeout(() => {
      setTerminalOutput(prev => [
        ...prev,
        "Data refinement complete.",
        "Quota progress updated.",
        ""
      ]);
      setIsProcessing(false);
      onDataRefinement();
    }, 2000);
  };

  const handleClearTerminal = () => {
    setTerminalOutput([
      "Terminal cleared.",
      "Ready for next operation.",
      ""
    ]);
  };

  return (
    <div className="bg-card border-2 border-primary/20 rounded-none shadow-lg">
      <div className="bg-primary/10 px-4 py-2 border-b border-primary/20">
        <div className="font-futura text-sm tracking-wider text-primary">
          MACRODATA REFINEMENT TERMINAL
        </div>
      </div>

      {/* Terminal Display */}
      <div className="bg-background/50 p-4 h-64 overflow-y-auto font-mono text-sm">
        {terminalOutput.map((line, index) => (
          <div key={index} className={cn(
            "mb-1",
            line.startsWith('>') ? "text-primary" : "text-foreground",
            line.includes("complete") || line.includes("updated") ? "text-secondary" : ""
          )}>
            {line || "\u00A0"}
          </div>
        ))}
        {isProcessing && (
          <div className="text-primary animate-pulse">
            Processing...
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3 border-t border-primary/20">
        <div className="text-xs text-muted-foreground mb-2 tracking-wider">
          QUOTA PROGRESS
        </div>
        <Progress 
          value={progress * 100} 
          className="h-2 bg-muted/20"
        />
        <div className="text-xs text-muted-foreground mt-1">
          {Math.round(progress * 100)}% Complete
        </div>
      </div>

      {/* Control Panel */}
      <div className="p-4 border-t border-primary/20 bg-muted/10">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleRefinement}
            disabled={isProcessing}
            variant="outline"
            className="font-futura text-xs tracking-wider bg-card border-primary/30 hover:bg-primary/10"
          >
            {isProcessing ? "PROCESSING..." : "REFINE DATA"}
          </Button>
          
          <Button
            onClick={handleClearTerminal}
            variant="outline"
            className="font-futura text-xs tracking-wider bg-card border-muted-foreground/30 hover:bg-muted/20"
          >
            CLEAR TERMINAL
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-card border border-primary/20 p-2 rounded-none">
            <div className="text-xs text-muted-foreground">CPU</div>
            <div className="text-sm font-mono text-primary">47%</div>
          </div>
          <div className="bg-card border border-primary/20 p-2 rounded-none">
            <div className="text-xs text-muted-foreground">MEM</div>
            <div className="text-sm font-mono text-secondary">23%</div>
          </div>
          <div className="bg-card border border-primary/20 p-2 rounded-none">
            <div className="text-xs text-muted-foreground">NET</div>
            <div className="text-sm font-mono text-accent">SEVERED</div>
          </div>
        </div>
      </div>
    </div>
  );
}
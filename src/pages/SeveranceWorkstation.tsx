import React, { useState, useEffect } from 'react';
import { ModuleHeader } from '@/components/ModuleHeader';
import { SeveranceTerminal } from '@/components/severance/SeveranceTerminal';
import { WorkerProfile } from '@/components/severance/WorkerProfile';
import { ProductivityTracker } from '@/components/severance/ProductivityTracker';
import { CorporateMessages } from '@/components/severance/CorporateMessages';
import { DataRefinement } from '@/components/severance/DataRefinement';
import { useToast } from '@/hooks/use-toast';

export function SeveranceWorkstation() {
  const { toast } = useToast();
  const [currentWorker] = useState({
    name: "M. SCOUT",
    department: "MACRODATA REFINEMENT", 
    employeeId: "MDR-4417",
    startTime: "09:00:00",
    quotaProgress: 73
  });

  const [workSession, setWorkSession] = useState({
    timeRemaining: "06:42:18",
    tasksCompleted: 147,
    quotaTarget: 200,
    currentFile: "LUMON_DATA_BATCH_4417.CSV"
  });

  useEffect(() => {
    // Simulate work session countdown
    const interval = setInterval(() => {
      setWorkSession(prev => {
        const [hours, minutes, seconds] = prev.timeRemaining.split(':').map(Number);
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
        
        return {
          ...prev,
          timeRemaining: `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [toast]);

  const handleDataRefinement = () => {
    setWorkSession(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted + 1
    }));
    
    if (workSession.tasksCompleted + 1 >= workSession.quotaTarget) {
      toast({
        title: "QUOTA ACHIEVED",
        description: "Excellent work. Proceed to Music/Dance Experience.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/10">
      <ModuleHeader 
        moduleNumber="LMN-001"
        title="LUMON INDUSTRIES WORKSTATION"
        description="Macrodata Refinement Division - Sublevel C"
      />

      <div className="container mx-auto p-6 space-y-6">
        {/* Corporate Header */}
        <div className="bg-card border-2 border-primary/20 rounded-none shadow-lg">
          <div className="bg-primary/10 px-6 py-3 border-b border-primary/20">
            <div className="flex justify-between items-center">
              <div className="font-futura text-sm tracking-wider text-primary">
                LUMON INDUSTRIES EMPLOYEE TERMINAL
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                SECURITY LEVEL: SEVERED
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="text-xs text-muted-foreground mb-2 tracking-wider">EMPLOYEE STATUS</div>
                <div className="text-lg font-futura text-foreground">{currentWorker.name}</div>
                <div className="text-sm text-muted-foreground">{currentWorker.department}</div>
                <div className="text-xs text-muted-foreground mt-2">ID: {currentWorker.employeeId}</div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="text-xs text-muted-foreground mb-2 tracking-wider">WORK SESSION</div>
                <div className="text-2xl font-mono text-primary">{workSession.timeRemaining}</div>
                <div className="text-xs text-muted-foreground">TIME REMAINING</div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="text-xs text-muted-foreground mb-2 tracking-wider">PRODUCTIVITY</div>
                <div className="text-2xl font-mono text-secondary">{workSession.tasksCompleted}/{workSession.quotaTarget}</div>
                <div className="text-xs text-muted-foreground">TASKS COMPLETED</div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="text-xs text-muted-foreground mb-2 tracking-wider">CURRENT FILE</div>
                <div className="text-sm font-mono text-foreground break-all">{workSession.currentFile}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Work Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Worker Profile & Messages */}
          <div className="space-y-6">
            <WorkerProfile worker={currentWorker} />
            <CorporateMessages />
          </div>

          {/* Center Panel - Main Terminal */}
          <div className="space-y-6">
            <SeveranceTerminal 
              onDataRefinement={handleDataRefinement}
              currentFile={workSession.currentFile}
              progress={workSession.tasksCompleted / workSession.quotaTarget}
            />
          </div>

          {/* Right Panel - Productivity & Data Refinement */}
          <div className="space-y-6">
            <ProductivityTracker 
              completed={workSession.tasksCompleted}
              target={workSession.quotaTarget}
              timeRemaining={workSession.timeRemaining}
            />
            <DataRefinement onRefine={handleDataRefinement} />
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-card border-2 border-primary/20 rounded-none shadow-lg">
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl text-primary">●</div>
                <div className="text-xs text-muted-foreground">WELLNESS</div>
                <div className="text-sm font-mono text-foreground">OPTIMAL</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl text-secondary">●</div>
                <div className="text-xs text-muted-foreground">SECURITY</div>
                <div className="text-sm font-mono text-foreground">ACTIVE</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl text-accent">●</div>
                <div className="text-xs text-muted-foreground">CONNECTION</div>
                <div className="text-sm font-mono text-foreground">SEVERED</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl text-primary">●</div>
                <div className="text-xs text-muted-foreground">COMPLIANCE</div>
                <div className="text-sm font-mono text-foreground">100%</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl text-secondary">●</div>
                <div className="text-xs text-muted-foreground">MORALE</div>
                <div className="text-sm font-mono text-foreground">EXCELLENT</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
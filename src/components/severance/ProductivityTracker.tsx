import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProductivityTrackerProps {
  completed: number;
  target: number;
  timeRemaining: string;
}

export function ProductivityTracker({ completed, target, timeRemaining }: ProductivityTrackerProps) {
  const completionPercentage = (completed / target) * 100;
  const isOnTrack = completionPercentage >= 50; // Simplified metric

  return (
    <Card className="border-2 border-primary/20 rounded-none shadow-lg">
      <CardHeader className="bg-primary/10 border-b border-primary/20 pb-3">
        <div className="font-futura text-sm tracking-wider text-primary">
          PRODUCTIVITY MONITOR
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Main Progress Display */}
        <div className="text-center space-y-3">
          <div className="text-4xl font-mono text-primary">
            {completed}
          </div>
          <div className="text-sm text-muted-foreground tracking-wider">
            OF {target} TASKS COMPLETED
          </div>
          
          <Progress 
            value={completionPercentage} 
            className="h-3 bg-muted/20"
          />
          
          <div className="text-xs text-muted-foreground">
            {completionPercentage.toFixed(1)}% Complete
          </div>
        </div>

        {/* Time Tracking */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-muted/10 border border-primary/20 p-4 text-center">
            <div className="text-2xl font-mono text-secondary">
              {timeRemaining}
            </div>
            <div className="text-xs text-muted-foreground tracking-wider">
              TIME REMAINING
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground tracking-wider mb-2">
            PERFORMANCE METRICS
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-primary/20 p-3 text-center">
              <div className="text-sm font-mono text-primary">94.2%</div>
              <div className="text-xs text-muted-foreground">ACCURACY</div>
            </div>
            <div className="bg-card border border-primary/20 p-3 text-center">
              <div className="text-sm font-mono text-secondary">12.3/hr</div>
              <div className="text-xs text-muted-foreground">RATE</div>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-3 pt-3 border-t border-primary/20">
          <div className="text-xs text-muted-foreground tracking-wider mb-2">
            STATUS INDICATORS
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Quota Progress</span>
              <div className={cn(
                "w-3 h-3 rounded-full",
                completionPercentage >= 75 ? "bg-primary" : 
                completionPercentage >= 50 ? "bg-secondary" : "bg-destructive"
              )} />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Time Management</span>
              <div className={cn(
                "w-3 h-3 rounded-full",
                isOnTrack ? "bg-primary" : "bg-secondary"
              )} />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Quality Score</span>
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-primary/5 border border-primary/20 p-3 text-center">
          <div className="text-xs text-primary font-futura tracking-wider">
            {completionPercentage >= 100 ? 
              "QUOTA ACHIEVED - EXCELLENT WORK" :
              completionPercentage >= 75 ?
              "APPROACHING QUOTA - MAINTAIN PACE" :
              "FOCUS ON YOUR TASKS"
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
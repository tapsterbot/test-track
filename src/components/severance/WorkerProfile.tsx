import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Worker {
  name: string;
  department: string;
  employeeId: string;
  startTime: string;
  quotaProgress: number;
}

interface WorkerProfileProps {
  worker: Worker;
}

export function WorkerProfile({ worker }: WorkerProfileProps) {
  return (
    <Card className="border-2 border-primary/20 rounded-none shadow-lg">
      <CardHeader className="bg-primary/10 border-b border-primary/20 pb-3">
        <div className="font-futura text-sm tracking-wider text-primary">
          EMPLOYEE PROFILE
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Employee Photo Placeholder */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-muted/30 border-2 border-primary/20 flex items-center justify-center">
            <div className="text-4xl text-muted-foreground">👤</div>
          </div>
        </div>

        {/* Employee Details */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground tracking-wider mb-1">NAME</div>
            <div className="font-futura text-lg tracking-wide text-foreground">{worker.name}</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground tracking-wider mb-1">DEPARTMENT</div>
            <div className="text-sm text-foreground">{worker.department}</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground tracking-wider mb-1">EMPLOYEE ID</div>
            <div className="font-mono text-sm text-foreground">{worker.employeeId}</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground tracking-wider mb-1">SHIFT START</div>
            <div className="font-mono text-sm text-foreground">{worker.startTime}</div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="space-y-2 pt-3 border-t border-primary/20">
          <div className="text-xs text-muted-foreground tracking-wider mb-2">STATUS</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="font-futura text-xs rounded-none">
              SEVERED
            </Badge>
            <Badge variant="outline" className="font-futura text-xs rounded-none border-primary/30">
              ACTIVE
            </Badge>
            <Badge variant={worker.quotaProgress >= 100 ? "default" : "secondary"} className="font-futura text-xs rounded-none">
              {worker.quotaProgress >= 100 ? "QUOTA MET" : "IN PROGRESS"}
            </Badge>
          </div>
        </div>

        {/* Employee Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-primary/20">
          <div className="text-center bg-muted/10 p-3 border border-primary/20">
            <div className="text-lg font-mono text-primary">{worker.quotaProgress}</div>
            <div className="text-xs text-muted-foreground">QUOTA %</div>
          </div>
          <div className="text-center bg-muted/10 p-3 border border-primary/20">
            <div className="text-lg font-mono text-secondary">A+</div>
            <div className="text-xs text-muted-foreground">RATING</div>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="bg-primary/5 border border-primary/20 p-3 text-center">
          <div className="text-xs text-primary font-futura tracking-wider">
            REMEMBER: YOU ARE HERE FOR LUMON
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
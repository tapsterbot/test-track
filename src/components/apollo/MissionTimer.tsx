import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MissionTimerProps {
  className?: string;
}

export function MissionTimer({ className }: MissionTimerProps) {
  const [missionTime, setMissionTime] = useState(0);
  const [getTime, setGetTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTime(prev => prev + 1);
      setGetTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(3, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatGET = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getUTCFullYear()}.${(date.getUTCMonth() + 1).toString().padStart(3, '0')}.${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "bg-black border-2 border-muted-foreground rounded-sm p-4",
      "font-futura text-nasa-green shadow-inner nasa-panel",
      className
    )}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground uppercase">MET</span>
          <span className="text-lg font-bold tracking-wider">
            {formatTime(missionTime)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground uppercase">GET</span>
          <span className="text-sm tracking-wider">
            {formatGET(getTime)}
          </span>
        </div>
      </div>
    </div>
  );
}
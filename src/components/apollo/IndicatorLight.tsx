import { cn } from "@/lib/utils";

interface IndicatorLightProps {
  label: string;
  status: "on" | "off" | "blink";
  color?: "red" | "amber" | "green" | "blue" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function IndicatorLight({ 
  label, 
  status, 
  color = "green", 
  size = "md",
  className 
}: IndicatorLightProps) {
  const colors = {
    red: status === "on" ? "bg-destructive shadow-destructive" : "bg-destructive/20",
    amber: status === "on" ? "bg-nasa-amber shadow-nasa-amber" : "bg-nasa-amber/20", 
    green: status === "on" ? "bg-nasa-green shadow-nasa-green" : "bg-nasa-green/20",
    blue: status === "on" ? "bg-nasa-telemetry shadow-nasa-telemetry" : "bg-nasa-telemetry/20",
    white: status === "on" ? "bg-white shadow-white" : "bg-white/20"
  };

  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6"
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div 
        className={cn(
          "rounded-full border-2 border-muted-foreground/30 transition-all duration-300",
          sizes[size],
          colors[color],
          status === "on" && "shadow-lg shadow-current/50",
          status === "blink" && "animate-pulse"
        )}
      />
      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider text-center leading-tight">
        {label}
      </label>
    </div>
  );
}
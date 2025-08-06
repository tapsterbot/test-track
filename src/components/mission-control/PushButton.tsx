import { useState } from "react";
import { cn } from "@/lib/utils";

interface PushButtonProps {
  label: string;
  onClick: () => void;
  color?: "red" | "amber" | "white" | "green";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  className?: string;
}

export function PushButton({ 
  label, 
  onClick, 
  color = "white", 
  size = "md",
  active = false,
  className 
}: PushButtonProps) {
  const [pressed, setPressed] = useState(false);

  const colors = {
    red: active 
      ? "bg-destructive border-destructive text-destructive-foreground shadow-destructive/50" 
      : "bg-destructive/80 border-destructive/80 text-destructive-foreground",
    amber: active 
      ? "bg-nasa-amber border-nasa-amber text-card-foreground shadow-nasa-amber/50" 
      : "bg-nasa-amber/80 border-nasa-amber/80 text-card-foreground",
    white: active 
      ? "bg-card border-border text-card-foreground shadow-card/50" 
      : "bg-card/80 border-border/80 text-card-foreground",
    green: active 
      ? "bg-nasa-green border-nasa-green text-card-foreground shadow-nasa-green/50" 
      : "bg-nasa-green/80 border-nasa-green/80 text-card-foreground"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <button
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onClick={onClick}
        className={cn(
          "border-2 rounded-sm transition-all duration-100",
          "font-futura font-bold uppercase tracking-wider nasa-panel",
          "hover:brightness-110 active:scale-95",
          sizes[size],
          colors[color],
          pressed ? "shadow-inner scale-95" : "shadow-lg",
          active && "shadow-lg shadow-current/50"
        )}
      >
        <div className={cn(
          "absolute inset-1 rounded-sm transition-all duration-100 pointer-events-none",
          pressed 
            ? "bg-gradient-to-b from-black/20 to-transparent" 
            : "bg-gradient-to-b from-white/20 to-transparent"
        )} />
        <span className="relative z-10">{label}</span>
      </button>
    </div>
  );
}
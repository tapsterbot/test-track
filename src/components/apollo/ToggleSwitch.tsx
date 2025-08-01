import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  color?: "red" | "amber" | "white" | "green";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ToggleSwitch({ 
  label, 
  value, 
  onChange, 
  color = "white", 
  size = "md",
  className 
}: ToggleSwitchProps) {
  const colors = {
    red: "bg-destructive border-destructive text-destructive-foreground shadow-destructive/50",
    amber: "bg-nasa-amber border-nasa-amber text-card-foreground shadow-nasa-amber/50",
    white: "bg-card border-border text-card-foreground shadow-card/50",
    green: "bg-nasa-green border-nasa-green text-card-foreground shadow-nasa-green/50"
  };

  const sizes = {
    sm: "h-8 w-12 text-xs",
    md: "h-10 w-16 text-sm", 
    lg: "h-12 w-20 text-base"
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "relative border-2 rounded-sm transition-all duration-200",
          "shadow-inner font-futura font-bold uppercase nasa-panel",
          "hover:shadow-lg active:shadow-none active:scale-95",
          sizes[size],
          value ? colors[color] : "bg-muted border-muted-foreground text-muted-foreground"
        )}
      >
        <div className={cn(
          "absolute inset-1 rounded-sm transition-all duration-200",
          value 
            ? "bg-gradient-to-b from-white/20 to-transparent" 
            : "bg-gradient-to-b from-black/20 to-transparent"
        )} />
        <span className="relative z-10">
          {value ? "ON" : "OFF"}
        </span>
      </button>
    </div>
  );
}
import { cn } from "@/lib/utils";

interface SystemPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function SystemPanel({ title, children, className, fullWidth = false }: SystemPanelProps) {
  return (
    <div className={cn(
      "nasa-panel border-2 border-muted-foreground/30 rounded-sm",
      fullWidth ? "p-0" : "p-4",
      className
    )}>
      <div className={cn(
        "mb-3 pb-2 border-b border-muted-foreground/20",
        fullWidth ? "px-4 pt-4" : ""
      )}>
        <h3 className="text-sm font-futura font-bold text-muted-foreground uppercase tracking-wider nasa-display">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
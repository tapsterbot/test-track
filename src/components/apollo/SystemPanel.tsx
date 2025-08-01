import { cn } from "@/lib/utils";

interface SystemPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SystemPanel({ title, children, className }: SystemPanelProps) {
  return (
    <div className={cn(
      "nasa-panel border-2 border-muted-foreground/30 rounded-sm p-4",
      className
    )}>
      <div className="mb-3 pb-2 border-b border-muted-foreground/20">
        <h3 className="text-sm font-futura font-bold text-muted-foreground uppercase tracking-wider nasa-display">
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
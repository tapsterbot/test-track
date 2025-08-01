import { cn } from "@/lib/utils";

interface SystemPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SystemPanel({ title, children, className }: SystemPanelProps) {
  return (
    <div className={cn(
      "bg-card/50 border-2 border-muted-foreground/30 rounded-sm",
      "shadow-inner shadow-black/20 p-4",
      className
    )}>
      <div className="mb-3 pb-2 border-b border-muted-foreground/20">
        <h3 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
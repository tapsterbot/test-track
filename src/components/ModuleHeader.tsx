import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface ModuleHeaderProps {
  moduleNumber: string;
  title: string;
  description: string;
}

export function ModuleHeader({ moduleNumber, title, description }: ModuleHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="nasa-panel border-b-2 border-primary bg-card">
      <div className="container mx-auto px-4 py-3">
        {/* Mission Status Bar */}
        <div className="mb-4 text-xs nasa-display">
          <div className="flex items-center justify-between gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="nasa-panel">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <span className="text-foreground text-sm">□ MISSION TIME: {currentTime.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false })} UTC</span>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="nasa-panel p-2">
          <div className="text-center">
            <div className="mb-2 font-futura">
              <div className="text-xs text-muted-foreground tracking-[0.3em] mb-1">TRAINING MODULE {moduleNumber}</div>
              <h1 className="text-4xl font-black text-primary font-futura tracking-[0.15em] mb-2">
                {title}
              </h1>
              <div className="text-sm text-accent tracking-[0.2em] mb-1 font-futura">{description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
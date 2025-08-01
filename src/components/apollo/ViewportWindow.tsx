import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ViewportWindowProps {
  className?: string;
}

export function ViewportWindow({ className }: ViewportWindowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Space background
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      for (let i = 0; i < 100; i++) {
        const x = (i * 7 + rotation * 0.1) % canvas.width;
        const y = (i * 11) % canvas.height;
        const brightness = Math.sin(rotation * 0.01 + i) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.8})`;
        ctx.fillRect(x, y, 1, 1);
      }

      // Earth
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.7;
      const radius = canvas.width * 0.3;

      // Earth shadow/terminator
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation * 0.002);

      // Earth base
      const earthGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      earthGradient.addColorStop(0, '#4A90E2');
      earthGradient.addColorStop(0.6, '#2E5C8A');
      earthGradient.addColorStop(1, '#1A3B5C');
      
      ctx.fillStyle = earthGradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Continental outlines
      ctx.strokeStyle = '#2D5A2D';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 + rotation * 0.002;
        const r = radius * 0.8;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * r * 0.3, Math.sin(angle) * r * 0.3, 20, 0, Math.PI);
        ctx.stroke();
      }

      // Cloud layer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + rotation * 0.003;
        const r = radius * (0.9 + Math.sin(rotation * 0.01 + i) * 0.1);
        const cloudX = Math.cos(angle) * r * 0.7;
        const cloudY = Math.sin(angle) * r * 0.7;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Atmosphere glow
      const atmosGradient = ctx.createRadialGradient(0, 0, radius * 0.9, 0, 0, radius * 1.2);
      atmosGradient.addColorStop(0, 'rgba(135, 206, 250, 0)');
      atmosGradient.addColorStop(1, 'rgba(135, 206, 250, 0.4)');
      ctx.fillStyle = atmosGradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      rotation += 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className={cn(
      "relative bg-black border-4 border-muted-foreground rounded-lg overflow-hidden",
      "shadow-inner shadow-black/50",
      className
    )}>
      {/* Window frame bolts */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-muted-foreground rounded-full" />
      <div className="absolute top-2 right-2 w-2 h-2 bg-muted-foreground rounded-full" />
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-muted-foreground rounded-full" />
      <div className="absolute bottom-2 right-2 w-2 h-2 bg-muted-foreground rounded-full" />
      
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full h-full"
      />
      
      {/* Window reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}
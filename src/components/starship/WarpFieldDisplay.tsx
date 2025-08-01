import { useEffect, useRef } from "react";

interface WarpFieldDisplayProps {
  warpCore: number;
  redAlert: boolean;
  className?: string;
}

export const WarpFieldDisplay = ({ warpCore, redAlert, className }: WarpFieldDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let warpBubbles: Array<{
      x: number;
      y: number;
      radius: number;
      intensity: number;
      phase: number;
    }> = [];

    // Initialize warp bubbles
    for (let i = 0; i < 8; i++) {
      warpBubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 30 + 10,
        intensity: Math.random() * 0.5 + 0.3,
        phase: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Space distortion grid
      ctx.strokeStyle = 'hsla(240, 60%, 50%, 0.2)';
      ctx.lineWidth = 0.5;
      
      const gridSize = 20;
      const warpFactor = warpCore / 100;
      
      // Draw distorted grid
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        for (let y = 0; y <= canvas.height; y += 2) {
          // Calculate distortion based on warp field strength
          const distortion = Math.sin(time * 0.02 + x * 0.05 + y * 0.03) * warpFactor * 5;
          const warpX = x + distortion;
          
          if (y === 0) {
            ctx.moveTo(warpX, y);
          } else {
            ctx.lineTo(warpX, y);
          }
        }
        ctx.stroke();
      }
      
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 2) {
          const distortion = Math.sin(time * 0.02 + x * 0.03 + y * 0.05) * warpFactor * 5;
          const warpY = y + distortion;
          
          if (x === 0) {
            ctx.moveTo(x, warpY);
          } else {
            ctx.lineTo(x, warpY);
          }
        }
        ctx.stroke();
      }
      
      // Warp field visualization
      warpBubbles.forEach((bubble, index) => {
        // Update bubble properties
        bubble.phase += 0.05;
        bubble.intensity = Math.sin(bubble.phase) * 0.3 + 0.5;
        
        // Bubble movement based on warp core power
        bubble.x += Math.sin(time * 0.01 + index) * warpFactor * 0.5;
        bubble.y += Math.cos(time * 0.015 + index) * warpFactor * 0.3;
        
        // Wrap around edges
        if (bubble.x < -bubble.radius) bubble.x = canvas.width + bubble.radius;
        if (bubble.x > canvas.width + bubble.radius) bubble.x = -bubble.radius;
        if (bubble.y < -bubble.radius) bubble.y = canvas.height + bubble.radius;
        if (bubble.y > canvas.height + bubble.radius) bubble.y = -bubble.radius;
        
        // Draw warp bubble
        const gradient = ctx.createRadialGradient(
          bubble.x, bubble.y, 0,
          bubble.x, bubble.y, bubble.radius
        );
        
        const alpha = bubble.intensity * warpFactor;
        gradient.addColorStop(0, redAlert 
          ? `hsla(0, 80%, 60%, ${alpha * 0.8})` 
          : `hsla(240, 80%, 60%, ${alpha * 0.8})`);
        gradient.addColorStop(0.7, redAlert 
          ? `hsla(0, 80%, 60%, ${alpha * 0.3})` 
          : `hsla(240, 80%, 60%, ${alpha * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Warp field rings
        for (let ring = 1; ring <= 3; ring++) {
          const ringRadius = bubble.radius + ring * 8;
          const ringAlpha = (bubble.intensity * warpFactor) / (ring * 2);
          
          ctx.strokeStyle = redAlert 
            ? `hsla(0, 80%, 60%, ${ringAlpha})` 
            : `hsla(240, 80%, 60%, ${ringAlpha})`;
          ctx.lineWidth = 2 / ring;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
      
      // Subspace rifts (when warp core is highly active)
      if (warpFactor > 0.8) {
        for (let i = 0; i < 3; i++) {
          const riftX = Math.sin(time * 0.02 + i * 2) * canvas.width * 0.3 + canvas.width / 2;
          const riftY = Math.cos(time * 0.025 + i * 2) * canvas.height * 0.3 + canvas.height / 2;
          
          const riftIntensity = Math.sin(time * 0.1 + i) * 0.5 + 0.5;
          
          ctx.strokeStyle = `hsla(280, 100%, 70%, ${riftIntensity * 0.8})`;
          ctx.lineWidth = 3;
          ctx.setLineDash([2, 6]);
          
          ctx.beginPath();
          ctx.moveTo(riftX - 20, riftY);
          ctx.lineTo(riftX + 20, riftY);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(riftX, riftY - 20);
          ctx.lineTo(riftX, riftY + 20);
          ctx.stroke();
          
          ctx.setLineDash([]);
        }
      }
      
      // Hyperspace jump effect (random chance)
      if (Math.random() > 0.995 && warpFactor > 0.6) {
        // Star streaking effect
        for (let i = 0; i < 20; i++) {
          const startX = Math.random() * canvas.width;
          const startY = Math.random() * canvas.height;
          const streakLength = Math.random() * 100 + 50;
          const angle = Math.random() * Math.PI * 2;
          
          const endX = startX + Math.cos(angle) * streakLength;
          const endY = startY + Math.sin(angle) * streakLength;
          
          const streakGradient = ctx.createLinearGradient(startX, startY, endX, endY);
          streakGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          streakGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
          streakGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.strokeStyle = streakGradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      }
      
      time += 1;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [warpCore, redAlert]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={280}
        height={200}
        className="border border-primary/30 bg-card/20 rounded-lg backdrop-blur-sm"
      />
      <div className="absolute bottom-2 left-2 text-xs text-primary font-mono bg-background/80 px-2 py-1 rounded">
        WARP FIELD MATRIX
      </div>
      <div className="absolute top-2 right-2 text-xs text-accent font-mono bg-background/80 px-2 py-1 rounded">
        CORE: {warpCore.toFixed(0)}%
      </div>
    </div>
  );
};
import { useEffect, useRef } from "react";

interface TacticalDisplayProps {
  redAlert: boolean;
  scannerData: Array<{x: number, y: number, id: number, type: string, distance?: number}>;
  className?: string;
}

export const TacticalDisplay = ({ redAlert, scannerData, className }: TacticalDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on container
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      canvas.width = size;
      canvas.height = size;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    let animationId: number;
    let rotation = 0;
    let pulseTime = 0;
    let starField: Array<{x: number, y: number, twinkle: number}> = [];

    // Initialize star field
    const initStarField = () => {
      starField = [];
      for (let i = 0; i < 50; i++) {
        starField.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          twinkle: Math.random() * Math.PI * 2
        });
      }
    };

    initStarField();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.9;
      
      // Star field background
      starField.forEach(star => {
        const twinkleIntensity = Math.sin(Date.now() * 0.003 + star.twinkle) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkleIntensity * 0.8})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Enhanced tactical grid
      ctx.strokeStyle = redAlert ? 'hsla(0, 80%, 60%, 0.3)' : 'hsla(180, 80%, 60%, 0.3)';
      ctx.lineWidth = 0.5;
      
      // Radial grid lines
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI * 2) / 16;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * maxRadius, centerY + Math.sin(angle) * maxRadius);
        ctx.stroke();
      }
      
      // Concentric circles with pulse
      for (let i = 1; i <= 7; i++) {
        const pulse = Math.sin(pulseTime * 0.02 + i * 0.3) * 0.2 + 0.8;
        const alpha = 0.4 * pulse;
        ctx.strokeStyle = redAlert ? `hsla(0, 80%, 60%, ${alpha})` : `hsla(180, 80%, 60%, ${alpha})`;
        ctx.lineWidth = i === 7 ? 2 : 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, (i / 7) * maxRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Tactical sweep with enhanced effects
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      
      // Primary tactical sweep
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
      gradient.addColorStop(0, redAlert ? 'hsla(0, 80%, 60%, 0.6)' : 'hsla(180, 80%, 60%, 0.6)');
      gradient.addColorStop(0.5, redAlert ? 'hsla(0, 80%, 60%, 0.3)' : 'hsla(180, 80%, 60%, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxRadius, -Math.PI / 6, Math.PI / 6);
      ctx.closePath();
      ctx.fill();
      
      // Secondary sweep (threat detection)
      ctx.rotate(-rotation * 1.5);
      const threatGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius * 0.7);
      threatGradient.addColorStop(0, 'hsla(45, 100%, 60%, 0.4)');
      threatGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = threatGradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxRadius * 0.7, -Math.PI / 12, Math.PI / 12);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
      
      // Enhanced contact visualization
      scannerData.forEach((contact, index) => {
        const colors = {
          friendly: { hue: 120, name: 'ALLY' },
          unknown: { hue: 45, name: 'UNKN' },
          hostile: { hue: 0, name: 'HOST' }
        };
        
        const contactColor = colors[contact.type as keyof typeof colors];
        const age = scannerData.length - index;
        const alpha = Math.max(0.3, 1 - age * 0.08);
        
        // Scale contact positions to canvas size
        const scaledX = (contact.x / 200) * canvas.width;
        const scaledY = (contact.y / 200) * canvas.height;
        
        // Contact trail effect
        for (let i = 0; i < 4; i++) {
          const trailAlpha = Math.max(0.1, alpha - i * 0.2);
          ctx.fillStyle = `hsla(${contactColor.hue}, 80%, 60%, ${trailAlpha})`;
          ctx.beginPath();
          ctx.arc(scaledX + i * 1.5, scaledY + i * 1.5, 3 - i * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Main contact marker
        ctx.fillStyle = `hsl(${contactColor.hue}, 80%, 60%)`;
        ctx.beginPath();
        ctx.arc(scaledX, scaledY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Contact classification ring
        const ringPulse = Math.sin(Date.now() * 0.008 + contact.id) * 0.3 + 0.7;
        ctx.strokeStyle = `hsla(${contactColor.hue}, 80%, 60%, ${ringPulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(scaledX, scaledY, 12 + ringPulse * 3, 0, Math.PI * 2);
        ctx.stroke();
        
        // Distance and classification
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(contactColor.name, scaledX + 10, scaledY - 5);
        if (contact.distance) {
          ctx.font = '8px monospace';
          ctx.fillText(`${contact.distance}km`, scaledX + 10, scaledY + 8);
        }
      });
      
      // Hyperspace visualization
      if (Math.random() > 0.98) {
        const hyperspaceX = Math.random() * canvas.width;
        const hyperspaceY = Math.random() * canvas.height;
        
        ctx.strokeStyle = 'hsla(240, 100%, 80%, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(hyperspaceX - 20, hyperspaceY);
        ctx.lineTo(hyperspaceX + 20, hyperspaceY);
        ctx.stroke();
        
        ctx.strokeStyle = 'hsla(240, 100%, 80%, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hyperspaceX, hyperspaceY - 20);
        ctx.lineTo(hyperspaceX, hyperspaceY + 20);
        ctx.stroke();
      }
      
      rotation += redAlert ? 0.03 : 0.015;
      pulseTime += 1;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, [scannerData, redAlert]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full border border-primary/30 bg-card/20 rounded-lg backdrop-blur-sm"
      />
      <div className="absolute bottom-1 left-1 text-xs text-primary font-mono bg-background/80 px-1 py-0.5 rounded">
        TACTICAL
      </div>
      <div className="absolute top-1 right-1 text-xs text-accent font-mono bg-background/80 px-1 py-0.5 rounded">
        {redAlert ? 'COMBAT' : 'SCAN'}
      </div>
    </div>
  );
};
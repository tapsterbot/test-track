import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Eye, Crown } from "lucide-react";

interface ChessVirtualControlsProps {
  isActive: boolean;
  onToggleGame: () => void;
  cameraMode: 'orbit' | 'white' | 'black';
  onToggleCameraMode: () => void;
}

export function ChessVirtualControls({
  isActive,
  onToggleGame,
  cameraMode,
  onToggleCameraMode
}: ChessVirtualControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={onToggleGame}
        className="nasa-panel w-12 h-12 p-0"
        variant="outline"
        size="sm"
      >
        {isActive ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
      
      <Button
        onClick={onToggleCameraMode}
        className="nasa-panel w-12 h-12 p-0"
        variant="outline"
        size="sm"
      >
        <Eye className="w-4 h-4" />
      </Button>
      
      <div className="nasa-panel p-2 bg-background/90 rounded">
        <div className="text-xs text-center text-primary">
          {cameraMode.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
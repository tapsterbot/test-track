import { SystemPanel } from "@/components/apollo/SystemPanel";
import { IndicatorLight } from "@/components/apollo/IndicatorLight";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad2, 
  Mouse, 
  Keyboard, 
  Smartphone,
  Wifi,
  Signal,
  Camera,
  Zap
} from "lucide-react";

interface ControlPanelProps {
  isActive: boolean;
}

export function ControlPanel({ isActive }: ControlPanelProps) {
  return (
    <div className="space-y-4">
      <SystemPanel title="INPUT STATUS">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              <span className="text-sm">KEYBOARD</span>
            </div>
            <IndicatorLight color="green" label="RDY" status="on" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mouse className="w-4 h-4" />
              <span className="text-sm">MOUSE</span>
            </div>
            <IndicatorLight color="green" label="RDY" status="on" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span className="text-sm">TOUCH</span>
            </div>
            <IndicatorLight color="amber" label="STB" status="on" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm">GAMEPAD</span>
            </div>
            <IndicatorLight color="red" label="OFF" status="off" />
          </div>
        </div>
      </SystemPanel>

      <SystemPanel title="COMMUNICATION">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">UPLINK</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {isActive ? "ACTIVE" : "STANDBY"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Signal className="w-4 h-4" />
              <span className="text-sm">SIGNAL</span>
            </div>
            <div className="text-xs text-primary">-74 dBm</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span className="text-sm">CAMERA</span>
            </div>
            <IndicatorLight 
              color={isActive ? "green" : "amber"} 
              label="CAM" 
              status={isActive ? "on" : "off"} 
            />
          </div>
        </div>
      </SystemPanel>

      <SystemPanel title="MISSION MODE">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">MODE</span>
            <Badge className="nasa-badge">
              {isActive ? "EXPLORATION" : "SAFE"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">AUTONOMY</span>
            <div className="text-xs text-primary">MANUAL</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-sm">MOTORS</span>
            </div>
            <IndicatorLight 
              color={isActive ? "green" : "amber"} 
              label="MOT" 
              status={isActive ? "on" : "off"} 
            />
          </div>
        </div>
      </SystemPanel>

      <SystemPanel title="DIAGNOSTICS">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className="text-primary">60</span>
          </div>
          <div className="flex justify-between">
            <span>GPU:</span>
            <span className="text-primary">WebGL 2.0</span>
          </div>
          <div className="flex justify-between">
            <span>Triangles:</span>
            <span className="text-primary">32.4K</span>
          </div>
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="text-primary">45MB</span>
          </div>
        </div>
      </SystemPanel>
    </div>
  );
}
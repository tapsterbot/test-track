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

    </div>
  );
}
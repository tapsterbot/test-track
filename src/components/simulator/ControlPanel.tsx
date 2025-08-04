import { useState, useEffect } from "react";
import { SystemPanel } from "@/components/mission-control/SystemPanel";
import { IndicatorLight } from "@/components/mission-control/IndicatorLight";
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
  const [inputStatus, setInputStatus] = useState({
    touch: false,
    gamepad: false
  });

  useEffect(() => {
    // Check for touch support
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Check for gamepad support
    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      const hasGamepad = Array.from(gamepads).some(gamepad => gamepad !== null);
      return hasGamepad;
    };

    // Initial check
    setInputStatus({
      touch: hasTouch,
      gamepad: checkGamepad()
    });

    // Monitor gamepad connections
    const handleGamepadConnect = () => {
      setInputStatus(prev => ({ ...prev, gamepad: true }));
    };
    
    const handleGamepadDisconnect = () => {
      setInputStatus(prev => ({ ...prev, gamepad: checkGamepad() }));
    };

    window.addEventListener('gamepadconnected', handleGamepadConnect);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnect);

    // Periodic gamepad check
    const gamepadInterval = setInterval(() => {
      setInputStatus(prev => ({ ...prev, gamepad: checkGamepad() }));
    }, 1000);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnect);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnect);
      clearInterval(gamepadInterval);
    };
  }, []);

  return (
    <SystemPanel title="INPUT STATUS">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Keyboard className="w-3 h-3" />
            <span>KEYBOARD</span>
          </div>
          <IndicatorLight color="green" label="RDY" status="on" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Mouse className="w-3 h-3" />
            <span>MOUSE</span>
          </div>
          <IndicatorLight color="green" label="RDY" status="on" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            <span>TOUCH</span>
          </div>
          <IndicatorLight 
            color={inputStatus.touch ? "green" : "red"} 
            label={inputStatus.touch ? "RDY" : "N/A"} 
            status={inputStatus.touch ? "on" : "off"} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Gamepad2 className="w-3 h-3" />
            <span>GAMEPAD</span>
          </div>
          <IndicatorLight 
            color={inputStatus.gamepad ? "green" : "red"} 
            label={inputStatus.gamepad ? "RDY" : "OFF"} 
            status={inputStatus.gamepad ? "on" : "off"} 
          />
        </div>
      </div>
    </SystemPanel>
  );
}
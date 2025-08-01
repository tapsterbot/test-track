import { SystemPanel } from "@/components/apollo/SystemPanel";
import { IndicatorLight } from "@/components/apollo/IndicatorLight";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Compass, Gauge, MapPin, Battery, Thermometer } from "lucide-react";

interface VehicleData {
  speed: number;
  heading: number;
  altitude: number;
  battery: number;
  temperature: number;
  position: { x: number; y: number; z: number };
  objectiveComplete?: boolean;
  nearTarget?: boolean;
}

interface MissionHUDProps {
  vehicleData: VehicleData;
}

export function MissionHUD({ vehicleData }: MissionHUDProps) {
  const getBatteryStatus = (level: number) => {
    if (level > 60) return { color: "green", status: "OPTIMAL" };
    if (level > 30) return { color: "amber", status: "CAUTION" };
    return { color: "red", status: "CRITICAL" };
  };

  const getSpeedStatus = (speed: number) => {
    if (speed < 5) return "SAFE";
    if (speed < 15) return "NOMINAL";
    return "HIGH";
  };

  const batteryStatus = getBatteryStatus(vehicleData.battery);

  return (
    <SystemPanel title="MISSION STATUS">
      <div className="space-y-4">
        {/* Speed & Position */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold">SPEED</span>
          </div>
          <div className="text-lg font-mono text-primary">
            {vehicleData.speed.toFixed(1)} m/s
          </div>
        </div>

        {/* Battery */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">BATTERY</span>
            </div>
            <span className="text-sm font-mono">{vehicleData.battery.toFixed(0)}%</span>
          </div>
          <Progress value={vehicleData.battery} className="h-2" />
        </div>

        {/* Target Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">TARGET STATUS</span>
            <div className={`text-sm font-mono ${
              vehicleData.objectiveComplete ? 'text-green-400' : 
              vehicleData.nearTarget ? 'text-yellow-400' : 'text-muted-foreground'
            }`}>
              {vehicleData.objectiveComplete ? 'AT TARGET' : 
               vehicleData.nearTarget ? 'APPROACHING' : 'DISTANT'}
            </div>
          </div>
        </div>

        {/* Mission Objective */}
        {vehicleData.objectiveComplete && (
          <div className="p-3 bg-green-500/20 border border-green-500/30 rounded">
            <div className="text-center text-green-400 font-semibold">
              🎯 OBJECTIVE COMPLETE!
            </div>
          </div>
        )}
      </div>
    </SystemPanel>
  );
}
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
    <div className="space-y-4">
      <SystemPanel title="VEHICLE TELEMETRY">
        <div className="space-y-4">
          {/* Speed */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">SPEED</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono text-primary">
                {vehicleData.speed.toFixed(1)} m/s
              </div>
              <Badge variant="outline" className="text-xs">
                {getSpeedStatus(vehicleData.speed)}
              </Badge>
            </div>
          </div>

          {/* Heading */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">HEADING</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono text-primary">
                {Math.abs(vehicleData.heading).toFixed(0)}°
              </div>
              <div className="text-xs text-muted-foreground">
                {vehicleData.heading >= 0 ? 'E' : 'W'} of N
              </div>
            </div>
          </div>

          {/* Altitude */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">ALTITUDE</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono text-primary">
                {vehicleData.altitude.toFixed(1)} m
              </div>
              <div className="text-xs text-muted-foreground">MSL</div>
            </div>
          </div>
        </div>
      </SystemPanel>

      <SystemPanel title="POWER & SYSTEMS">
        <div className="space-y-4">
          {/* Battery */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold">BATTERY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{vehicleData.battery.toFixed(0)}%</span>
                <IndicatorLight 
                  color={batteryStatus.color as "green" | "red" | "amber"}
                  label="PWR"
                  status="on"
                />
              </div>
            </div>
            <Progress value={vehicleData.battery} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              Status: {batteryStatus.status}
            </div>
          </div>

          {/* Temperature */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">TEMP</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono text-primary">
                {vehicleData.temperature.toFixed(1)}°C
              </div>
              <div className="text-xs text-muted-foreground">Internal</div>
            </div>
          </div>
        </div>
      </SystemPanel>

      <SystemPanel title="POSITION">
        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span>X:</span>
            <span className="text-primary">{vehicleData.position.x.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Y:</span>
            <span className="text-primary">{vehicleData.position.y.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Z:</span>
            <span className="text-primary">{vehicleData.position.z.toFixed(2)}</span>
          </div>
          <div className="pt-2 border-t border-muted-foreground/20">
            <div className="text-center text-muted-foreground">
              MARS COORDINATE SYSTEM
            </div>
          </div>
        </div>
      </SystemPanel>
    </div>
  );
}
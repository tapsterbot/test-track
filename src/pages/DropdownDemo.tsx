import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronDown, Settings, Users, Database, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

const DropdownDemo = () => {
  const [selectedMission, setSelectedMission] = useState("");
  const [selectedCrew, setSelectedCrew] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("");
  const [nativeSelect, setNativeSelect] = useState("");
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSelectionChange = (value: string, type: string) => {
    toast({
      title: "Selection Updated",
      description: `${type}: ${value}`,
    });
  };

  const handleMultiSelectToggle = (value: string) => {
    const newSelection = multiSelect.includes(value) 
      ? multiSelect.filter(item => item !== value)
      : [...multiSelect, value];
    setMultiSelect(newSelection);
    
    toast({
      title: "Multi-Selection Updated",
      description: `Selected: ${newSelection.join(", ") || "None"}`,
    });
  };

  const resetAllSelections = () => {
    setSelectedMission("");
    setSelectedCrew("");
    setSelectedPriority("");
    setSelectedSystem("");
    setNativeSelect("");
    setMultiSelect([]);
    
    toast({
      title: "System Reset Complete",
      description: "All selections cleared",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NASA Mission Control Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-3">
          {/* Mission Status Bar */}
          <div className="flex justify-between items-center mb-4 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ MODULE 004 ACTIVE</span>
              <span className="text-accent">⚠ DROPDOWN SYSTEMS ONLINE</span>
              <span className="text-foreground">□ MISSION TIME: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">CONSOLE 004 READY</div>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-accent hover:text-primary transition-colors font-futura text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              RETURN TO MAIN CONSOLE
            </Link>
          </div>

          {/* Module Header */}
          <div className="nasa-panel p-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground tracking-[0.3em] mb-2 font-futura">MODULE 004</div>
              <h1 className="text-4xl font-black text-primary font-futura tracking-[0.15em] mb-2">
                DROPDOWN & SELECT DEMO
              </h1>
              <div className="text-sm text-accent tracking-[0.2em] font-futura">SELECTION INTERFACE PROTOCOLS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Interface */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Mission Selection Interface */}
          <Card className="nasa-panel">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="font-futura tracking-wide text-primary">Mission Parameters</CardTitle>
                  <CardDescription>Primary selection interface</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-accent font-futura tracking-wide mb-2 block">MISSION TYPE</label>
                <Select value={selectedMission} onValueChange={(value) => {
                  setSelectedMission(value);
                  handleSelectionChange(value, "Mission Type");
                }}>
                  <SelectTrigger id="mission-select" className="nasa-panel">
                    <SelectValue placeholder="Select mission type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exploration">Deep Space Exploration</SelectItem>
                    <SelectItem value="maintenance">Station Maintenance</SelectItem>
                    <SelectItem value="research">Scientific Research</SelectItem>
                    <SelectItem value="emergency">Emergency Response</SelectItem>
                    <SelectItem value="transport">Personnel Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-accent font-futura tracking-wide mb-2 block">CREW ASSIGNMENT</label>
                <Select value={selectedCrew} onValueChange={(value) => {
                  setSelectedCrew(value);
                  handleSelectionChange(value, "Crew Assignment");
                }}>
                  <SelectTrigger id="crew-select" className="nasa-panel">
                    <SelectValue placeholder="Assign crew member..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commander">CDR Martinez</SelectItem>
                    <SelectItem value="pilot">PLT Johnson</SelectItem>
                    <SelectItem value="engineer">FE Chen</SelectItem>
                    <SelectItem value="scientist">MS Thompson</SelectItem>
                    <SelectItem value="specialist">SP Rodriguez</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-accent font-futura tracking-wide mb-2 block">PRIORITY LEVEL</label>
                <Select value={selectedPriority} onValueChange={(value) => {
                  setSelectedPriority(value);
                  handleSelectionChange(value, "Priority Level");
                }}>
                  <SelectTrigger id="priority-select" className="nasa-panel">
                    <SelectValue placeholder="Set priority level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">CRITICAL - Immediate Action</SelectItem>
                    <SelectItem value="high">HIGH - Within 24 Hours</SelectItem>
                    <SelectItem value="medium">MEDIUM - Within 72 Hours</SelectItem>
                    <SelectItem value="low">LOW - Scheduled Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* System Configuration */}
          <Card className="nasa-panel">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-accent" />
                <div>
                  <CardTitle className="font-futura tracking-wide text-primary">System Configuration</CardTitle>
                  <CardDescription>Advanced selection controls</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-accent font-futura tracking-wide mb-2 block">SUBSYSTEM TARGET</label>
                <Select value={selectedSystem} onValueChange={(value) => {
                  setSelectedSystem(value);
                  handleSelectionChange(value, "Subsystem");
                }}>
                  <SelectTrigger id="system-select" className="nasa-panel">
                    <SelectValue placeholder="Select target system..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="life-support">Life Support Systems</SelectItem>
                    <SelectItem value="navigation">Navigation Controls</SelectItem>
                    <SelectItem value="communications">Communications Array</SelectItem>
                    <SelectItem value="power">Power Distribution</SelectItem>
                    <SelectItem value="propulsion">Propulsion Systems</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-accent font-futura tracking-wide mb-2 block">NATIVE HTML SELECT</label>
                <select 
                  id="native-select"
                  value={nativeSelect}
                  onChange={(e) => {
                    setNativeSelect(e.target.value);
                    handleSelectionChange(e.target.value, "Native Select");
                  }}
                  className="w-full h-10 px-3 py-2 bg-card border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">Select operational mode...</option>
                  <option value="auto">Automated Operation</option>
                  <option value="manual">Manual Control</option>
                  <option value="assisted">Computer Assisted</option>
                  <option value="override">Emergency Override</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-accent font-futura tracking-wide mb-2 block">PROTOCOL SELECTION (MULTI)</label>
                <div className="space-y-2">
                  {["Safety Protocol Alpha", "Backup Systems Check", "Communication Protocol", "Emergency Procedures"].map((protocol) => (
                    <div key={protocol} className="flex items-center gap-3">
                      <Button
                        variant={multiSelect.includes(protocol) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleMultiSelectToggle(protocol)}
                        className="flex-1 justify-start"
                      >
                        {multiSelect.includes(protocol) ? "◉" : "○"} {protocol}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Control Actions */}
          <Card className="nasa-panel">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-destructive" />
                <div>
                  <CardTitle className="font-futura tracking-wide text-primary">Control Actions</CardTitle>
                  <CardDescription>System reset and validation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={resetAllSelections}
                variant="destructive"
                className="w-full"
                id="reset-selections"
              >
                RESET ALL SELECTIONS
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="secondary" className="justify-center py-2">
                  Selections: {[selectedMission, selectedCrew, selectedPriority, selectedSystem, nativeSelect].filter(Boolean).length + multiSelect.length}
                </Badge>
                <Badge variant="outline" className="justify-center py-2">
                  Multi: {multiSelect.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Mission Summary */}
          <Card className="nasa-panel">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="font-futura tracking-wide text-primary">Mission Summary</CardTitle>
                  <CardDescription>Current selection status</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-accent font-futura">Mission Type:</span>
                  <span className={selectedMission ? "text-primary" : "text-muted-foreground"}>
                    {selectedMission || "NOT SELECTED"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent font-futura">Crew Assignment:</span>
                  <span className={selectedCrew ? "text-primary" : "text-muted-foreground"}>
                    {selectedCrew || "NOT ASSIGNED"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent font-futura">Priority Level:</span>
                  <span className={selectedPriority ? "text-primary" : "text-muted-foreground"}>
                    {selectedPriority || "NOT SET"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent font-futura">Target System:</span>
                  <span className={selectedSystem ? "text-primary" : "text-muted-foreground"}>
                    {selectedSystem || "NOT SELECTED"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent font-futura">Operation Mode:</span>
                  <span className={nativeSelect ? "text-primary" : "text-muted-foreground"}>
                    {nativeSelect || "NOT SET"}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="text-accent font-futura mb-2">Active Protocols:</div>
                  {multiSelect.length > 0 ? (
                    <div className="space-y-1">
                      {multiSelect.map((protocol) => (
                        <div key={protocol} className="text-primary text-xs">◉ {protocol}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-xs">No protocols selected</div>
                  )}
                </div>
                <div className="border-t border-border pt-3">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-accent font-futura">System Status:</div>
                      <div className="text-primary">◉ OPERATIONAL</div>
                    </div>
                    <div>
                      <div className="text-accent font-futura">Selection Count:</div>
                      <div className="text-primary">{[selectedMission, selectedCrew, selectedPriority, selectedSystem, nativeSelect].filter(Boolean).length + multiSelect.length}/9</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded nasa-panel">
                  <h4 className="font-semibold text-accent mb-2">TEST PROTOCOLS:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <p>• Test each dropdown selection and verify state changes</p>
                      <p>• Verify native HTML select functionality</p>
                      <p>• Test multi-selection protocol toggles</p>
                    </div>
                    <div>
                      <p>• Check dropdown menu visibility and positioning</p>
                      <p>• Test reset functionality clears all selections</p>
                      <p>• Verify toast notifications for selection changes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownDemo;
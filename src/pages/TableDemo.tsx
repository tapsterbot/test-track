import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, ChevronUp, ChevronDown, Search, Database, Users, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

interface MissionData {
  id: string;
  mission: string;
  commander: string;
  status: string;
  priority: string;
  duration: number;
  crew: number;
  launchDate: string;
}

const TableDemo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof MissionData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { toast } = useToast();

  const missionData: MissionData[] = [
    { id: "M001", mission: "Mars Reconnaissance", commander: "Sarah Chen", status: "Active", priority: "High", duration: 180, crew: 6, launchDate: "2024-03-15" },
    { id: "M002", mission: "Lunar Base Alpha", commander: "Marcus Rodriguez", status: "Planned", priority: "Critical", duration: 365, crew: 8, launchDate: "2024-06-20" },
    { id: "M003", mission: "Europa Survey", commander: "Elena Kowalski", status: "Complete", priority: "Medium", duration: 90, crew: 4, launchDate: "2023-11-08" },
    { id: "M004", mission: "Asteroid Mining", commander: "David Park", status: "Active", priority: "Low", duration: 120, crew: 5, launchDate: "2024-01-12" },
    { id: "M005", mission: "ISS Maintenance", commander: "Lisa Thompson", status: "Complete", priority: "High", duration: 14, crew: 3, launchDate: "2024-02-28" },
    { id: "M006", mission: "Deep Space Probe", commander: "Ahmed Hassan", status: "Active", priority: "Medium", duration: 300, crew: 2, launchDate: "2023-09-15" },
    { id: "M007", mission: "Orbital Station", commander: "Maria Gonzalez", status: "Planned", priority: "Critical", duration: 450, crew: 12, launchDate: "2024-08-10" },
    { id: "M008", mission: "Solar Array Deploy", commander: "James Wilson", status: "Complete", priority: "High", duration: 7, crew: 4, launchDate: "2024-01-05" }
  ];

  const filteredData = missionData.filter(mission =>
    mission.mission.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.commander.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (column: keyof MissionData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    
    toast({
      title: "Table Sorted",
      description: `Sorted by ${column} (${sortDirection === "asc" ? "desc" : "asc"})`,
    });
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(row => row.id));
    }
  };

  const extractSelectedData = () => {
    const selectedData = missionData.filter(mission => selectedRows.includes(mission.id));
    toast({
      title: "Data Extracted",
      description: `Extracted ${selectedData.length} mission records`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "text-primary";
      case "complete": return "text-accent";
      case "planned": return "text-muted-foreground";
      default: return "text-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NASA Mission Control Header */}
      <div className="nasa-panel border-b-2 border-primary bg-card">
        <div className="container mx-auto px-4 py-3">
          {/* Mission Status Bar */}
          <div className="flex justify-between items-center mb-4 text-xs nasa-display">
            <div className="flex gap-6">
              <span className="text-primary">◉ MODULE 006 ACTIVE</span>
              <span className="text-accent">⚠ DATABASE ONLINE</span>
              <span className="text-foreground">□ MISSION TIME: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-primary">CONSOLE 006 READY</div>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" size="sm" className="nasa-panel">
              <Link to="/" className="flex items-center gap-2 font-futura text-sm">
                <Home className="w-4 h-4" />
                RETURN TO MISSION CONTROL
              </Link>
            </Button>
          </div>

          {/* Module Header */}
          <div className="nasa-panel p-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground tracking-[0.3em] mb-2 font-futura">MODULE 006</div>
              <h1 className="text-4xl font-black text-primary font-futura tracking-[0.15em] mb-2">
                TABLE DEMO
              </h1>
              <div className="text-sm text-accent tracking-[0.2em] font-futura">DATA EXTRACTION PROTOCOLS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Interface */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          
          {/* Search and Controls */}
          <Card className="nasa-panel">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="font-futura tracking-wide text-primary">Data Search & Controls</CardTitle>
                  <CardDescription>Mission database query interface</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    id="table-search"
                    placeholder="Search missions, commanders, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="nasa-panel"
                  />
                </div>
                <Button 
                  onClick={extractSelectedData}
                  disabled={selectedRows.length === 0}
                  variant={selectedRows.length > 0 ? "default" : "outline"}
                >
                  EXTRACT DATA ({selectedRows.length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mission Data Table */}
          <Card className="nasa-panel">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-accent" />
                <div>
                  <CardTitle className="font-futura tracking-wide text-primary">Mission Database</CardTitle>
                  <CardDescription>Active mission data repository</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                          onCheckedChange={handleSelectAll}
                          id="select-all"
                        />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary font-futura"
                        onClick={() => handleSort("id")}
                      >
                        <div className="flex items-center gap-2">
                          ID
                          {sortColumn === "id" && (
                            sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary font-futura"
                        onClick={() => handleSort("mission")}
                      >
                        <div className="flex items-center gap-2">
                          MISSION
                          {sortColumn === "mission" && (
                            sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary font-futura"
                        onClick={() => handleSort("commander")}
                      >
                        <div className="flex items-center gap-2">
                          COMMANDER
                          {sortColumn === "commander" && (
                            sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary font-futura"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-2">
                          STATUS
                          {sortColumn === "status" && (
                            sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary font-futura"
                        onClick={() => handleSort("priority")}
                      >
                        <div className="flex items-center gap-2">
                          PRIORITY
                          {sortColumn === "priority" && (
                            sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary font-futura"
                        onClick={() => handleSort("duration")}
                      >
                        <div className="flex items-center gap-2">
                          DURATION
                          {sortColumn === "duration" && (
                            sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary font-futura"
                        onClick={() => handleSort("crew")}
                      >
                        <div className="flex items-center gap-2">
                          CREW
                          {sortColumn === "crew" && (
                            sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((mission) => (
                      <TableRow 
                        key={mission.id}
                        className={selectedRows.includes(mission.id) ? "bg-accent/20" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(mission.id)}
                            onCheckedChange={() => handleRowSelect(mission.id)}
                            id={`select-${mission.id}`}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-primary">{mission.id}</TableCell>
                        <TableCell className="font-futura">{mission.mission}</TableCell>
                        <TableCell className="font-futura">{mission.commander}</TableCell>
                        <TableCell>
                          <span className={`font-futura ${getStatusColor(mission.status)}`}>
                            ◉ {mission.status.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(mission.priority)} className="font-futura">
                            {mission.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{mission.duration} DAYS</TableCell>
                        <TableCell className="font-mono">{mission.crew} CREW</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground font-futura">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} missions
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    id="prev-page"
                  >
                    PREVIOUS
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        id={`page-${page}`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    id="next-page"
                  >
                    NEXT
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Summary */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="nasa-panel">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle className="font-futura tracking-wide text-primary">Data Metrics</CardTitle>
                    <CardDescription>Database interaction summary</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-accent font-futura">Total Records:</span>
                    <span className="text-primary">{missionData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent font-futura">Filtered Results:</span>
                    <span className="text-primary">{filteredData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent font-futura">Selected Rows:</span>
                    <span className="text-primary">{selectedRows.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent font-futura">Current Page:</span>
                    <span className="text-primary">{currentPage} of {totalPages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent font-futura">Sort Column:</span>
                    <span className="text-primary">{sortColumn || "NONE"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent font-futura">Sort Direction:</span>
                    <span className="text-primary">{sortDirection.toUpperCase()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="nasa-panel">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-accent" />
                  <div>
                    <CardTitle className="font-futura tracking-wide text-primary">Mission Summary</CardTitle>
                    <CardDescription>Current database status</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-accent font-futura">Active Missions:</span>
                    <span className="text-primary">{missionData.filter(m => m.status === "Active").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent font-futura">Planned Missions:</span>
                    <span className="text-primary">{missionData.filter(m => m.status === "Planned").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent font-futura">Completed Missions:</span>
                    <span className="text-primary">{missionData.filter(m => m.status === "Complete").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent font-futura">Critical Priority:</span>
                    <span className="text-destructive">{missionData.filter(m => m.priority === "Critical").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent font-futura">Total Crew Members:</span>
                    <span className="text-primary">{missionData.reduce((sum, m) => sum + m.crew, 0)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="text-accent font-futura mb-2">System Status:</div>
                    <div className="text-primary text-xs">◉ DATABASE OPERATIONAL</div>
                    <div className="text-accent text-xs">⚠ REAL-TIME SYNC ACTIVE</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded nasa-panel">
                  <h4 className="font-semibold text-accent mb-2">TEST PROTOCOLS:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <p>• Test table sorting functionality by clicking column headers</p>
                      <p>• Verify search functionality filters results correctly</p>
                      <p>• Test row selection checkboxes and select all</p>
                    </div>
                    <div>
                      <p>• Test pagination controls and navigation</p>
                      <p>• Verify data extraction for selected rows</p>
                      <p>• Check responsive behavior and data display</p>
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

export default TableDemo;
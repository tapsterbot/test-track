import { useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { SystemPanel } from "@/components/mission-control/SystemPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChessBoard3D } from "@/components/chess/ChessBoard3D";
import { ChessControls } from "@/components/chess/ChessControls";
import { ChessHistory } from "@/components/chess/ChessHistory";
import { useChessGame } from "@/hooks/useChessGame";
import { Play, Pause, RotateCcw, Eye } from "lucide-react";

export default function ChessDemo() {
  const [isGameActive, setIsGameActive] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<'overview' | 'white' | 'black' | 'side'>('overview');
  const {
    gameState,
    selectedSquare,
    validMoves,
    moveHistory,
    isInCheck,
    isGameOver,
    winner,
    makeMove,
    selectSquare,
    resetGame
  } = useChessGame();

  const handleStartGame = () => {
    setIsGameActive(true);
  };

  const handlePauseGame = () => {
    setIsGameActive(false);
  };

  const handleResetGame = () => {
    setIsGameActive(false);
    resetGame();
  };

  const handleCameraChange = () => {
    const presets: Array<typeof cameraPreset> = ['overview', 'white', 'black', 'side'];
    const currentIndex = presets.indexOf(cameraPreset);
    const nextIndex = (currentIndex + 1) % presets.length;
    setCameraPreset(presets[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader
        moduleNumber="026"
        title="3D CHESS COMMAND"
        description="TRI-DIMENSIONAL CHESS SIMULATION"
      />

      <div className="container mx-auto px-4 pt-8 pb-1">
        {/* Mission Briefing */}
        <div className="mb-8">
          <SystemPanel title="MISSION BRIEFING">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="nasa-panel">
                <CardHeader>
                  <CardTitle className="text-lg font-futura text-primary">OBJECTIVE</CardTitle>
                  <CardDescription>Master tri-dimensional chess strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Play 3D chess with multiple levels and attack boards, inspired by Star Trek's tri-dimensional chess variant.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div>□ MAIN BOARD: Standard 8x8 chess grid</div>
                    <div>□ ATTACK BOARDS: Four 2x4 platforms</div>
                    <div>□ LEVELS: Multi-tier gameplay</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="nasa-panel">
                <CardHeader>
                  <CardTitle className="text-lg font-futura text-primary">CONTROLS</CardTitle>
                  <CardDescription>Navigation and piece movement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="font-semibold text-accent mb-1">PIECE SELECTION</div>
                      <div>Click piece to select • Click destination to move</div>
                    </div>
                    <div>
                      <div className="font-semibold text-accent mb-1">CAMERA CONTROL</div>
                      <div>Drag to orbit • Scroll to zoom • Eye button for presets</div>
                    </div>
                    <div>
                      <div className="font-semibold text-accent mb-1">TOUCH CONTROLS</div>
                      <div>Tap to select • Pinch to zoom • Two-finger rotate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SystemPanel>
        </div>

        {/* Game Controls */}
        <div className="mb-6">
          <SystemPanel title="GAME CONTROL">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-4 gap-2">
                <Button
                  onClick={handleStartGame}
                  disabled={isGameActive}
                  className="nasa-button"
                  size="sm"
                >
                  <Play className="w-3 h-3 sm:mr-1" />
                  <span className="hidden xs:inline ml-1">START</span>
                </Button>
                <Button
                  onClick={handlePauseGame}
                  disabled={!isGameActive}
                  variant="secondary"
                  className="nasa-button"
                  size="sm"
                >
                  <Pause className="w-3 h-3 sm:mr-1" />
                  <span className="hidden xs:inline ml-1">PAUSE</span>
                </Button>
                <Button
                  onClick={handleResetGame}
                  variant="outline"
                  className="nasa-button"
                  size="sm"
                >
                  <RotateCcw className="w-3 h-3 sm:mr-1" />
                  <span className="hidden xs:inline ml-1">RESET</span>
                </Button>
                <Button
                  onClick={handleCameraChange}
                  variant="outline"
                  className="nasa-button"
                  size="sm"
                  title={`Camera: ${cameraPreset}`}
                >
                  <Eye className="w-3 h-3 sm:mr-1" />
                  <span className="hidden xs:inline ml-1">{cameraPreset.toUpperCase()}</span>
                </Button>
              </div>
              <div className="text-xs text-center">
                STATUS: <span className={`font-semibold ${isGameActive ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isGameActive ? 'ACTIVE' : 'STANDBY'}
                </span>
                {isInCheck && <span className="ml-4 text-destructive font-semibold">CHECK!</span>}
                {isGameOver && <span className="ml-4 text-primary font-semibold">GAME OVER - {winner} WINS</span>}
              </div>
            </div>
          </SystemPanel>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 3D Chess Board */}
          <div className="lg:col-span-3">
            <div className="nasa-panel border-2 border-muted-foreground/30 rounded-sm overflow-hidden bg-black">
              <div className="px-4 pt-4 pb-2 border-b border-muted-foreground/20">
                <h3 className="text-sm font-futura font-bold text-muted-foreground uppercase tracking-wider nasa-display">
                  3D CHESS VIEWPORT
                </h3>
              </div>
              <div className="relative w-full h-[600px] bg-black">
                <ChessBoard3D
                  gameState={gameState}
                  selectedSquare={selectedSquare}
                  validMoves={validMoves}
                  onSquareClick={selectSquare}
                  cameraPreset={cameraPreset}
                  isActive={isGameActive}
                />
                
                {!isGameActive && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer"
                    onClick={handleStartGame}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-futura text-primary mb-2">CHESS READY</div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        Click anywhere to begin
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Game Information Panel */}
          <div className="space-y-6">
            <ChessControls
              currentPlayer={gameState.currentPlayer}
              isInCheck={isInCheck}
              isGameOver={isGameOver}
              winner={winner}
            />
            <ChessHistory moves={moveHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}
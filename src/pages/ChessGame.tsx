import { useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { SystemPanel } from "@/components/mission-control/SystemPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChessBoard3D } from "@/components/chess/ChessBoard3D";
import { ChessVirtualControls } from "@/components/chess/ChessVirtualControls";
import { Play, Pause, RotateCcw, Eye, Crown, Target } from "lucide-react";

export default function ChessGame() {
  const [isGameActive, setIsGameActive] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'white' | 'black'>('white');
  const [gameState, setGameState] = useState({
    currentPlayer: 'white' as 'white' | 'black',
    moveCount: 0,
    gameStatus: 'active' as 'active' | 'check' | 'checkmate' | 'stalemate' | 'draw',
    capturedPieces: { white: [], black: [] },
    lastMove: null as { from: string; to: string; piece: string } | null,
    selectedSquare: null as string | null,
    gameTime: { white: 600, black: 600 }
  });

  const handleStartGame = () => {
    setIsGameActive(true);
  };

  const handlePauseGame = () => {
    setIsGameActive(false);
  };

  const handleToggleGame = () => {
    setIsGameActive(prev => !prev);
  };

  const handleResetGame = () => {
    setIsGameActive(false);
    setResetKey(prev => prev + 1);
    setGameState({
      currentPlayer: 'white',
      moveCount: 0,
      gameStatus: 'active',
      capturedPieces: { white: [], black: [] },
      lastMove: null,
      selectedSquare: null,
      gameTime: { white: 600, black: 600 }
    });
  };

  const handleToggleCameraMode = () => {
    setCameraMode(prev => {
      switch (prev) {
        case 'white': return 'black';
        case 'black': return 'orbit';
        case 'orbit': return 'white';
        default: return 'white';
      }
    });
  };

  const handleGameUpdate = (chessGameState: any) => {
    setGameState(prevState => ({
      ...prevState,
      currentPlayer: chessGameState.currentPlayer || prevState.currentPlayer,
      moveCount: chessGameState.moveCount || prevState.moveCount,
      gameStatus: chessGameState.status === 'playing' ? 'active' : chessGameState.status || prevState.gameStatus,
      capturedPieces: chessGameState.capturedPieces || prevState.capturedPieces,
      lastMove: chessGameState.lastMove || prevState.lastMove
    }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader 
        moduleNumber="026" 
        title="3D CHESS BOARD" 
        description="STRATEGIC THINKING & PATTERN RECOGNITION TRAINING"
      />
      
      <div className="container mx-auto p-4 space-y-6">
        {/* Mission Briefing & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Mission Briefing */}
          <SystemPanel title="MISSION BRIEFING">
            <div className="space-y-2 text-xs">
              <p>Tri-dimensional chess simulation activated.</p>
              <p>Navigate pieces across three levels using strategic thinking.</p>
              <p><strong>CONTROLS:</strong></p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Arrow keys: Move cursor</li>
                <li>• Q/E or Page Up/Down: Change level</li>
                <li>• Enter/Space: Select piece</li>
                <li>• Mouse: Click to interact</li>
              </ul>
            </div>
          </SystemPanel>

          {/* Game Controls */}
          <SystemPanel title="GAME CONTROLS">
            <div className="space-y-3">
              <Button
                onClick={handleStartGame}
                disabled={isGameActive}
                className="w-full nasa-panel"
                variant="outline"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                START MISSION
              </Button>
              
              <Button
                onClick={handlePauseGame}
                disabled={!isGameActive}
                className="w-full nasa-panel"
                variant="outline"
                size="sm"
              >
                <Pause className="w-4 h-4 mr-2" />
                PAUSE MISSION
              </Button>
              
              <Button
                onClick={handleResetGame}
                className="w-full nasa-panel"
                variant="outline"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                RESET MISSION
              </Button>
              
              <Button
                onClick={handleToggleCameraMode}
                className="w-full nasa-panel"
                variant="outline"
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                VIEW: {cameraMode.toUpperCase()}
              </Button>
            </div>
          </SystemPanel>

          {/* Game Status */}
          <SystemPanel title="GAME STATUS">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>CURRENT TURN:</span>
                <span className="text-primary">{gameState.currentPlayer?.toUpperCase() || 'WHITE'}</span>
              </div>
              <div className="flex justify-between">
                <span>MOVE COUNT:</span>
                <span className="text-accent">{Math.ceil((gameState.moveCount || 0) / 2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GAME STATUS:</span>
                <span className={`${gameState.gameStatus === 'check' ? 'text-destructive' : 
                  gameState.gameStatus === 'active' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {gameState.gameStatus?.toUpperCase() || 'ACTIVE'}
                </span>
              </div>
            </div>
          </SystemPanel>

          {/* Game Timers */}
          <SystemPanel title="MISSION TIMERS">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>WHITE TIME:</span>
                <span className={`${gameState.currentPlayer === 'white' && isGameActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {formatTime(gameState.gameTime?.white || 600)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>BLACK TIME:</span>
                <span className={`${gameState.currentPlayer === 'black' && isGameActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {formatTime(gameState.gameTime?.black || 600)}
                </span>
              </div>
            </div>
          </SystemPanel>

          {/* Captured Pieces */}
          <SystemPanel title="CAPTURED UNITS">
            <div className="space-y-2 text-xs">
              <div>
                <span>WHITE LOSSES:</span>
                <div className="text-muted-foreground">{gameState.capturedPieces?.white?.length || 'None'}</div>
              </div>
              <div>
                <span>BLACK LOSSES:</span>
                <div className="text-muted-foreground">{gameState.capturedPieces?.black?.length || 'None'}</div>
              </div>
            </div>
          </SystemPanel>
        </div>

        {/* Main Chess Board */}
        <SystemPanel title="STRATEGIC COMMAND INTERFACE" fullWidth>
          <div className="relative">
            {/* 3D Chess Board */}
            <div className="aspect-square max-w-4xl mx-auto bg-background rounded-lg overflow-hidden border-2 border-muted-foreground/30">
              <ChessBoard3D
                key={resetKey}
                isActive={isGameActive}
                cameraMode={cameraMode}
                onGameUpdate={handleGameUpdate}
                onToggleGame={handleToggleGame}
              />
            </div>

            {/* Game Start Overlay */}
            {!isGameActive && gameState.moveCount === 0 && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                <div className="text-center nasa-panel p-8">
                  <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">3D Chess Mission Ready</h3>
                  <p className="text-sm text-muted-foreground mb-4">Click to begin strategic analysis</p>
                  <Button onClick={handleStartGame} className="nasa-panel">
                    <Target className="w-4 h-4 mr-2" />
                    INITIATE GAME
                  </Button>
                </div>
              </div>
            )}

            {/* HUD Overlay */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="nasa-panel px-3 py-2 bg-background/90">
                <div className="text-xs text-primary">TURN: {gameState.currentPlayer?.toUpperCase() || 'WHITE'}</div>
              </div>
              {gameState.gameStatus !== 'active' && (
                <div className="nasa-panel px-3 py-2 bg-background/90">
                  <div className="text-xs text-destructive">
                    {gameState.gameStatus === 'check' ? 'CHECK!' : 
                     gameState.gameStatus === 'checkmate' ? 'CHECKMATE!' :
                     gameState.gameStatus === 'stalemate' ? 'STALEMATE!' : 'DRAW!'}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden absolute bottom-4 right-4">
              <ChessVirtualControls
                isActive={isGameActive}
                onToggleGame={handleToggleGame}
                cameraMode={cameraMode}
                onToggleCameraMode={handleToggleCameraMode}
              />
            </div>
          </div>
        </SystemPanel>
      </div>
    </div>
  );
}
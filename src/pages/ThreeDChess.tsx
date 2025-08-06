import { useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { SystemPanel } from "@/components/mission-control/SystemPanel";
import { PushButton } from "@/components/mission-control/PushButton";
import { IndicatorLight } from "@/components/mission-control/IndicatorLight";
import { RaumschachBoard } from "@/components/chess/RaumschachBoard";
import { useRaumschach } from "@/hooks/useRaumschach";
import { useToast } from "@/hooks/use-toast";

export default function ThreeDChess() {
  const [isGameActive, setIsGameActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const { toast } = useToast();
  const {
    gameState,
    selectedPosition,
    validMoves,
    selectSquare,
    resetGame,
    getCurrentPlayer,
    getGameStatus,
    getMoveHistory
  } = useRaumschach();

  const handleNewGame = () => {
    resetGame();
    setIsGameActive(true);
    toast({
      title: "New Game Started",
      description: "Raumschach 5×5×5 chess initialized",
    });
  };

  const handleResetGame = () => {
    resetGame();
    setIsGameActive(false);
    toast({
      title: "Game Reset",
      description: "All pieces returned to starting positions",
    });
  };

  const handleCanvasClick = () => {
    if (!isGameActive) {
      handleNewGame();
    } else if (!isDragging) {
      // Only pause if it wasn't a drag operation
      setIsGameActive(false);
      toast({
        title: "Game Paused",
        description: "Click to resume",
      });
    }
  };

  const handleCanvasPointerDown = (event: any) => {
    setDragStart({ x: event.clientX || event.touches?.[0]?.clientX || 0, y: event.clientY || event.touches?.[0]?.clientY || 0 });
    setIsDragging(false);
  };

  const handleCanvasPointerMove = (event: any) => {
    if (dragStart) {
      const currentX = event.clientX || event.touches?.[0]?.clientX || 0;
      const currentY = event.clientY || event.touches?.[0]?.clientY || 0;
      const distance = Math.sqrt(
        Math.pow(currentX - dragStart.x, 2) + Math.pow(currentY - dragStart.y, 2)
      );
      if (distance > 5) { // 5px threshold for drag detection
        setIsDragging(true);
      }
    }
  };

  const handleCanvasPointerUp = () => {
    setDragStart(null);
    // Reset dragging state after a short delay to ensure click event fires with correct state
    setTimeout(() => setIsDragging(false), 50);
  };

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader
        moduleNumber="05"
        title="RAUMSCHACH"
        description="5×5×5 THREE-DIMENSIONAL CHESS"
      />
      
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main 3D Chess Board */}
        <div className="lg:col-span-3">
          <SystemPanel title="3D CHESS BOARD" fullWidth>
            <div className="h-[600px] w-full">
              <RaumschachBoard
                gameState={gameState}
                selectedPosition={selectedPosition}
                validMoves={validMoves}
                onSquareClick={selectSquare}
                onCanvasClick={handleCanvasClick}
                onCanvasPointerDown={handleCanvasPointerDown}
                onCanvasPointerMove={handleCanvasPointerMove}
                onCanvasPointerUp={handleCanvasPointerUp}
                isActive={isGameActive}
              />
            </div>
          </SystemPanel>
        </div>

        {/* Control Panels */}
        <div className="space-y-4">
          {/* Game Controls */}
          <SystemPanel title="GAME CONTROLS">
            <div className="space-y-3">
              <PushButton
                label="NEW GAME"
                onClick={handleNewGame}
                color="green"
              />
              <PushButton
                label="RESET"
                onClick={handleResetGame}
                color="amber"
              />
            </div>
          </SystemPanel>

          {/* Game Status */}
          <SystemPanel title="GAME STATUS">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">ACTIVE:</span>
                <IndicatorLight 
                  label=""
                  status={isGameActive ? "on" : "off"} 
                  color="green" 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">PLAYER:</span>
                <span className="text-xs nasa-display">
                  {getCurrentPlayer().toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">STATUS:</span>
                <span className="text-xs nasa-display">
                  {getGameStatus().toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">MOVES:</span>
                <span className="text-xs nasa-display">
                  {getMoveHistory().length}
                </span>
              </div>
            </div>
          </SystemPanel>

          {/* Selected Piece Info */}
          {selectedPosition && (
            <SystemPanel title="SELECTION">
              <div className="space-y-2">
                <div className="text-xs nasa-display">
                  <div>LEVEL: {selectedPosition.level}</div>
                  <div>RANK: {selectedPosition.rank}</div>
                  <div>FILE: {selectedPosition.file}</div>
                  <div>PIECE: {gameState.board[selectedPosition.level][selectedPosition.rank][selectedPosition.file]?.type.toUpperCase()}</div>
                </div>
              </div>
            </SystemPanel>
          )}

          {/* Instructions */}
          <SystemPanel title="CONTROLS">
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Click pieces to select</div>
              <div>• Click valid squares to move</div>
              <div>• Drag to orbit camera</div>
              <div>• Scroll to zoom</div>
              <div>• Arrow keys to rotate</div>
            </div>
          </SystemPanel>
        </div>
      </div>
    </div>
  );
}
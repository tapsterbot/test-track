import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { SystemPanel } from "@/components/mission-control/SystemPanel";
import { PushButton } from "@/components/mission-control/PushButton";
import { IndicatorLight } from "@/components/mission-control/IndicatorLight";
import { RaumschachBoard } from "@/components/chess/RaumschachBoard";
import { useRaumschach } from "@/hooks/useRaumschach";
import { useChessKeyboard } from "@/hooks/useChessKeyboard";


export default function ThreeDChess() {
  const [isGameActive, setIsGameActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [clickedOnGameElement, setClickedOnGameElement] = useState(false);
  
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

  const {
    cursorPosition,
    isKeyboardMode,
    disableKeyboardMode
  } = useChessKeyboard(
    isGameActive,
    selectSquare,
    () => {
      resetGame();
      setIsGameActive(false);
    },
    () => {
      resetGame();
      setIsGameActive(true);
    }
  );

  const handleNewGame = () => {
    resetGame();
    setIsGameActive(true);
  };

  const handleResetGame = () => {
    resetGame();
    setIsGameActive(false);
  };

  const handleCanvasClick = () => {
    if (!isGameActive) {
      handleNewGame();
    } else if (!isDragging && !clickedOnGameElement) {
      // Only pause if it wasn't a drag operation and wasn't clicking on game elements
      setIsGameActive(false);
    }
    // Reset the flag after handling the click
    setClickedOnGameElement(false);
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

  // Prevent keyboard scrolling when game is active
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGameActive) {
        // Prevent arrow keys, space, page up/down from scrolling the page
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'PageUp', 'PageDown'].includes(event.code)) {
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isGameActive]);

  const handleSquareClick = (position: any) => {
    setClickedOnGameElement(true);
    disableKeyboardMode(); // Switch to mouse mode
    selectSquare(position);
  };

  const handleMouseInteraction = () => {
    disableKeyboardMode(); // Switch to mouse mode when hovering
  };

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader
        moduleNumber="026"
        title="3D CHESS"
        description="5×5×5 RAUMSCHACH THREE-DIMENSIONAL CHESS"
      />
      
      <div className="container mx-auto p-4">
        {/* Compact Game Controls - Above the game */}
        <div className="mb-4">
          <div className="nasa-panel p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-futura text-primary tracking-wide">GAME CONTROLS</h3>
              <div className="flex gap-2">
                <PushButton
                  label="NEW GAME"
                  onClick={handleNewGame}
                  color="green"
                  size="sm"
                />
                <PushButton
                  label="RESET"
                  onClick={handleResetGame}
                  color="amber"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main 3D Chess Board */}
          <div className="lg:col-span-3">
            <SystemPanel title="3D CHESS BOARD" fullWidth>
              <div className="h-[600px] w-full">
                <RaumschachBoard
                  gameState={gameState}
                  selectedPosition={selectedPosition}
                  validMoves={validMoves}
                  onSquareClick={handleSquareClick}
                  onCanvasClick={handleCanvasClick}
                  onCanvasPointerDown={handleCanvasPointerDown}
                  onCanvasPointerMove={handleCanvasPointerMove}
                  onCanvasPointerUp={handleCanvasPointerUp}
                  isActive={isGameActive}
                  currentPlayer={getCurrentPlayer()}
                  gameStatus={getGameStatus()}
                  moveCount={getMoveHistory().length}
                  cursorPosition={cursorPosition}
                  isKeyboardMode={isKeyboardMode}
                  onMouseInteraction={handleMouseInteraction}
                />
              </div>
            </SystemPanel>
          </div>

          {/* Control Panels */}
          <div className="space-y-4">
            {/* Instructions */}
            <SystemPanel title="CONTROLS">
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="text-primary mb-1">MOUSE:</div>
                <div>• Click pieces to select</div>
                <div>• Click valid squares to move</div>
                <div>• Drag to orbit camera</div>
                <div>• Scroll to zoom</div>
                <div className="text-primary mb-1 mt-2">TOUCH:</div>
                <div>• Tap pieces to select</div>
                <div>• Tap valid squares to move</div>
                <div>• Drag to orbit camera</div>
                <div>• Pinch to zoom</div>
                <div className="text-primary mb-1 mt-2">KEYBOARD:</div>
                <div>• Arrow keys to navigate</div>
                <div>• Page Up/Down for levels</div>
                <div>• Space/Enter to select</div>
                <div>• Escape to deselect</div>
                <div>• R to reset, N for new game</div>
              </div>
            </SystemPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
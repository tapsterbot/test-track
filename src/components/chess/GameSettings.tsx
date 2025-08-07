import { SystemPanel } from "@/components/mission-control/SystemPanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleSwitch } from "@/components/mission-control/ToggleSwitch";
import { GameSettings as GameSettingsType, PromotablePiece } from "@/hooks/useRaumschach";

interface GameSettingsProps {
  settings: GameSettingsType;
  onUpdateSettings: (settings: Partial<GameSettingsType>) => void;
}

export function GameSettings({ settings, onUpdateSettings }: GameSettingsProps) {
  const promotionPieces: { value: PromotablePiece; label: string }[] = [
    { value: 'queen', label: 'Queen' },
    { value: 'rook', label: 'Rook' },
    { value: 'bishop', label: 'Bishop' },
    { value: 'knight', label: 'Knight' },
    { value: 'unicorn', label: 'Unicorn' }
  ];

  return (
    <SystemPanel title="SETTINGS">
      <div className="space-y-4">
        <div>
          <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wide">
            Default Promotion
          </div>
          <Select
            value={settings.defaultPromotionPiece}
            onValueChange={(value: PromotablePiece) =>
              onUpdateSettings({ defaultPromotionPiece: value })
            }
          >
            <SelectTrigger className="nasa-input text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="nasa-panel border-primary/30">
              {promotionPieces.map((piece) => (
                <SelectItem
                  key={piece.value}
                  value={piece.value}
                  className="text-xs hover:bg-primary/10"
                >
                  {piece.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wide">
            Auto Promote
          </div>
          <ToggleSwitch
            value={settings.autoPromote}
            onChange={(autoPromote) => onUpdateSettings({ autoPromote })}
            label="AUTO PROMOTE"
            color={settings.autoPromote ? "green" : "amber"}
          />
          <div className="text-xs text-muted-foreground mt-1">
            {settings.autoPromote
              ? "Automatically promote to default piece"
              : "Show promotion dialog when pawn reaches end"
            }
          </div>
        </div>
      </div>
    </SystemPanel>
  );
}
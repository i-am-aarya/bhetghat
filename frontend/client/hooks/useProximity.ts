import { Game } from "@/components/game/Game";
import { useEffect } from "react";

export const useProximity = (
  game: Game | null,
  onProximityChange: (users: string[]) => void,
) => {
  useEffect(() => {
    if (!game) return;

    const checkProximity = () => {
      const nearby = Array.from(game.remotePlayers.values())
        .filter((player) => {
          const dx = player.playerX - game.localPlayer.playerX;
          const dy = player.playerY - game.localPlayer.playerY;
          return Math.sqrt(dx * dx + dy * dy) < 500;
        })
        .map((player) => player.username);
      onProximityChange(nearby);
    };

    const interval = setInterval(checkProximity, 1000);
    return () => clearInterval(interval);
  }, [game, onProximityChange]);
};

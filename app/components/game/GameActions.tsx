import { useGameStore } from "~/stores/game";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

export default function GameActions() {
  const playAgain = useGameStore((action) => action.playAgain);
  const resetGame = useGameStore((action) => action.resetGame);

  const navigate = useNavigate();

  const handlePlayAgain = () => {
    playAgain();
    navigate("/game");
  };

  const handleNewGame = () => {
    resetGame();
    navigate("/game-setup");
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button size="lg" onClick={handlePlayAgain}>
        Play Again
      </Button>

      <Button size="lg" variant="outline" onClick={handleNewGame}>
        New Game
      </Button>
    </div>
  );
}

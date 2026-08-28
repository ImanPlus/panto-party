import clsx from "clsx";

import "./WordCard.css";

import { Card } from "../ui/card";

type WordCardProps = {
  word: string;
  isFlipped: boolean;
  onFlip: () => void;
  onFlipEnd: () => void;
};

export function WordCard({
  word,
  isFlipped,
  onFlip,
  onFlipEnd
}: WordCardProps) {

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if(event.propertyName === "transform"){
      onFlipEnd();
    }
  }

  return (
    <div className="word-card-perspective">
      <button
        type="button"
        onClick={onFlip}
        className="block h-64 w-full max-w-md cursor-pointer"
        aria-label={isFlipped ? "Hide word" : "Show word"}
      >
        <div
          className={clsx(
            "word-card-inner",
            isFlipped && "is-flipped",
          )}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* Front */}
          <Card className="word-card-face word-card-fron bg-muted shadow-md">
            <div className="space-y-3 text-center">
              <div className="text-5xl">🎭</div>

              <p className="text-xl font-semibold">
                Tap to reveal
              </p>

              <p className="text-sm text-muted-foreground">
                Show the word to the actor
              </p>
            </div>
          </Card>

          {/* Back */}
          <Card className="word-card-face word-card-back bg-secondary shadow-md">
            <div className="px-6 text-center">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                ACT THIS
              </p>

              <p className="text-4xl font-bold tracking-tight">
                {word}
              </p>
            </div>
          </Card>
        </div>
      </button>
    </div>
  );
}
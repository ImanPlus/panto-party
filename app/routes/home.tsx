import { buttonVariants } from "~/components/ui/button";
import type { Route } from "./+types/home";
import { Link } from "react-router";
import { createTitle } from "~/lib/createTitle";

export function meta({}: Route.MetaArgs) {
  return [
    { title: createTitle() },
    { name: "description", content: "Welcome to Panto Party Game!" },
  ];
}

export default function Home() {
  return (
    <div className="text-center">
      <div className="mb-4 text-4xl">🎭</div>

      <h1 className="text-4xl font-bold">Panto Party</h1>

      <p className="mt-3 text-2xl font-semibold">Ready to act?</p>

      <p className="mt-2 text-lg text-muted-foreground">
        Get your team together and let the fun begin! 
      </p>

      <Link
        to="/game-setup"
        className={buttonVariants({
          size: "xl",
          className: "mt-8 min-w-48",
        })}
      >
        🎭 Start Game
      </Link>
    </div>
  );
}

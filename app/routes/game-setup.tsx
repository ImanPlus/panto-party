import * as z from "zod";
import { nanoid } from "nanoid";
import {
  useFieldArray,
  useForm,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import type { GameSetupForm } from "~/types/game";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGameStore } from "~/stores/game";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { FieldError } from "~/components/ui/field";
import { createTitle } from "~/lib/createTitle";
import { useEffect } from "react";

export function meta() {
  return [{ title: createTitle("Game Setup") }];
}

// Child Component
function TeamItem({ teamIndex }: { teamIndex: number }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<GameSetupForm>();

  const {
    fields: players,
    append: appendPlayer,
    remove: removePlayer,
  } = useFieldArray({ control, name: `teams.${teamIndex}.players` });

  const playersError =
    errors.teams?.[teamIndex]?.players?.message ??
    errors.teams?.[teamIndex]?.players?.root?.message;

  const handleAddPlayer = () => {
    appendPlayer({
      id: nanoid(),
      name: "",
    });
  };

  return (
    <div className="space-y-5">
      {/* Team name + Add Player */}
      <div className="space-y-3">
        <Label htmlFor={`team-${teamIndex}`}>Team Name</Label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id={`team-${teamIndex}`}
            {...register(`teams.${teamIndex}.name`)}
            placeholder="Team name"
          />

          <Button
            type="button"
            variant="outline"
            className="shrink-0"
            onClick={handleAddPlayer}
          >
            Add Player
          </Button>
        </div>

        {errors.teams?.[teamIndex]?.name && (
          <FieldError>{errors.teams[teamIndex].name.message}</FieldError>
        )}
      </div>

      {/* Players */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Players</h4>

        {players.map((player, playerIndex) => (
          <div key={player.id} className="flex flex-col gap-2 sm:flex-row">
            <div className="block space-y-2">
              <Input
                {...register(`teams.${teamIndex}.players.${playerIndex}.name`)}
                placeholder="Player Name"
              />
              {errors.teams?.[teamIndex]?.players?.[playerIndex]?.name && (
                <FieldError>
                  {
                    errors.teams[teamIndex].players?.[playerIndex]?.name
                      ?.message
                  }
                </FieldError>
              )}
            </div>

            <Button
              type="button"
              variant="destructive"
              className="md:flex-1"
              onClick={() => removePlayer(playerIndex)}
            >
              Remove
            </Button>
          </div>
        ))}

        {playersError && <FieldError>{playersError}</FieldError>}
      </div>
    </div>
  );
}

// Parent Component
export default function GameSetup() {
  const rounds = [1, 2, 3, 5];
  const durations = [10, 30, 60, 90];
  const setGameSetup = useGameStore((action) => action.setGameSetup);
  const initializeGame = useGameStore((action) => action.initializeGame);
  const resetGame = useGameStore((action) => action.resetGame);
  const navigate = useNavigate();

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const gameSetupSchema = z.object({
    gameName: z.string().min(1, "Game name is required"),
    turnDuration: z.number(),
    numberOfRounds: z.number(),
    teams: z
      .array(
        z.object({
          id: z.string(),
          name: z.string().min(1, "Team name is required"),

          players: z
            .array(
              z.object({
                id: z.string(),
                name: z.string().min(1, "Player name is required"),
              }),
            )
            .min(1, "Each team must have at least one player"),
        }),
      )
      .min(2, "At least two teams are required"),
  });

  const methods = useForm<GameSetupForm>({
    resolver: zodResolver(gameSetupSchema),
    defaultValues: {
      gameName: "",
      turnDuration: 60,
      numberOfRounds: 1,
      teams: [],
    },
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const {
    fields: teams,
    append,
    remove,
  } = useFieldArray({ control, name: "teams" });

  const handleAddTeam = () => {
    append({
      id: nanoid(),
      name: "",
      players: [],
    });
  };

  const onSubmit = (gameSetup: GameSetupForm) => {
    setGameSetup(gameSetup);
    initializeGame(gameSetup);
    navigate("/game");
  };

  const teamsError = errors.teams?.message ?? errors.teams?.root?.message;

  return (
    <FormProvider {...methods}>
      <div className="w-full px-4 py-8">
        <Card className="mx-auto w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-3xl">🎭 Game Setup</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Game Name */}
              <div className="space-y-2">
                <Label htmlFor="game-name">Game Name </Label>
                <Input
                  id="game-name"
                  placeholder="Friday Night Panto.."
                  {...register("gameName")}
                />
                {errors.gameName && (
                  <FieldError>{errors.gameName.message}</FieldError>
                )}
              </div>

              {/* Teams */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold">Teams</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTeam}
                  >
                    + Add Team
                  </Button>
                  {teamsError && <FieldError>{teamsError}</FieldError>}
                  <div className="space-y-4">
                    {teams.map((team, index) => (
                      <div key={team.id} className="rounded-lg border p-4">
                        <TeamItem teamIndex={index} />
                        <Button
                          className="mt-4"
                          variant="destructive"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          Remove Team
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Game Settings */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Number of rounds */}
                  <div className="space-y-2">
                    <Label htmlFor="round-game">Number of rounds</Label>

                    <select
                      id="round-game"
                      {...register("numberOfRounds", { valueAsNumber: true })}
                      className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                    >
                      {rounds.map((round) => (
                        <option key={round} value={round}>
                          {round} {round === 1 ? "Round" : "Rounds"}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Turn duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration">Turn duration</Label>
                    <select
                      id="duration"
                      {...register("turnDuration", { valueAsNumber: true })}
                      className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                    >
                      {durations.map((duration) => (
                        <option key={duration} value={duration}>
                          {duration} Seconds
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <Button type="submit" size="lg">
                    🎭 Start Game
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}

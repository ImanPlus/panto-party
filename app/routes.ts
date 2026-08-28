import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/RootLayout.tsx", [
    index("routes/home.tsx"),
    route("game-over", "routes/game-over.tsx"),
    route("game-setup", "routes/game-setup.tsx"),
    route("game", "routes/game.tsx")
  ])

] satisfies RouteConfig;

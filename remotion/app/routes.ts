import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Public route - Login page
  route("/login", "./pages/auth/login.tsx"),

  // Protected routes - wrapped with ProtectedLayout
  layout("./layouts/ProtectedLayout.tsx", [
    index("./pages/videos/table.tsx"),
    route("/short", "./pages/shorts/home.tsx"),
    route("/test", "./pages/test.tsx"),
    route("/video", "./pages/videos/home.tsx"),
  ]),

  // API routes (not protected)
  route("/api/lambda/progress", "./styles/routes/progress.tsx"),
  route("/api/lambda/render", "./styles/routes/render.tsx"),
] satisfies RouteConfig;

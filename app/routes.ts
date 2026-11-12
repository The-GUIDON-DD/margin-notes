import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("doodles/:category", "routes/doodles.tsx"),
  route("subjects/:subject", "routes/subjects.tsx"),
] satisfies RouteConfig;

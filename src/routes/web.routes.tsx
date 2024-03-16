import About from "../pages/About";
import Home from "../pages/Home";
import Login from "../pages/Login";

export const webRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/about",
    component: About,
  },
  {
    path: "/login",
    component: Login,
  },
];

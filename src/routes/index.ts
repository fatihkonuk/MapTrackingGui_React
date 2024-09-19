import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home.tsx"; // Ana sayfa bileşeni
import About from "../pages/About.tsx"; // Hakkında sayfası bileşeni
import MainLayout from "../layouts/MainLayout.tsx"; // Layout bileşeni

const router = createBrowserRouter([
  {
    path: "/", // Ana rota ("/")
    Component: MainLayout, // Bu rotanın bileşeni MainLayout
    children: [
      {
        path: "/", // Bu rotanın alt rotası ("Home")
        index: true, // Bu rota ana sayfa olarak işaretlenir ("/")
        Component: Home, // Home bileşeni render edilir
      },
      {
        path: "/about", // Bu rota "/about"
        Component: About, // About bileşeni render edilir
      },
    ],
  },
]);

export default router;

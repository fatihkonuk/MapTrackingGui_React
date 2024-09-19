import { Outlet } from "react-router-dom";
import Navigator from "./components/Navigator";
import SideMenu from "./components/SideMenu";

const MainLayout = () => {
  return (
    <div>
      <header>
        <Navigator />
        <SideMenu />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

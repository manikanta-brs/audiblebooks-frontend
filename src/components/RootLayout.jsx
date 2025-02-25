import { useSelector } from "react-redux";
import NavigationBar from "./NavigationBar";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const RootLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  console.log(`%c is it ${isLoggedIn} bavani`, "color: red;");
  return (
    <div>
      {isLoggedIn && <NavigationBar />}
      <ToastContainer limit={1} />
      <Outlet />
    </div>
  );
};

export default RootLayout;

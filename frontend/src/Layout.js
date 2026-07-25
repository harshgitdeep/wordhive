import Header from "./Header";
import Footer from "./Footer";
import {Outlet} from "react-router-dom";

export default function Layout() {
  return (
    <div className="app-container">
      <Header />
      <div className="page-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
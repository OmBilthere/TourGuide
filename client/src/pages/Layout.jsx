import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[url(/gradientBackground.png)] bg-cover bg-center bg-no-repeat">
      <Navbar />

      <main className="flex-1 pt-24">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
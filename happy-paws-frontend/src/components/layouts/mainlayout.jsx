import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../navbar";
import Footer from "../footer";

export default function MainLayout() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <Navbar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      {isLanding && <Footer />}
    </div>
  );
}


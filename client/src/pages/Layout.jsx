import React, { useState, useCallback, lazy, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import { useUser, SignIn } from "@clerk/clerk-react";
import Sidebar from "../components/Sidebar";

// Lazy load heavy components
// const Sidebar = lazy(() => import("../components/Sidebar"));
// const SignIn = lazy(() =>
//   import("@clerk/clerk-react").then((m) => ({ default: m.SignIn }))
// );

const Navbar = React.memo(({ sidebar, toggleSidebar }) => {
  const navigate = useNavigate();
  return (
    <nav
      className="w-full px-6 min-h-14 flex items-center justify-between border-b border-gray-200"
      role="navigation">
      <div className="flex items-end-safe py-2">
        <img
          src={assets.logo}
          alt="CreativeCraft.AI Logo"
          className="h-10 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <p className="text-2xl font-semibold text-primary ml-2">
          CreativeCraft.AI
        </p>
      </div>
      {sidebar ? (
        <X
          className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      ) : (
        <Menu
          className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        />
      )}
    </nav>
  );
});

const Background = () => (
  <div
    className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-80"
    style={{ backgroundImage: "url(/bgbg.jpg)" }} // need to convert to compressed .webp
    aria-hidden="true"></div>
);

const AuthFallback = () => (
  <div className="flex items-center justify-center h-screen">
    {/* <Suspense fallback={<div>Loading...</div>}> */}
    <SignIn />
    {/* </Suspense> */}
  </div>
);
  
const Layout = () => {
  const { user } = useUser();
  const [sidebar, setSidebar] = useState(false);

  const toggleSidebar = useCallback(() => setSidebar((prev) => !prev), []);

  if (!user) return <AuthFallback />;

  return (
    <div className="flex flex-col h-screen">
      <Navbar sidebar={sidebar} toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 h-[calc(100vh-56px)]">
        {/* <Suspense fallback={<div>Loading sidebar...</div>}> */}
        <Sidebar sidebar={sidebar} setSidebar={toggleSidebar} />
        <main className="relative flex-1">
          <Background />
          <div className="relative z-10 h-full">
            <Outlet /> {/* Routes will render here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

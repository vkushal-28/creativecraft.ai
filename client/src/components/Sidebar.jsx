import React, { useMemo, useCallback } from "react";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Navigation items
const navItems = [
  { to: "", label: "Dashboard", Icon: House },
  { to: "write-article", label: "Write Article", Icon: SquarePen },
  { to: "blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "generate-images", label: "Generate Images", Icon: Image },
  { to: "remove-background", label: "Remove Background", Icon: Eraser },
  { to: "remove-object", label: "Remove Object", Icon: Scissors },
  { to: "review-resume", label: "Review Resume", Icon: FileText },
  { to: "community", label: "Community", Icon: Users },
];

// Tailwind class constants
const linkBase =
  "px-3.5 py-2.5 flex items-center gap-3 rounded hover:bg-gray-100";
const activeLink =
  "bg-gradient-to-r from-primary to-primary text-white transition-colors";

// Sidebar navigation links
const SidebarLinks = React.memo(({ setSidebar }) => {
  const navLinks = useMemo(
    () =>
      navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === ""} // index route
          onClick={() => setSidebar(false)}
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeLink : ""}`
          }>
          <Icon className="w-4 h-4" />
          {label}
        </NavLink>
      )),
    [setSidebar]
  );

  return (
    <div className="px-4 mt-5 text-sm text-gray-600 font-medium">
      {navLinks}
    </div>
  );
});

// Sidebar user profile and logout
const SidebarProfile = React.memo(({ user, openUserProfile, signOut }) => {
  const { fullName, imageUrl } = user || {};

  return (
    <div className="w-full border-t border-gray-200 p-4 flex items-center justify-between ">
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={openUserProfile}>
        <img src={imageUrl} alt="user" className="w-8 rounded-full" />
        <div>
          <h1 className="text-sm font-medium">{fullName}</h1>
          <p className="text-sm text-gray-500">
            <Protect plan="premium" fallback="Free">
              Premium
            </Protect>{" "}
            Plan
          </p>
        </div>
      </div>
      <LogOut
        className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        onClick={signOut}
      />
    </div>
  );
});

// Main Sidebar component
const Sidebar = React.memo(({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const handleCloseSidebar = useCallback(() => setSidebar(false), [setSidebar]);

  return (
    <div
      className={`w-60 bg-white shadow-lg flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 z-10
        ${
          sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
        } transition-transform duration-300 ease-in-out`}>
      <div className="my-7 w-full">
        <img
          src={user?.imageUrl}
          alt=""
          className="w-13 rounded-full mx-auto"
        />
        <h1 className="mt-1 text-center text-slate-700 font-semibold">
          {user?.fullName}
        </h1>
        <SidebarLinks setSidebar={handleCloseSidebar} />
      </div>

      <SidebarProfile
        user={user}
        openUserProfile={openUserProfile}
        signOut={signOut}
      />
    </div>
  );
});

export default Sidebar;

import React, { memo, useCallback } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  useClerk,
  UserButton,
  ClerkLoading,
  useUser,
} from "@clerk/clerk-react";
import { AvatarSkeleton } from "./common/loaders";

// Destructure static assets outside component to avoid re-evaluation
const { logo } = assets;

// Memoized Auth Button
const AuthButton = memo(({ user, isLoaded, isSignedIn, openSignIn }) => {
  console.log(isLoaded, isSignedIn, user, "isLoaded");
  if (user) return <UserButton />;
  if (user === undefined) return <AvatarSkeleton />;
  return (
    <button
      onClick={openSignIn}
      className="flex items-center gap-2 max-sm:btn-sm rounded-full text-sm cursor-pointer bg-primary text-white px-6 md:px-10 py-2.5 max-sm:py-2"
      aria-label="Get Started">
      Get Started <ArrowRight className="w-4 h-4" />
    </button>
  );
});

// Memoized Left Section of Navbar
const NavbarLeft = memo(({ onLogoClick }) => (
  <div className="flex items-end-safe cursor-pointer">
    <img
      src={logo}
      alt="CreativeCraft.AI Logo"
      className="h-12 max-sm:h-8"
      onClick={onLogoClick}
    />
    <p className="text-2xl max-sm:text-lg font-semibold text-primary ml-2">
      CreativeCraft.AI
    </p>
  </div>
));

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  // Memoized callback to prevent recreation on every render
  const handleLogoClick = useCallback(() => navigate("/"), [navigate]);

  return (
    <header className="fixed z-50 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-6 xl:px-32">
      <NavbarLeft onLogoClick={handleLogoClick} />
      <AuthButton user={user} openSignIn={openSignIn} isLoaded isSignedIn />
    </header>
  );
};

// Memoize Navbar to avoid unnecessary re-renders
export default memo(Navbar);

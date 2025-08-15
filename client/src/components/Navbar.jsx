import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-6  xl:px-32 ">
      <div className="flex items-end-safe">
        <img
          src={assets.logo}
          alt="logo"
          className="h-12 max-sm:h-8  cursor-pointer"
          onClick={() => navigate("/")}
        />
        <p className="text-2xl max-sm:text-lg font-semibold text-primary ">
          CreativeCraft.AI
        </p>
      </div>
      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={openSignIn}
          className="flex items-center gap-2 max-sm:btn-sm rounded-full text-sm cursor-pointer bg-primary text-white px-6 md:px-10 py-2.5 max-sm:py-2">
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;

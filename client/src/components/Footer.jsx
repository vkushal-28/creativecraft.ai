import React, { memo } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

// Data for links
const companyLinks = [
  { name: "Home", href: "#" },
  { name: "About us", href: "#" },
  { name: "Contact us", href: "#" },
  { name: "Privacy policy", href: "#" },
];

// Subcomponent: Company Links
const CompanyLinks = () => (
  <div>
    <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
    <ul className="text-sm space-y-2">
      {companyLinks.map((link) => (
        <li key={link.name}>
          <a href={link.href} className="hover:underline">
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Subcomponent: Newsletter Form
const NewsletterForm = () => (
  <div>
    <h2 className="font-semibold text-gray-800 mb-5">
      Subscribe to our newsletter
    </h2>
    <p className="text-sm">
      The latest news, articles, and resources, sent to your inbox weekly.
    </p>
    <div className="flex items-center gap-2 pt-4">
      <input
        aria-label="Email address"
        className="border border-gray-500/30 placeholder-gray-500 focus:ring-2 ring-indigo-600 outline-none w-full max-w-64 h-9 rounded px-2"
        type="email"
        placeholder="Enter your email"
      />
      <button className="bg-primary w-24 h-9 px-2 text-white rounded cursor-pointer hover:bg-indigo-700">
        Subscribe
      </button>
    </div>
  </div>
);

// Main Footer Component
const Footer = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => navigate("/");

  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full bg-gray-50 text-gray-500 mt-20">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/20 pt-4 pb-6">
        {/* Logo & Description */}
        <div className="md:max-w-96">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogoClick}>
            <img
              src={assets.logo}
              alt="CreativeCraft.AI Logo"
              className="h-9"
            />
            <p className="text-xl font-semibold text-primary">
              CreativeCraft.AI
            </p>
          </div>
          <p className="mt-6 text-sm">
            Experience the power of AI with QuickAi. <br />
            Transform your content creation with our suite of premium AI tools.
            Write articles, generate images, and enhance your workflow.
          </p>
        </div>

        {/* Links & Newsletter */}
        <div className="flex-1 flex flex-col md:flex-row items-start md:justify-end gap-10">
          <CompanyLinks />
          <NewsletterForm />
        </div>
      </div>

      {/* Copyright */}
      <p className="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2025 © Kushal Vala. All Rights Reserved.
      </p>
    </footer>
  );
};

// Memoize for performance
export default memo(Footer);

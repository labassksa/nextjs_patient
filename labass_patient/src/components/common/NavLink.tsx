"use client";
import Link from "next/link";
import React from "react";

interface NavLinkProps {
  href: string;
  icon: React.ElementType; // Updated to use React.ElementType for Material Icons
  label: string;
  active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  label,
  active,
}) => {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-center"
      passHref
    >
      <Icon
        className={`h-5 w-20 ${active ? "text-green-700" : "text-gray-400"}`}
      />
      <span
        className={`${
          active ? "text-green-700 text-sm" : "text-gray-400 text-xs"
        } hover:text-green-700`}
      >
        {label}
      </span>
    </Link>
  );
};

export default NavLink;

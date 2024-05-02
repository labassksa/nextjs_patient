// components/NavLink.tsx
"use client";
// components/NavLink.tsx
import Link from "next/link";

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
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
      className="flex flex-col items-center space-y-1 text-center"
    >
      <Icon
        className={`h-5 w-5 ${active ? "text-green-700" : "text-gray-400"}`}
      />
      <span
        className={` ${
          active ? "text-green-700 text-sm"  : "text-gray-400 text-xs"
        } hover:text-green-700`}
      >
        {label}
      </span>
    </Link>
  );
};

export default NavLink;

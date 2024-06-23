// components/BottomNav.tsx

"use client";
import {
  HomeIcon,
  UserIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/solid";
// components/BottomNavBar.tsx
import NavLink from "./NavLink";

interface BottomNavBarProps {
  currentPath: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPath }) => {
  const isActive = (href: string) => currentPath === href;

  return (
    <nav className="flex fixed inset-x-0 bottom-0 bg-white shadow-md px-4 py-2  justify-around items-center text-sm text-gray-800 border-t">
      <NavLink
        href="/profile"
        icon={UserIcon}
        label="المزيد"
        active={isActive("/profile")}
      />
      <NavLink
        href="/myConsultations"
        icon={ChatBubbleBottomCenterIcon}
        label="استشاراتي"
        active={isActive("/myConsultations")}
      />
      <NavLink
        href="/"
        icon={HomeIcon}
        label="الرئيسية"
        active={isActive("/")}
      />
    </nav>
  );
};

export default BottomNavBar;

"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Home as HomeIcon,
  AccountCircle as UserIcon,
  ChatBubble as ChatBubbleIcon,
  CardMembership as CardMembershipIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface AppDrawerProps {
  currentPath: string;
}

const navItems = [
  { href: "/home",            label: "الرئيسية",   icon: HomeIcon },
  { href: "/myConsultations", label: "الاستشارات",  icon: ChatBubbleIcon },
  { href: "/mySubscriptions", label: "باقاتي",      icon: CardMembershipIcon },
  { href: "/profile",         label: "المزيد",      icon: UserIcon },
];

const AppDrawer: React.FC<AppDrawerProps> = ({ currentPath }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger trigger — fixed top-left, above the green banner */}
      <button
        onClick={() => setOpen(true)}
        aria-label="القائمة"
        className="fixed top-3 left-3 z-[60] w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
      >
        <MenuIcon style={{ fontSize: 22 }} className="text-[#173404]" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[70]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel — slides in from right (RTL start side) */}
      <div
        dir="rtl"
        className={`fixed top-0 right-0 h-full w-72 bg-white z-[80] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-full bg-[#173404] flex-shrink-0">
              <div className="absolute top-[7px] right-[7px] w-[13px] h-[13px] rounded-full bg-[#7ED957]" />
            </div>
            <span className="text-lg font-extrabold text-[#173404]">لاباس</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            aria-label="إغلاق"
          >
            <CloseIcon style={{ fontSize: 18 }} className="text-gray-600" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = currentPath === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150 ${
                  active
                    ? "bg-[#edf7e4] text-[#27500A]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon
                  style={{ fontSize: 22 }}
                  className={active ? "text-[#27500A]" : "text-gray-400"}
                />
                <span className={`text-sm ${active ? "font-bold" : "font-medium"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom branding */}
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            شركة معالم التطوير · مرخّصة من وزارة الصحة
          </p>
        </div>
      </div>
    </>
  );
};

export default AppDrawer;

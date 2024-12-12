"use client";
import React, { useState } from "react";
import {
  Home as HomeIcon,
  Assignment as PatientsIcon,
  PersonAdd as RegistrationIcon,
} from "@mui/icons-material";

interface LabBottomNavBarProps {
  onToggleView: (view: "patients" | "registration") => void;
  currentView: "patients" | "registration";
}

const LabBottomNavBar: React.FC<LabBottomNavBarProps> = ({
  onToggleView,
  currentView,
}) => {
  return (
    <nav className="flex fixed inset-x-0 bottom-0 bg-white shadow-md px-4 py-2 justify-around items-center text-sm text-gray-800 border-t">
      <button
        className={`flex flex-col items-center ${
          currentView === "patients" ? "text-green-500" : "text-gray-500"
        }`}
        onClick={() => onToggleView("patients")}
      >
        <PatientsIcon fontSize="small" />
        <span>المرضى</span>
      </button>
      <button
        className={`flex flex-col items-center ${
          currentView === "registration" ? "text-green-500" : "text-gray-500"
        }`}
        onClick={() => onToggleView("registration")}
      >
        <RegistrationIcon fontSize="small" />
        <span>تسجيل</span>
      </button>
    </nav>
  );
};

export default LabBottomNavBar;

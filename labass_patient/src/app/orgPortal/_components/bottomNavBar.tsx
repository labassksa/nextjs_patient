"use client";
import React, { useState } from "react";
import {
  Home as HomeIcon,
  Assignment as PatientsIcon,
  PersonAdd as RegistrationIcon,
  CardMembership as SubscriptionIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface LabBottomNavBarProps {
  onToggleView: React.Dispatch<
    React.SetStateAction<"patients" | "registration" | "subscription">
  >;
  currentView: "patients" | "registration" | "subscription";
  className?: string;
}

const LabBottomNavBar: React.FC<LabBottomNavBarProps> = ({
  onToggleView,
  currentView,
}) => {
  const {t} = useTranslation();
  return (
    <nav className="flex fixed inset-x-0 bottom-0 bg-white shadow-md px-4 py-2 justify-around items-center text-sm text-gray-800 border-t">
      <button
        className={`flex flex-col items-center ${
          currentView === "patients" ? "text-blue-500" : "text-gray-500"
        }`}
        onClick={() => onToggleView("patients")}
      >
        <PatientsIcon fontSize="small" />
        <span>{t('patient')}</span>
      </button>
      <button
        className={`flex flex-col items-center ${
          currentView === "registration" ? "text-blue-500" : "text-gray-500"
        }`}
        onClick={() => onToggleView("registration")}
      >
        <RegistrationIcon fontSize="small" />
        <span>{t('registration')}</span>
      </button>
      <button
        className={`flex flex-col items-center ${
          currentView === "subscription" ? "text-blue-500" : "text-gray-500"
        }`}
        onClick={() => onToggleView("subscription")}
      >
        <SubscriptionIcon fontSize="small" />
        <span>{t('subscription.tabLabel')}</span>
      </button>
    </nav>
  );
};

export default LabBottomNavBar;

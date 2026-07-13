"use client";

import React from "react";
import { CardMembership, ChatBubbleOutline } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface Props {
  consultations: number;
  subscriptions: number;
}

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

const StatTile: React.FC<StatTileProps> = ({ icon, label, value }) => (
  <div className="flex-1 rounded-wallet-lg border border-[rgba(23,52,4,0.08)] bg-white p-4 shadow-wallet-card">
    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-paleGreen text-green700">
      {icon}
    </div>
    <p
      className="text-2xl font-extrabold text-forestDeep"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {value}
    </p>
    <p className="mt-0.5 text-xs text-forest/60">{label}</p>
  </div>
);

const WalletStats: React.FC<Props> = ({ consultations, subscriptions }) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3">
      <StatTile
        icon={<ChatBubbleOutline fontSize="small" />}
        label={t("wallet.consultationsCount")}
        value={consultations}
      />
      <StatTile
        icon={<CardMembership fontSize="small" />}
        label={t("wallet.subscriptionsCount")}
        value={subscriptions}
      />
    </div>
  );
};

export default WalletStats;

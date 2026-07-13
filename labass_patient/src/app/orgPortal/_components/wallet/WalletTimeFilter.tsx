"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { WalletPeriod } from "../../_types/walletTypes";

interface Props {
  value: WalletPeriod;
  onChange: (period: WalletPeriod) => void;
}

const periods: WalletPeriod[] = ["week", "month", "all"];

const WalletTimeFilter: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div
      className="flex rounded-full border border-[rgba(23,52,4,0.08)] bg-surfaceAlt p-1"
      role="group"
      aria-label={t("wallet.transactionsTitle")}
    >
      {periods.map((period) => (
        <button
          key={period}
          type="button"
          aria-pressed={value === period}
          onClick={() => onChange(period)}
          className={`flex-1 rounded-full py-2 text-sm transition-all ${
            value === period
              ? "bg-forest font-bold text-paleGreen shadow-wallet-chip"
              : "text-forest/60"
          }`}
        >
          {t(`wallet.filter.${period}`)}
        </button>
      ))}
    </div>
  );
};

export default WalletTimeFilter;

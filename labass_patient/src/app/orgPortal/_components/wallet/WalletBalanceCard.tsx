"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  balance: number;
  totalEarned: number;
  commissionPercentage: number;
}

const WalletBalanceCard: React.FC<Props> = ({
  balance,
  totalEarned,
  commissionPercentage,
}) => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden rounded-wallet-xl border-t-4 border-lime bg-forest p-6 text-paleGreen shadow-wallet-card">
      <p className="text-sm opacity-75">{t("wallet.currentBalance")}</p>
      <div className="mt-1 flex items-end gap-2">
        <span
          className="text-4xl font-extrabold text-white"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {balance.toLocaleString("en-US")}
        </span>
        <span className="mb-1 text-base opacity-90">{t("wallet.currency")}</span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs opacity-60">{t("wallet.totalEarned")}</p>
          <p
            className="text-sm font-bold text-white"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {totalEarned.toLocaleString("en-US")} {t("wallet.currency")}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center bg-paleGreen px-3 py-1 text-xs font-bold text-forestDeep rounded-full">
          {commissionPercentage}٪ · {t("wallet.commissionRate")}
        </span>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed opacity-70">
        {t("wallet.commissionExplainer", { percent: commissionPercentage })}
      </p>
    </section>
  );
};

export default WalletBalanceCard;

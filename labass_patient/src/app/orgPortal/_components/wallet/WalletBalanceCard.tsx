"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  balance: number;
  currency: string;
  commissionPercentage: number;
}

const WalletBalanceCard: React.FC<Props> = ({
  balance,
  currency,
  commissionPercentage,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("ar") ? "ar-SA" : "en-SA";
  const formattedBalance = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  return (
    <section className="overflow-hidden rounded-wallet-xl border-t-4 border-lime bg-forest p-6 text-paleGreen shadow-wallet-card">
      <p className="text-sm opacity-75">{t("wallet.currentBalance")}</p>
      <p
        className="mt-1 text-3xl font-extrabold text-white"
        dir="ltr"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {formattedBalance}
      </p>

      <div className="mt-5 flex justify-start">
        <span className="inline-flex items-center rounded-full bg-paleGreen px-3 py-1 text-xs font-bold text-forestDeep">
          {commissionPercentage}% · {t("wallet.commissionRate")}
        </span>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed opacity-70">
        {t("wallet.commissionExplainer", { percent: commissionPercentage })}
      </p>
    </section>
  );
};

export default WalletBalanceCard;

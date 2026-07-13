"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { WalletPeriod } from "../../_types/walletTypes";
import WalletBalanceCard from "./WalletBalanceCard";
import WalletPayoutHistory from "./WalletPayoutHistory";
import WalletShareLinks from "./WalletShareLinks";
import WalletStats from "./WalletStats";
import WalletTimeFilter from "./WalletTimeFilter";
import WalletTransactions from "./WalletTransactions";
import { walletMockData } from "./walletMockData";

const WalletSection: React.FC = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<WalletPeriod>("week");
  const periodData = walletMockData.periods[period];

  return (
    <main
      dir="rtl"
      className="mx-auto min-h-screen max-w-md space-y-5 bg-surface px-4 pb-24 pt-6 font-cairo"
    >
      <h1 className="text-xl font-extrabold text-forestDeep">
        {t("wallet.title")}
      </h1>

      <WalletBalanceCard
        balance={walletMockData.balance}
        totalEarned={walletMockData.totalEarned}
        commissionPercentage={walletMockData.commissionPercentage}
      />

      <WalletTimeFilter value={period} onChange={setPeriod} />
      <WalletStats
        consultations={periodData.consultationsCount}
        subscriptions={periodData.subscriptionsCount}
      />
      <WalletTransactions transactions={periodData.transactions} />
      <WalletShareLinks
        referralCode={walletMockData.referralCode}
        marketingLink={walletMockData.marketingLink}
      />
      <WalletPayoutHistory payouts={walletMockData.payouts} />
    </main>
  );
};

export default WalletSection;

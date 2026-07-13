"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { PayoutRecord } from "../../_types/walletTypes";

interface Props {
  payouts: PayoutRecord[];
}

const WalletPayoutHistory: React.FC<Props> = ({ payouts }) => {
  const { t } = useTranslation();

  return (
    <section>
      <h2 className="mb-3 text-base font-bold text-forestDeep">
        {t("wallet.payoutHistoryTitle")}
      </h2>
      {payouts.length === 0 ? (
        <p className="rounded-wallet-lg border border-[rgba(23,52,4,0.08)] bg-white p-6 text-center text-sm text-forest/50">
          {t("wallet.emptyPayouts")}
        </p>
      ) : (
        <ul className="space-y-2">
          {payouts.map((payout) => (
            <li
              key={payout.id}
              className="flex items-center justify-between gap-3 rounded-wallet-lg border border-[rgba(23,52,4,0.08)] bg-white p-3"
            >
              <div>
                <p
                  className="text-sm font-bold text-forestDeep"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {payout.amount.toLocaleString("en-US")} {t("wallet.currency")}
                </p>
                <p className="text-[11px] text-forest/50">
                  {t(`wallet.payoutMethod.${payout.method}`)} · {payout.date}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                  payout.status === "completed"
                    ? "bg-paleGreen text-green700"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {t(`wallet.payoutStatus.${payout.status}`)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-forest/50">
        {t("wallet.payoutNote")}
      </p>
    </section>
  );
};

export default WalletPayoutHistory;

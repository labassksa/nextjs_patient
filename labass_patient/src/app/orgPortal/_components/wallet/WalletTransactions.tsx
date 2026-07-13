"use client";

import React from "react";
import { CardMembership, ChatBubbleOutline } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { WalletTransaction } from "../../_types/walletTypes";

interface Props {
  transactions: WalletTransaction[];
}

const WalletTransactions: React.FC<Props> = ({ transactions }) => {
  const { t } = useTranslation();

  return (
    <section>
      <h2 className="mb-3 text-base font-bold text-forestDeep">
        {t("wallet.transactionsTitle")}
      </h2>
      {transactions.length === 0 ? (
        <p className="rounded-wallet-lg border border-[rgba(23,52,4,0.08)] bg-white p-6 text-center text-sm text-forest/50">
          {t("wallet.emptyTransactions")}
        </p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((transaction) => {
            const isConsultation = transaction.type === "consultation";
            const label = t(
              isConsultation
                ? "wallet.earnedFromConsultation"
                : "wallet.earnedFromSubscription",
              {
                amount: transaction.amount,
                patient: transaction.patientLabel,
              }
            );

            return (
              <li
                key={transaction.id}
                className="flex items-center gap-3 rounded-wallet-lg border border-[rgba(23,52,4,0.08)] bg-white p-3 shadow-wallet-card"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isConsultation
                      ? "bg-paleGreen text-green700"
                      : "bg-surfaceTint text-forest"
                  }`}
                >
                  {isConsultation ? (
                    <ChatBubbleOutline fontSize="small" />
                  ) : (
                    <CardMembership fontSize="small" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-forestDeep">
                    {label}
                  </p>
                  <p
                    className="text-[11px] text-forest/50"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {transaction.date}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                    transaction.status === "completed"
                      ? "bg-paleGreen text-green700"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {t(`wallet.status.${transaction.status}`)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default WalletTransactions;

"use client";

import React from "react";
import {
  CardMembership,
  ChatBubbleOutline,
  ChevronLeft,
  ChevronRight,
  PaymentsOutlined,
  Tune,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { NormalizedWalletTransaction } from "@/types/wallet";
import { formatWalletDate, formatWalletMoney } from "./walletFormatting";

interface Props {
  transactions: NormalizedWalletTransaction[];
  currency: string;
  isFullHistory: boolean;
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  total?: number;
  onOpenHistory: () => void;
  onPageChange: (page: number) => void;
}

const transactionIcons = {
  consultation_commission: <ChatBubbleOutline fontSize="small" />,
  subscription_commission: <CardMembership fontSize="small" />,
  payout: <PaymentsOutlined fontSize="small" />,
  adjustment: <Tune fontSize="small" />,
};

const WalletTransactions: React.FC<Props> = ({
  transactions,
  currency,
  isFullHistory,
  isLoading = false,
  page = 1,
  totalPages = 0,
  total = 0,
  onOpenHistory,
  onPageChange,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("ar") ? "ar-SA" : "en-SA";

  return (
    <section aria-busy={isLoading}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-forestDeep">
            {isFullHistory
              ? t("wallet.allTransactionsTitle")
              : t("wallet.transactionsTitle")}
          </h2>
          {isFullHistory && (
            <p className="text-[11px] text-forest/50">
              {t("wallet.transactionCount", { count: total })}
            </p>
          )}
        </div>
        {!isFullHistory && transactions.length > 0 && (
          <button
            type="button"
            onClick={onOpenHistory}
            className="text-xs font-bold text-green700"
          >
            {t("wallet.viewAll")}
          </button>
        )}
      </div>

      {transactions.length === 0 && isLoading ? (
        <div className="animate-pulse space-y-2" aria-label={t("wallet.loading")}>
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-20 rounded-wallet-lg bg-white" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <p className="rounded-wallet-lg border border-[rgba(23,52,4,0.08)] bg-white p-6 text-center text-sm text-forest/50">
          {t("wallet.emptyTransactions")}
        </p>
      ) : (
        <ul className={`space-y-2 transition-opacity ${isLoading ? "opacity-50" : "opacity-100"}`}>
          {transactions.map((transaction) => {
            const isCredit = transaction.amount > 0;
            const isCommission =
              transaction.type === "consultation_commission" ||
              transaction.type === "subscription_commission";
            const percentage =
              transaction.commissionRate == null
                ? null
                : transaction.commissionRate * 100;

            return (
              <li
                key={transaction.id}
                className="rounded-wallet-lg border border-[rgba(23,52,4,0.08)] bg-white p-3 shadow-wallet-card"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isCredit
                        ? "bg-paleGreen text-green700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {transactionIcons[transaction.type]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-forestDeep">
                      {t(`wallet.transactionType.${transaction.type}`)}
                    </p>
                    <p
                      className="text-[11px] text-forest/50"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {formatWalletDate(transaction.createdAt, locale)}
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-sm font-extrabold ${
                      isCredit ? "text-green700" : "text-red-700"
                    }`}
                    dir="ltr"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {isCredit ? "+" : "-"}
                    {formatWalletMoney(
                      Math.abs(transaction.amount),
                      currency,
                      locale
                    )}
                  </p>
                </div>

                {isCommission &&
                  (transaction.baseAmount != null || percentage != null) && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[rgba(23,52,4,0.08)] pt-2 text-[11px] text-forest/60">
                      {transaction.baseAmount != null && (
                        <span>
                          {t("wallet.baseAmount")}: {formatWalletMoney(transaction.baseAmount, currency, locale)}
                        </span>
                      )}
                      {percentage != null && (
                        <span>
                          {t("wallet.appliedRate")}: {percentage.toLocaleString(locale, { maximumFractionDigits: 2 })}%
                        </span>
                      )}
                    </div>
                  )}

                {transaction.note && (
                  <p className="mt-2 text-xs leading-relaxed text-forest/70">
                    {transaction.note}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {isFullHistory && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between rounded-full border border-[rgba(23,52,4,0.08)] bg-white p-1">
          <button
            type="button"
            aria-label={t("wallet.previousPage")}
            title={t("wallet.previousPage")}
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest disabled:opacity-30"
          >
            <ChevronRight fontSize="small" />
          </button>
          <span className="text-xs font-bold text-forest/70">
            {t("wallet.pageOf", { page, totalPages })}
          </span>
          <button
            type="button"
            aria-label={t("wallet.nextPage")}
            title={t("wallet.nextPage")}
            disabled={page >= totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest disabled:opacity-30"
          >
            <ChevronLeft fontSize="small" />
          </button>
        </div>
      )}
    </section>
  );
};

export default WalletTransactions;

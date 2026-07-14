"use client";

import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Refresh } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getReferralCode } from "../../_controllers/getReferralCode";
import {
  getMyWallet,
  getMyWalletTransactions,
} from "../../_controllers/getMyWallet";
import {
  MyWallet,
  WalletTransactionsPage,
} from "@/types/wallet";
import WalletBalanceCard from "./WalletBalanceCard";
import WalletShareLinks from "./WalletShareLinks";
import WalletTransactions from "./WalletTransactions";

const POLL_INTERVAL_MS = 45_000;

const getErrorKey = (error: unknown) => {
  if (!axios.isAxiosError(error)) return "wallet.errors.general";

  switch (error.response?.status) {
    case 401:
      return "wallet.errors.unauthorized";
    case 403:
      return "wallet.errors.forbidden";
    case 404:
      return "wallet.errors.noMarketer";
    default:
      return "wallet.errors.general";
  }
};

const WalletSkeleton = () => (
  <div className="animate-pulse space-y-5" aria-hidden="true">
    <div className="h-40 rounded-wallet-xl bg-paleGreen" />
    <div className="h-5 w-32 rounded bg-paleGreen" />
    {[0, 1, 2].map((item) => (
      <div key={item} className="h-20 rounded-wallet-lg bg-white" />
    ))}
  </div>
);

const WalletSection: React.FC = () => {
  const { t } = useTranslation();
  const mountedRef = useRef(true);
  const [wallet, setWallet] = useState<MyWallet | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isReferralLoading, setIsReferralLoading] = useState(true);
  const [history, setHistory] = useState<WalletTransactionsPage | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [isFullHistory, setIsFullHistory] = useState(false);

  const loadWallet = useCallback(async (initial = false) => {
    if (initial) setIsInitialLoading(true);
    else setIsRefreshing(true);
    setWalletError(null);

    try {
      const data = await getMyWallet();
      if (mountedRef.current) setWallet(data);
    } catch (error) {
      if (mountedRef.current) setWalletError(getErrorKey(error));
    } finally {
      if (mountedRef.current) {
        setIsInitialLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  const loadHistoryPage = useCallback(async (page: number) => {
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const data = await getMyWalletTransactions(page, 20);
      if (mountedRef.current) setHistory(data);
    } catch (error) {
      if (mountedRef.current) setHistoryError(getErrorKey(error));
    } finally {
      if (mountedRef.current) setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadWallet(true);

    const refreshOnFocus = () => loadWallet(false);
    window.addEventListener("focus", refreshOnFocus);
    const pollTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") loadWallet(false);
    }, POLL_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("focus", refreshOnFocus);
      window.clearInterval(pollTimer);
    };
  }, [loadWallet]);

  useEffect(() => {
    let active = true;
    getReferralCode()
      .then((code) => {
        if (active) setReferralCode(code);
      })
      .catch(() => {
        if (active) setReferralCode(null);
      })
      .finally(() => {
        if (active) setIsReferralLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const openFullHistory = () => {
    setIsFullHistory(true);
    loadHistoryPage(1);
  };

  const refresh = async () => {
    const requests: Promise<unknown>[] = [loadWallet(false)];
    if (isFullHistory) requests.push(loadHistoryPage(history?.page ?? 1));
    await Promise.all(requests);
  };

  const displayedTransactions = isFullHistory
    ? history?.data ?? []
    : wallet?.recentTransactions ?? [];
  const currency = history?.currency ?? wallet?.currency ?? "SAR";

  return (
    <main
      dir="rtl"
      className="mx-auto min-h-screen max-w-md space-y-5 bg-surface px-4 pb-24 pt-6 font-cairo"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-forestDeep">
          {t("wallet.title")}
        </h1>
        <button
          type="button"
          onClick={refresh}
          disabled={isRefreshing || isInitialLoading}
          aria-label={t("wallet.refresh")}
          title={t("wallet.refresh")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(23,52,4,0.10)] bg-white text-forest disabled:opacity-50"
        >
          <Refresh
            fontSize="small"
            className={isRefreshing ? "animate-spin" : undefined}
          />
        </button>
      </div>

      {isInitialLoading && !wallet ? (
        <WalletSkeleton />
      ) : !wallet ? (
        <div className="rounded-wallet-lg border border-red-100 bg-white p-6 text-center">
          <p className="text-sm text-red-700">
            {t(walletError ?? "wallet.errors.general")}
          </p>
          <button
            type="button"
            onClick={() => loadWallet(true)}
            className="mt-4 rounded-full bg-forest px-5 py-2 text-sm font-bold text-paleGreen"
          >
            {t("wallet.retry")}
          </button>
        </div>
      ) : (
        <>
          {walletError && (
            <p className="rounded-wallet-md border border-red-100 bg-red-50 p-3 text-xs text-red-700">
              {t(walletError)}
            </p>
          )}

          <WalletBalanceCard
            balance={wallet.balance}
            currency={wallet.currency}
            commissionPercentage={wallet.commissionPercentage}
          />

          <WalletTransactions
            transactions={displayedTransactions}
            currency={currency}
            isFullHistory={isFullHistory}
            isLoading={isHistoryLoading}
            page={history?.page}
            totalPages={history?.totalPages}
            total={history?.total}
            onOpenHistory={openFullHistory}
            onPageChange={loadHistoryPage}
          />

          {historyError && (
            <div className="rounded-wallet-md border border-red-100 bg-red-50 p-3 text-center text-xs text-red-700">
              <p>{t(historyError)}</p>
              <button
                type="button"
                onClick={() => loadHistoryPage(history?.page ?? 1)}
                className="mt-2 font-bold underline"
              >
                {t("wallet.retry")}
              </button>
            </div>
          )}

          <WalletShareLinks
            referralCode={referralCode}
            isFetchingCode={isReferralLoading}
          />
        </>
      )}
    </main>
  );
};

export default WalletSection;

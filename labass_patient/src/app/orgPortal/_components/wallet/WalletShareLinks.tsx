"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ContentCopy, IosShare } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface Props {
  referralCode: string;
  marketingLink: string;
}

const WalletShareLinks: React.FC<Props> = ({ referralCode, marketingLink }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const showCopiedState = () => {
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      showCopiedState();
    } catch {
      // Clipboard access may be unavailable outside a secure browser context.
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url: marketingLink, title: "Labass" });
      } catch {
        // Closing the native share sheet is not an error for this interaction.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(marketingLink);
      showCopiedState();
    } catch {
      // Clipboard access may be unavailable outside a secure browser context.
    }
  };

  return (
    <section className="rounded-wallet-lg border border-[rgba(23,52,4,0.08)] bg-surfaceTint p-5">
      <h2 className="text-base font-bold text-forestDeep">
        {t("wallet.shareTitle")}
      </h2>
      <p className="mb-4 mt-1 text-xs text-forest/60">
        {t("wallet.shareSubtitle")}
      </p>

      <div className="mb-3 flex items-center justify-between gap-2 rounded-full border border-[rgba(23,52,4,0.10)] bg-white px-4 py-2">
        <span
          className="min-w-0 truncate text-sm font-bold text-forestDeep"
          dir="ltr"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {referralCode}
        </span>
        <button
          type="button"
          onClick={copyCode}
          className="flex shrink-0 items-center gap-1 text-xs font-bold text-green700"
        >
          {copied ? (
            <>
              <Check fontSize="small" /> {t("wallet.copied")}
            </>
          ) : (
            <>
              <ContentCopy fontSize="small" /> {t("wallet.copyCode")}
            </>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={shareLink}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-forest py-3 text-sm font-bold text-paleGreen transition-transform active:-translate-y-px"
      >
        <IosShare fontSize="small" /> {t("wallet.shareLink")}
      </button>
    </section>
  );
};

export default WalletShareLinks;

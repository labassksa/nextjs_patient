"use client";

import React, { useEffect, useState } from "react";
import { Send } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { generateReferralCode } from "../../_controllers/generateReferralCode";
import { sendMarketingMessage } from "../../_controllers/sendMarketingMessage";

interface Props {
  referralCode: string | null;
  isFetchingCode: boolean;
}

const WalletShareLinks: React.FC<Props> = ({
  referralCode,
  isFetchingCode,
}) => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(referralCode ?? "");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (referralCode) setCode(referralCode);
  }, [referralCode]);

  const handleGenerateCode = async () => {
    setError("");
    setSuccess(false);
    setIsGeneratingCode(true);
    try {
      const generatedCode = await generateReferralCode();
      if (generatedCode) setCode(generatedCode);
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message || t("wallet.marketing.errors.general")
      );
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleSendMarketing = async () => {
    setError("");
    setSuccess(false);
    if (!phone || !code.trim()) {
      setError(t("wallet.marketing.errors.required"));
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedPhone = phone.startsWith("0")
        ? `+966${phone.slice(1)}`
        : `+966${phone}`;
      await sendMarketingMessage(formattedPhone, code.trim());
      setSuccess(true);
      setPhone("");
    } catch (requestError: any) {
      const status = requestError?.response?.status;
      const message = requestError?.response?.data?.message;
      if (status === 400) {
        setError(message || t("wallet.marketing.errors.invalid"));
      } else if (status === 403) {
        setError(t("wallet.marketing.errors.forbidden"));
      } else if (status === 404) {
        setError(t("wallet.marketing.errors.notFound"));
      } else if (status === 500) {
        setError(t("wallet.marketing.errors.server"));
      } else {
        setError(message || t("wallet.marketing.errors.general"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-wallet-lg border border-[rgba(23,52,4,0.08)] bg-surfaceTint p-5">
      <h2 className="text-base font-bold text-forestDeep">
        {t("wallet.shareTitle")}
      </h2>
      <p className="mb-4 mt-1 text-xs text-forest/60">
        {t("wallet.marketing.subtitle")}
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="wallet-marketing-phone"
            className="mb-1 block text-sm font-medium text-forestDeep"
          >
            {t("wallet.marketing.phoneLabel")}
          </label>
          <input
            id="wallet-marketing-phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value.replace(/[^\d]/g, ""));
              setError("");
              setSuccess(false);
            }}
            placeholder="05xxxxxxxx"
            className="w-full rounded-wallet-md border border-[rgba(23,52,4,0.18)] bg-white px-3 py-2 text-right text-forestDeep outline-none focus:border-green600 focus:ring-2 focus:ring-paleGreen"
            dir="ltr"
          />
        </div>

        <div>
          <label
            htmlFor="wallet-marketing-code"
            className="mb-1 block text-sm font-medium text-forestDeep"
          >
            {t("wallet.marketing.codeLabel")}
          </label>
          {isFetchingCode ? (
            <div className="flex h-11 w-full animate-pulse items-center justify-center rounded-wallet-md border border-[rgba(23,52,4,0.08)] bg-white" />
          ) : code ? (
            <input
              id="wallet-marketing-code"
              type="text"
              value={code}
              readOnly
              className="w-full cursor-default rounded-wallet-md border border-[rgba(23,52,4,0.10)] bg-white px-3 py-2 text-right font-mono tracking-widest text-forestDeep"
              dir="ltr"
            />
          ) : (
            <button
              type="button"
              onClick={handleGenerateCode}
              disabled={isGeneratingCode}
              className="w-full rounded-wallet-md border border-dashed border-green600 bg-white px-3 py-2 text-sm font-bold text-green700 disabled:opacity-60"
            >
              {isGeneratingCode
                ? t("wallet.marketing.generating")
                : t("wallet.marketing.generateCode")}
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-wallet-md bg-red-50 p-3 text-xs text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="rounded-wallet-md bg-paleGreen p-3 text-xs font-bold text-green700">
            {t("wallet.marketing.success")}
          </p>
        )}

        <button
          type="button"
          onClick={handleSendMarketing}
          disabled={isSubmitting || !code}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-forest py-3 text-sm font-bold text-paleGreen disabled:opacity-50"
        >
          <Send fontSize="small" />
          {isSubmitting
            ? t("wallet.marketing.sending")
            : t("wallet.marketing.send")}
        </button>
      </div>
    </section>
  );
};

export default WalletShareLinks;

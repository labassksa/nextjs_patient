"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import s from "../../payment.module.css";

interface ReferralCodeInputProps {
  setReferralCode: (code: string) => void;
}

const ReferralCodeInput: React.FC<ReferralCodeInputProps> = ({ setReferralCode }) => {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [isOk, setIsOk] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const validate = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const { data } = await axios.get(`${apiUrl}/referral-codes/validate`, {
        params: { code: code.trim() },
      });
      if (data?.valid) {
        setMessage("تم التحقق");
        setIsOk(true);
        setFrozen(true);
        setReferralCode(code.trim());
        localStorage.setItem("referralCode", code.trim());
      } else {
        setMessage("الرمز غير صحيح أو منتهٍ");
        setIsOk(false);
        setReferralCode("");
      }
    } catch {
      setMessage("الرمز غير صحيح أو منتهٍ");
      setIsOk(false);
      setReferralCode("");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill from URL param or localStorage, then auto-validate
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("referralCode") || localStorage.getItem("referralCode");
    if (code) {
      setInput(code);
      validate(code);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (frozen) {
      setFrozen(false);
      setReferralCode("");
      localStorage.removeItem("referralCode");
      setMessage("");
      setIsOk(false);
    }
    setInput(e.target.value);
  };

  return (
    <div className={s.card} dir="rtl">
      <h2 className={s.cardTitle}>الرمز التسويقي</h2>

      <div className={s.promoRow}>
        <input
          className={s.promoInput}
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="أدخل الرمز التسويقي"
          disabled={loading || frozen}
        />
        <button
          className={s.promoBtn}
          onClick={() => validate(input)}
          disabled={loading || frozen || !input.trim()}
        >
          {loading ? (
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid rgba(234,243,222,0.4)",
                borderTopColor: "#eaf3de",
                animation: "spin 0.8s linear infinite",
              }}
            />
          ) : (
            "استخدام"
          )}
        </button>
      </div>

      {message && (
        <p className={`${s.promoMsg} ${isOk ? s.promoOk : s.promoErr}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ReferralCodeInput;

"use client";

import React, { useState } from "react";
import axios from "axios";
import { PaymentMethodEnum } from "@/types/paymentMethods";
import { convertArabicToEnglishNumbers } from "@/utils/arabicToenglish";
import s from "../../payment.module.css";

interface PromoCodeProps {
  setDiscountedPrice: (price: number) => void;
  setPromoCode: (code: string) => void;
  selectedPaymentMethod: PaymentMethodEnum;
}

const PromoCode: React.FC<PromoCodeProps> = ({
  setDiscountedPrice,
  setPromoCode,
  selectedPaymentMethod,
}) => {
  const [input, setInput] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isOk, setIsOk] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleApply = async () => {
    if (input.length !== 7) {
      setMessage("الرمز الترويجي يجب أن يكون مكوّناً من 7 أحرف");
      setIsOk(false);
      return;
    }
    const token = localStorage.getItem("labass_token");
    if (!token) {
      setMessage("سجّل دخول أولاً لاستخدام الرمز");
      setIsOk(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${apiUrl}/use-promo`,
        { promoCode: input, price: cashAmount || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && response.data.discountedPrice) {
        setDiscountedPrice(response.data.discountedPrice);
        setPromoCode(input);
        setMessage(`تم تطبيق الرمز! السعر الجديد: ${response.data.discountedPrice.toFixed(2)} ريال`);
        setIsOk(true);
        setFrozen(true);
      } else {
        setMessage("حدث خطأ غير متوقع، حاول مرة أخرى");
        setIsOk(false);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const msg = err.response.data.message;
        if (msg === "Promotional code not found") setMessage("الرمز الترويجي غير موجود");
        else if (msg.includes("already used")) setMessage("تم استخدام هذا الرمز مسبقاً");
        else if (msg === "Price is required") setMessage("أدخل مبلغ الكاش للحصول على فاتورة إلكترونية");
        else setMessage("حدث خطأ، حاول لاحقاً");
      } else {
        setMessage("حدث خطأ أثناء تطبيق الرمز");
      }
      setIsOk(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (frozen) {
      setFrozen(false);
      setPromoCode("");
      setMessage("");
      setIsOk(false);
    }
    setInput(e.target.value);
  };

  return (
    <div className={s.card} dir="rtl">
      <h2 className={s.cardTitle}>رمز ترويجي</h2>

      <div className={s.promoRow}>
        <input
          className={s.promoInput}
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="أدخل الرمز الترويجي"
          disabled={loading || frozen}
        />
        <button
          className={s.promoBtn}
          onClick={handleApply}
          disabled={loading || frozen}
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

      {selectedPaymentMethod === PaymentMethodEnum.Cash && (
        <div className={s.cashInpWrap}>
          <input
            className={s.cashInp}
            type="text"
            value={cashAmount}
            onChange={(e) => {
              const filtered = e.target.value.replace(/[^٠١٢٣٤٥٦٧٨٩0-9]/g, "");
              setCashAmount(convertArabicToEnglishNumbers(filtered));
            }}
            placeholder="أدخل المبلغ النقدي لإصدار فاتورة"
          />
        </div>
      )}
    </div>
  );
};

export default PromoCode;

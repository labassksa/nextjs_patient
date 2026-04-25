import React from "react";
import Image from "next/image";
import { PaymentMethodEnum } from "@/types/paymentMethods";
import s from "../../payment.module.css";

interface PaymentMethodProps {
  method: string;
  setMethod: React.Dispatch<React.SetStateAction<PaymentMethodEnum>>;
}

const CashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="13" rx="2" stroke="#639922" strokeWidth="1.5" />
    <circle cx="12" cy="12.5" r="2.5" stroke="#639922" strokeWidth="1.5" />
    <path d="M6 6V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke="#639922" strokeWidth="1.5" />
    <path d="M6 12.5H5M19 12.5h-1" stroke="#639922" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PaymentMethod: React.FC<PaymentMethodProps> = ({ method, setMethod }) => {
  return (
    <div className={s.card} dir="rtl">
      <h2 className={s.cardTitle}>طريقة الدفع</h2>
      <div className={s.methodList}>

        {/* Apple Pay */}
        <button
          className={`${s.methodItem} ${method === PaymentMethodEnum.ApplePay ? s.methodItemActive : ""}`}
          onClick={() => setMethod(PaymentMethodEnum.ApplePay)}
        >
          <div className={`${s.methodDot} ${method === PaymentMethodEnum.ApplePay ? s.methodDotActive : ""}`}>
            <div className={`${s.methodDotInner} ${method === PaymentMethodEnum.ApplePay ? s.methodDotInnerVisible : ""}`} />
          </div>
          <span className={s.methodLabel}>ابل باي</span>
          <div className={s.methodLogoBox}>
            <Image src="/icons/apple_pay.svg" alt="Apple Pay" width={46} height={18} className={s.methodLogo} />
          </div>
        </button>

        {/* Card */}
        <button
          className={`${s.methodItem} ${method === PaymentMethodEnum.Card ? s.methodItemActive : ""}`}
          onClick={() => setMethod(PaymentMethodEnum.Card)}
        >
          <div className={`${s.methodDot} ${method === PaymentMethodEnum.Card ? s.methodDotActive : ""}`}>
            <div className={`${s.methodDotInner} ${method === PaymentMethodEnum.Card ? s.methodDotInnerVisible : ""}`} />
          </div>
          <span className={s.methodLabel}>البطاقة الائتمانية</span>
          <div className={s.methodLogos}>
            <div className={s.methodLogoBox}>
              <Image src="/icons/visa.svg" alt="Visa" width={32} height={18} className={s.methodLogo} />
            </div>
            <div className={s.methodLogoBox}>
              <Image src="/icons/mada.svg" alt="Mada" width={32} height={18} className={s.methodLogo} />
            </div>
            <div className={s.methodLogoBox}>
              <Image src="/icons/mc.svg" alt="Mastercard" width={26} height={18} className={s.methodLogo} />
            </div>
          </div>
        </button>

        {/* Cash */}
        <button
          className={`${s.methodItem} ${method === PaymentMethodEnum.Cash ? s.methodItemActive : ""}`}
          onClick={() => setMethod(PaymentMethodEnum.Cash)}
        >
          <div className={`${s.methodDot} ${method === PaymentMethodEnum.Cash ? s.methodDotActive : ""}`}>
            <div className={`${s.methodDotInner} ${method === PaymentMethodEnum.Cash ? s.methodDotInnerVisible : ""}`} />
          </div>
          <span className={s.methodLabel}>الدفع نقداً</span>
          <div className={s.cashIcon}>
            <CashIcon />
          </div>
        </button>

      </div>
    </div>
  );
};

export default PaymentMethod;

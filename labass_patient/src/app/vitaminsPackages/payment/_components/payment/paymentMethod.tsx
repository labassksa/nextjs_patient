import React from "react";
import { PaymentMethodEnum } from "@/types/paymentMethods";
import s from "../../payment.module.css";

interface PaymentMethodProps {
  method: string;
  setMethod: React.Dispatch<React.SetStateAction<PaymentMethodEnum>>;
}

const methods = [
  { key: PaymentMethodEnum.ApplePay, label: "ابل باي", icon: "🍎" },
  { key: PaymentMethodEnum.Card, label: "البطاقة الائتمانية", icon: "💳" },
  { key: PaymentMethodEnum.Cash, label: "الدفع نقداً", icon: "💵" },
];

const PaymentMethod: React.FC<PaymentMethodProps> = ({ method, setMethod }) => {
  return (
    <div className={s.card} dir="rtl">
      <h2 className={s.cardTitle}>اختر طريقة الدفع</h2>
      <div className={s.methodList}>
        {methods.map((item) => {
          const active = method === item.key;
          return (
            <button
              key={item.key}
              className={`${s.methodItem} ${active ? s.methodItemActive : ""}`}
              onClick={() => setMethod(item.key)}
            >
              <div className={`${s.methodDot} ${active ? s.methodDotActive : ""}`}>
                <div className={`${s.methodDotInner} ${active ? s.methodDotInnerActive : ""}`} />
              </div>
              <span className={s.methodLabel}>{item.label}</span>
              <span className={s.methodIcon}>{item.icon}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethod;

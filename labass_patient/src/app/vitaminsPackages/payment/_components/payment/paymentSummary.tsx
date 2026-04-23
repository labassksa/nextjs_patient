import React from "react";
import s from "../../payment.module.css";

const PaymentSummary: React.FC<{ discountedPrice: number }> = ({ discountedPrice }) => {
  const taxRate = 0.15;
  const priceWithoutVAT = discountedPrice / (1 + taxRate);
  const tax = priceWithoutVAT * taxRate;

  return (
    <div className={s.card} dir="rtl">
      <h2 className={s.cardTitle}>ملخّص الطلب</h2>

      <div className={s.summaryRow}>
        <span className={s.summaryLbl}>الاشتراك</span>
        <span className={s.summaryVal}>{priceWithoutVAT.toFixed(2)} ريال</span>
      </div>

      <div className={s.summaryRow}>
        <span className={s.summaryLbl}>ضريبة القيمة المضافة (15%)</span>
        <span className={s.summaryVal}>{tax.toFixed(2)} ريال</span>
      </div>

      <div className={`${s.summaryRow} ${s.summaryRowTotal}`}>
        <span className={s.summaryLblTotal}>الإجمالي</span>
        <span className={s.summaryValTotal}>
          <sub>ريال</sub>
          {discountedPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default PaymentSummary;

import React from "react";
import s from "../../payment.module.css";

interface PaymentIntroProps {
  planLabel: string;
  price: number;
}

const features = [
  "فحص دم من مختبر معتمد بأعلى معايير الجودة",
  "طبيب يحلل نتائجك",
  "فيتامينات ومعادن مخصّصة لك توصلك لبيتك",
  "استشر الطبيب 24/7",
];

const PaymentIntro: React.FC<PaymentIntroProps> = ({ planLabel, price }) => {
  return (
    <div className={s.planCard}>
      {/* Badge */}
      <div className={s.planBadge}>
        <span className={s.planBadgeDot} />
        باقتك المختارة
      </div>

      {/* Plan label */}
      <p className={s.planMeta}>اشتراك</p>
      <p className={s.planName}>{planLabel || "الباقة الشهرية"}</p>

      {/* Price */}
      <div className={s.planPriceRow}>
        <span className={s.planPriceNum}>
          {price.toLocaleString("ar-SA")}
        </span>
        <span className={s.planPriceCur}>ريال</span>
      </div>

      {/* Separator */}
      <div className={s.planSep} />

      {/* Features */}
      <div className={s.planFeats}>
        {features.map((f) => (
          <div key={f} className={s.planFeat}>
            <div className={s.planFeatCk}>✓</div>
            <span>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentIntro;

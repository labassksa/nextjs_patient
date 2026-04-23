import React from "react";
import s from "../../payment.module.css";

interface PaymentIntroProps {
  planLabel: string;
  price: number;
}

const features = [
  "فحص دم منزلي شامل",
  "تحليل متقدم للنتائج",
  "فيتامينات مخصصة لك",
  "استشارة مع طبيب عام",
];

const PaymentIntro: React.FC<PaymentIntroProps> = ({ planLabel, price }) => {
  return (
    <div className={s.planBanner} dir="rtl">
      <div className={s.planBannerGrain} />
      <div className={s.planBannerBlob} />

      <div className={s.planBannerInner}>
        {/* Badge */}
        <div className={s.planBadge}>
          <span className={s.planBadgeDot} />
          باقتك المختارة
        </div>

        {/* Plan name */}
        <p className={s.planName}>{planLabel || "الباقة الشهرية"}</p>

        {/* Price */}
        <div className={s.planPrice}>
          <span className={s.planPriceNum}>
            {price.toLocaleString("ar-SA")}
          </span>
          <span className={s.planPriceCur}>ريال</span>
        </div>

        {/* Divider */}
        <div className={s.planDivider}>
          <div className={s.planDividerLine} />
          <span className={s.planDividerTxt}>ما يشمله اشتراكك</span>
          <div className={s.planDividerLine} />
        </div>

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
    </div>
  );
};

export default PaymentIntro;

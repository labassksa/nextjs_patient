import React from "react";
import { Bundle } from "../../myClientComponent";
import s from "../../payment.module.css";

interface PaymentIntroProps {
  bundle: Bundle | null;
  price: number;
}

const PaymentIntro: React.FC<PaymentIntroProps> = ({ bundle, price }) => {
  const name = bundle?.description || "جاري التحميل...";
  const type = bundle?.type || "";
  const originalPrice = bundle?.originalPrice ? Number(bundle.originalPrice) : null;
  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className={s.planCard}>
      {/* Badge */}
      <div className={s.planBadge}>
        <span className={s.planBadgeDot} />
        {type || "باقتك المختارة"}
      </div>

      {/* Plan name */}
      <p className={s.planMeta}>اشتراك</p>
      <p className={s.planName}>{name}</p>

      {/* Price */}
      <div className={s.planPriceRow}>
        <span className={s.planPriceNum}>
          {price.toLocaleString("ar-SA")}
        </span>
        <span className={s.planPriceCur}>ريال</span>
        {hasDiscount && (
          <span className={s.planOriginalPrice}>
            {originalPrice!.toLocaleString("ar-SA")} ريال
          </span>
        )}
      </div>
    </div>
  );
};

export default PaymentIntro;

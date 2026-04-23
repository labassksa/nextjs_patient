import React from "react";
import Link from "next/link";
import s from "../../payment.module.css";

interface PaymentHeaderProps {
  onBack: () => void;
}

const PaymentHeader: React.FC<PaymentHeaderProps> = ({ onBack }) => {
  return (
    <div className={s.nav}>
      <Link href="/vitaminsPackages" className={s.brand}>
        <div className={s.mark} />
        <span className={s.bname}>لاباس</span>
      </Link>
      <button className={s.navBack} onClick={onBack}>
        ← رجوع
      </button>
    </div>
  );
};

export default PaymentHeader;

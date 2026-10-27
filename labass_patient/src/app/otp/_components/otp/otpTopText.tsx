// components/otp/OTPTopText.tsx
import React from "react";
import Link from "next/link";
import s from "../../../login/login.module.css";
import o from "../../otp.module.css";

const OTPTopText = ({ phoneNumber }: { phoneNumber: string | null }) => {
  return (
    <div className={s.heroText}>
      <div className={s.eyebrow}>
        <span className={s.eyebrowDot} />
        رمز التحقق
      </div>
      <h1 className={s.title}>أدخل الرمز</h1>
      <p className={s.sub}>
        أرسلنا رمزاً من ٤ أرقام إلى{" "}
        {/* <bdi dir="ltr"> keeps "+966 5…" in order inside Arabic text */}
        {phoneNumber && (
          <bdi dir="ltr" className={o.phone}>
            {phoneNumber}
          </bdi>
        )}
        <Link href="/login" className={o.editLink}>
          تعديل
        </Link>
      </p>
    </div>
  );
};

export default OTPTopText;

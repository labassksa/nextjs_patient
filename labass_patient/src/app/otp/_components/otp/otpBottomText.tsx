// components/otp/OTPBottomText.tsx
import React, { useState, useEffect } from "react";
import o from "../../otp.module.css";

interface OTPBottomTextProps {
  onResend: () => void;
}

const OTPBottomText: React.FC<OTPBottomTextProps> = ({ onResend }) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResendClick = () => {
    if (timeLeft === 0) {
      onResend();
      setTimeLeft(60); // Restart the timer
    }
  };

  return (
    <div className={o.resend}>
      <span>لم يصلك الرمز؟</span>
      <button
        type="button"
        className={o.resendBtn}
        onClick={handleResendClick}
        disabled={timeLeft > 0}
      >
        إعادة الإرسال
      </button>
      {timeLeft > 0 && (
        <span dir="ltr" className={o.timer}>
          00:{String(timeLeft).padStart(2, "0")}
        </span>
      )}
    </div>
  );
};

export default OTPBottomText;

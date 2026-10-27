import React, { forwardRef } from "react";
import o from "../../otp.module.css";
import { convertArabicToEnglishNumbers } from "../../../../utils/arabicToenglish";

interface OTPInputProps {
  value: string;
  index: number;
  onChange: (value: string, index: number) => void;
  // Called with several digits at once (paste / SMS autofill)
  onFill: (digits: string, index: number) => void;
  autoFocus?: boolean;
  hasError?: boolean;
}

const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  ({ value, index, onChange, onFill, autoFocus, hasError }, ref) => {
    // Keep digits only; Arabic-Indic digits (١٢٣) are converted first
    const toDigits = (raw: string) =>
      convertArabicToEnglishNumbers(raw).replace(/\D/g, "");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = toDigits(e.target.value);
      if (digits.length <= 1) {
        onChange(digits, index);
      } else if (digits.length === 2 && value) {
        // Typed over a filled box: keep only the new digit
        onChange(digits.replace(value, ""), index);
      } else {
        // Whole code arrived at once (iOS/Android SMS autofill)
        onFill(digits, index);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const digits = toDigits(e.clipboardData.getData("text"));
      if (digits) onFill(digits, index);
    };

    return (
      <input
        id={`otp-${index}`}
        type="tel"
        value={value}
        autoFocus={autoFocus}
        onChange={handleInputChange}
        onPaste={handlePaste}
        aria-label={`الرقم ${index + 1}`}
        className={`${o.box} ${value ? o.boxFilled : ""} ${hasError ? o.boxError : ""}`}
        autoComplete="one-time-code"
        inputMode="numeric"
        pattern="[0-9]*"
        ref={ref}
      />
    );
  }
);

// Set the displayName property for the forwardRef component
OTPInput.displayName = "OTPInput";

export default OTPInput;

import React from "react";
import AppleIcon from "@mui/icons-material/Apple";
import { PaymentMethodEnum } from "../../types/paymentMethods";
import { useRouter } from "next/navigation";

interface PaymentButtonProps {
  method: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ method }) => {
  const router = useRouter();

  const handlePaymentClick = () => {
    if (method === PaymentMethodEnum.Card) {
      router.push("/cardDetails"); // Navigate to the Card Details page
    } else {
      router.push("/userPersonalInfo"); // Navigate to the Card Details page
    }
  };

  if (method === PaymentMethodEnum.ApplePay) {
    return (
      <button
        className="sticky bottom-0 pb-4 w-full font-bold bg-black text-white py-4 px-4 rounded-3xl flex justify-center items-center "
        dir="rtl"
        onClick={handlePaymentClick}
      >
        <AppleIcon className="ml-2" />
        Apple Pay
      </button>
    );
  } else if (method === PaymentMethodEnum.Card) {
    return (
      <button
        className="sticky bottom-0 pb-4 w-full font-bold bg-custom-green text-white py-4 px-4 rounded-3xl "
        dir="rtl"
        onClick={handlePaymentClick}
      >
        الدفع
      </button>
    );
  }

  return null;
};

export default PaymentButton;

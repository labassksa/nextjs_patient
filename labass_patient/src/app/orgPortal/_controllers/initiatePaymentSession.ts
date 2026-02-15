import axios from "axios";

export const initiatePaymentSession = async (invoiceAmount: number) => {
  try {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      return { success: false, message: "لم يتم العثور على رمز المصادقة" };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/initiate-session`,
      {
        InvoiceAmount: invoiceAmount,
        CurrencyIso: "SAR",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 && response.data?.Data) {
      return {
        success: true,
        sessionId: response.data.Data.SessionId,
        countryCode: response.data.Data.CountryCode,
      };
    } else {
      return { success: false, message: "استجابة غير متوقعة من الخادم" };
    }
  } catch (error: any) {
    console.error("Error initiating payment session:", error);
    return {
      success: false,
      message: error.response?.data?.message || "حدث خطأ أثناء بدء جلسة الدفع",
    };
  }
};

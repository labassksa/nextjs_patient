import axios from "axios";

export const initiatePaymentSession = async (invoiceAmount: number) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/initiate-session`,
      {
        InvoiceAmount: invoiceAmount,
        CurrencyIso: "SAR",
      }
    );

    if (response.data?.IsSuccess && response.data?.Data) {
      return {
        success: true,
        sessionId: response.data.Data.SessionId,
        countryCode: response.data.Data.CountryCode,
      };
    } else {
      return { success: false, message: response.data?.Message || "استجابة غير متوقعة من الخادم" };
    }
  } catch (error: any) {
    console.error("Error initiating payment session:", error);
    return {
      success: false,
      message: error.response?.data?.message || "حدث خطأ أثناء بدء جلسة الدفع",
    };
  }
};

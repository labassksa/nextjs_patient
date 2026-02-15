import axios from "axios";

export const executeOneTimeBundlePayment = async (data: {
  bundleId: number;
  sessionId: string;
  callBackUrl: string;
  errorUrl: string;
}) => {
  try {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      return { success: false, message: "لم يتم العثور على رمز المصادقة" };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/execute-onetime-bundle-payment`,
      {
        bundleId: data.bundleId,
        sessionId: data.sessionId,
        callBackUrl: data.callBackUrl,
        errorUrl: data.errorUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 && response.data?.success) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "استجابة غير متوقعة من الخادم",
      };
    }
  } catch (error: any) {
    console.error("Error executing one-time bundle payment:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "حدث خطأ أثناء تنفيذ عملية الدفع",
    };
  }
};

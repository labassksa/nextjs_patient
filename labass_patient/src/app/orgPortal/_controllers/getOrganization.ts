import axios from "axios";

export const getOrganization = async () => {
  try {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      throw new Error("لا يوجد رمز دخول. يرجى تسجيل الدخول للمتابعة.");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/organization`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "تم استلام رمز استجابة غير متوقع." };
    }
  } catch (error: any) {
    console.error("Axios Request Error:", error);

    // Detect Network Error
    if (axios.isAxiosError(error) && !error.response) {
      return {
        success: false,
        message:
          "⚠️ خطأ في الاتصال بالشبكة: يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
      };
    }

    // Extract Backend Message
    let backendMessage =
      error.response?.data?.message || "حدث خطأ ، حاول مرة أخرى";

    // Translate Specific Backend Messages
    if (
      backendMessage.includes(
        "MarketerProfile not found for the given user ID."
      )
    ) {
      backendMessage =
        "⚠️ تعذر العثور على الملف التعريفي للمسوق لهذا المستخدم. يرجى تسجيل الدخول باستخدام حساب المسوق الخاص بك.";
    } else if (
      backendMessage.includes(
        "Organization not found for the given marketer profile."
      )
    ) {
      backendMessage =
        "⚠️ لم يتم العثور على المؤسسة المرتبطة بملفك التعريفي. يرجى الاتصال بالدعم الفني";
    }

    return {
      success: false,
      message: backendMessage,
    };
  }
};

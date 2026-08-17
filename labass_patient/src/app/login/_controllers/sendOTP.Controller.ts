import axios from "axios";

// Modify the function to accept a countryCode parameter
export const loginPatient = async (
  phoneNumber: string,
  countryCode: string
) => {
  try {
    // Ensure the phone number starts with the selected country code
    const formattedPhoneNumber = phoneNumber.startsWith(countryCode)
      ? phoneNumber
      : `${countryCode}${phoneNumber}`;

    const data = {
      phoneNumber: formattedPhoneNumber,
      role: "patient",
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.post(`${apiUrl}/send-otp`, data);

    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, message: "Unexpected response status code" };
    }
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      const backendMessage =
        error.response.data.error || "حدث خطأ ، حاول مرة أخرى";
      const roleMatch = backendMessage.match(/role "(\w+)"/);
      let translatedMessage = "حدث خطأ ، حاول مرة أخرى";

      if (roleMatch) {
        const role = roleMatch[1];

        switch (role) {
          case "doctor":
            translatedMessage =
              "المستخدم مسجل كطبيب و غير مصرح له بالدخول كمريض. يرجى الاتصال بدعم العملاء في لاباس";
            break;
          case "marketer":
            translatedMessage =
              "المستخدم مسجل كمسوق و غير مصرح له بالدخول كمريض. يرجى الاتصال بدعم العملاء في لاباس";
            break;
          case "admin":
            translatedMessage =
              "المستخدم مسجل كمسؤول و غير مصرح له بالدخول كمريض. يرجى الاتصال بدعم العملاء في لاباس";
            break;
          case "patient":
            translatedMessage =
              " المستخدم غير مصرح له بالدخول كمريض. يرجى الاتصال بدعم العملاء في";
            break;
          default:
            translatedMessage = "حدث خطأ ، حاول مرة أخرى";
        }
      }

      return { success: false, message: translatedMessage };
    } else {
      return {
        success: false,
        message: "حدث خطأ ، حاول مرة أخرى",
      };
    }
  }
};

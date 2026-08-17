import axios from "axios";

// TEMPORARY MARKETER OTP BYPASS — REMOVE AFTER 2026-08-27
// The backend resolves a stored marketer role from the phone number alone and may
// return a ready-to-use session on /send-otp instead of dispatching an OTP.
export interface SendOtpAuthResponse {
  userId: number;
  token: string;
  refreshToken?: string;
  bypassExpiresAt?: string;
}
// END TEMPORARY MARKETER OTP BYPASS

export interface SendOtpResult {
  success: boolean;
  message?: string;
  /** Full, unreduced /send-otp response body. */
  data?: any;
  // TEMPORARY MARKETER OTP BYPASS — REMOVE AFTER 2026-08-27
  alreadyRegisteredMarketer?: boolean;
  nextRoute?: string;
  authResponse?: SendOtpAuthResponse;
  // END TEMPORARY MARKETER OTP BYPASS
}

// Modify the function to accept a countryCode parameter
export const loginPatient = async (
  phoneNumber: string,
  countryCode: string
): Promise<SendOtpResult> => {
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
      const body = response.data ?? {};

      return {
        success: true,
        // Preserve the complete response rather than reducing it to a boolean.
        data: body,
        message: body.message,
        // TEMPORARY MARKETER OTP BYPASS — REMOVE AFTER 2026-08-27
        alreadyRegisteredMarketer: body.alreadyRegisteredMarketer === true,
        nextRoute: body.nextRoute,
        authResponse: body.authResponse,
        // END TEMPORARY MARKETER OTP BYPASS
      };
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

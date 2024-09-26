import axios from "axios";

// Function to handle login logic for patients
export const loginPatient = async (phoneNumber: string) => {
  try {
    // Check if the phone number already starts with '+966'
    const formattedPhoneNumber = phoneNumber.startsWith("+966")
      ? phoneNumber
      : `+966${phoneNumber}`;

    // Prepare the payload with the corrected phone number and role
    const data = {
      phoneNumber: formattedPhoneNumber, // Use the formatted phone number
      role: "patient", // Specify the role as 'patient'
    };

    // Use environment variable for the backend URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Send the data to the backend using Axios
    const response = await axios.post(`${apiUrl}/send-otp`, data);

    // Check for successful response
    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, message: "Unexpected response status code" };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      // Extract error message from backend response
      const backendMessage =
        error.response.data.error || "حدث خطأ ، حاول مرة أخرى";

      // Use regex to extract the role from the error message
      const roleMatch = backendMessage.match(/role "(\w+)"/);
      let translatedMessage = "حدث خطأ ، حاول مرة أخرى";

      if (roleMatch) {
        const role = roleMatch[1]; // Extract the role (e.g., patient, doctor, marketer, admin)

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
      // Handle unexpected errors
      return {
        success: false,
        message: "حدث خطأ ، حاول مرة أخرى",
      };
    }
  }
};

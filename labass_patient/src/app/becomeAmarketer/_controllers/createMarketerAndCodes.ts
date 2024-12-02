import axios from "axios";

export const createMarketerAndGeneratePromoCodes = async (
  name: string,
  phoneNumber: string,
  promoterName: string
) => {
  try {
    const formattedPhoneNumber = phoneNumber.startsWith("+966")
      ? phoneNumber
      : `+966${phoneNumber}`;
    const data = {
      name,
      phoneNumber: formattedPhoneNumber,
      promoterName,
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await axios.post(
      `${apiUrl}/create-marketer-and-generate-codes`,
      data
    );

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Unexpected response status code" };
    }
  } catch (error) {
    return {
      success: false,
      message:
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "حدث خطأ ، حاول مرة أخرى",
    };
  }
};

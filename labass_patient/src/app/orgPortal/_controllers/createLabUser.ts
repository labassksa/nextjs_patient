import axios from "axios";

export const createLabUser = async (name: string, phoneNumber: string) => {
  try {
    const formattedPhoneNumber = phoneNumber.startsWith("+966")
      ? phoneNumber
      : `+966${phoneNumber}`;
    const data = {
      name,
      phoneNumber: formattedPhoneNumber,
    };
    const token = localStorage.getItem("labass_token");
    if (!token) {
      throw new Error("No token found. Please log in to continue.");
    }
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/create-lab-user`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
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

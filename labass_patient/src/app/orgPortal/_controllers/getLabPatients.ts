import axios from "axios";
import i18next from "i18next";
export const getLabPatients = async () => {
  try {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      throw new Error("No token found. Please log in to continue.");
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/lab-marketer-patients`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
          : i18next.t('unexpectedError'),
    };
  }
};

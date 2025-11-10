import axios from "axios";
import i18next from "i18next";

export const getMySubscription = async () => {
  try {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      return {
        success: false,
        message: i18next.t('errors.noToken')
      };
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/my-subscription`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, message: i18next.t('errors.unexpectedResponse') };
    }
  } catch (error: any) {
    console.error("Error fetching subscription:", error);

    // Detect Network Error
    if (axios.isAxiosError(error) && !error.response) {
      return {
        success: false,
        message: i18next.t('errors.networkError'),
      };
    }

    // Handle 404 - No active subscription
    if (error.response?.status === 404) {
      return {
        success: false,
        noSubscription: true,
        message: error.response?.data?.message || "No active subscription found",
      };
    }

    // Extract Backend Message
    let backendMessage =
      error.response?.data?.message || i18next.t('errors.genericError');

    return {
      success: false,
      message: backendMessage,
    };
  }
};

import axios from "axios";
import i18next from "i18next";

export const getOrganization = async () => {
  try {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      throw new Error(i18next.t('errors.noToken'));
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
      return { success: false, message: i18next.t('errors.unexpectedResponse') };
    }
  } catch (error: any) {
    console.error("Axios Request Error:", error);

    // Detect Network Error
    if (axios.isAxiosError(error) && !error.response) {
      return {
        success: false,
        message: i18next.t('errors.networkError'),
      };
    }

    // Extract Backend Message
    let backendMessage =
      error.response?.data?.message || i18next.t('errors.genericError');

    // Translate Specific Backend Messages
    if (
      backendMessage.includes(
        "MarketerProfile not found for the given user ID."
      )
    ) {
      backendMessage = i18next.t('errors.marketerNotFound');
    } else if (
      backendMessage.includes(
        "Organization not found for the given marketer profile."
      )
    ) {
      backendMessage = i18next.t('errors.organizationNotFound');
    }

    return {
      success: false,
      message: backendMessage,
    };
  }
};

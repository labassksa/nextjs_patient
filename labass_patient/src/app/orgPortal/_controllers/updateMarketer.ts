import axios from "axios";
import i18next from "i18next";

interface UpdateMarketerData {
  firstName: string;
  lastName: string;
}

export const updateMarketer = async (userData: UpdateMarketerData) => {
  try {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      return {
        success: false,
        message: i18next.t('errors.noToken')
      };
    }

    const requestBody = {
      marketerData: {
        iban: "SAA"
      },
      userData: {
        firstName: userData.firstName,
        lastName: userData.lastName
      }
    };

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/my-marketer`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: i18next.t('errors.unexpectedResponse') };
    }
  } catch (error: any) {
    console.error("Update Marketer Error:", error);

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

    return {
      success: false,
      message: backendMessage,
    };
  }
};
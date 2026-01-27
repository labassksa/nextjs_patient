import axios from "axios";
import i18next from "i18next";

export interface Bundle {
  id: number;
  name: string;
  type: string;
  price: number;
  consultationCount: number;
  currency: string;
  recurringType: string;
  isActive: boolean;
  description?: string;
}

export const getBundles = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/bundles`
    );

    if (response.status === 200) {
      return { success: true, data: response.data.data as Bundle[] };
    } else {
      return { success: false, message: i18next.t('errors.unexpectedResponse') };
    }
  } catch (error: any) {
    console.error("Error fetching bundles:", error);

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

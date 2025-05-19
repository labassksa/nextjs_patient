import axios from "axios";
import i18next from "i18next";
export const getMarketerConsultaion = async (fromDate?: Date, toDate?: Date) => {
  try {
    const token = localStorage.getItem("labass_token");
    const userId = localStorage.getItem("labass_userId");
    if (!token || !userId) {
      return {
        success: false,
        message: i18next.t('errors.noToken'),
      };
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/marketers/consultations/${userId}`,
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        fromDate: fromDate ? fromDate.toISOString().split('T')[0] : undefined,
        toDate: toDate ? toDate.toISOString().split('T')[0] : undefined,
      }
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

import axios from "axios";
import i18next from "i18next";

const formatLocalDate = (date?: Date) => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getMarketerConsultaion = async (
  fromDate?: Date,
  toDate?: Date,
  page = 1,
  limit = 10,
  forceRefresh = false
) => {
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
        ...(forceRefresh
          ? { "Cache-Control": "no-cache", Pragma: "no-cache" }
          : {}),
      },
      params: {
        fromDate: formatLocalDate(fromDate),
        toDate: formatLocalDate(toDate),
        page,
        limit,
        _refresh: forceRefresh ? Date.now() : undefined,
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

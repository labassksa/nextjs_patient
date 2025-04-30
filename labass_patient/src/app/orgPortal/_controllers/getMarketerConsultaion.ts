import axios from "axios";

export const getMarketerConsultaion = async () => {
  try {
    const token = localStorage.getItem("labass_token");
    const userId = 6;//localStorage.getItem("labass_userId");
    if (!token && !userId) {
      throw new Error("No token found. Please log in to continue.");
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/marketers/consultations/${userId}`,
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
          : "حدث خطأ ، حاول مرة أخرى",
    };
  }
};

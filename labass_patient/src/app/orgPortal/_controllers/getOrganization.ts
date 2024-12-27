import axios from "axios";

export const getOrganization = async () => {
  try {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      throw new Error("No token found. Please log in to continue.");
    }

    // Adjust the endpoint to match the real one in your env
    // or as you said: getOrganizationURL = "next_Public_API/organization"
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

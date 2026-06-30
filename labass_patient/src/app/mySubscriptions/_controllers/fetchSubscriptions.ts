import axios from "axios";

export const fetchSubscriptions = async () => {
  try {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      throw new Error("No token found. Please log in to continue.");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/patient/my-subscriptions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data ?? [];
  } catch (error: any) {
    if (error.response?.status === 403) {
      // Patient not linked to an organization — no subscriptions
      return [];
    } else if (error.response) {
      throw new Error(
        error.response.data.message ||
          "Failed to fetch subscriptions from the server."
      );
    } else if (error.request) {
      throw new Error(
        "No response from server. Please check your network connection."
      );
    } else {
      throw new Error(
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  }
};

// _controllers/myConsultations.ts
import axios from "axios";

export const fetchConsultations = async () => {
  try {
    const token = localStorage.getItem("labass_token"); // Replace with your actual token retrieval method
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/consultations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.reverse();
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return [];
  }
};
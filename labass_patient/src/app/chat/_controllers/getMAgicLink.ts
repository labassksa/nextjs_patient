import axios from "axios";

export const getMagicLink = async (
  tokenUUID: string,
  consultationId: number
) => {
  try {
    // Make the GET request with tokenUUID and consultationId as query parameters
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/magic-link`,
      {
        params: {
          tokenUUID, // Pass tokenUUID as a query parameter
          consultationId, // Pass consultationId as a query parameter
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error during magic link:", error);
    throw error;
  }
};

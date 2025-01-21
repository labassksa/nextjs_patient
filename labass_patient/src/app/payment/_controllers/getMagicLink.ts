// src/utils/getMagicLink.ts
import axios from "axios";

export const getMagicLink = async (tokenUUID: string, promoCode: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/magic-link`,
      {
        params: {
          tokenUUID,
          promoCode,
        },
      }
    );

    // The successful response body might look like:
    // {
    //   "message": "Promo code applied successfully.",
    //   "discountedPrice": 70,
    //   "tokenJWT": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    // }
    return response.data;
  } catch (error) {
    console.error("Error during magic link:", error);
    throw error;
  }
};

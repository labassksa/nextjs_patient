import axios from "axios";

const apiUrl = "process.env.NEXT_PUBLIC_API_URL";

export const fetchInvoiceLink = async (
  consultationId: number
): Promise<string | null> => {
  try {
    const token = localStorage.getItem("labass_token"); // Ensure token is fetched correctly
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(
      `${apiUrl}create-invoice`,
      { consultationId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Log the full response to understand its structure
    console.log("API Response:", response);
    console.log("API Response invoice link:", response.data.invoiceLink);

    // Check if the response contains the `invoiceLink` key
    if (response.data && response.data.invoiceLink) {
      return response.data.invoiceLink;
    } else {
      console.error("Invoice link not found in response:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching invoice link:", error);
    return null;
  }
};

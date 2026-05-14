import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const sendMarketingMessage = async (phoneNumber: string, code: string) => {
  const token = localStorage.getItem("labass_token");
  const { data } = await axios.post(
    `${apiUrl}/my-referral-codes/send-marketing`,
    { phoneNumber, code },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const generateReferralCode = async (): Promise<string> => {
  const token = localStorage.getItem("labass_token");
  const { data } = await axios.post(
    `${apiUrl}/my-referral-codes`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data?.data?.code;
};

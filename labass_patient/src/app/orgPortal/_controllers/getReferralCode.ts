import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getReferralCode = async (): Promise<string | null> => {
  const token = localStorage.getItem("labass_token");
  const { data } = await axios.get(`${apiUrl}/my-referral-codes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (Array.isArray(data?.data)) {
    return data.data[0]?.code ?? null;
  }
  return data?.data?.code ?? null;
};

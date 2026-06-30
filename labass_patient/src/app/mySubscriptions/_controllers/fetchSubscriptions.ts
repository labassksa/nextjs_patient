import axios from "axios";

const fetchPatientSubscriptions = async (token: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/patient/my-subscriptions`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = response.data.data ?? [];
    return Array.isArray(data) ? data : [data];
  } catch (error: any) {
    if (error.response?.status === 403 || error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

const fetchOrgSubscriptions = async (token: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/my-subscription`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = response.data.data ?? [];
    return Array.isArray(data) ? data : [data];
  } catch (error: any) {
    if (error.response?.status === 403 || error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const fetchSubscriptions = async () => {
  const token = localStorage.getItem("labass_token");
  if (!token) {
    throw new Error("No token found. Please log in to continue.");
  }

  try {
    const [patientSubs, orgSubs] = await Promise.all([
      fetchPatientSubscriptions(token),
      fetchOrgSubscriptions(token),
    ]);

    // Merge and deduplicate by id
    const seen = new Set<number>();
    const merged = [...patientSubs, ...orgSubs].filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });

    return merged;
  } catch (error: any) {
    if (error.response) {
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

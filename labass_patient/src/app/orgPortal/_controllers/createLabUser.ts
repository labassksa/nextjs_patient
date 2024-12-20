import axios from "axios";

interface CreateLabUserData {
  name: string;
  phoneNumber: string;
  age: string;
  nationality: string;
  gender: string;
  testType: string;
  pdfFiles?: File[] | null; // Update this to accept File[]
}

export const createLabUser = async (data: CreateLabUserData) => {
  try {
    const formattedPhoneNumber = data.phoneNumber.startsWith("+966")
      ? data.phoneNumber
      : `+966${data.phoneNumber}`;

    // Prepare FormData
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phoneNumber", formattedPhoneNumber);
    formData.append("age", data.age);
    formData.append("nationality", data.nationality);
    formData.append("gender", data.gender);
    formData.append("testType", data.testType);

    if (data.testType === "استشارة بعد الاختبار" && data.pdfFiles) {
      Array.from(data.pdfFiles).forEach((file) => {
        formData.append("pdfFiles", file);
      });
    }

    const token = localStorage.getItem("labass_token");
    if (!token) {
      throw new Error("No token found. Please log in to continue.");
    }

    // Send request
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/create-lab-user`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type will be automatically set to multipart/form-data
        },
      }
    );

    if (response.status === 201) {
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

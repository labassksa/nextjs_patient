import { ConsultationStatus } from "@/models/consultation";

export const translateStatus = (status: string) => {
  switch (status) {
    case ConsultationStatus.Paid:
      return "مدفوعة";
    case ConsultationStatus.Open:
      return "مفتوحة";
    case ConsultationStatus.Closed:
      return "مكتملة";
    case ConsultationStatus.Failed:
      return "ملغاة";
    case ConsultationStatus.PendingPayment:
      return "بانتظار الدفع";
    default:
      return status;
  }
};

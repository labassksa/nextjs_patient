import { WalletData } from "../../_types/walletTypes";

export const walletMockData: WalletData = {
  balance: 1240,
  totalEarned: 3675,
  commissionPercentage: 10,
  referralCode: "LABASS-MK-8492",
  marketingLink: "https://labass.sa/r/LABASS-MK-8492",
  periods: {
    week: {
      consultationsCount: 6,
      subscriptionsCount: 2,
      earned: 140,
      transactions: [
        { id: "w1", type: "consultation", patientLabel: "المريض س", amount: 15, date: "2026-07-12", status: "completed" },
        { id: "w2", type: "subscription", patientLabel: "المريض ص", amount: 25, date: "2026-07-11", status: "completed" },
        { id: "w3", type: "consultation", patientLabel: "المريض ع", amount: 15, date: "2026-07-10", status: "pending" },
        { id: "w4", type: "subscription", patientLabel: "المريض ن", amount: 25, date: "2026-07-09", status: "completed" },
        { id: "w5", type: "consultation", patientLabel: "المريض ك", amount: 15, date: "2026-07-08", status: "completed" },
        { id: "w6", type: "consultation", patientLabel: "المريض ه", amount: 15, date: "2026-07-08", status: "completed" },
      ],
    },
    month: {
      consultationsCount: 23,
      subscriptionsCount: 8,
      earned: 545,
      transactions: [
        { id: "m1", type: "subscription", patientLabel: "المريض ص", amount: 25, date: "2026-07-11", status: "completed" },
        { id: "m2", type: "consultation", patientLabel: "المريض س", amount: 15, date: "2026-07-12", status: "completed" },
        { id: "m3", type: "subscription", patientLabel: "المريض و", amount: 25, date: "2026-07-05", status: "completed" },
        { id: "m4", type: "consultation", patientLabel: "المريض ط", amount: 15, date: "2026-07-03", status: "completed" },
        { id: "m5", type: "consultation", patientLabel: "المريض ي", amount: 15, date: "2026-07-02", status: "pending" },
        { id: "m6", type: "subscription", patientLabel: "المريض ل", amount: 25, date: "2026-07-01", status: "completed" },
      ],
    },
    all: {
      consultationsCount: 148,
      subscriptionsCount: 41,
      earned: 3675,
      transactions: [
        { id: "a1", type: "subscription", patientLabel: "المريض ص", amount: 25, date: "2026-07-11", status: "completed" },
        { id: "a2", type: "consultation", patientLabel: "المريض س", amount: 15, date: "2026-07-12", status: "completed" },
        { id: "a3", type: "subscription", patientLabel: "المريض ب", amount: 25, date: "2026-06-28", status: "completed" },
        { id: "a4", type: "consultation", patientLabel: "المريض د", amount: 15, date: "2026-06-20", status: "completed" },
        { id: "a5", type: "subscription", patientLabel: "المريض ر", amount: 25, date: "2026-06-14", status: "completed" },
        { id: "a6", type: "consultation", patientLabel: "المريض ز", amount: 15, date: "2026-06-09", status: "completed" },
      ],
    },
  },
  payouts: [
    { id: "p1", amount: 545, date: "2026-07-01", method: "stcpay", status: "completed" },
    { id: "p2", amount: 610, date: "2026-06-01", method: "bank", status: "completed" },
    { id: "p3", amount: 480, date: "2026-05-01", method: "stcpay", status: "completed" },
  ],
};

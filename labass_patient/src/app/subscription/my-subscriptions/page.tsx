"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import s from "./my-subscriptions.module.css";

const bundleConsultationTypeMap: Record<string, string> = {
  "GP Consultations":         "quick",
  "Specialist Consultations": "specialist",
  "Vitamins":                 "vitamins",
  "Obesity Program":          "obesity",
  "Sexual Health":            "sexualHealth",
};

interface MySubscription {
  id: number;
  status: string;
  expiresAt: string;
  remainingConsultations: number;
  bundle: {
    type: string;
    isUnlimited: boolean;
    price: number;
    intervalDays: number;
    whoSubscribes: string;
  };
}

const consultationErrorMessage = (status: number, message: string): string => {
  if (status === 403) {
    if (message.includes("does not have an active")) return "ليس لديك اشتراك نشط";
    if (message.includes("subscription has expired")) return "انتهت صلاحية اشتراكك";
    if (message.includes("No remaining consultations")) return "لقد استنفدت جميع استشاراتك في هذه الباقة";
  }
  return "حدث خطأ، يرجى المحاولة مجدداً";
};

const formatExpiry = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function MySubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<MySubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [startingId, setStartingId] = useState<number | null>(null);
  const [consultationError, setConsultationError] = useState<Record<number, string>>({});

  useEffect(() => {
    const token = localStorage.getItem("labass_token");
    if (!token) { router.push("/login"); return; }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/patient/my-subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const list: MySubscription[] = data.data ?? [];
        setSubscriptions(list.filter((s) => s.status === "Active"));
      })
      .catch(() => setFetchError("تعذّر تحميل الاشتراكات، يرجى المحاولة مجدداً"))
      .finally(() => setLoading(false));
  }, []);

  const handleStartConsultation = async (sub: MySubscription) => {
    const token = localStorage.getItem("labass_token");
    if (!token) { router.push("/login"); return; }

    setStartingId(sub.id);
    setConsultationError((prev) => ({ ...prev, [sub.id]: "" }));

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/patient/consultations/create-from-bundle`,
        {
          bundleType: sub.bundle.type,
          consultationType: bundleConsultationTypeMap[sub.bundle.type],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        const cid = data.data.consultation.id;
        localStorage.setItem(`subscription_consultation_${cid}`, "1");
        router.push(`/completeInfo?consultationId=${cid}`);
      }
    } catch (err: any) {
      const status = err?.response?.status ?? 500;
      const message = err?.response?.data?.message ?? "";
      setConsultationError((prev) => ({
        ...prev,
        [sub.id]: consultationErrorMessage(status, message),
      }));
    } finally {
      setStartingId(null);
    }
  };

  return (
    <div dir="rtl" className={s.page}>
      {/* Nav */}
      <div className={s.nav}>
        <button className={s.back} onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#173404" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className={s.navTitle}>اشتراكاتي</span>
        <div style={{ width: 36 }} />
      </div>

      <div className={s.content}>
        {loading && (
          <div className={s.center}>
            <div className={s.spinner} />
          </div>
        )}

        {!loading && fetchError && (
          <div className={s.center}>
            <p className={s.errorTxt}>{fetchError}</p>
          </div>
        )}

        {!loading && !fetchError && subscriptions.length === 0 && (
          <div className={s.center}>
            <div className={s.emptyIcon}>📋</div>
            <p className={s.emptyTxt}>لا توجد اشتراكات نشطة</p>
            <button className={s.subscribeBtn} onClick={() => router.push("/generalPackage")}>
              اشترك الآن
            </button>
          </div>
        )}

        {!loading && !fetchError && subscriptions.map((sub) => (
          <div key={sub.id} className={s.card}>
            <div className={s.cardHeader}>
              <span className={s.badge}>نشط</span>
              <span className={s.bundleType}>{sub.bundle.type}</span>
            </div>

            <div className={s.cardRow}>
              <span className={s.cardLabel}>صالح حتى</span>
              <span className={s.cardValue}>{formatExpiry(sub.expiresAt)}</span>
            </div>

            <div className={s.cardRow}>
              <span className={s.cardLabel}>الاستشارات</span>
              <span className={s.cardValue}>
                {sub.bundle.isUnlimited ? "غير محدودة" : `${sub.remainingConsultations.toLocaleString("ar-SA")} متبقية`}
              </span>
            </div>

            {consultationError[sub.id] && (
              <p className={s.consultationErr}>{consultationError[sub.id]}</p>
            )}

            {sub.bundle.type in bundleConsultationTypeMap && (
              <button
                className={s.startBtn}
                onClick={() => handleStartConsultation(sub)}
                disabled={startingId === sub.id}
              >
                {startingId === sub.id ? "جاري التحميل..." : "ابدأ استشارة"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

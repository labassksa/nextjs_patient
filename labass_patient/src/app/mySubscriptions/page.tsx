"use client";
import React, { useState, useEffect } from "react";
import BottomNavBar from "../../components/common/BottomNavBar";
import Header from "../../components/common/header";
import { usePathname, useRouter } from "next/navigation";
import { fetchSubscriptions } from "./_controllers/fetchSubscriptions";
import Link from "next/link";
import axios from "axios";

type SubscriptionStatus =
  | "Draft"
  | "Active"
  | "Inactive"
  | "Cancelled"
  | "Expired"
  | "Failed";

interface Bundle {
  type: string;
  name?: string;
  description?: string;
  price?: number;
  consultationCount?: number;
}

interface Subscription {
  id: number;
  bundle: Bundle;
  status: SubscriptionStatus;
  remainingConsultations: number;
  totalConsultations: number;
  price: number;
  currency: string;
  recurringType: string;
  nextBillingDate?: string;
  lastBilledDate?: string;
  cancelledAt?: string;
  expiresAt?: string;
  createdAt: string;
}

const STATUS: Record<
  SubscriptionStatus,
  { ar: string; bg: string; fg: string; dot: string }
> = {
  Active:    { ar: "فعّال",   bg: "#e6f7f0", fg: "#0d7a4e", dot: "#22c55e" },
  Draft:     { ar: "مسودة",   bg: "#f5f5f5", fg: "#555",    dot: "#9ca3af" },
  Inactive:  { ar: "موقوف",   bg: "#fff8e6", fg: "#b35c00", dot: "#f59e0b" },
  Cancelled: { ar: "ملغى",    bg: "#fff0f0", fg: "#b00020", dot: "#ef4444" },
  Expired:   { ar: "منتهي",   bg: "#f5f0ff", fg: "#6d28d9", dot: "#8b5cf6" },
  Failed:    { ar: "فشل",     bg: "#fff0f0", fg: "#b00020", dot: "#ef4444" },
};

const BUNDLE_CONSULTATION_TYPE: Record<string, string> = {
  "GP Consultations": "quick",
};

const fmt = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

/* ── Consultations progress ring ── */
const Ring: React.FC<{ remaining: number; total: number }> = ({
  remaining,
  total,
}) => {
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1" dir="rtl">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e2f3f1" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#14B8A6"
          strokeWidth="6"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
        <text
          x="32"
          y="36"
          textAnchor="middle"
          fill="#0F766E"
          fontSize="14"
          fontWeight="700"
          fontFamily="system-ui"
        >
          {remaining}
        </text>
      </svg>
      <span className="text-xs text-gray-400">
        متبقية من {total}
      </span>
    </div>
  );
};

/* ── Single subscription card ── */
const SubCard: React.FC<{ sub: Subscription }> = ({ sub }) => {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [cardError, setCardError] = useState("");
  const cfg = STATUS[sub.status] ?? STATUS.Draft;
  const isActive = sub.status === "Active";

  const handleStartConsultation = async () => {
    setCardError("");
    setStarting(true);
    try {
      const token = localStorage.getItem("labass_token");
      if (!token) { router.push("/login"); return; }
      const consultationType = BUNDLE_CONSULTATION_TYPE[sub.bundle.type] ?? "quick";
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/patient/consultations/create-from-bundle`,
        { bundleType: sub.bundle.type, consultationType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success && data.data?.consultation?.id) {
        router.push(`/chat/${data.data.consultation.id}`);
      } else {
        setCardError("تعذّر إنشاء الاستشارة، يرجى المحاولة مجدداً");
      }
    } catch (err: any) {
      const msg: string = err.response?.data?.message ?? "";
      if (err.response?.status === 403) {
        setCardError(
          msg.toLowerCase().includes("remaining")
            ? "لا توجد استشارات متبقية في هذه الباقة"
            : "غير مصرح بإنشاء استشارة"
        );
      } else {
        setCardError("تعذّر إنشاء الاستشارة، يرجى المحاولة مجدداً");
      }
    } finally {
      setStarting(false);
    }
  };

  return (
    <div
      className="mx-4 my-3 rounded-2xl overflow-hidden shadow-sm"
      style={{
        border: isActive ? "1.5px solid #14B8A6" : "1.5px solid #e5e7eb",
        background: "#fff",
      }}
      dir="rtl"
    >
      {/* Gradient header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: isActive
            ? "linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)"
            : "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
        }}
      >
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ background: cfg.bg, color: cfg.fg }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: cfg.dot }}
          />
          {cfg.ar}
        </span>
        <div className="text-right">
          <p className="text-white font-extrabold text-base leading-tight">
            {sub.bundle?.type ?? "باقة"}
          </p>
          {sub.bundle?.name && (
            <p className="text-white/70 text-xs">{sub.bundle.name}</p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-4">
          {/* Left: details */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">السعر</span>
              <span className="font-bold text-gray-800">
                {Number(sub.price).toLocaleString("ar-SA")}{" "}
                <span className="font-normal text-gray-500">{sub.currency}</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">دورة الفوترة</span>
              <span className="text-gray-700">{sub.recurringType}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">تاريخ البدء</span>
              <span className="text-gray-700">{fmt(sub.createdAt)}</span>
            </div>

            {sub.nextBillingDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">الدفعة القادمة</span>
                <span className="text-gray-700">{fmt(sub.nextBillingDate)}</span>
              </div>
            )}

            {sub.expiresAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">ينتهي في</span>
                <span className="text-gray-700">{fmt(sub.expiresAt)}</span>
              </div>
            )}

            {sub.cancelledAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">تاريخ الإلغاء</span>
                <span className="text-red-500">{fmt(sub.cancelledAt)}</span>
              </div>
            )}
          </div>

          {/* Right: ring */}
          <Ring
            remaining={sub.remainingConsultations}
            total={sub.totalConsultations}
          />
        </div>

        {/* Error */}
        {cardError && (
          <p className="mt-3 text-xs text-red-500 text-center">{cardError}</p>
        )}

        {/* Start consultation CTA — only for active */}
        {isActive && (
          <button
            onClick={handleStartConsultation}
            disabled={starting}
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)" }}
          >
            {starting ? "جاري التحميل..." : "ابدأ استشارة"}
            {!starting && <span>←</span>}
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Empty state ── */
const EmptyState = () => (
  <div
    className="flex flex-col items-center justify-center mt-16 px-8"
    dir="rtl"
  >
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
      style={{ background: "#e6f7f5" }}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <rect
          x="2" y="7" width="20" height="14" rx="2"
          stroke="#0F766E" strokeWidth="1.5"
        />
        <path
          d="M16 3H8L6 7h12L16 3z"
          stroke="#0F766E" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M12 11v4M10 13h4"
          stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round"
        />
      </svg>
    </div>
    <p className="text-gray-800 font-bold text-lg mb-1">لا يوجد لديك اشتراكات</p>
    <p className="text-gray-400 text-sm text-center mb-6">
      اشترك في إحدى باقاتنا واستمتع بخدمات طبية دائمة
    </p>
    <Link
      href="/generalPackage"
      className="px-6 py-3 rounded-xl text-white text-sm font-bold"
      style={{ background: "linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)" }}
    >
      اكتشف الباقات
    </Link>
  </div>
);

/* ── Page ── */
export default function MySubscriptionsPage() {
  const pathname = usePathname();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscriptions()
      .then(setSubscriptions)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const active = subscriptions.filter((s) => s.status === "Active");
  const others = subscriptions.filter((s) => s.status !== "Active");

  return (
    <div className="min-h-screen bg-gray-50 mb-16">
      <Header title="باقاتي" />

      <div className="pt-16">
        {isLoading ? (
          <div className="flex justify-center mt-16">
            <div
              className="w-10 h-10 rounded-full border-4"
              style={{
                borderColor: "rgba(20,184,166,0.2)",
                borderTopColor: "#14B8A6",
                animation: "spin 0.85s linear infinite",
              }}
            />
            <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center mt-10 text-sm px-6">{error}</p>
        ) : subscriptions.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {active.length > 0 && (
              <div>
                <p
                  className="text-xs font-semibold text-gray-400 px-5 pt-4 pb-1"
                  dir="rtl"
                >
                  الاشتراك الفعّال
                </p>
                {active.map((s) => (
                  <SubCard key={s.id} sub={s} />
                ))}
              </div>
            )}

            {others.length > 0 && (
              <div>
                <p
                  className="text-xs font-semibold text-gray-400 px-5 pt-4 pb-1"
                  dir="rtl"
                >
                  سجل الاشتراكات
                </p>
                {others.map((s) => (
                  <SubCard key={s.id} sub={s} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNavBar currentPath={pathname} />
    </div>
  );
}

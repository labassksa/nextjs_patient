"use client";

import Link from "next/link";

export default function VitaminSubscribeSuccessPage() {
  return (
    <div dir="rtl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "#f9fafb" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#e6f4ea", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>
          ✓
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>تم الاشتراك بنجاح!</h1>
        <p style={{ color: "#555", marginBottom: 24, lineHeight: 1.7 }}>
          شكراً لاشتراكك في برنامج الفيتامينات المخصّصة من لاباس. سيتواصل معك فريقنا خلال ٢٤ ساعة لتحديد موعد زيارة الممرّض.
        </p>
        <Link href="/home" style={{ display: "inline-block", background: "#1D9E75", color: "#fff", padding: "12px 32px", borderRadius: 8, fontWeight: 600, textDecoration: "none" }}>
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

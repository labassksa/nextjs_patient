"use client";
import React from "react";
import Link from "next/link";
import SimpleLoginForm from "./_components/login/form";
import { useRouter } from "next/navigation";
import s from "./login.module.css";

const LoginPage: React.FC = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back(); // Navigate to the previous page
  };

  return (
    <div dir="rtl" className={s.page}>
      <div className={s.shell}>
        {/* ─── TOP BAR ─── */}
        <header className={s.topBar}>
          <Link href="/landing" className={s.brand}>
            <div className={s.mark} />
            <span className={s.bname}>لاباس</span>
          </Link>
          {/* Right-pointing arrow = "back" in RTL */}
          <button onClick={handleBackClick} className={s.backBtn} aria-label="رجوع">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>

        {/* ─── HERO ─── */}
        <section className={s.hero}>
          <div className={s.heroText}>
            <div className={s.eyebrow}>
              <span className={s.eyebrowDot} />
              مرخّصة من وزارة الصحة
            </div>
            <h1 className={s.title}>تسجيل الدخول</h1>
            <p className={s.sub}>أدخل رقم جوالك للمتابعة</p>
          </div>

          <div className={s.pillVisual} aria-hidden="true">
            <div className={s.ring} />
            <div className={s.pillWrap}>
              <div className={s.pill}>
                <span className={s.pillText}>labass</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FORM ─── */}
        <SimpleLoginForm />

        <div className={s.trust}>
          <div className={s.trustItem}><div className={s.trustCheck}>✓</div> طبيب مرخّص</div>
          <div className={s.trustItem}><div className={s.trustCheck}>✓</div> متاح 24/7</div>
          <div className={s.trustItem}><div className={s.trustCheck}>✓</div> بياناتك محمية</div>
        </div>

        <footer className={s.foot}>شركة معالم التطوير · مرخّصة من وزارة الصحة</footer>
      </div>
    </div>
  );
};

export default LoginPage;

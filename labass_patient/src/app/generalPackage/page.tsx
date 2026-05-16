"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import styles from "./generalPackage.module.css";

const monthlyFeatures = [
  "استشارة طبية فورية 24/7 مع طبيب أسرة",
  "إعادة صرف وصفاتك الدائمة",
  "وصفة إلكترونية معتمدة",
  "تواصل مباشر مع الطبيب",
];

const quarterlyFeatures = [
  "استشارة طبية فورية 24/7 مع طبيب أسرة",
  "إعادة صرف وصفاتك الدائمة",
  "وصفة إلكترونية معتمدة",
  "تواصل مباشر مع الطبيب",
  "أولوية في الرد",
];

const plansMeta = [
  {
    id: "monthly",
    name: "شهري",
    cur: "ريال",
    period: "/ شهرياً",
    badge: null,
    features: monthlyFeatures,
    popular: false,
  },
  {
    id: "quarterly",
    name: "كل ٣ أشهر",
    cur: "ريال",
    period: "/ كل ٣ أشهر",
    badge: "وفّر ١٦٪",
    features: quarterlyFeatures,
    popular: true,
  },
];

const howSteps = [
  {
    num: "١",
    title: "سجّل واشترك",
    desc: "أنشئ حسابك واختر الباقة المناسبة خلال دقيقتين.",
    active: true,
  },
  {
    num: "٢",
    title: "ابدأ استشارتك",
    desc: "تواصل مع طبيب أسرة مرخّص فوراً — بدون انتظار وبدون موعد.",
    active: false,
  },
  {
    num: "٣",
    title: "احصل على وصفتك",
    desc: "يصف لك الطبيب الدواء المناسب أو يجدد وصفتك مباشرة.",
    active: false,
  },
];

const faqs = [
  {
    q: "ما الفرق بين هذه الباقة والاستشارة العادية؟",
    a: "الباقة تمنحك وصولاً غير محدود لطبيب أسرة مرخّص على مدار الساعة، مع قدرة إعادة صرف الوصفات الدائمة — بدون دفع لكل استشارة على حدة.",
  },
  {
    q: "هل يمكنني إعادة صرف أي وصفة؟",
    a: "يمكن تجديد معظم الوصفات الدائمة للأمراض المزمنة. يقيّم طبيبك حالتك ويصدر الوصفة إلكترونياً إن كانت مناسبة طبياً.",
  },
  {
    q: "هل يمكنني إلغاء الاشتراك في أي وقت؟",
    a: "نعم، يمكنك إلغاء اشتراكك في أي وقت بدون أي رسوم إضافية أو غرامات.",
  },
  {
    q: "كم يستغرق الرد؟",
    a: "يرد الطبيب في الغالب خلال دقائق. في أوقات الذروة قد يصل الوقت إلى ٣٠ دقيقة.",
  },
];

export default function GeneralConsultationPage() {
  const [selectedPlan, setSelectedPlan] = useState("quarterly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [prices, setPrices] = useState<Record<string, number | null>>({ monthly: null, quarterly: null });

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bundles`)
      .then(({ data }) => {
        const list: any[] = Array.isArray(data) ? data : (data.data ?? []);
        const gp = list.filter((b: any) => b.type === "GP Consultations" && b.whoSubscribes === "individual");
        const monthly   = gp.find((b: any) => b.intervalDays === 30);
        const quarterly = gp.find((b: any) => b.intervalDays === 90);
        setPrices({
          monthly:   monthly   ? Number(monthly.price)   : null,
          quarterly: quarterly ? Number(quarterly.price) : null,
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referralCode = params.get("referralCode");
    if (referralCode) {
      localStorage.setItem("referralCode", referralCode);
    }
  }, []);

  return (
    <div className={styles.app} dir="rtl">
      {/* LICENSE BAR */}
      <div className={styles.licBar}>
        شركة سعودية مرخّصة من وزارة الصحة · ترخيص رقم 1400055938
      </div>

      {/* NAV */}
      <nav className={styles.nav}>
        <Link href="/landing" className={styles.brand}>
          <div className={styles.mark} />
          <span className={styles.bname}>لاباس</span>
        </Link>
        <Link href="/generalPackage/subscribe" className={styles.navCta}>
          اشترك الآن
        </Link>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          {/* TEXT COLUMN */}
          <div>
            <div className={styles.heroEyebrow}>
              <span className={styles.heroEyebrowDot} />
              استشارات طبية على مدار الساعة
            </div>

            <h1 className={styles.heroH1}>
              طبيبك دائماً متاح
            </h1>

            <p className={styles.heroSub}>
              استشارة فورية مع طبيب أسرة مرخّص، إعادة صرف وصفاتك، وتجديد أدويتك — بدون انتظار وبدون عيادة
            </p>

            <ul className={styles.heroBullets}>
              <li>
                <span className={styles.hbCk}>&#10003;</span>
                طبيب أسرة مرخّص يرد خلال دقائق
              </li>
              <li>
                <span className={styles.hbCk}>&#10003;</span>
                وصفاتك تتجدد بسهولة وبدون عناء
              </li>
            </ul>

            <div className={styles.heroBadges}>
              <div className={styles.brandBadge}>
                <div className={styles.bbDot} />
                استشارة فورية
              </div>
              <div className={styles.brandBadge}>
                <div className={styles.bbDot} />
                إعادة صرف
              </div>
              <div className={styles.brandBadge}>
                <div className={styles.bbDot} />
                24/7
              </div>
            </div>

            <div className={styles.heroCtas}>
              <Link href="/generalPackage/subscribe" className={styles.heroBtn}>
                اشترك الآن
                <span className={styles.heroBtnArr}>&larr;</span>
              </Link>
            </div>

            <div className={styles.heroTrust}>
              <div className={styles.heroAva}>
                <div className={`${styles.heroAv} ${styles.heroAv1}`}>م</div>
                <div className={`${styles.heroAv} ${styles.heroAv2}`}>ع</div>
                <div className={`${styles.heroAv} ${styles.heroAv3}`}>س</div>
                <div className={`${styles.heroAv} ${styles.heroAv4}`}>خ</div>
              </div>
              <div className={styles.heroTrustTxt}>
                <strong>+٥٠٠</strong> مريض يستخدمون الخدمة
              </div>
            </div>
          </div>

          {/* VISUAL COLUMN — Labass spinning pill */}
          <div className={styles.heroVisual}>
            {/* Floating ornaments */}
            <div className={styles.heroParticles}>
              <div className={`${styles.heroOrn} ${styles.o1}`}>
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M34.1353 17.6974L37.6206 12.8729L38.3144 17.2133L40.9283 16.7938L39.9279 10.6139L39.5084 8L36.8945 8.41952L30.7146 9.41991L31.1342 12.0338L35.4746 11.34L31.9732 16.1806C27.8909 14.0508 22.7437 15.1803 19.9685 19.0366C16.9027 23.2641 17.8547 29.1696 22.0822 32.2354C26.3097 35.285 32.2152 34.3491 35.281 30.1216C38.0885 26.2007 37.5238 20.9083 34.1353 17.6974ZM23.6473 30.0732C20.5977 27.8627 19.9201 23.6191 22.1145 20.5695C24.325 17.5199 28.5686 16.8422 31.6182 19.0366C34.6678 21.2472 35.3455 25.4908 33.1511 28.5404C30.9405 31.5899 26.6808 32.2676 23.6473 30.0732Z" fill="#173404" />
                </svg>
              </div>
              <div className={`${styles.heroOrn} ${styles.o2}`}>
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28.5202 20.6989C27.0519 15.697 21.7917 12.8249 16.7897 14.2932C11.7878 15.7615 8.91567 21.0216 10.384 26.0236C11.7232 30.6061 16.225 33.3813 20.8236 32.7198L21.8724 36.2857L19.1939 37.0763L19.9362 39.6096L22.6146 38.819L23.2923 41.1102L25.8256 40.368L25.1479 38.0767L28.0361 37.2377L27.2939 34.7044L24.4057 35.5435L23.3569 31.9776C27.5843 30.0575 29.8756 25.2814 28.5202 20.6989ZM12.9334 25.2814C11.8685 21.667 13.9499 17.8914 17.5481 16.8264C21.1624 15.7615 24.9381 17.8268 25.9869 21.4412C27.0519 25.0555 24.9865 28.8312 21.3722 29.8961C17.774 30.961 13.9822 28.8957 12.9334 25.2814Z" fill="#173404" />
                </svg>
              </div>
              <div className={`${styles.heroOrn} ${styles.o3}`}>
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M34.1353 17.6974L37.6206 12.8729L38.3144 17.2133L40.9283 16.7938L39.9279 10.6139L39.5084 8L36.8945 8.41952L30.7146 9.41991L31.1342 12.0338L35.4746 11.34L31.9732 16.1806C27.8909 14.0508 22.7437 15.1803 19.9685 19.0366C16.9027 23.2641 17.8547 29.1696 22.0822 32.2354C26.3097 35.285 32.2152 34.3491 35.281 30.1216C38.0885 26.2007 37.5238 20.9083 34.1353 17.6974ZM23.6473 30.0732C20.5977 27.8627 19.9201 23.6191 22.1145 20.5695C24.325 17.5199 28.5686 16.8422 31.6182 19.0366C34.6678 21.2472 35.3455 25.4908 33.1511 28.5404C30.9405 31.5899 26.6808 32.2676 23.6473 30.0732Z" fill="#173404" opacity="0.7" />
                </svg>
              </div>
              <div className={`${styles.heroOrn} ${styles.o4}`}>
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28.5202 20.6989C27.0519 15.697 21.7917 12.8249 16.7897 14.2932C11.7878 15.7615 8.91567 21.0216 10.384 26.0236C11.7232 30.6061 16.225 33.3813 20.8236 32.7198L21.8724 36.2857L19.1939 37.0763L19.9362 39.6096L22.6146 38.819L23.2923 41.1102L25.8256 40.368L25.1479 38.0767L28.0361 37.2377L27.2939 34.7044L24.4057 35.5435L23.3569 31.9776C27.5843 30.0575 29.8756 25.2814 28.5202 20.6989ZM12.9334 25.2814C11.8685 21.667 13.9499 17.8914 17.5481 16.8264C21.1624 15.7615 24.9381 17.8268 25.9869 21.4412C27.0519 25.0555 24.9865 28.8312 21.3722 29.8961C17.774 30.961 13.9822 28.8957 12.9334 25.2814Z" fill="#173404" opacity="0.7" />
                </svg>
              </div>
            </div>

            {/* Spinning Labass pill */}
            <div className={`${styles.pillWrap} ${styles.blister}`}>
              <svg viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="gc-body" cx="0.42" cy="0.35" r="0.7">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="0.55" stopColor="#f2ede5" />
                    <stop offset="0.9" stopColor="#d4ccbd" />
                    <stop offset="1" stopColor="#b0a695" />
                  </radialGradient>
                  <filter id="gc-grain" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves={2} seed="11" stitchTiles="stitch" result="fine" />
                    <feColorMatrix in="fine" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 -0.2" result="fineMask" />
                    <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves={2} seed="4" result="medium" />
                    <feColorMatrix in="medium" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.32 -0.16" result="mediumMask" />
                    <feComposite in="fineMask" in2="mediumMask" operator="arithmetic" k1="0" k2="1" k3="0.8" k4="0" result="combined" />
                    <feComposite in="combined" in2="SourceGraphic" operator="in" />
                  </filter>
                  <filter id="gc-mottle" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves={3} seed="7" result="blotch" />
                    <feColorMatrix in="blotch" values="0 0 0 0 0.55  0 0 0 0 0.52  0 0 0 0 0.48  0 0 0 0.25 -0.05" result="tinted" />
                    <feComposite in="tinted" in2="SourceGraphic" operator="in" />
                  </filter>
                  <filter id="gc-atoms-dark" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves={1} seed="47" result="noise" />
                    <feColorMatrix in="noise" values="0 0 0 0 0.09  0 0 0 0 0.205  0 0 0 0 0.015  0 0 0 2.4 -1.15" result="thresh" />
                    <feComposite in="thresh" in2="SourceGraphic" operator="in" />
                  </filter>
                  <filter id="gc-atoms-bright" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="2.9" numOctaves={1} seed="89" result="noise" />
                    <feColorMatrix in="noise" values="0 0 0 0 0.302  0 0 0 0 0.647  0 0 0 0 0.078  0 0 0 2.4 -1.2" result="thresh" />
                    <feComposite in="thresh" in2="SourceGraphic" operator="in" />
                  </filter>
                  <filter id="gc-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                    <feOffset in="blur" dx="2" dy="3" result="offset" />
                    <feComposite in="offset" in2="SourceAlpha" operator="out" result="innerCut" />
                    <feGaussianBlur in="innerCut" stdDeviation="1.5" result="softInner" />
                    <feFlood floodColor="#6b6050" floodOpacity="0.55" result="col" />
                    <feComposite in="col" in2="softInner" operator="in" result="finalShadow" />
                    <feComposite in="finalShadow" in2="SourceGraphic" operator="in" />
                  </filter>
                </defs>

                <circle cx="180" cy="180" r="140" fill="url(#gc-body)" />
                <circle cx="180" cy="180" r="140" fill="#f2ede5" filter="url(#gc-mottle)" opacity="0.55" />
                <circle cx="180" cy="180" r="140" fill="#f2ede5" filter="url(#gc-grain)" opacity="0.8" />
                <circle cx="180" cy="180" r="140" fill="#173404" filter="url(#gc-atoms-dark)" opacity="0.9" />
                <circle cx="180" cy="180" r="140" fill="#4DA514" filter="url(#gc-atoms-bright)" opacity="0.75" />

                <text x="185" y="200" fill="#000000" fontFamily="Tajawal, system-ui, sans-serif" fontSize="64" fontWeight="800" textAnchor="middle" letterSpacing="-1.5" opacity="0.09">لاباس</text>
                <text x="185" y="200" fontFamily="Tajawal, system-ui, sans-serif" fontSize="64" fontWeight="800" textAnchor="middle" letterSpacing="-1.5" filter="url(#gc-inner-shadow)">لاباس</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.how} id="how">
        <div className={styles.secEyebrow}>
          <span className={styles.secEyebrowDot} />
          بسيط وسريع
        </div>
        <h2 className={styles.secTtl}>كيف تعمل الخدمة؟</h2>
        <p className={styles.secSub}>ثلاث خطوات بسيطة للوصول إلى طبيبك</p>
        <div className={styles.howSteps}>
          {howSteps.map((step) => (
            <div
              key={step.num}
              className={`${styles.howStep} ${step.active ? styles.howStepActive : ""}`}
            >
              <div className={styles.howStepNum}>{step.num}</div>
              <h3 className={styles.howStepTtl}>{step.title}</h3>
              <p className={styles.howStepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLANS */}
      <section className={styles.plansSec} id="plans">
        <div className={styles.secEyebrow}>
          <span className={styles.secEyebrowDot} />
          باقات الاشتراك
        </div>
        <h2 className={styles.secTtl}>اختر باقتك</h2>
        <p className={styles.secSub}>استشارة طبية 24/7 مع طبيب أسرة مرخّص — ابدأ اليوم</p>

        <div className={styles.plansRow}>
          {plansMeta.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const price = prices[plan.id];
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`${styles.planCard} ${plan.popular ? styles.popular : ""} ${isSelected ? styles.planCardSelected : ""}`}
              >
                {plan.popular && (
                  <span className={styles.planPopBadge}>الأوفر</span>
                )}
                {plan.badge && !plan.popular && (
                  <span className={styles.planSaveBadge}>{plan.badge}</span>
                )}

                <div className={styles.planRadio} />

                <p className={styles.planName}>{plan.name}</p>
                <div className={styles.planPrice}>
                  <span className={styles.planNum}>
                    {price !== null ? price.toLocaleString("ar-SA") : "—"}
                  </span>
                  <span className={styles.planCur}>{plan.cur}</span>
                </div>
                <p className={styles.planPeriod}>{plan.period}</p>

                <ul className={styles.planFeats}>
                  {plan.features.map((feat, i) => (
                    <li key={i} className={styles.planFeat}>
                      <span className={styles.planCk}>&#10003;</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/generalPackage/subscribe"
                  className={styles.planCta}
                  onClick={(e) => e.stopPropagation()}
                >
                  اشترك الآن
                  <span className={styles.planCtaArr}>&larr;</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq} id="faq">
        <div className={styles.secEyebrow}>
          <span className={styles.secEyebrowDot} />
          الأسئلة الشائعة
        </div>
        <h2 className={styles.secTtl}>أسئلة شائعة</h2>

        <div className={styles.faqList}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`${styles.faqItem} ${openFaq === i ? styles.faqItemOpen : ""}`}
            >
              <button
                className={styles.faqQ}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <span className={styles.faqIcon}>+</span>
              </button>
              <div className={styles.faqA}>
                <div className={styles.faqAInner}>{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaWrap}>
          <div className={styles.ctaEyebrow}>
            <span className={styles.ctaEyebrowDot} />
            ابدأ اليوم
          </div>
          <h2 className={styles.ctaTtl}>طبيبك دائماً متاح</h2>
          <p className={styles.ctaSub}>
            اشترك الآن واحصل على استشارة فورية مع طبيب أسرة مرخّص
          </p>
          <Link href="/generalPackage/subscribe" className={styles.ctaBtn}>
            اشترك الآن
            <span className={styles.ctaBtnArr}>&larr;</span>
          </Link>
          <p className={styles.ctaFoot}>بدون عقود · إلغاء في أي وقت</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.foot}>
        <div className={styles.footBrand}>
          <div className={styles.mark} style={{ width: 24, height: 24 }} />
          لاباس — رعاية صحية ذكية
        </div>
        <div className={styles.footLinks}>
          <span>سياسة الخصوصية</span>
          <span>الشروط والأحكام</span>
        </div>
        <p className={styles.footCopy}>© ٢٠٢٥ لاباس. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import s from "./obesity.module.css";

export default function ObesityProgram() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "quarterly">("quarterly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showFdaPopup, setShowFdaPopup] = useState(false);

  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const planFeatures = [
    "تقييم طبّي شامل (٢٦ سؤالاً)",
    "أدوية طبّية بوصفة طبّية",
    "فحص دم من مختبر معتمد بأعلى معايير الجودة",
    "خطّة غذائية ورياضية مخصّصة",
    "استشر الطبيب 24/7",
    "توصيل مجاني",
  ];

  const faqItems = [
    {
      q: "ما الفرق بين لاباس وبرامج الحمية الأخرى؟",
      a: "برامج الحمية التقليدية تعتمد على قوائم طعام عامّة. لاباس يبدأ بتحاليل دم شاملة، يقرأها طبيب مختصّ، ويصمّم خطّة تعالج السبب الحقيقي للوزن الزائد.",
    },
    {
      q: "كيف يمكنني استشارة طبيبي؟",
      a: "عبر محادثة مباشرة في التطبيق أو مكالمة فيديو، بدون حجز مسبق. يرد طبيبك خلال ساعات العمل، وللحالات العاجلة يوجد فريق دعم على مدار الساعة.",
    },
    {
      q: "كم المدة المتوقّعة لرؤية نتائج؟",
      a: "أغلب مشتركينا يلاحظون تغيّراً واضحاً خلال أوّل ٤ أسابيع. النتائج المستدامة تحتاج عادةً ٣ إلى ٦ أشهر من المتابعة.",
    },
    {
      q: "هل يمكنني إلغاء اشتراكي متى أشاء؟",
      a: "نعم، يمكنك إلغاء اشتراكك في أي وقت بدون أي التزام. ضمان استرداد كامل خلال أول ٧ أيام.",
    },
  ];

  return (
    <div dir="rtl" className={s.app}>
      {/* ─── LICENSE TAG ─── */}
      <div style={{ background: "#f2faed", borderBottom: "0.5px solid rgba(23,52,4,0.08)", padding: "8px 48px", textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#27500A", letterSpacing: "0.2px" }}>
        شركة سعودية مرخّصة من وزارة الصحة &middot; ترخيص رقم 1400055938
      </div>

      {/* ─── NAV ─── */}
      <nav className={s.nav}>
        <Link href="/" className={s.brand}>
          <div className={s.mark} />
          <span className={s.bname}>لاباس</span>
        </Link>
        <Link href="/obesityProgram/subscribe" className={s.navCta}>
          اشترك
        </Link>
      </nav>

      {/* ─── HERO ─── */}
      <section className={s.hero}>
        <div className={s.heroGrid}>
          {/* TEXT COLUMN */}
          <div>
            <div className={s.heroEyebrow}>
              <span className={s.heroEyebrowDot} />
              برنامج علاج السمنة بإشراف طبّي
            </div>

            <h1 className={s.heroH1}>
              اخسر وزنك <span className={s.dim}>بإشراف طبّي</span>
              <br />
              مع <span className={s.glp}>مونجارو و اوزمبيك</span>
            </h1>

            <p className={s.heroLead}>
              تحاليل شاملة، أدوية موصوفة، ومتابعة مستمرّة من طبيبك — كلّها في
              مكان واحد.
            </p>

            <p className={s.heroSub}>
              أطباؤنا يصفون لك الدواء المناسب بناءً على تحاليلك وتقييمك الطبّي.
              الأدوية تشمل Ozempic و Mounjaro وغيرها — حسب ما يناسب حالتك.
            </p>

            <div className={s.heroBadges}>
              <span className={`${s.brandBadge} ${s.bbOz}`}>
                <span className={s.bbDot} />
                <span className={s.bbLat}>Ozempic</span>
                <span>سيماغلوتايد</span>
              </span>
              <span className={`${s.brandBadge} ${s.bbMj}`}>
                <span className={s.bbDot} />
                <span className={s.bbLat}>Mounjaro</span>
                <span>تيرزيباتايد</span>
              </span>
            </div>

            <div className={s.heroCtas}>
              <Link href="/obesityProgram/subscribe" className={s.heroBtn}>
                اشترك الآن
                <span className={s.heroBtnArr}>&larr;</span>
              </Link>
              <Link href="#how" className={s.heroBtnGhost}>
                كيف يعمل البرنامج؟
              </Link>
            </div>

            <div className={s.heroTrust}>
              <div className={s.heroAva}>
                <div className={`${s.heroAv} ${s.heroAv1}`}>ع</div>
                <div className={`${s.heroAv} ${s.heroAv2}`}>ر</div>
                <div className={`${s.heroAv} ${s.heroAv3}`}>م</div>
                <div className={`${s.heroAv} ${s.heroAv4}`}>+</div>
              </div>
              <span className={s.heroTrustTxt}>
                أكثر من <strong>٢٬٠٠٠</strong> مشترك يثقون بلاباس
              </span>
            </div>
          </div>

          {/* VISUAL COLUMN */}
          <div className={s.heroVisual}>
            <div className={s.hvRing} />
            <div className={s.hvRing2} />

            {/* Ozempic Pen */}
            <div className={`${s.penWrap} ${s.penOz}`}>
              <svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="oz-body" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#b5cfe8" />
                    <stop offset="0.15" stopColor="#d9e8f5" />
                    <stop offset="0.45" stopColor="#ecf3fa" />
                    <stop offset="0.55" stopColor="#ecf3fa" />
                    <stop offset="0.85" stopColor="#9fbbd9" />
                    <stop offset="1" stopColor="#6a8eb5" />
                  </linearGradient>
                  <linearGradient id="oz-cap" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#1a3c6e" />
                    <stop offset="0.3" stopColor="#2e5fa3" />
                    <stop offset="0.55" stopColor="#4a80c7" />
                    <stop offset="0.8" stopColor="#2a558f" />
                    <stop offset="1" stopColor="#0f2750" />
                  </linearGradient>
                  <linearGradient id="oz-dial" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#2a558f" />
                    <stop offset="0.5" stopColor="#4a80c7" />
                    <stop offset="1" stopColor="#1a3c6e" />
                  </linearGradient>
                </defs>
                <rect x="58" y="10" width="84" height="118" rx="16" fill="url(#oz-cap)" />
                <rect x="58" y="10" width="84" height="12" rx="16" fill="#0a1828" opacity="0.3" />
                <rect x="62" y="18" width="12" height="100" rx="6" fill="#ffffff" opacity="0.22" />
                <rect x="128" y="22" width="6" height="96" rx="3" fill="#0a1828" opacity="0.4" />
                <rect x="56" y="125" width="88" height="10" rx="4" fill="#0f2750" />
                <rect x="56" y="125" width="88" height="3" fill="#0a1828" opacity="0.5" />
                <rect x="52" y="132" width="96" height="230" rx="14" fill="url(#oz-body)" stroke="#6a8eb5" strokeWidth="0.5" />
                <rect x="58" y="140" width="10" height="214" rx="5" fill="#ffffff" opacity="0.6" />
                <rect x="72" y="140" width="4" height="214" rx="2" fill="#ffffff" opacity="0.3" />
                <rect x="138" y="148" width="6" height="200" rx="3" fill="#1a3c6e" opacity="0.3" />
                <rect x="66" y="236" width="68" height="40" rx="3" fill="#ffffff" opacity="0.95" />
                <text x="100" y="253" fill="#0c447c" fontFamily="Inter, system-ui" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="-0.3">Ozempic</text>
                <text x="100" y="263" fill="#6a8eb5" fontFamily="Inter, system-ui" fontSize="5" fontWeight="500" textAnchor="middle" letterSpacing="0.4">SEMAGLUTIDE</text>
                <rect x="56" y="360" width="88" height="36" rx="4" fill="url(#oz-dial)" stroke="#0f2750" strokeWidth="0.5" />
                <rect x="88" y="396" width="24" height="8" rx="2" fill="#8aa8c8" />
                <rect x="94" y="402" width="12" height="12" fill="#0f2750" />
              </svg>
            </div>

            {/* Mounjaro Pen */}
            <div className={`${s.penWrap} ${s.penMj}`}>
              <svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="mj-body" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#f0d4b8" />
                    <stop offset="0.15" stopColor="#f9e6d2" />
                    <stop offset="0.45" stopColor="#fdefe0" />
                    <stop offset="0.55" stopColor="#fdefe0" />
                    <stop offset="0.85" stopColor="#e5c3a4" />
                    <stop offset="1" stopColor="#c99872" />
                  </linearGradient>
                  <linearGradient id="mj-cap" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#8a5534" />
                    <stop offset="0.3" stopColor="#b87648" />
                    <stop offset="0.55" stopColor="#d48f62" />
                    <stop offset="0.8" stopColor="#a56538" />
                    <stop offset="1" stopColor="#6e3f20" />
                  </linearGradient>
                  <linearGradient id="mj-dial" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#a56538" />
                    <stop offset="0.5" stopColor="#d48f62" />
                    <stop offset="1" stopColor="#7a4a2a" />
                  </linearGradient>
                </defs>
                <rect x="58" y="10" width="84" height="118" rx="16" fill="url(#mj-cap)" />
                <rect x="58" y="10" width="84" height="12" rx="16" fill="#3a2010" opacity="0.3" />
                <rect x="62" y="18" width="12" height="100" rx="6" fill="#ffffff" opacity="0.25" />
                <rect x="128" y="22" width="6" height="96" rx="3" fill="#3a2010" opacity="0.35" />
                <rect x="56" y="125" width="88" height="10" rx="4" fill="#6e3f20" />
                <rect x="56" y="125" width="88" height="3" fill="#3a2010" opacity="0.5" />
                <rect x="52" y="132" width="96" height="230" rx="14" fill="url(#mj-body)" stroke="#a68560" strokeWidth="0.5" />
                <rect x="58" y="140" width="10" height="214" rx="5" fill="#ffffff" opacity="0.55" />
                <rect x="72" y="140" width="4" height="214" rx="2" fill="#ffffff" opacity="0.25" />
                <rect x="138" y="148" width="6" height="200" rx="3" fill="#8a5534" opacity="0.28" />
                <rect x="66" y="236" width="68" height="40" rx="3" fill="#ffffff" opacity="0.92" />
                <text x="100" y="253" fill="#7a3e1a" fontFamily="Inter, system-ui" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="-0.3">Mounjaro</text>
                <text x="100" y="263" fill="#c99872" fontFamily="Inter, system-ui" fontSize="5" fontWeight="500" textAnchor="middle" letterSpacing="0.4">TIRZEPATIDE</text>
                <rect x="56" y="360" width="88" height="36" rx="4" fill="url(#mj-dial)" stroke="#6e3f20" strokeWidth="0.5" />
                <rect x="88" y="396" width="24" height="8" rx="2" fill="#9a7050" />
                <rect x="94" y="402" width="12" height="12" fill="#6e3f20" />
              </svg>
            </div>

            <div className={s.penShadow} />

            {/* Floating Chips */}
            <div className={`${s.hvChip} ${s.chipFda}`} onClick={() => setShowFdaPopup(true)} style={{ cursor: "pointer" }}>
              <div className={s.hvChipIc}>FDA</div>
              <div>
                <div className={s.hvChipLbl}>الحالة</div>
                <div className={s.hvChipVal}>معتمد من FDA للسمنة</div>
              </div>
            </div>

            <div className={`${s.hvChip} ${s.chipWeekly}`}>
              <div className={s.hvChipIc}>&#9201;</div>
              <div>
                <div className={s.hvChipLbl}>الجرعة</div>
                <div className={s.hvChipVal}>
                  مرة<sub>/أسبوعياً</sub>
                </div>
              </div>
            </div>

            <div className={`${s.hvChip} ${s.chipDoctor}`}>
              <div className={s.hvChipIc}>&#9877;</div>
              <div>
                <div className={s.hvChipLbl}>الإشراف</div>
                <div className={s.hvChipVal}>طبيب مختصّ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AVAILABILITY STRIP ─── */}
      <div className={s.avail}>
        <span className={s.availTtl}>الأدوية المتوفّرة حالياً</span>
        <div className={s.availBrands}>
          <div className={s.availBrand}>
            <div className={`${s.availBrandMark} ${s.abOz}`}>Oz</div>
            <div>
              <div className={s.availBrandNm}>Ozempic</div>
              <div className={s.availBrandSub}>سيماغلوتايد — Semaglutide</div>
            </div>
          </div>
          <div className={s.availBrand}>
            <div className={`${s.availBrandMark} ${s.abMj}`}>Mj</div>
            <div>
              <div className={s.availBrandNm}>Mounjaro</div>
              <div className={s.availBrandSub}>تيرزيباتايد — Tirzepatide</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── TRADEMARK BAR ─── */}
      <div className={s.tmBar}>
        <strong>Ozempic</strong> علامة تجارية مسجّلة لشركة Novo Nordisk &bull;{" "}
        <strong>Mounjaro</strong> علامة تجارية مسجّلة لشركة Eli Lilly. لاباس ليست
        تابعة لأيّ من هذه الشركات.
      </div>

      {/* ─── STATS STRIP ─── */}
      <section className={s.strip}>
        <div className={s.stripHead}>
          <h2 className={s.stripTtl}>
            السمنة في المملكة العربية السعودية — أرقام تستحقّ الانتباه
          </h2>
          <span className={s.stripSrc}>
            المصدر: منظمة الصحة العالمية ووزارة الصحة السعودية
          </span>
        </div>
        <div className={s.stripGrid}>
          <div className={s.stripStat}>
            <div className={s.stripNum}>
              ٧٠<sup>%</sup>
            </div>
            <div className={s.stripDesc}>
              من البالغين يعانون من زيادة الوزن أو السمنة
            </div>
          </div>
          <div className={s.stripStat}>
            <div className={s.stripNum}>
              ٤٠<sup>%</sup>
            </div>
            <div className={s.stripDesc}>
              نسبة السمنة المفرطة بين النساء البالغات
            </div>
          </div>
          <div className={s.stripStat}>
            <div className={s.stripNum}>#٣</div>
            <div className={s.stripDesc}>
              المملكة ضمن أعلى ثلاث دو�� خليجية في معدّلات السمنة
            </div>
          </div>
          <div className={s.stripStat}>
            <div className={s.stripNum}>
              ١٩<sup>%</sup>
            </div>
            <div className={s.stripDesc}>
              من المراهقين مصابون بالسمنة — الجيل القادم في خطر
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className={s.how}>
        <div className={s.secEyebrow}>
          <span className={s.secEyebrowDot} />
          كيف يعمل البرنامج
        </div>
        <h2 className={s.secTtl}>٤ خطوات نحو وزن صحّي</h2>
        <p className={s.secSub}>
          من التقييم الطبّي إلى وصول الدواء لبابك — كلّها تتم أونلاين بإشراف
          طبيبك المختصّ.
        </p>

        <div className={s.howSteps}>
          <div className={`${s.howStep} ${s.howStepActive}`}>
            <div className={s.howStepNum}>١</div>
            <h3 className={s.howStepTtl}>سجّل وأجب على التقييم</h3>
            <p className={s.howStepDesc}>
              أنشئ حسابك وأجب على ٢٦ سؤالاً طبّياً يغطّي تاريخك الصحّي ونمط
              حياتك.
            </p>
          </div>
          <div className={s.howStep}>
            <div className={s.howStepNum}>٢</div>
            <h3 className={s.howStepTtl}>تحاليل دم منزلية</h3>
            <p className={s.howStepDesc}>
              فريقنا يزورك في المنزل لسحب عيّنة الدم — من مختبر طبّي معتمد بجودة عالية. النتائج خلال ٤٨ ساعة.
            </p>
          </div>
          <div className={s.howStep}>
            <div className={s.howStepNum}>٣</div>
            <h3 className={s.howStepTtl}>خطّة طبّية مخصّصة</h3>
            <p className={s.howStepDesc}>
              طبيبك يراجع نتائجك ويصف لك الدواء والجرعة المناسبة تماماً لحالتك.
            </p>
          </div>
          <div className={s.howStep}>
            <div className={s.howStepNum}>٤</div>
            <h3 className={s.howStepTtl}>متابعة مستمرّة</h3>
            <p className={s.howStepDesc}>
              تواصل مع طبيبك في أي وقت، تتبّع تقدّمك، وعدّل خطّتك حسب النتائج.
            </p>
          </div>
        </div>
      </section>

      {/* ─── PILLARS ─── */}
      <section className={s.pillars}>
        <div className={s.secEyebrow}>
          <span className={s.secEyebrowDot} />
          ماذا يشمل البرنامج
        </div>
        <h2 className={s.secTtl}>٦ ركائز لنتائج حقيقية</h2>
        <p className={s.secSub}>
          برنامج متكامل يجمع بين الطبّ والتغذية والدعم النفسي — كلّها تحت إشراف
          طبيبك.
        </p>

        <div className={s.pillarsGrid}>
          {/* 1 - تحاليل طبّية شاملة */}
          <div className={s.pillar}>
            <div className={s.pillarIc} style={{ background: "#FAEEDA" }}>
              <svg viewBox="0 0 28 28" fill="none">
                <path
                  d="M14 3 L22 8 L22 18 Q22 23 14 25 Q6 23 6 18 L6 8 Z"
                  stroke="#BA7517"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 14 L13 17 L18 11"
                  stroke="#BA7517"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className={s.pillarTtl}>تحاليل طبّية شاملة</h3>
            <p className={s.pillarDesc}>
              تحاليل دم منزلية من مختبر طبّي معتمد بجودة عالية — تشمل الغدة الدرقية، السكّر التراكمي، الدهون، والفيتامينات. تُقرأ من طبيب مختصّ.
            </p>
          </div>

          {/* 2 - خطّة غذائية ذكية */}
          <div className={s.pillar}>
            <div className={s.pillarIc} style={{ background: "#E1F5EE" }}>
              <svg viewBox="0 0 28 28" fill="none">
                <rect
                  x="4"
                  y="6"
                  width="20"
                  height="16"
                  rx="2"
                  stroke="#0F6E56"
                  strokeWidth="1.8"
                />
                <path
                  d="M9 12 L13 16 L19 10"
                  stroke="#0F6E56"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M4 10 L24 10" stroke="#0F6E56" strokeWidth="1" opacity="0.4" />
              </svg>
            </div>
            <h3 className={s.pillarTtl}>تقييم شامل</h3>
            <p className={s.pillarDesc}>
              ٢٦ سؤالاً طبّياً يغطّي تاريخك الصحّي، أدويتك الحالية، ونمط حياتك — لبناء صورة كاملة.
            </p>
          </div>

          {/* 3 - استشر الطبيب 24/7 */}
          <div className={s.pillar}>
            <div className={s.pillarIc} style={{ background: "#FCEBEB" }}>
              <svg viewBox="0 0 28 28" fill="none">
                <path
                  d="M6 9 L16 9 Q22 9 22 15 L22 17 L16 20 L6 20 Q4 20 4 18 L4 11 Q4 9 6 9 Z"
                  stroke="#A32D2D"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 14 L26 12 L26 20 L22 18"
                  stroke="#A32D2D"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="9" cy="14" r="1" fill="#A32D2D" />
                <circle cx="13" cy="14" r="1" fill="#A32D2D" />
                <circle cx="17" cy="14" r="1" fill="#A32D2D" />
              </svg>
            </div>
            <h3 className={s.pillarTtl}>استشر الطبيب 24/7</h3>
            <p className={s.pillarDesc}>
              محادثة مباشرة أو مكالمة فيديو مع طبيبك — بدون حجز مسبق، بدون انتظار.
            </p>
          </div>

          {/* 4 - ادوية طبية */}
          <div className={s.pillar}>
            <div className={s.pillarIc} style={{ background: "#EEEDFE" }}>
              <svg viewBox="0 0 28 28" fill="none">
                <path
                  d="M14 4 L4 10 L14 16 L24 10 Z"
                  stroke="#534AB7"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 18 L14 24 L24 18"
                  stroke="#534AB7"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 14 L14 20 L24 14"
                  stroke="#534AB7"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className={s.pillarTtl}>ادوية طبية</h3>
            <p className={s.pillarDesc}>
              أدوية يصفها طبيبك بناءً على تقييمك الطبّي وتحاليلك — موصوفة بشكل
              شخصي وليست عامّة.
            </p>
          </div>

          {/* 5 - متابعة التقدّم */}
          <div className={s.pillar}>
            <div className={s.pillarIc} style={{ background: "#FAECE7" }}>
              <svg viewBox="0 0 28 28" fill="none">
                <path
                  d="M6 20 L10 14 L14 16 L18 10 L22 12"
                  stroke="#993C1D"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="22" cy="12" r="2" fill="#993C1D" />
                <circle cx="6" cy="20" r="2" fill="#993C1D" opacity="0.4" />
              </svg>
            </div>
            <h3 className={s.pillarTtl}>متابعة التقدّم</h3>
            <p className={s.pillarDesc}>
              تتبّع وزنك، قياساتك، ونتائج تحاليلك — كلّها في مكان واحد مع تقارير دوريّة.
            </p>
          </div>

          {/* 6 - دعم نفسي وسلوكي */}
          <div className={s.pillar}>
            <div className={s.pillarIc} style={{ background: "#FBEAF0" }}>
              <svg viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="10" stroke="#993556" strokeWidth="1.8" />
                <path
                  d="M14 8 Q9 10 9 14 Q9 18 14 18 Q19 18 19 14"
                  stroke="#993556"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="14" cy="14" r="2" fill="#993556" />
              </svg>
            </div>
            <h3 className={s.pillarTtl}>دعم نفسي وسلوكي</h3>
            <p className={s.pillarDesc}>
              إرشاد سلوكي يساعدك على بناء عادات صحّية مستدامة — لأن الوزن ليس فقط أرقام.
            </p>
          </div>
        </div>
      </section>

      {/* ─── PLANS ─── */}
      <section className={s.plansSec}>
        <div className={s.secEyebrow}>
          <span className={s.secEyebrowDot} />
          الباقات والأسعار
        </div>
        <h2 className={s.secTtl}>اختر الباقة المناسبة لك</h2>
        <p className={s.secSub}>
          جميع الباقات تشمل التقييم الطبّي، الأدوية، التحاليل، والمتابعة — الفرق
          فقط في المدّة والتوفير.
        </p>

        <div className={s.plansRow}>
          {/* Monthly */}
          <div
            className={`${s.planCard} ${selectedPlan === "monthly" ? s.planCardSelected : ""}`}
            onClick={() => setSelectedPlan("monthly")}
          >
            <div className={s.planRadio} />
            <p className={s.planName}>الباقة الشهرية</p>
            <div className={s.planPrice}>
              <span className={s.planNum}>٣٩٩</span>
              <span className={s.planCur}>ريال / شهرياً</span>
            </div>
            <p className={s.planPeriod}>
              يُجدّد تلقائياً كل شهر &middot; إلغِ متى شئت
            </p>
            <ul className={s.planFeats}>
              {planFeatures.map((f, i) => (
                <li key={i} className={s.planFeat}>
                  <span className={s.planCk}>&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/obesityProgram/subscribe" className={s.planCta}>
              ابدأ الآن
              <span className={s.planCtaArr}>&larr;</span>
            </Link>
          </div>

          {/* Quarterly */}
          <div
            className={`${s.planCard} ${s.planCardPopular} ${selectedPlan === "quarterly" ? s.planCardSelected : ""}`}
            onClick={() => setSelectedPlan("quarterly")}
          >
            <div className={s.planRadio} />
            <span className={s.planPopBadge}>الأكثر طلباً &middot; وفّر ١٥٪</span>
            <p className={s.planName}>باقة ٣ أشهر</p>
            <div className={s.planPrice}>
              <span className={s.planNum}>١٬٠١٧</span>
              <span className={s.planCur}>ريال / كل ٣ أشهر</span>
            </div>
            <p className={s.planPeriod}>
              ~٣٣٩ ريال شهرياً &middot; توفّر ١٨٠ ريال
            </p>
            <ul className={s.planFeats}>
              {planFeatures.map((f, i) => (
                <li key={i} className={s.planFeat}>
                  <span className={s.planCk}>&#10003;</span>
                  {f}
                </li>
              ))}
              <li className={s.planFeat}>
                <span className={s.planCk}>&#10003;</span>
                إعادة تحليل بعد ٩٠ يوماً — من مختبر معتمد
              </li>
            </ul>
            <Link href="/obesityProgram/subscribe" className={s.planCta}>
              ابدأ الآن
              <span className={s.planCtaArr}>&larr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className={s.test}>
        <div className={s.secEyebrow}>
          <span className={s.secEyebrowDot} />
          قصص نجاح
        </div>
        <h2 className={s.secTtl}>نتائج حقيقية من مشتركين حقيقيين</h2>
        <p className={s.secSub}>
          أرقام فعلية من مشتركات في البرنامج — الأسماء مستعارة لحماية الخصوصية.
        </p>

        <div className={s.testGrid}>
          {/* Card 1 */}
          <div className={s.testCard}>
            <div className={s.testHead}>
              <div className={`${s.testAv} ${s.testAv1}`}>س</div>
              <div>
                <div className={s.testName}>سارة الدوسري</div>
                <div className={s.testMeta}>٣٥ سنة &middot; الرياض</div>
              </div>
              <span className={s.testVt}>مشتركة فعّالة</span>
            </div>
            <div className={s.testBio}>
              الوزن <span>كجم</span>
            </div>
            <div className={s.testNums}>
              <div className={s.testCol}>
                <span className={s.testLbl}>قبل</span>
                <span className={s.testNum}>٩٨</span>
              </div>
              <span className={s.testArr}>&rarr;</span>
              <div className={s.testCol}>
                <span className={s.testLbl}>بعد</span>
                <span className={`${s.testNum} ${s.testNumDn}`}>٨٥</span>
              </div>
              <span className={s.testUnit}>كجم</span>
            </div>
            <svg className={s.testSpark} viewBox="0 0 180 32" preserveAspectRatio="none">
              <path d="M 0 6 L 60 14 L 120 22 L 180 28" stroke="#3B6D11" />
              <circle cx="0" cy="6" r="2.2" fill="#3B6D11" />
              <circle cx="60" cy="14" r="2.2" fill="#3B6D11" />
              <circle cx="120" cy="22" r="2.2" fill="#3B6D11" />
              <circle cx="180" cy="28" r="3.2" fill="#3B6D11" stroke="#ffffff" strokeWidth="1.2" />
            </svg>
            <p className={s.testQ}>
              لاباس غيّر حياتي — الدكتور تابع معاي خطوة بخطوة وحسّيت إن الخطّة فعلاً مصمّمة لي.
            </p>
          </div>

          {/* Card 2 */}
          <div className={s.testCard}>
            <div className={s.testHead}>
              <div className={`${s.testAv} ${s.testAv2}`}>ر</div>
              <div>
                <div className={s.testName}>رهف الشمري</div>
                <div className={s.testMeta}>٣١ سنة &middot; الرياض</div>
              </div>
              <span className={s.testVt}>مشتركة فعّالة</span>
            </div>
            <div className={s.testBio}>
              محيط الخصر <span>سم</span>
            </div>
            <div className={s.testNums}>
              <div className={s.testCol}>
                <span className={s.testLbl}>قبل</span>
                <span className={s.testNum}>١٠٢</span>
              </div>
              <span className={s.testArr}>&rarr;</span>
              <div className={s.testCol}>
                <span className={s.testLbl}>بعد</span>
                <span className={`${s.testNum} ${s.testNumDn}`}>٨٧</span>
              </div>
              <span className={s.testUnit}>سم</span>
            </div>
            <svg className={s.testSpark} viewBox="0 0 180 32" preserveAspectRatio="none">
              <path d="M 0 6 L 60 14 L 120 22 L 180 28" stroke="#3B6D11" />
              <circle cx="0" cy="6" r="2.2" fill="#3B6D11" />
              <circle cx="60" cy="14" r="2.2" fill="#3B6D11" />
              <circle cx="120" cy="22" r="2.2" fill="#3B6D11" />
              <circle cx="180" cy="28" r="3.2" fill="#3B6D11" stroke="#ffffff" strokeWidth="1.2" />
            </svg>
            <p className={s.testQ}>
              أخيراً لقيت برنامج يفهم جسمي — التحاليل بيّنت أشياء ما كنت أعرفها عن نفسي.
            </p>
          </div>

          {/* Card 3 */}
          <div className={s.testCard}>
            <div className={s.testHead}>
              <div className={`${s.testAv} ${s.testAv3}`}>م</div>
              <div>
                <div className={s.testName}>منيرة العتيبي</div>
                <div className={s.testMeta}>٤٠ سنة &middot; الرياض</div>
              </div>
              <span className={s.testVt}>مشتركة فعّالة</span>
            </div>
            <div className={s.testBio}>
              HbA1c <span>%</span>
            </div>
            <div className={s.testNums}>
              <div className={s.testCol}>
                <span className={s.testLbl}>قبل</span>
                <span className={s.testNum}>٦.٨</span>
              </div>
              <span className={s.testArr}>&rarr;</span>
              <div className={s.testCol}>
                <span className={s.testLbl}>بعد</span>
                <span className={`${s.testNum} ${s.testNumDn}`}>٥.٥</span>
              </div>
              <span className={s.testUnit}>%</span>
            </div>
            <svg className={s.testSpark} viewBox="0 0 180 32" preserveAspectRatio="none">
              <path d="M 0 6 L 60 14 L 120 22 L 180 28" stroke="#3B6D11" />
              <circle cx="0" cy="6" r="2.2" fill="#3B6D11" />
              <circle cx="60" cy="14" r="2.2" fill="#3B6D11" />
              <circle cx="120" cy="22" r="2.2" fill="#3B6D11" />
              <circle cx="180" cy="28" r="3.2" fill="#3B6D11" stroke="#ffffff" strokeWidth="1.2" />
            </svg>
            <p className={s.testQ}>
              مو بس وزني نزل — حتى السكّر التراكمي تحسّن بشكل ما توقّعته. شكراً لاباس.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className={s.faq}>
        <div className={s.secEyebrow}>
          <span className={s.secEyebrowDot} />
          الأسئلة الشائعة
        </div>
        <h2 className={s.secTtl}>عندك سؤال؟</h2>
        <p className={s.secSub}>
          إجابات سريعة على أكثر الأسئلة شيوعاً عن برنامج علاج السمنة.
        </p>

        <div className={s.faqList}>
          {faqItems.map((item, i) => (
            <div
              key={i}
              className={`${s.faqItem} ${openFaq === i ? s.faqItemOpen : ""}`}
            >
              <div className={s.faqQ} onClick={() => toggleFaq(i)}>
                <span>{item.q}</span>
                <span className={s.faqIcon}>+</span>
              </div>
              <div className={s.faqA}>
                <div className={s.faqAInner}>{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={s.cta}>
        <div className={s.ctaWrap}>
          <div className={s.ctaEyebrow}>
            <span className={s.ctaEyebrowDot} />
            ابدأ رحلتك الآن
          </div>
          <h2 className={s.ctaTtl}>جاهز تبدأ؟ خطوتك الأولى هنا.</h2>
          <p className={s.ctaSub}>
            سجّل في أقلّ من ٥ دقائق، وابدأ رحلتك نحو وزن صحّي بإشراف طبّي
            متكامل.
          </p>
          <Link href="/obesityProgram/subscribe" className={s.ctaBtn}>
            اشترك الآن
            <span className={s.ctaBtnArr}>&larr;</span>
          </Link>
          <p className={s.ctaFoot}>
            بدون التزام &middot; إلغاء في أي وقت &middot; ضمان استرداد ٧ أيام
          </p>
        </div>
      </section>

      {/* ─── LICENSE TAG ─── */}
      <div style={{ background: "#f2faed", borderTop: "0.5px solid rgba(23,52,4,0.08)", padding: "8px 48px", textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#27500A", letterSpacing: "0.2px" }}>
        شركة سعودية مرخّصة من وزارة الصحة &middot; ترخيص رقم 1400055938
      </div>

      {/* ─── FOOTER ─── */}
      <footer className={s.foot}>
        <div className={s.footBrand}>
          <div className={s.mark} />
          <span>لاباس</span>
        </div>
        <div className={s.footLinks}>
          <span>الشروط والأحكام</span>
          <span>سياسة الخصوصية</span>
          <span>تواصل معنا</span>
        </div>
        <span className={s.footCopy}>
          &copy; ٢٠٢٥ لاباس. جميع الحقوق محفوظة.
        </span>
      </footer>

      {/* ─── FDA POPUP ─── */}
      {showFdaPopup && (
        <div
          onClick={() => setShowFdaPopup(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "24px 16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              maxWidth: 520,
              width: "100%",
              padding: "32px 24px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowFdaPopup(false)}
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                background: "#f3f4f6",
                border: "none",
                borderRadius: "50%",
                width: 34,
                height: 34,
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#374151",
              }}
            >
              &times;
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ background: "#EEF2FF", borderRadius: 10, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#4338CA" }}>
                FDA
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>اعتماد FDA للمادة الفعّالة</h3>
            </div>

            <div style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.85 }}>
              <p style={{ marginBottom: 14 }}>
                المادة الفعّالة <strong>تيرزيباتيد (Tirzepatide)</strong> حاصلة على اعتماد هيئة الغذاء والدواء الأمريكية (FDA) للاستخدامات التالية:
              </p>

              <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, color: "#15803d", fontSize: 13, marginBottom: 6 }}>✓ إنقاص الوزن (باسم Zepbound)</div>
                <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>
                  معتمد منذ نوفمبر ٢٠٢٣ لعلاج السمنة المزمنة عند البالغين الذين يعانون من مؤشر كتلة جسم ≥ ٣٠، أو ≥ ٢٧ مع حالة صحية مرتبطة بالوزن.
                </p>
              </div>

              <div style={{ background: "#EEF2FF", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, color: "#4338CA", fontSize: 13, marginBottom: 6 }}>✓ داء السكري من النوع الثاني (باسم Mounjaro)</div>
                <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>
                  معتمد منذ مايو ٢٠٢٢ كعلاج مساعد للنظام الغذائي والرياضة لتحسين مستوى السكر في الدم.
                </p>
              </div>

              <div style={{ background: "#FFF7ED", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: "#C2410C", fontSize: 13, marginBottom: 6 }}>✓ انقطاع النفس أثناء النوم (باسم Zepbound)</div>
                <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>
                  معتمد منذ ديسمبر ٢٠٢٤ لعلاج انقطاع النفس الانسدادي المعتدل إلى الشديد عند البالغين المصابين بالسمنة.
                </p>
              </div>

              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                المصدر: هيئة الغذاء والدواء الأمريكية (U.S. FDA) · آخر تحديث: ٢٠٢٤
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

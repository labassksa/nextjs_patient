"use client";

import Link from "next/link";
import Image from "next/image";
import s from "./landing.module.css";

/* ─── ATOM ICON (inline SVG) ─── */
const AtomIcon = ({ size = 26, opacity = 0.6 }: { size?: number; opacity?: number }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ opacity }} aria-hidden="true">
    <ellipse cx="20" cy="20" rx="17" ry="6.5" fill="none" stroke="#173404" strokeWidth="1.8" />
    <ellipse cx="20" cy="20" rx="17" ry="6.5" fill="none" stroke="#173404" strokeWidth="1.8" transform="rotate(60 20 20)" />
    <ellipse cx="20" cy="20" rx="17" ry="6.5" fill="none" stroke="#173404" strokeWidth="1.8" transform="rotate(120 20 20)" />
    <circle cx="20" cy="20" r="2.5" fill="#173404" />
  </svg>
);

/* ─── B2C PACKAGES ─── */
const packages = [
  {
    id: "vitamins",
    name: "فيتامينات ومعادن",
    hook: "تعب مستمر؟ تساقط شعر؟ بشرة باهتة؟",
    desc: "اكتشف السبب بفحص دم واحد — واحصل على مكملات مخصّصة لاحتياجك",
    href: "/vitaminsPackages",
    icon: "/icons/widgets/icon-lab.svg",
    gradient: "pkgGradVit",
  },
  {
    id: "obesity",
    name: "برنامج السمنة",
    hook: "حاولت كل الطرق ولا نتيجة؟",
    desc: "أدوية معتمدة من FDA مع خطة غذائية ومتابعة طبيب — نتائج حقيقية",
    badge: "معتمد من FDA",
    href: "/obesityProgram",
    icon: "/icons/widgets/icon-fat.svg",
    gradient: "pkgGradOb",
  },
  {
    id: "sexual",
    name: "الصحة الجنسية",
    hook: "موضوع خاص يستحق رعاية خاصة",
    desc: "تحدّث مع طبيب مختص بسرّية تامة — علاج فعّال يوصلك لبيتك",
    href: "/sexualHealth",
    icon: "/icons/widgets/icon-sex.svg",
    gradient: "pkgGradSex",
  },
];

/* ─── B2B BUNDLES ─── */
const b2bCards = [
  {
    type: "استشارات طبيب عام",
    name: "باقات الطبيب العام",
    desc: "استشارات فورية، وصفات معتمدة، قراءة تحاليل، وإعادة صرف أدوية — لموظفيك أو عملائك.",
    tiers: [
      { name: "الباقة الأساسية", price: "٥٠٠ ريال", count: "٥٠ استشارة" },
      { name: "الباقة المتوسطة", price: "١,٢٠٠ ريال", count: "١٥٠ استشارة" },
    ],
    features: [
      "استشارة فورية عبر المحادثة أو الفيديو",
      "وصفات طبية معتمدة إلكترونياً",
      "قراءة وتفسير التحاليل",
      "إعادة صرف الأدوية",
      "لوحة تحكم للمنشأة",
    ],
  },
  {
    type: "استشارات أخصائي",
    name: "باقات الأخصائيين",
    desc: "استشارات متخصصة في السمنة، طب الأسرة، وإعادة صرف الأدوية النفسية.",
    tiers: [
      { name: "الباقة المميزة", price: "٢,٥٠٠ ريال", count: "٣٠٠ استشارة" },
    ],
    features: [
      "استشارات سمنة مع طبيب مختص",
      "طب أسرة (تشمل إصدار الإجازة المرضية)",
      "إعادة صرف الأدوية النفسية",
      "لوحة تحكم للمنشأة",
    ],
  },
];

/* ─── B2B SCALE STATS ─── */
const b2bStats = [
  { num: "+١٠٠٠", lbl: "صيدلية" },
  { num: "+٥٠", lbl: "مختبر طبي" },
  { num: "+٥٠", lbl: "مدرسة" },
  { num: "٢٤/٧", lbl: "دعم فوري" },
];

/* ─── PARTNER LOGOS (marquee — duplicated for infinite scroll) ─── */
const logos = [
  { src: "/partnersLogos/logo-2.svg", alt: "شريك" },
  { src: "/partnersLogos/unnamed.webp", alt: "شريك" },
  { src: "/partnersLogos/retailer_1352_2021032112143184752.jpg", alt: "شريك" },
  { src: "/partnersLogos/alshafi.png", alt: "صيدليات الشافي" },
];
const marqueeLogos = [...logos, ...logos, ...logos, ...logos];

/* ─── TESTIMONIALS ─── */
const testimonials = [
  {
    quote: "لاباس سهّلت علينا صرف الوصفات الإلكترونية بشكل كبير — العملاء يطلبون الخدمة بأنفسهم الآن.",
    name: "م. سعود الحربي",
    role: "مدير صيدلية · الرياض",
    av: "ص",
  },
  {
    quote: "وفّرنا على المدرسة تكلفة العيادة الطبية بالكامل. الأهالي مرتاحين والطلاب يحصلون على استشارة فورية.",
    name: "أ. نورة القحطاني",
    role: "مديرة مدرسة أهلية · جدة",
    av: "ن",
  },
  {
    quote: "الباقات مرنة وتناسب حجم منشأتنا. الدعم الفني سريع ومتعاون — تجربة ممتازة من البداية.",
    name: "د. عبدالله المطيري",
    role: "مدير مختبر طبي · الدمام",
    av: "ع",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ─── FIXED TOP HEADER ─── */}
      <div className={s.navOuter} dir="rtl">
        <nav className={s.nav}>
          <div className={s.brand}>
            <div className={s.mark} />
            <span className={s.bname}>لاباس</span>
          </div>
          <div className={s.navLinks}>
            <a href="#b2c" className={s.navLink}>للأفراد</a>
            <a href="#b2b" className={s.navLink}>للمنشآت</a>
            <a href="#partners" className={s.navLink}>شركاؤنا</a>
          </div>
          <a href="#b2b" className={s.navCta}>للمنشآت</a>
        </nav>
      </div>

    <div dir="rtl" className={s.app}>

      {/* ─── 1. LICENSE BAR ─── */}
      <div className={s.licBar}>
        شركة سعودية مرخّصة من وزارة الصحة · ترخيص رقم 1400055938
      </div>

      {/* ─── 3. HERO ─── */}
      <section className={s.hero}>
        <div className={s.heroGrid}>
          <div>
            <div className={s.heroEyebrow}>
              <span className={s.heroEyebrowDot} />
              مرخّصة من وزارة الصحة
            </div>
            <h1 className={s.heroH1}>
              صحتك تبدأ
              <br />
              من هنا
            </h1>
            <p className={s.heroSub}>
              رعاية صحية متكاملة — فحص، تشخيص، علاج، وتوصيل لبيتك
            </p>
            <p className={s.heroDesc}>
              طبيب مرخّص يقرأ تحاليلك ويحدد علاجك، وأدوية ومكملات توصلك لبيتك — واستشر طبيبك 24/7.
            </p>
            <a href="#b2c" className={s.heroBtn}>
              استكشف خدماتنا
              <span className={s.heroBtnArr}>←</span>
            </a>
            <div className={s.heroTrust}>
              <div className={s.trustItem}><div className={s.trustCheck}>✓</div> طبيب مرخّص</div>
              <div className={s.trustItem}><div className={s.trustCheck}>✓</div> توصيل مجاني للفيتامينات والأدوية</div>
              <div className={s.trustItem}><div className={s.trustCheck}>✓</div> 24/7</div>
            </div>
          </div>

          {/* ─── PILL VISUAL with ATOMS ─── */}
          <div className={s.heroVisual}>
            <div className={s.ring1} />
            <div className={s.ring2} />
            <div className={s.pillShadow} />

            {/* Dark green atoms scattered around the pill */}
            <div className={`${s.atom} ${s.atom1}`}><AtomIcon size={30} opacity={0.55} /></div>
            <div className={`${s.atom} ${s.atom2}`}><AtomIcon size={22} opacity={0.38} /></div>
            <div className={`${s.atom} ${s.atom3}`}><AtomIcon size={34} opacity={0.48} /></div>
            <div className={`${s.atom} ${s.atom4}`}><AtomIcon size={20} opacity={0.32} /></div>
            <div className={`${s.atom} ${s.atom5}`}><AtomIcon size={26} opacity={0.42} /></div>
            <div className={`${s.atom} ${s.atom6}`}><AtomIcon size={18} opacity={0.28} /></div>

            <div className={s.pillWrap}>
              <div className={s.pillTilt}>
                <svg viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg" className={s.pill}>
                  <defs>
                    <radialGradient id="lp-sph" cx="0.38" cy="0.32" r="0.72">
                      <stop offset="0" stopColor="#c0f090"/>
                      <stop offset="0.42" stopColor="#7ED957"/>
                      <stop offset="0.76" stopColor="#3b7a1a"/>
                      <stop offset="1" stopColor="#1b4806"/>
                    </radialGradient>
                    <filter id="lp-grain" x="-5%" y="-5%" width="110%" height="110%">
                      <feTurbulence type="fractalNoise" baseFrequency="2.1" numOctaves={2} seed="5" stitchTiles="stitch" result="fine"/>
                      <feColorMatrix in="fine" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.28 -0.12" result="mask"/>
                      <feComposite in="mask" in2="SourceGraphic" operator="in"/>
                    </filter>
                    <filter id="lp-dark" x="-5%" y="-5%" width="110%" height="110%">
                      <feTurbulence type="fractalNoise" baseFrequency="2.7" numOctaves={1} seed="31" result="noise"/>
                      <feColorMatrix in="noise" values="0 0 0 0 0.09  0 0 0 0 0.2  0 0 0 0 0.015  0 0 0 2.2 -1.05" result="thresh"/>
                      <feComposite in="thresh" in2="SourceGraphic" operator="in"/>
                    </filter>
                    <filter id="lp-bright" x="-5%" y="-5%" width="110%" height="110%">
                      <feTurbulence type="fractalNoise" baseFrequency="3.0" numOctaves={1} seed="77" result="noise"/>
                      <feColorMatrix in="noise" values="0 0 0 0 0.48  0 0 0 0 0.85  0 0 0 0 0.22  0 0 0 2.0 -1.0" result="thresh"/>
                      <feComposite in="thresh" in2="SourceGraphic" operator="in"/>
                    </filter>
                    <filter id="lp-inner" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                      <feOffset in="blur" dx="2" dy="3" result="offset"/>
                      <feComposite in="offset" in2="SourceAlpha" operator="out" result="cut"/>
                      <feGaussianBlur in="cut" stdDeviation="1.5" result="soft"/>
                      <feFlood floodColor="#173404" floodOpacity="0.65" result="col"/>
                      <feComposite in="col" in2="soft" operator="in" result="shadow"/>
                      <feComposite in="shadow" in2="SourceGraphic" operator="in"/>
                    </filter>
                  </defs>
                  <circle cx="180" cy="180" r="140" fill="url(#lp-sph)"/>
                  <circle cx="180" cy="180" r="140" fill="#7ED957" filter="url(#lp-grain)" opacity="0.65"/>
                  <circle cx="180" cy="180" r="140" fill="#173404" filter="url(#lp-dark)" opacity="0.85"/>
                  <circle cx="180" cy="180" r="140" fill="#a8e87c" filter="url(#lp-bright)" opacity="0.6"/>
                  <ellipse cx="140" cy="126" rx="50" ry="38" fill="white" opacity="0.12"/>
                  <text x="182" y="202" fill="#173404" fontFamily="Tajawal, system-ui, sans-serif" fontSize="62" fontWeight="800" textAnchor="middle" letterSpacing="-1.5" opacity="0.11">لاباس</text>
                  <text x="182" y="202" fontFamily="Tajawal, system-ui, sans-serif" fontSize="62" fontWeight="800" textAnchor="middle" letterSpacing="-1.5" filter="url(#lp-inner)" fill="white" opacity="0.88">لاباس</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. B2C PACKAGES ─── */}
      <section id="b2c" className={s.sec}>
        <div className={s.secHead}>
          <div className={s.secEyebrow}>
            <span className={s.secEyebrowDot} />
            للأفراد
          </div>
          <h2 className={s.secTtl}>برامج صحية متخصصة</h2>
          <p className={s.secSub}>
            كل برنامج يبدأ بفهم حالتك — ويوصلك لعلاج مخصّص مع طبيب مرخّص
          </p>
        </div>

        <div className={s.pkgGrid}>
          {packages.map((pkg) => (
            <Link key={pkg.id} href={pkg.href} className={s.pkgCard}>
              <div className={`${s.pkgGrad} ${s[pkg.gradient]}`}>
                {pkg.id === "vitamins" ? (
                  <div className={s.vitViz}>
                    <div className={s.vitRing} />
                    <div className={s.vitRing2} />
                    <div className={s.vitOrbitTrack}>
                      <div className={s.vitDot} />
                    </div>
                    <div className={s.vitOrbitTrack2}>
                      <div className={s.vitDot2} />
                    </div>
                    <div className={s.vitIconFloat}>
                      <Image src="/icons/widgets/icon-lab-clear.svg" alt={pkg.name} width={52} height={52} />
                    </div>
                  </div>
                ) : pkg.id === "obesity" ? (
                  <div className={s.obViz}>
                    <div className={s.obRing} />
                    <div className={s.obRing2} />
                    <div className={s.obOrbitTrack}><div className={s.vitDot} /></div>
                    <div className={s.obOrbitTrack2}><div className={s.vitDot2} /></div>
                    <div className={s.obIconFloat}>
                      <Image src="/icons/widgets/icon-fat-clear.svg" alt={pkg.name} width={52} height={52} />
                    </div>
                  </div>
                ) : (
                  <div className={s.sexViz}>
                    <div className={s.sexRing} />
                    <div className={s.sexRing2} />
                    <div className={s.sexOrbitTrack}><div className={s.sexDot} /></div>
                    <div className={s.sexOrbitTrack2}><div className={s.sexDot2} /></div>
                    <div className={s.sexIconFloat}>
                      <Image src="/icons/widgets/icon-sex-clear.svg" alt={pkg.name} width={52} height={52} />
                    </div>
                  </div>
                )}
                {pkg.badge && <span className={s.pkgBadge}>{pkg.badge}</span>}
              </div>
              <div className={s.pkgBody}>
                <h3 className={s.pkgName}>{pkg.name}</h3>
                <p className={s.pkgHook}>{pkg.hook}</p>
                <p className={s.pkgDesc}>{pkg.desc}</p>
                <span className={s.pkgCta}>
                  اكتشف المزيد
                  <span className={s.pkgCtaArr}>←</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className={s.divider}>
        <div className={s.dividerLine} />
        <div className={s.dividerLabel}>حلول المنشآت</div>
        <div className={s.dividerLine} />
      </div>

      {/* ─── 5. B2B SECTION ─── */}
      <section id="b2b" className={s.b2bSec}>
        <div className={s.secHead}>
          <div className={s.b2bEyebrow}>
            <span className={s.b2bEyebrowDot} />
            للمنشآت والشركات
          </div>
          <h2 className={s.b2bSecTtl}>باقات استشارات طبية للمنشآت</h2>
          <p className={s.b2bSecSub}>
            صيدليات · مختبرات معتمدة بمعايير الجودة · مدارس · جهات حكومية
          </p>
        </div>

        {/* Scale stats */}
        <div className={s.b2bScaleRow}>
          {b2bStats.map((st, i) => (
            <>
              {i > 0 && <div key={`div-${i}`} className={s.b2bScaleDivider} />}
              <div key={st.num} className={s.b2bScaleStat}>
                <div className={s.b2bScaleNum}>{st.num}</div>
                <div className={s.b2bScaleLbl}>{st.lbl}</div>
              </div>
            </>
          ))}
        </div>

        <div className={s.b2bGrid}>
          {b2bCards.map((card, ci) => (
            <div key={ci} className={s.b2bCard}>
              <span className={s.b2bType}>{card.type}</span>
              <h3 className={s.b2bName}>{card.name}</h3>
              <p className={s.b2bDesc}>{card.desc}</p>

              <div className={s.b2bTiers}>
                {card.tiers.map((t, ti) => (
                  <div key={ti} className={s.b2bTier}>
                    <div>
                      <div className={s.b2bTierName}>{t.name}</div>
                      <div className={s.b2bTierCount}>{t.count}</div>
                    </div>
                    <div className={s.b2bTierPrice}>{t.price}</div>
                  </div>
                ))}
              </div>

              <ul className={s.b2bFeats}>
                {card.features.map((f, fi) => (
                  <li key={fi} className={s.b2bFeat}>
                    <span className={s.b2bFeatCk}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="tel:0505117551" className={s.b2bBtn}>
                تواصل مع المبيعات
              </a>
            </div>
          ))}
        </div>

        <div className={s.b2bContact}>
          أو تواصل مباشرة:{" "}
          <a href="mailto:sales@labass.sa" className={s.b2bContactLink}>sales@labass.sa</a>
          {" · "}
          <a href="tel:0505117551" className={s.b2bContactLink}>0505117551</a>
        </div>
      </section>

      {/* ─── 6. TESTIMONIALS ─── */}
      <section className={`${s.sec} ${s.b2bBg}`}>
        <div className={s.secHead}>
          <div className={s.secEyebrow}>
            <span className={s.secEyebrowDot} />
            شركاء النجاح
          </div>
          <h2 className={s.secTtl}>ماذا يقول شركاؤنا؟</h2>
        </div>

        <div className={s.testGrid}>
          {testimonials.map((t, i) => (
            <div key={i} className={s.testCard}>
              <p className={s.testQuote}>&ldquo;{t.quote}&rdquo;</p>
              <div className={s.testAuthor}>
                <div className={s.testAv}>{t.av}</div>
                <div>
                  <div className={s.testName}>{t.name}</div>
                  <div className={s.testRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. PARTNER LOGOS (marquee) ─── */}
      <section id="partners" className={s.sec}>
        <div className={s.secHead}>
          <div className={s.secEyebrow}>
            <span className={s.secEyebrowDot} />
            شركاؤنا
          </div>
          <h2 className={s.secTtl}>شبكة واسعة تخدمك أينما كنت</h2>
        </div>

        <div className={s.logoWrap}>
          <div className={s.logoTrack}>
            {marqueeLogos.map((logo, i) => (
              <Image
                key={i}
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={50}
                className={s.partnerLogo}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. FOOTER CTA ─── */}
      <section className={s.ctaSec}>
        <h2 className={s.ctaTtl}>ابدأ رحلتك الصحية الآن</h2>
        <p className={s.ctaSub}>أطباء مرخّصون، أدوية معتمدة، وتوصيل لباب بيتك</p>
        <a href="#b2c" className={s.ctaBtn}>استكشف الباقات</a>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className={s.foot}>
        <div className={s.footCompany}>شركة معالم التطوير</div>
        <div className={s.footLic}>مرخّصة من وزارة الصحة برقم ١٤٠٠٠٥٥٩٣٨</div>
        <div className={s.footContact}>
          <a href="tel:0505117551" className={s.footLink}>0505117551</a>
          <a href="mailto:sales@labass.sa" className={s.footLink}>sales@labass.sa</a>
        </div>
      </footer>
    </div>
    </>
  );
}

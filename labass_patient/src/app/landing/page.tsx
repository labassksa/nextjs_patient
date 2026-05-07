"use client";

import Link from "next/link";
import Image from "next/image";
import s from "./landing.module.css";

/* ─── B2C PACKAGES ─── */
const packages = [
  {
    id: "vitamins",
    name: "فيتامينات ومعادن",
    hook: "تعب مستمر؟ تساقط شعر؟",
    desc: "جسمك يرسل لك إشارات — طبيب مختص يقيّم حالتك ويختار مكملاتك المناسبة",
    price: "٢٨٩ ريال",
    priceSub: "/ شهر",
    features: [
      "طبيب مختص يقيّم حالتك الصحية",
      "مكملات مخصصة بناءً على احتياجاتك",
      "مكملات توصل لبيتك مجاناً",
      "استشارة طبيب 24/7",
    ],
    cta: "اشترك الآن",
    href: "/vitaminsPackages",
    icon: "/icons/widgets/icon-lab.svg",
    gradient: "pkgGradVit",
  },
  {
    id: "obesity",
    name: "برنامج إنقاص الوزن",
    hook: "اخسر وزنك بإشراف طبّي",
    desc: "مع مونجارو و اوزمبيك — أدوية موصوفة، خطة غذائية، ومتابعة مستمرة",
    badge: "معتمد من FDA",
    features: [
      "أدوية سمنة معتمدة من FDA",
      "خطة غذائية مخصصة",
      "متابعة دورية مع الطبيب",
      "توصيل الأدوية لبيتك",
    ],
    cta: "ابدأ الآن",
    href: "/obesityProgram",
    icon: "/icons/widgets/icon-fat.svg",
    gradient: "pkgGradOb",
  },
  {
    id: "sexual",
    name: "الصحة الجنسية",
    hook: "الأداء اللي تبيه، بخصوصية تامة",
    desc: "علاج متكامل بوصفة طبيب — بدون عيادة، مع طبيب مختص يتابعك",
    features: [
      "سرية تامة مع طبيب مختص",
      "تشخيص ووصفة طبية معتمدة",
      "علاج يوصل مباشرة لبيتك",
      "لا حاجة لزيارة عيادة",
    ],
    cta: "تحدث مع طبيب",
    href: "/sexualHealth",
    icon: "/icons/widgets/icon-sex.svg",
    gradient: "pkgGradSex",
  },
  {
    id: "general",
    name: "استشارة طبية عامة",
    hook: "طبيبك دائماً متاح",
    desc: "استشارة فورية مع طبيب أسرة وإعادة صرف وصفاتك — بدون انتظار وبدون عيادة",
    price: "٩٩ ريال",
    priceSub: "/ شهر",
    features: [
      "استشارة طبية 24/7 مع طبيب أسرة",
      "إعادة صرف الوصفات الدائمة",
      "وصفة إلكترونية معتمدة",
      "تواصل مباشر مع الطبيب",
    ],
    cta: "اشترك الآن",
    href: "/generalPackage",
    icon: "/icons/widgets/icon-doctor.svg",
    gradient: "pkgGradGen",
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
          <div className={s.navAuth}>
            <Link href="/home" className={s.navAuthInd}>تسجيل الدخول</Link>
            <Link href="/orgPortal" className={s.navAuthOrg}>بوابة المنشآت</Link>
          </div>
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
              برامج صحية مخصصة
              <br />
              تبدأ من منزلك
            </h1>
            <p className={s.heroSub}>
              فيتامينات · سمنة · صحة جنسية — طبيب مرخّص يتابعك من الأول للآخر
            </p>
            <p className={s.heroDesc}>
              فحص، تشخيص، وصفة، وتوصيل لبيتك — بدون زيارة عيادة. استشر طبيبك 24/7.
            </p>
            <a href="#b2c" className={s.heroBtn}>
              اكتشف الباقات
              <span className={s.heroBtnArr}>←</span>
            </a>
            <div className={s.heroTrust}>
              <div className={s.trustItem}><div className={s.trustCheck}>✓</div> طبيب مرخّص</div>
              <div className={s.trustItem}><div className={s.trustCheck}>✓</div> توصيل مجاني</div>
              <div className={s.trustItem}><div className={s.trustCheck}>✓</div> 24/7</div>
              <div className={s.trustItem}><div className={s.trustCheck}>✓</div> بدون زيارة عيادة</div>
            </div>
          </div>

          {/* ─── PILL VISUAL with FLOATING CHIPS ─── */}
          <div className={s.heroVisual}>
            <div className={s.ring1} />
            <div className={s.ring2} />
            <div className={s.pillShadow} />

            <div className={s.pillWrap}>
              <div className={s.pillTilt}>
                <div className={s.pill}>
                  <div className={s.pillSpec} />
                  <div className={s.pillText}>labass</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SHOP / EDITORIAL PACKAGE SHOWCASE ─── */}
      <section id="shop" className={s.shopSec}>
        <div className={s.shopHead}>
          <div className={s.shopEyebrow}>
            <span className={s.shopEyebrowDot} />
            ابدأ من اهتمامك
          </div>
          <h2 className={s.shopTtl}>اختر برنامجك</h2>
          <p className={s.shopSub}>
            ثلاثة برامج — كل واحد يبدأ بفحص أو استشارة ويوصلك لعلاج مخصّص مع طبيب مرخّص
          </p>
        </div>
        <div className={s.shopCards}>

          <Link href="/vitaminsPackages" className={`${s.shopCard} ${s.shopVit}`}>
            <div className={s.shopCardTop}>
              <span className={s.shopCat}>فيتامينات ومعادن</span>
              <p className={s.shopConcern}>تعب مستمر؟<br />جسمك يرسل لك إشارات</p>
              <div className={s.shopViz}>
                <Image src="/icons/widgets/icon-lab-clear.svg" alt="فيتامينات" width={84} height={84} className={s.shopIcon} />
              </div>
            </div>
            <div className={s.shopCardBot}>
              <p className={s.shopBenefit}>طبيب مختص يقيّم حالتك، مكملات مخصصة توصل لبيتك</p>
              <p className={s.shopPrice}>من <strong>٢٨٩ ريال</strong> / شهر</p>
              <span className={s.shopBtn}>اشترك الآن</span>
            </div>
          </Link>

          <Link href="/obesityProgram" className={`${s.shopCard} ${s.shopOb}`}>
            <div className={s.shopCardTop}>
              <span className={s.shopCat}>برنامج إنقاص الوزن</span>
              <p className={s.shopConcern}>اخسر وزنك<br />بإشراف طبّي</p>
              <span className={s.shopBadge}>معتمد من FDA</span>
              <div className={s.shopViz}>
                <Image src="/icons/widgets/icon-fat-clear.svg" alt="سمنة" width={84} height={84} className={s.shopIcon} />
              </div>
            </div>
            <div className={s.shopCardBot}>
              <p className={s.shopBenefit}>أدوية معتمدة من FDA مع خطة غذائية ومتابعة طبيب مستمرة</p>
              <p className={s.shopPrice}>من <strong>٣٥٧ ريال</strong> / شهر</p>
              <span className={s.shopBtn}>ابدأ الآن</span>
            </div>
          </Link>

          <Link href="/sexualHealth" className={`${s.shopCard} ${s.shopSex}`}>
            <div className={s.shopCardTop}>
              <span className={s.shopCat}>الصحة الجنسية</span>
              <p className={s.shopConcern}>الأداء اللي تبيه<br />بخصوصية تامة</p>
              <div className={s.shopViz}>
                <Image src="/icons/widgets/icon-sex-clear.svg" alt="صحة جنسية" width={84} height={84} className={s.shopIcon} />
              </div>
            </div>
            <div className={s.shopCardBot}>
              <p className={s.shopBenefit}>طبيب مختص بسرية تامة، علاج فعّال، توصيل مضمون لبيتك</p>
              <p className={s.shopPrice}>من <strong>١٤٩ ريال</strong> / شهر</p>
              <span className={s.shopBtn}>تحدث مع طبيب</span>
            </div>
          </Link>

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
                ) : pkg.id === "general" ? (
                  <div className={s.genViz}>
                    <div className={s.genRing} />
                    <div className={s.genRing2} />
                    <div className={s.genOrbitTrack}><div className={s.genDot} /></div>
                    <div className={s.genOrbitTrack2}><div className={s.genDot2} /></div>
                    <div className={s.genIconFloat}>
                      <Image src="/icons/widgets/icon-doctor.svg" alt={pkg.name} width={52} height={52} />
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
                {"price" in pkg && pkg.price && (
                  <p className={s.pkgPrice}>
                    {pkg.price}
                    <span className={s.pkgPriceSub}>{pkg.priceSub}</span>
                  </p>
                )}
                <ul className={s.pkgFeats}>
                  {pkg.features.map((f, i) => (
                    <li key={i} className={s.pkgFeat}>
                      <span className={s.pkgFeatDot} />
                      {f}
                    </li>
                  ))}
                </ul>
                <span className={s.pkgCta}>
                  {pkg.cta}
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

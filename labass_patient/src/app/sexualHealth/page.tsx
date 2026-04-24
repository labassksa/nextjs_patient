"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./sexualHealth.module.css";

const blogArticles = [
  {
    slug: "ed-prevalence",
    cat: "صحة الرجل",
    title: "ضعف الانتصاب: كم هو شائع فعلاً؟ الأرقام التي يخفيها الصمت",
    author: "فريق لاباس · القسم الطبّي",
    readTime: "١٠ دقائق قراءة",
    date: "٢٢ أبريل ٢٠٢٦",
    refs: "مراجع من: Arab J Urology, J Sex Medicine, Cureus",
    refsCount: "٥",
    content: [
      { type: "lead" as const, text: "مراجعة موسّعة لأبحاث الأندرولوجيا الخليجية — من دراسة El-Sakka في Int J Impotence Research التي رصدت خصائص ED في مرضى سعوديين، إلى GOSS العربية التي شملت ٨٠٤ رجلاً من الشرق الأوسط." },
      { type: "heading" as const, text: "ما مدى انتشار ضعف الانتصاب؟" },
      { type: "paragraph" as const, text: "تشير الدراسات الحديثة إلى أن ضعف الانتصاب يصيب ما بين ٢٥٪ إلى ٤٠٪ من الرجال فوق سن الأربعين في المنطقة العربية. النسبة ترتفع مع التقدّم في العمر، لتصل إلى أكثر من ٧٠٪ بعد سن الستّين." },
      { type: "paragraph" as const, text: "في دراسة El-Sakka التي شملت مرضى سعوديين، وُجد أن ٨٦٪ من مرضى السكري من النوع الثاني يعانون من درجة ما من ضعف الانتصاب. كما أن ارتفاع ضغط الدم وأمراض القلب من العوامل المرتبطة بقوة." },
      { type: "heading" as const, text: "لماذا لا يتحدّث الرجال عن المشكلة؟" },
      { type: "paragraph" as const, text: "رغم الانتشار الواسع، أظهرت دراسة GOSS أن ٢٨٪ فقط من المصابين ناقشوا المشكلة مع طبيبهم. الحاجز الأكبر ليس طبّياً — بل ثقافي واجتماعي. كثير من الرجال يعتبرون الموضوع محرجاً أو علامة ضعف." },
      { type: "callout" as const, text: "هذا بالضبط ما صُمّم لاباس لحلّه: منصة خاصّة وسرّيّة تتيح لك التحدّث مع طبيب مرخّص دون الحاجة لزيارة عيادة." },
      { type: "heading" as const, text: "ما هي الخيارات العلاجية المتاحة؟" },
      { type: "paragraph" as const, text: "الأدوية من فئة PDE5 inhibitors (مثل Sildenafil و Tadalafil) تُعتبر الخطّ الأول في العلاج. نسبة نجاحها تصل إلى ٦٦٪ في التجارب السريرية الكبرى. يختار الطبيب الدواء المناسب بناءً على حالتك الصحية ونمط حياتك." },
      { type: "paragraph" as const, text: "إلى جانب الأدوية، هناك تغييرات في نمط الحياة أثبتت فعاليتها: فقدان الوزن، ممارسة الرياضة بانتظام، الإقلاع عن التدخين، وتقليل التوتر — كلها عوامل تحسّن الأداء بشكل ملحوظ." },
    ],
  },
  {
    slug: "pde5-explained",
    cat: "فسيولوجيا",
    title: "كيف تعمل أدوية PDE5؟ الشرح العلمي المبسّط",
    author: "فريق لاباس",
    readTime: "٧ دقائق",
    date: "",
    refs: "BMJ, FDA Labels",
    refsCount: "٤",
    content: [
      { type: "lead" as const, text: "Sildenafil و Tadalafil — نفس الآلية، لكن اختلافات مهمّة في التوقيت والمدّة. إليك الشرح العلمي بلغة بسيطة." },
      { type: "heading" as const, text: "ما هو إنزيم PDE5؟" },
      { type: "paragraph" as const, text: "PDE5 (فوسفوديستيراز النوع الخامس) هو إنزيم طبيعي في الجسم، يوجد بتركيز عالٍ في الأوعية الدموية للعضو الذكري. وظيفته تحليل مادة cGMP المسؤولة عن استرخاء العضلات الملساء وتدفّق الدم." },
      { type: "paragraph" as const, text: "عند التنبيه الجنسي، يُفرز أكسيد النيتريك (NO) الذي ينشّط إنتاج cGMP. هذا يؤدي لاسترخاء العضلات الملساء في الأوعية الدموية، ممّا يسمح بتدفّق الدم وحدوث الانتصاب." },
      { type: "heading" as const, text: "كيف تعمل الأدوية؟" },
      { type: "paragraph" as const, text: "أدوية PDE5 inhibitors تمنع عمل الإنزيم مؤقّتاً، ممّا يحافظ على مستوى cGMP مرتفعاً لفترة أطول. النتيجة: انتصاب أقوى يدوم لوقت كافٍ." },
      { type: "callout" as const, text: "مهم: هذه الأدوية لا تسبّب انتصاباً تلقائياً — يجب أن يكون هناك تنبيه جنسي طبيعي أولاً. الدواء يُسهّل الاستجابة، لا يخلقها." },
      { type: "heading" as const, text: "الفرق بين Sildenafil و Tadalafil" },
      { type: "paragraph" as const, text: "Sildenafil (جنريك Viagra): يبدأ مفعوله خلال ٣٠-٦٠ دقيقة ويستمر ٤-٥ ساعات. مناسب للمواعيد المخطّطة. يُفضّل تناوله على معدة فارغة." },
      { type: "paragraph" as const, text: "Tadalafil (جنريك Cialis): يبدأ خلال ٣٠-١٢٠ دقيقة لكنه يستمر حتى ٣٦ ساعة. مناسب للعفوية. متوفّر بجرعة يومية منخفضة (2.5-5mg) للاستخدام المستمر." },
    ],
  },
  {
    slug: "ed-heart-diabetes",
    cat: "قلب وسكّر",
    title: "ضعف الانتصاب كإنذار مبكّر لأمراض القلب والسكّري",
    author: "فريق لاباس",
    readTime: "٨ دقائق",
    date: "",
    refs: "Circulation, JACC",
    refsCount: "٤",
    content: [
      { type: "lead" as const, text: "العلاقة ليست صدفة — الأوعية الدموية في العضو الذكري من الأضيق في الجسم، وتتأثّر أولاً." },
      { type: "heading" as const, text: "العلاقة بين ضعف الانتصاب وأمراض القلب" },
      { type: "paragraph" as const, text: "أظهرت دراسات نُشرت في مجلة Circulation أن ضعف الانتصاب يسبق أمراض القلب بـ ٢-٥ سنوات في كثير من الحالات. السبب بسيط: الأوعية الدموية الصغيرة تتأثّر بتصلّب الشرايين قبل الكبيرة." },
      { type: "paragraph" as const, text: "الشرايين التي تغذّي العضو الذكري قطرها ١-٢ ملم فقط، بينما الشرايين التاجية قطرها ٣-٤ ملم. لذلك، نفس الترسّبات التي ستسبب ذبحة صدرية لاحقاً، تظهر أعراضها أولاً كضعف انتصاب." },
      { type: "callout" as const, text: "إذا كنت تعاني من ضعف الانتصاب وعمرك أقل من ٥٠ — هذا ليس مجرد مشكلة جنسية، بل قد يكون إنذاراً مبكراً يستحقّ الفحص." },
      { type: "heading" as const, text: "السكّري وضعف الانتصاب" },
      { type: "paragraph" as const, text: "٨٦٪ من مرضى السكري من النوع الثاني يعانون من درجة ما من ضعف الانتصاب. ارتفاع السكر المزمن يؤذي الأعصاب والأوعية الدموية الدقيقة، ممّا يؤثّر مباشرة على القدرة الجنسية." },
      { type: "paragraph" as const, text: "الخبر الجيد: السيطرة على السكر، فقدان الوزن، وأدوية PDE5 يمكن أن تحسّن الوضع بشكل ملحوظ حتى مع وجود السكّري." },
    ],
  },
  {
    slug: "lifestyle-changes",
    cat: "نمط حياة",
    title: "خمس تغييرات في نمط الحياة تحسّن الأداء بدون دواء",
    author: "فريق لاباس",
    readTime: "٦ دقائق",
    date: "",
    refs: "JAMA Internal Medicine, Am J Med",
    refsCount: "٣",
    content: [
      { type: "lead" as const, text: "النوم، الرياضة، التوتّر، التدخين، والوزن — الدراسات تؤكّد الأرقام." },
      { type: "heading" as const, text: "١. خسارة الوزن الزائد" },
      { type: "paragraph" as const, text: "دراسة نُشرت في JAMA أظهرت أن خسارة ١٠٪ من وزن الجسم حسّنت وظيفة الانتصاب عند ثلث المشاركين بدون أي دواء. الدهون الزائدة تخفض التستوستيرون وتزيد الالتهابات." },
      { type: "heading" as const, text: "٢. التمارين الرياضية" },
      { type: "paragraph" as const, text: "١٥٠ دقيقة من التمارين المعتدلة أسبوعياً (مشي سريع، سباحة) تحسّن تدفّق الدم وتخفض ضغط الدم. تمارين كيجل تقوّي عضلات الحوض المسؤولة عن الانتصاب." },
      { type: "heading" as const, text: "٣. تحسين النوم" },
      { type: "paragraph" as const, text: "٧-٩ ساعات نوم جيد ضرورية. قلة النوم تخفض التستوستيرون بنسبة تصل إلى ١٥٪. انقطاع النفس أثناء النوم مرتبط بقوة بضعف الانتصاب." },
      { type: "heading" as const, text: "٤. الإقلاع عن التدخين" },
      { type: "paragraph" as const, text: "التدخين يضيّق الأوعية الدموية ويتلف بطانتها. دراسات أثبتت تحسّناً ملحوظاً في الانتصاب خلال ٦ أشهر من الإقلاع." },
      { type: "heading" as const, text: "٥. إدارة التوتر" },
      { type: "paragraph" as const, text: "الكورتيزول المرتفع (هرمون التوتر) يثبّط التستوستيرون ويعيق الاستجابة الجنسية. التأمل، التنفس العميق، وتقليل ساعات العمل — كلها تساعد." },
    ],
  },
];

export default function SexualHealth() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "quarterly" | "annual">("quarterly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openArticle, setOpenArticle] = useState<number | null>(null);

  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  const faqItems = [
    {
      q: "هل هذه الأدوية أصلية أم مقلّدة؟",
      a: "أصلية وبوصفة طبّية. Sildenafil و Tadalafil جنريك معتمد — نفس المادة الفعّالة في Viagra و Cialis، تصنيع شركات دوائية مرخّصة، ومسجّلة لدى هيئة الغذاء والدواء السعودية.",
    },
    {
      q: "ماذا لو كنت أتناول دواء للضغط أو القلب؟",
      a: "هذا بالضبط سبب وجود تقييم طبّي. بعض أدوية الضغط (خاصة النترات) تتعارض تعارضاً خطيراً مع PDE5. الطبيب يراجع كل أدويتك قبل الموافقة على الوصفة.",
    },
    {
      q: "كم يستغرق وصول الطلبية؟",
      a: "خلال ٤٨ ساعة داخل الرياض. الخدمة متوفّرة حالياً في الرياض فقط. التوصيل مجاني في كل الباقات.",
    },
    {
      q: "هل يمكنني الإلغاء متى شئت؟",
      a: "نعم. إلغاء فوري من التطبيق، بدون رسوم، بدون أسئلة. ضمان استرداد كامل خلال أوّل ٧ أيام إن لم تكن قد فتحت العبوة.",
    },
    {
      q: "ماذا لو لم يعمل الدواء معي؟",
      a: "طبيبك سيعدّل الجرعة أو يحوّلك لدواء آخر مجاناً. في بعض الحالات، ضعف الانتصاب يحتاج تقييماً أعمق (هرموني، قلبي) — طبيبك يوجّهك للخطوة التالية.",
    },
  ];

  const monthlyFeatures = [
    "تقييم طبّي كامل",
    "وصفة من طبيب مرخّص",
    "٨ جرعات شهرياً",
    "استشارة عبر المحادثة",
    "توصيل مجاني",
  ];

  const quarterlyFeatures = [
    "تقييم طبّي كامل",
    "وصفة من طبيب مرخّص",
    "٢٤ جرعة كل ٣ أشهر",
    "استشارة عبر المحادثة",
    "توصيل مجاني",
    "إمكانية تبديل الدواء مجاناً",
  ];

  const annualFeatures = [
    "كل ما في الباقة الربعيّة",
    "٩٦ جرعة سنوياً",
    "فحص دم سنوي مجاني — من مختبر معتمد",
    "إعادة تقييم مع طبيبك",
    "أولوية في الدعم",
  ];

  return (
    <div dir="rtl" className={styles.app}>
      {/* ─── LICENSE TAG ─── */}
      <div style={{ background: "#f2faed", borderBottom: "0.5px solid rgba(23,52,4,0.08)", padding: "8px 48px", textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#27500A", letterSpacing: "0.2px" }}>
        شركة سعودية مرخّصة من وزارة الصحة &middot; ترخيص رقم 1400055938
      </div>

      {/* ─── NAV ─── */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <div className={styles.mark} />
          <span className={styles.bname}>لاباس</span>
        </Link>
        <div className={styles.navMid}>
          <span className={styles.navLink}>الفيتامينات</span>
          <span className={styles.navLink}>إدارة الوزن</span>
          <span className={`${styles.navLink} ${styles.navLinkActive}`}>الصحة الجنسية</span>
          <span className={styles.navLink}>المدوّنة</span>
        </div>
        <Link href="/sexualHealth/subscribe" className={styles.navCta}>
          اشترك
        </Link>
      </nav>

      {/* ─── HERO ─── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          {/* TEXT COLUMN */}
          <div>
            <div className={styles.heroEyebrow}>
              <span className={styles.heroEyebrowDot} />
              الصحة الجنسية للرجل &middot; بسرّيّة تامّة
            </div>

            <h1 className={styles.heroH1}>
              الأداء اللي تبيه،<br/><span className={styles.dim}>بخصوصية تامة</span>
            </h1>

            <p className={styles.heroLead}>
              علاج متكامل بوصفة طبيب، وتتابع طبيبك متى ما احتجت.
            </p>

            <p className={styles.heroSub}>
              ضعف الانتصاب، الالتهابات، سرعة القذف — احصل على تشخيص وعلاج شخصي من أطبّاء ذوي خبرة، بخصوصية تامّة.
            </p>

            <ul className={styles.heroBullets}>
              <li>
                <span className={styles.hbCk}>&#10003;</span>
                علاجات بوصفة طبّية لقدرة تحمّل أفضل وأطول
              </li>
              <li>
                <span className={styles.hbCk}>&#10003;</span>
                عمليّة خاصّة وسرّيّة — ١٠٠٪ أونلاين
              </li>
            </ul>

            <div className={styles.heroBadges}>
              <div className={`${styles.brandBadge} ${styles.bbSil}`}>
                <div className={styles.bbDot} />
                ضعف الانتصاب
              </div>
              <div className={`${styles.brandBadge} ${styles.bbTad}`}>
                <div className={styles.bbDot} />
                الالتهابات في المنطقة الحساسة
              </div>
              <div className={`${styles.brandBadge} ${styles.bbSil}`}>
                <div className={styles.bbDot} />
                سرعة القذف
              </div>
            </div>

            <div className={styles.heroCtas}>
              <Link href="/sexualHealth/subscribe" className={styles.heroBtn}>
                اشترك الآن
                <span className={styles.heroBtnArr}>&larr;</span>
              </Link>
            </div>

            <div className={styles.heroTrust}>
              <div className={styles.heroAva}>
                <div className={`${styles.heroAv} ${styles.heroAv1}`}>م</div>
                <div className={`${styles.heroAv} ${styles.heroAv2}`}>ع</div>
                <div className={`${styles.heroAv} ${styles.heroAv3}`}>ف</div>
                <div className={`${styles.heroAv} ${styles.heroAv4}`}>+</div>
              </div>
              <span className={styles.heroTrustTxt}>
                <strong>٢٬٣٠٠+</strong> رجل بدأ علاجه مع لاباس
              </span>
            </div>
          </div>

          {/* VISUAL COLUMN */}
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
              <div className={`${styles.heroOrn} ${styles.h1}`}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 20 L4 12 C1 9 3 4 7 4 C9.5 4 11 5.5 12 7 C13 5.5 14.5 4 17 4 C21 4 23 9 20 12 Z" fill="#173404" />
                </svg>
              </div>
              <div className={`${styles.heroOrn} ${styles.h2}`}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 20 L4 12 C1 9 3 4 7 4 C9.5 4 11 5.5 12 7 C13 5.5 14.5 4 17 4 C21 4 23 9 20 12 Z" fill="#173404" opacity="0.65" />
                </svg>
              </div>
              <div className={`${styles.heroOrn} ${styles.h3}`}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 20 L4 12 C1 9 3 4 7 4 C9.5 4 11 5.5 12 7 C13 5.5 14.5 4 17 4 C21 4 23 9 20 12 Z" fill="#173404" opacity="0.55" />
                </svg>
              </div>
              <div className={`${styles.heroOrn} ${styles.h4}`}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 20 L4 12 C1 9 3 4 7 4 C9.5 4 11 5.5 12 7 C13 5.5 14.5 4 17 4 C21 4 23 9 20 12 Z" fill="#173404" opacity="0.55" />
                </svg>
              </div>
            </div>
            {/* Spinning pill */}
            <div className={`${styles.pillWrap} ${styles.blister}`}>
              <svg viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="hp-body" cx="0.42" cy="0.35" r="0.7">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="0.55" stopColor="#f2ede5" />
                    <stop offset="0.9" stopColor="#d4ccbd" />
                    <stop offset="1" stopColor="#b0a695" />
                  </radialGradient>
                  <filter id="hp-grain" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves={2} seed="11" stitchTiles="stitch" result="fine" />
                    <feColorMatrix in="fine" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 -0.2" result="fineMask" />
                    <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves={2} seed="4" result="medium" />
                    <feColorMatrix in="medium" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.32 -0.16" result="mediumMask" />
                    <feComposite in="fineMask" in2="mediumMask" operator="arithmetic" k1="0" k2="1" k3="0.8" k4="0" result="combined" />
                    <feComposite in="combined" in2="SourceGraphic" operator="in" />
                  </filter>
                  <filter id="hp-speckle" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="3" numOctaves={1} seed="23" result="dots" />
                    <feColorMatrix in="dots" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.35 -0.3" result="bright" />
                    <feComposite in="bright" in2="SourceGraphic" operator="in" />
                  </filter>
                  <filter id="hp-mottle" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves={3} seed="7" result="blotch" />
                    <feColorMatrix in="blotch" values="0 0 0 0 0.55  0 0 0 0 0.52  0 0 0 0 0.48  0 0 0 0.25 -0.05" result="tinted" />
                    <feComposite in="tinted" in2="SourceGraphic" operator="in" />
                  </filter>
                  <filter id="hp-atoms-dark" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves={1} seed="47" result="noise" />
                    <feColorMatrix in="noise" values="0 0 0 0 0.09  0 0 0 0 0.205  0 0 0 0 0.015  0 0 0 2.4 -1.15" result="thresh" />
                    <feComposite in="thresh" in2="SourceGraphic" operator="in" />
                  </filter>
                  <filter id="hp-atoms-bright" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="2.9" numOctaves={1} seed="89" result="noise" />
                    <feColorMatrix in="noise" values="0 0 0 0 0.302  0 0 0 0 0.647  0 0 0 0 0.078  0 0 0 2.4 -1.2" result="thresh" />
                    <feComposite in="thresh" in2="SourceGraphic" operator="in" />
                  </filter>
                  <filter id="hp-atoms-mid" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="3.2" numOctaves={1} seed="131" result="noise" />
                    <feColorMatrix in="noise" values="0 0 0 0 0.22  0 0 0 0 0.45  0 0 0 0 0.08  0 0 0 2.2 -1.1" result="thresh" />
                    <feComposite in="thresh" in2="SourceGraphic" operator="in" />
                  </filter>
                  <filter id="hp-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                    <feOffset in="blur" dx="2" dy="3" result="offset" />
                    <feComposite in="offset" in2="SourceAlpha" operator="out" result="innerCut" />
                    <feGaussianBlur in="innerCut" stdDeviation="1.5" result="softInner" />
                    <feFlood floodColor="#6b6050" floodOpacity="0.55" result="col" />
                    <feComposite in="col" in2="softInner" operator="in" result="finalShadow" />
                    <feComposite in="finalShadow" in2="SourceGraphic" operator="in" />
                  </filter>
                </defs>

                <circle cx="180" cy="180" r="140" fill="url(#hp-body)" />
                <circle cx="180" cy="180" r="140" fill="#f2ede5" filter="url(#hp-mottle)" opacity="0.55" />
                <circle cx="180" cy="180" r="140" fill="#f2ede5" filter="url(#hp-grain)" opacity="0.8" />
                <circle cx="180" cy="180" r="140" fill="#f2ede5" filter="url(#hp-speckle)" opacity="0.45" />
                <circle cx="180" cy="180" r="140" fill="#173404" filter="url(#hp-atoms-dark)" opacity="0.9" />
                <circle cx="180" cy="180" r="140" fill="#4DA514" filter="url(#hp-atoms-bright)" opacity="0.75" />
                <circle cx="180" cy="180" r="140" fill="#5B8B3B" filter="url(#hp-atoms-mid)" opacity="0.7" />

                <text x="185" y="231" fill="#000000" fontFamily="Inter, system-ui, sans-serif" fontSize="170" fontWeight="700" textAnchor="middle" letterSpacing="-5" opacity="0.09">L</text>
                <text x="185" y="231" fontFamily="Inter, system-ui, sans-serif" fontSize="170" fontWeight="700" textAnchor="middle" letterSpacing="-5" filter="url(#hp-inner-shadow)">L</text>
              </svg>
            </div>

            {/* Hidden flanking pills */}
            <div className={`${styles.pillWrap} ${styles.pillSil}`} />
            <div className={`${styles.pillWrap} ${styles.pillTad}`} />
          </div>
        </div>
      </section>

      {/* ─── AVAILABILITY STRIP ─── */}
      <div className={styles.avail}>
        <span className={styles.availTtl}>الحالات التي نعالجها عبر منصّة لاباس — بإشراف طبّي</span>
        <div className={styles.availBrands}>
          <div className={styles.availBrand}>
            <div className={`${styles.availBrandMark} ${styles.abSil}`}>٠١</div>
            <div>
              <div className={styles.availBrandNm}>ضعف الانتصاب</div>
              <div className={styles.availBrandSub}>تشخيص وعلاج بوصفة طبّية</div>
            </div>
          </div>
          <div className={styles.availBrand}>
            <div className={`${styles.availBrandMark} ${styles.abTad}`}>٠٢</div>
            <div>
              <div className={styles.availBrandNm}>الالتهابات في المنطقة الحساسة</div>
              <div className={styles.availBrandSub}>تقييم ووصف العلاج المناسب</div>
            </div>
          </div>
          <div className={styles.availBrand}>
            <div className={`${styles.availBrandMark} ${styles.abSil}`}>٠٣</div>
            <div>
              <div className={styles.availBrandNm}>سرعة القذف</div>
              <div className={styles.availBrandSub}>خطّة علاج شخصية ومتابعة</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── STATS STRIP ─── */}
      <section className={styles.strip}>
        <div className={styles.stripHead}>
          <h2 className={styles.stripTtl}>
            مشكلة شائعة أكثر مما يُظنّ
          </h2>
          <span className={styles.stripSrc}>
            المصدر: Arab J Urology، J Sex Medicine، Cureus
          </span>
        </div>
        <div className={styles.stripGrid}>
          <div className={styles.stripStat}>
            <div className={styles.stripNum}>٤٠<sup>%</sup></div>
            <div className={styles.stripDesc}>من الرجال العرب فوق ٤٠ سنة يعانون من درجة من ضعف الانتصاب</div>
          </div>
          <div className={styles.stripStat}>
            <div className={styles.stripNum}>٨٦<sup>%</sup></div>
            <div className={styles.stripDesc}>من مرضى السكّر من النوع الثاني يعانون من ضعف انتصاب بدرجة ما</div>
          </div>
          <div className={styles.stripStat}>
            <div className={styles.stripNum}>٢٨<sup>%</sup></div>
            <div className={styles.stripDesc}>فقط من المصابين يفتحون الموضوع مع طبيبهم</div>
          </div>
          <div className={styles.stripStat}>
            <div className={styles.stripNum}>٦٦<sup>%</sup></div>
            <div className={styles.stripDesc}>نسبة التحسّن مع Sildenafil في التجارب السريرية الكبرى</div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className={styles.how}>
        <div className={styles.secEyebrow}>
          <span className={styles.secEyebrowDot} />
          كيف يعمل البرنامج
        </div>
        <h2 className={styles.secTtl}>أربع خطوات — كلّها من بيتك</h2>
        <p className={styles.secSub}>
          لا زيارات عيادة، لا مواعيد. تقييم سريع، وصفة من طبيب، وتوصيل سريع.
        </p>

        <div className={styles.howSteps}>
          <div className={`${styles.howStep} ${styles.howStepActive}`}>
            <div className={styles.howStepNum}>١</div>
            <h3 className={styles.howStepTtl}>تقييم طبّي</h3>
            <p className={styles.howStepDesc}>
              ٢٠ سؤالاً عن حالتك الصحّية والسوابق الدوائية والأعراض — ٤ دقائق.
            </p>
          </div>
          <div className={styles.howStep}>
            <div className={styles.howStepNum}>٢</div>
            <h3 className={styles.howStepTtl}>مراجعة طبيب</h3>
            <p className={styles.howStepDesc}>
              طبيب مرخّص يراجع ملفّك خلال ٢٤ ساعة، ويحدّد العلاج والجرعة المناسبة لك.
            </p>
          </div>
          <div className={styles.howStep}>
            <div className={styles.howStepNum}>٣</div>
            <h3 className={styles.howStepTtl}>توصيل سريع</h3>
            <p className={styles.howStepDesc}>
              يوصلك طلبك خلال ٤٨ ساعة داخل الرياض.
            </p>
          </div>
          <div className={styles.howStep}>
            <div className={styles.howStepNum}>٤</div>
            <h3 className={styles.howStepTtl}>استشر الطبيب ٢٤ ساعة في أي وقت</h3>
            <p className={styles.howStepDesc}>
              تواصل مع طبيبك عبر المحادثة لتعديل الجرعة أو الردّ على أي سؤال — بدون رسوم إضافية.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CONDITIONS WE TREAT ─── */}
      <section className={styles.treats}>
        <div className={styles.secEyebrow}>
          <span className={styles.secEyebrowDot} />
          الحالات التي نعالجها
        </div>
        <h2 className={styles.secTtl}>ثلاث حالات — نعالجها من بيتك</h2>
        <p className={styles.secSub}>
          تقييم طبّي دقيق، تشخيص من طبيب مرخّص، وعلاج مخصّص لحالتك — بخصوصية تامّة.
        </p>

        <div className={styles.treatsGrid}>
          {/* Erectile Dysfunction */}
          <div className={styles.treatCard}>
            <div className={styles.treatNmRow}>
              <div className={styles.treatArt}>
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="48" fill="#7aa3d4" />
                  <circle cx="60" cy="60" r="48" fill="#bfd6ef" opacity="0.4" />
                  <circle cx="48" cy="44" r="14" fill="#ffffff" opacity="0.2" />
                </svg>
              </div>
              <h3 className={styles.treatNm}>ضعف الانتصاب</h3>
            </div>
            <div className={styles.treatSub}>تشخيص وعلاج طبّي متكامل</div>
            <p className={styles.treatDesc}>
              مشكلة شائعة تصيب أكثر من ٤٠٪ من الرجال فوق الأربعين. نوفّر تقييماً طبّياً شاملاً وعلاجاً بوصفة طبّية مناسبة لحالتك.
            </p>
            <div className={styles.treatMeta}>
              <div className={styles.treatPill}>تقييم طبّي</div>
              <div className={styles.treatPill}>وصفة مخصّصة</div>
            </div>
          </div>

          {/* Infections */}
          <div className={styles.treatCard}>
            <div className={styles.treatNmRow}>
              <div className={styles.treatArt}>
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="48" fill="#d87a6c" />
                  <circle cx="60" cy="60" r="48" fill="#f2a59a" opacity="0.4" />
                  <circle cx="48" cy="44" r="14" fill="#ffffff" opacity="0.2" />
                </svg>
              </div>
              <h3 className={styles.treatNm}>الالتهابات في المنطقة الحساسة</h3>
            </div>
            <div className={styles.treatSub}>تقييم ووصف العلاج المناسب</div>
            <p className={styles.treatDesc}>
              التهابات فطرية أو بكتيرية في المنطقة الحساسة. طبيبك يحدّد نوع الالتهاب ويصف العلاج المناسب — بدون حرج.
            </p>
            <div className={styles.treatMeta}>
              <div className={styles.treatPill}>تشخيص دقيق</div>
              <div className={styles.treatPill}>علاج موجّه</div>
            </div>
          </div>

          {/* Premature Ejaculation */}
          <div className={styles.treatCard}>
            <div className={styles.treatNmRow}>
              <div className={styles.treatArt}>
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="48" fill="#5B8B3B" />
                  <circle cx="60" cy="60" r="48" fill="#BCE1A4" opacity="0.4" />
                  <circle cx="48" cy="44" r="14" fill="#ffffff" opacity="0.2" />
                </svg>
              </div>
              <h3 className={styles.treatNm}>سرعة القذف</h3>
            </div>
            <div className={styles.treatSub}>خطّة علاج شخصية ومتابعة</div>
            <p className={styles.treatDesc}>
              من أكثر المشاكل الجنسية شيوعاً عند الرجال. طبيبك يضع لك خطّة علاج شخصية تشمل الأدوية والنصائح السلوكية.
            </p>
            <div className={styles.treatMeta}>
              <div className={styles.treatPill}>علاج دوائي</div>
              <div className={styles.treatPill}>إرشاد سلوكي</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PILLARS ─── */}
      <section className={styles.pillars}>
        <div style={{ paddingBottom: "10px" }}>
          <div className={styles.secEyebrow}>
            <span className={styles.secEyebrowDot} />
            لماذا لاباس
          </div>
          <h2 className={styles.secTtl}>خمس أسباب تختار البرنامج</h2>
          <p className={styles.secSub}>
            لأن الخصوصية ليست ترفاً — هي شرط أساسي لبرنامج علاج مثل هذا.
          </p>
        </div>

        {/* Shared SVG defs block for pill symbols */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <filter id="pp-grain" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="6" numOctaves={2} seed="11" stitchTiles="stitch" result="fine" />
              <feColorMatrix in="fine" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 -0.2" result="fineMask" />
              <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves={2} seed="4" result="medium" />
              <feColorMatrix in="medium" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.32 -0.16" result="mediumMask" />
              <feComposite in="fineMask" in2="mediumMask" operator="arithmetic" k1="0" k2="1" k3="0.8" k4="0" result="combined" />
              <feComposite in="combined" in2="SourceGraphic" operator="in" />
            </filter>
            <filter id="pp-speckle" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="8" numOctaves={1} seed="23" result="dots" />
              <feColorMatrix in="dots" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.35 -0.3" result="bright" />
              <feComposite in="bright" in2="SourceGraphic" operator="in" />
            </filter>
            <filter id="pp-mottle" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={3} seed="7" result="blotch" />
              <feColorMatrix in="blotch" values="0 0 0 0 0.55  0 0 0 0 0.52  0 0 0 0 0.48  0 0 0 0.22 -0.05" result="tinted" />
              <feComposite in="tinted" in2="SourceGraphic" operator="in" />
            </filter>
            <filter id="pp-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.9" result="blur" />
              <feOffset in="blur" dx="0.6" dy="0.9" result="offset" />
              <feComposite in="offset" in2="SourceAlpha" operator="out" result="innerCut" />
              <feGaussianBlur in="innerCut" stdDeviation="0.45" result="softInner" />
              <feFlood floodColor="#6b6050" floodOpacity="0.55" result="col" />
              <feComposite in="col" in2="softInner" operator="in" result="finalShadow" />
              <feComposite in="finalShadow" in2="SourceGraphic" operator="in" />
            </filter>

            <radialGradient id="pp-white" cx="0.42" cy="0.35" r="0.7">
              <stop offset="0" stopColor="#ffffff" /><stop offset="0.55" stopColor="#f2ede5" /><stop offset="0.9" stopColor="#d4ccbd" /><stop offset="1" stopColor="#b0a695" />
            </radialGradient>
            <radialGradient id="pp-coral" cx="0.42" cy="0.35" r="0.7">
              <stop offset="0" stopColor="#f2a59a" /><stop offset="0.55" stopColor="#d87a6c" /><stop offset="0.9" stopColor="#a04a3a" /><stop offset="1" stopColor="#6e2a1d" />
            </radialGradient>
            <radialGradient id="pp-blue" cx="0.42" cy="0.35" r="0.7">
              <stop offset="0" stopColor="#bfd6ef" /><stop offset="0.55" stopColor="#7aa3d4" /><stop offset="0.9" stopColor="#3d6ca8" /><stop offset="1" stopColor="#1d3e6e" />
            </radialGradient>

            <symbol id="pill-blue" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="url(#pp-blue)" />
              <circle cx="50" cy="50" r="40" fill="#7aa3d4" filter="url(#pp-mottle)" opacity="0.55" />
              <circle cx="50" cy="50" r="40" fill="#7aa3d4" filter="url(#pp-grain)" opacity="0.8" />
              <circle cx="50" cy="50" r="40" fill="#7aa3d4" filter="url(#pp-speckle)" opacity="0.4" />
            </symbol>
            <symbol id="pill-coral" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="url(#pp-coral)" />
              <circle cx="50" cy="50" r="40" fill="#d87a6c" filter="url(#pp-mottle)" opacity="0.55" />
              <circle cx="50" cy="50" r="40" fill="#d87a6c" filter="url(#pp-grain)" opacity="0.8" />
              <circle cx="50" cy="50" r="40" fill="#d87a6c" filter="url(#pp-speckle)" opacity="0.4" />
            </symbol>
          </defs>
        </svg>

        <div className={styles.pillarsGrid}>
          {/* 1. Privacy */}
          <div className={styles.pillar}>
            <div className={styles.pillarIc} style={{ background: "#BCE1A4" }}>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 6 L36 11 V22 C36 30 31 36 24 40 C17 36 12 30 12 22 V11 Z" fill="#4DA514" opacity="0.5" />
                <path d="M24 9 L33 13 V22 C33 28 29 33 24 36 C19 33 15 28 15 22 V13 Z" fill="#5B8B3B" />
                <rect x="19" y="22" width="10" height="9" rx="1.5" fill="#4DA514" />
                <path d="M20.5 22 V19 a3.5 3.5 0 0 1 7 0 V22" stroke="#4DA514" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <circle cx="24" cy="26" r="1.2" fill="#BCE1A4" />
                <line x1="24" y1="26" x2="24" y2="28.5" stroke="#BCE1A4" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <h4 className={styles.pillarTtl}>خصوصية تامّة</h4>
            <p className={styles.pillarDesc}>رقم جوّالك لا يُشارَك، ودفعك يظهر &quot;Labass&quot; على البيان فقط.</p>
          </div>

          {/* 3. Authentic */}
          <div className={styles.pillar}>
            <div className={styles.pillarIc} style={{ background: "#BCE1A4" }}>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 7 L28 9 L33 8.5 L34.5 13 L39 15 L37.5 19.5 L39 24 L34.5 26 L33 30.5 L28 30 L24 32 L20 30 L15 30.5 L13.5 26 L9 24 L10.5 19.5 L9 15 L13.5 13 L15 8.5 L20 9 Z" fill="#4DA514" opacity="0.5" />
                <path d="M24 10 L27 11.5 L31 11 L32 14.5 L35.5 16 L34.5 19.5 L35.5 23 L32 24.5 L31 28 L27 27.5 L24 29 L21 27.5 L17 28 L16 24.5 L12.5 23 L13.5 19.5 L12.5 16 L16 14.5 L17 11 L21 11.5 Z" fill="#5B8B3B" />
                <path d="M18 19.5 L22 23.5 L30 15.5" stroke="#BCE1A4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <h4 className={styles.pillarTtl}>أصلي ومضمون</h4>
            <p className={styles.pillarDesc}>جنريك معتمد — نفس المادة الفعّالة لـ Viagra و Cialis، بسعر أقلّ بكثير.</p>
          </div>

          {/* 4. Pricing */}
          <div className={styles.pillar}>
            <div className={styles.pillarIc} style={{ background: "#BCE1A4" }}>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 8 L40 8 L40 23 L24 39 Q22 41 20 39 L9 28 Q7 26 9 24 Z" fill="#4DA514" opacity="0.5" />
                <path d="M25 10 L38 10 L38 22 L23 37 Q22 38 21 37 L11 27 Q10 26 11 25 Z" fill="#5B8B3B" />
                <circle cx="33" cy="15" r="2.4" fill="#BCE1A4" />
                <circle cx="33" cy="15" r="1" fill="#4DA514" />
              </svg>
            </div>
            <h4 className={styles.pillarTtl}>سعر ثابت، بلا مفاجآت</h4>
            <p className={styles.pillarDesc}>اشتراك بسعر واضح، توصيل مجاني، ولا رسوم استشارة إضافية. ألغِ متى شئت.</p>
          </div>

          {/* 5. Consultation */}
          <div className={styles.pillar}>
            <div className={styles.pillarIc} style={{ background: "#BCE1A4" }}>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16 Q8 11 13 11 L35 11 Q40 11 40 16 L40 28 Q40 33 35 33 L20 33 L13 39 L13 33 Q8 33 8 28 Z" fill="#4DA514" opacity="0.5" />
                <path d="M10 17 Q10 14 13 14 L34 14 Q37 14 37 17 L37 27 Q37 30 34 30 L20 30 L15 34 L15 30 Q10 30 10 27 Z" fill="#5B8B3B" />
                <circle cx="18" cy="22" r="1.8" fill="#BCE1A4" />
                <circle cx="24" cy="22" r="1.8" fill="#BCE1A4" />
                <circle cx="30" cy="22" r="1.8" fill="#BCE1A4" />
              </svg>
            </div>
            <h4 className={styles.pillarTtl}>استشر الطبيب ٢٤ ساعة</h4>
            <p className={styles.pillarDesc}>تواصل مباشر مع طبيبك عبر المحادثة في أي وقت — بدون حجز، بدون انتظار، وبدون رسوم.</p>
          </div>

          {/* 6. Shipping */}
          <div className={styles.pillar}>
            <div className={styles.pillarIc} style={{ background: "#BCE1A4" }}>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 17 L24 9 L43 17 L43 34 L24 42 L5 34 Z" fill="#4DA514" opacity="0.5" />
                <path d="M8 18.5 L24 12 L40 18.5 L40 32.5 L24 39 L8 32.5 Z" fill="#5B8B3B" />
                <path d="M8 18.5 L24 25 L40 18.5" stroke="#4DA514" strokeWidth="1.5" fill="none" />
                <path d="M24 25 L24 39" stroke="#4DA514" strokeWidth="1.2" fill="none" opacity="0.6" />
                <rect x="14" y="21.5" width="7" height="5" rx="0.5" fill="#BCE1A4" />
              </svg>
            </div>
            <h4 className={styles.pillarTtl}>توصيل سريع</h4>
            <p className={styles.pillarDesc}>خلال ٤٨ ساعة داخل الرياض. توصيل مجاني على كل الباقات.</p>
          </div>
        </div>
      </section>

      {/* ─── PLANS ─── */}
      <section id="plansSec" className={styles.plansSec}>
        <div className={styles.secEyebrow}>
          <span className={styles.secEyebrowDot} />
          الباقات والأسعار
        </div>
        <h2 className={styles.secTtl}>اختر باقتك</h2>
        <p className={styles.secSub}>
          كلما زادت المدة، زاد التوفير. جميع الباقات تشمل التقييم والوصفة والتوصيل — بدون رسوم إضافية.
        </p>

        <div className={styles.plansRow}>
          {/* Monthly */}
          <div
            className={`${styles.planCard} ${selectedPlan === "monthly" ? styles.planCardSelected : ""}`}
            onClick={() => setSelectedPlan("monthly")}
          >
            <div className={styles.planRadio} />
            <p className={styles.planName}>شهري</p>
            <div className={styles.planPrice}>
              <span className={styles.planNum}>١٤٩</span>
              <span className={styles.planCur}>ريال / شهرياً</span>
            </div>
            <p className={styles.planPeriod}>
              يُجدّد كل شهر &middot; ألغِ متى شئت
            </p>
            <ul className={styles.planFeats}>
              {monthlyFeatures.map((f, i) => (
                <li key={i} className={styles.planFeat}>
                  <span className={styles.planCk}>&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/sexualHealth/subscribe" className={styles.planCta}>
              اشترك شهرياً
              <span className={styles.planCtaArr}>&larr;</span>
            </Link>
          </div>

          {/* Quarterly - Popular */}
          <div
            className={`${styles.planCard} ${styles.popular} ${selectedPlan === "quarterly" ? styles.planCardSelected : ""}`}
            onClick={() => setSelectedPlan("quarterly")}
          >
            <div className={styles.planRadio} />
            <span className={styles.planPopBadge}>الأكثر طلباً &middot; وفّر ٢٠٪</span>
            <p className={styles.planName}>كل ٣ أشهر</p>
            <div className={styles.planPrice}>
              <span className={styles.planNum}>٣٥٧</span>
              <span className={styles.planCur}>ريال / كل ٣ أشهر</span>
            </div>
            <p className={styles.planPeriod}>
              ~١١٩ ريال شهرياً &middot; توفّر ٩٠ ريال
            </p>
            <ul className={styles.planFeats}>
              {quarterlyFeatures.map((f, i) => (
                <li key={i} className={styles.planFeat}>
                  <span className={styles.planCk}>&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/sexualHealth/subscribe" className={styles.planCta}>
              اشترك لـ ٣ أشهر
              <span className={styles.planCtaArr}>&larr;</span>
            </Link>
          </div>

          {/* Annual */}
          <div
            className={`${styles.planCard} ${selectedPlan === "annual" ? styles.planCardSelected : ""}`}
            onClick={() => setSelectedPlan("annual")}
          >
            <div className={styles.planRadio} />
            <span className={styles.planSaveBadge}>وفّر ٣٠٪</span>
            <p className={styles.planName}>سنوي</p>
            <div className={styles.planPrice}>
              <span className={styles.planNum}>١٬٢٥٠</span>
              <span className={styles.planCur}>ريال / سنوياً</span>
            </div>
            <p className={styles.planPeriod}>
              ~١٠٤ ريال شهرياً &middot; توفّر ٥٣٨ ريال
            </p>
            <ul className={styles.planFeats}>
              {annualFeatures.map((f, i) => (
                <li key={i} className={styles.planFeat}>
                  <span className={styles.planCk}>&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/sexualHealth/subscribe" className={styles.planCta}>
              اشترك سنوياً
              <span className={styles.planCtaArr}>&larr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className={styles.test}>
        <div className={styles.secEyebrow}>
          <span className={styles.secEyebrowDot} />
          شهادات حقيقية
        </div>
        <h2 className={styles.secTtl}>رجال مثلك — بدؤوا وعادت الثقة</h2>
        <p className={styles.secSub}>
          كل شهادة موثّقة بطلب من صاحبها، ومكتوبة بكلماته.
        </p>

        <div className={styles.testGrid}>
          {/* Card 1 */}
          <div className={styles.testCard}>
            <div className={styles.testQuote}>&ldquo;</div>
            <p className={styles.testTxt}>
              كنت أتردّد من زيارة العيادة لسنوات. مع لاباس، أكملت كل شيء من جوّالي خلال مساء واحد. الدواء وصل بعد يومين في علبة عاديّة، ما فيها أي شيء يلفت الانتباه.
            </p>
            <div className={styles.testAuthor}>
              <div className={`${styles.testAv} ${styles.testAv1}`}>م.ع</div>
              <div>
                <div className={styles.testName}>م. العنزي</div>
                <div className={styles.testMeta}>٤٢ سنة &middot; الرياض</div>
              </div>
              <span className={styles.testVt}>موثّق</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className={styles.testCard}>
            <div className={styles.testQuote}>&ldquo;</div>
            <p className={styles.testTxt}>
              الطبيب غيّر وصفتي من Sildenafil إلى Tadalafil بعد شهر، لأن الأول ما كان يناسب جدولي. التبديل تمّ عبر المحادثة خلال ساعتين، بدون رسوم جديدة.
            </p>
            <div className={styles.testAuthor}>
              <div className={`${styles.testAv} ${styles.testAv2}`}>ف.ح</div>
              <div>
                <div className={styles.testName}>ف. الحارثي</div>
                <div className={styles.testMeta}>٣٨ سنة &middot; الرياض</div>
              </div>
              <span className={styles.testVt}>موثّق</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className={styles.testCard}>
            <div className={styles.testQuote}>&ldquo;</div>
            <p className={styles.testTxt}>
              التقييم الطبّي كان دقيقاً — الطبيب نبّهني إلى تعارض بين دواء الضغط الذي أستخدمه و Sildenafil. حوّلوني لـ Tadalafil وشرح لي الفرق بصبر.
            </p>
            <div className={styles.testAuthor}>
              <div className={`${styles.testAv} ${styles.testAv3}`}>س.ق</div>
              <div>
                <div className={styles.testName}>س. القحطاني</div>
                <div className={styles.testMeta}>٥١ سنة &middot; الرياض</div>
              </div>
              <span className={styles.testVt}>موثّق</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG ─── */}
      <section className={styles.blog}>
        <div className={styles.blogHead}>
          <div>
            <div className={styles.secEyebrow}>
              <span className={styles.secEyebrowDot} />
              المدوّنة الطبّية
            </div>
            <h2 className={styles.secTtl}>معلومات موثّقة، بلا حرج</h2>
            <p className={styles.secSub}>
              مقالات يكتبها فريقنا الطبّي، كلّ جملة مسنودة بدراسة منشورة في مجلّة محكّمة.
            </p>
          </div>
        </div>

        <div className={styles.blogGrid}>
          {/* Featured Blog Card */}
          <div className={`${styles.blogCard} ${styles.feat}`} onClick={() => setOpenArticle(0)}>
            <div className={styles.blogThumb}>
              <span className={styles.blogCat}>صحة الرجل</span>
              <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bg-feat" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#173404" />
                    <stop offset="1" stopColor="#27500A" />
                  </linearGradient>
                </defs>
                <rect width="400" height="240" fill="url(#bg-feat)" />
                <g fill="#7ED957" opacity="0.08">
                  <circle cx="60" cy="40" r="2" />
                  <circle cx="340" cy="60" r="1.5" />
                  <circle cx="80" cy="200" r="2" />
                </g>
                <g transform="translate(50, 60)">
                  <text x="0" y="-10" fill="#C0DD97" fontFamily="Inter" fontSize="10" fontWeight="500" letterSpacing="0.5">انتشار ضعف الانتصاب بحسب العمر</text>
                  <g><rect x="0" y="80" width="40" height="30" fill="#7ED957" opacity="0.35" rx="2" /><text x="20" y="125" fill="#C0DD97" fontFamily="Inter" fontSize="8" textAnchor="middle">30-39</text><text x="20" y="75" fill="#EAF3DE" fontFamily="Inter" fontSize="9" fontWeight="700" textAnchor="middle">25%</text></g>
                  <g><rect x="60" y="62" width="40" height="48" fill="#7ED957" opacity="0.55" rx="2" /><text x="80" y="125" fill="#C0DD97" fontFamily="Inter" fontSize="8" textAnchor="middle">40-49</text><text x="80" y="57" fill="#EAF3DE" fontFamily="Inter" fontSize="9" fontWeight="700" textAnchor="middle">40%</text></g>
                  <g><rect x="120" y="38" width="40" height="72" fill="#7ED957" opacity="0.8" rx="2" /><text x="140" y="125" fill="#C0DD97" fontFamily="Inter" fontSize="8" textAnchor="middle">50-59</text><text x="140" y="33" fill="#EAF3DE" fontFamily="Inter" fontSize="9" fontWeight="700" textAnchor="middle">60%</text></g>
                  <g><rect x="180" y="14" width="40" height="96" fill="#7ED957" rx="2" /><text x="200" y="125" fill="#C0DD97" fontFamily="Inter" fontSize="8" textAnchor="middle">60-69</text><text x="200" y="9" fill="#EAF3DE" fontFamily="Inter" fontSize="9" fontWeight="700" textAnchor="middle">80%</text></g>
                  <g><rect x="240" y="2" width="40" height="108" fill="#7ED957" rx="2" /><text x="260" y="125" fill="#C0DD97" fontFamily="Inter" fontSize="8" textAnchor="middle">70+</text><text x="260" y="-3" fill="#EAF3DE" fontFamily="Inter" fontSize="9" fontWeight="700" textAnchor="middle">90%</text></g>
                  <line x1="0" y1="110" x2="290" y2="110" stroke="#C0DD97" strokeWidth="0.4" opacity="0.4" />
                </g>
              </svg>
            </div>
            <div className={styles.blogBody}>
              <div className={styles.blogMetaRow}>
                <span>فريق لاباس &middot; القسم الطبّي</span>
                <span className={styles.blogMetaDot} />
                <span>١٠ دقائق قراءة</span>
                <span className={styles.blogMetaDot} />
                <span>٢٢ أبريل ٢٠٢٦</span>
              </div>
              <h3 className={styles.blogTtl}>ضعف الانتصاب: كم هو شائع فعلاً؟ الأرقام التي يخفيها الصمت</h3>
              <p className={styles.blogEx}>
                مراجعة موسّعة لأبحاث الأندرولوجيا الخليجية — من دراسة El-Sakka في <em>Int J Impotence Research</em> التي رصدت خصائص ED في مرضى سعوديين، إلى GOSS العربية التي شملت ٨٠٤ رجلاً من الشرق الأوسط.
              </p>
              <div className={styles.blogCite}>
                <div className={styles.blogCiteIc}>٥</div>
                <div>مراجع من: <em>Arab J Urology</em>, <em>J Sex Medicine</em>, <em>Cureus</em></div>
              </div>
            </div>
          </div>

          {/* Blog Card 2 */}
          <div className={styles.blogCard} onClick={() => setOpenArticle(1)}>
            <div className={styles.blogThumb}>
              <span className={styles.blogCat}>فسيولوجيا</span>
              <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bg-a2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#d3e3f5" />
                    <stop offset="1" stopColor="#85aadd" />
                  </linearGradient>
                </defs>
                <rect width="400" height="200" fill="url(#bg-a2)" />
                <g transform="translate(200, 100)" stroke="#1b3d70" strokeWidth="1.5" fill="none">
                  <circle r="40" />
                  <circle cx="40" cy="0" r="8" fill="#ffffff" /><circle cx="-40" cy="0" r="8" fill="#ffffff" />
                  <circle cx="0" cy="40" r="8" fill="#ffffff" /><circle cx="0" cy="-40" r="8" fill="#ffffff" />
                  <circle cx="28" cy="28" r="5" fill="#ffffff" /><circle cx="-28" cy="-28" r="5" fill="#ffffff" />
                </g>
                <rect x="160" y="160" width="80" height="22" rx="11" fill="#ffffff" opacity="0.92" />
                <text x="200" y="175" fill="#1b3d70" fontFamily="Inter" fontSize="10" fontWeight="700" textAnchor="middle">PDE5</text>
              </svg>
            </div>
            <div className={styles.blogBody}>
              <div className={styles.blogMetaRow}>
                <span>فريق لاباس</span>
                <span className={styles.blogMetaDot} />
                <span>٧ دقائق</span>
              </div>
              <h3 className={styles.blogTtl}>كيف تعمل أدوية PDE5؟ الشرح العلمي المبسّط</h3>
              <p className={styles.blogEx}>Sildenafil و Tadalafil — نفس الآلية، لكن اختلافات مهمّة في التوقيت والمدّة.</p>
              <div className={styles.blogCite}>
                <div className={styles.blogCiteIc}>٤</div>
                <div><em>BMJ</em>, <em>FDA Labels</em></div>
              </div>
            </div>
          </div>

          {/* Blog Card 3 */}
          <div className={styles.blogCard} onClick={() => setOpenArticle(2)}>
            <div className={styles.blogThumb}>
              <span className={styles.blogCat}>قلب وسكّر</span>
              <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bg-a3" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#FCEBEB" />
                    <stop offset="1" stopColor="#f09595" />
                  </linearGradient>
                </defs>
                <rect width="400" height="200" fill="url(#bg-a3)" />
                <g transform="translate(200, 80)">
                  <path d="M 0 24 L -32 -8 Q -44 -18 -36 -30 Q -28 -42 -14 -36 Q -4 -32 0 -22 Q 4 -32 14 -36 Q 28 -42 36 -30 Q 44 -18 32 -8 Z" fill="#d9534f" stroke="#721c24" strokeWidth="1" />
                </g>
                <polyline points="50,150 90,150 110,130 130,170 150,110 170,150 230,150 250,140 270,150 310,150 330,130 350,170 370,150" fill="none" stroke="#721c24" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div className={styles.blogBody}>
              <div className={styles.blogMetaRow}>
                <span>فريق لاباس</span>
                <span className={styles.blogMetaDot} />
                <span>٨ دقائق</span>
              </div>
              <h3 className={styles.blogTtl}>ضعف الانتصاب كإنذار مبكّر لأمراض القلب والسكّري</h3>
              <p className={styles.blogEx}>العلاقة ليست صدفة — الأوعية الدموية في العضو الذكري الأضيق في الجسم.</p>
              <div className={styles.blogCite}>
                <div className={styles.blogCiteIc}>٤</div>
                <div><em>Circulation</em>, <em>JACC</em></div>
              </div>
            </div>
          </div>

          {/* Blog Card 4 */}
          <div className={styles.blogCard} onClick={() => setOpenArticle(3)}>
            <div className={styles.blogThumb}>
              <span className={styles.blogCat}>نمط حياة</span>
              <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bg-a4" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#EAF3DE" />
                    <stop offset="1" stopColor="#C0DD97" />
                  </linearGradient>
                </defs>
                <rect width="400" height="200" fill="url(#bg-a4)" />
                <g transform="translate(80, 100)"><circle r="26" fill="#ffffff" opacity="0.85" /><path d="M -12 -4 Q -12 -14 0 -14 Q 12 -14 12 -4 Q 12 6 0 14 Q -12 6 -12 -4 Z" fill="#d85a30" /></g>
                <g transform="translate(160, 100)"><circle r="26" fill="#ffffff" opacity="0.85" /><path d="M -12 8 Q -4 -12 0 -14 Q 4 -12 12 8" stroke="#639922" strokeWidth="3" fill="none" strokeLinecap="round" /><circle cx="0" cy="12" r="3" fill="#639922" /></g>
                <g transform="translate(240, 100)"><circle r="26" fill="#ffffff" opacity="0.85" /><circle r="10" fill="none" stroke="#1b3d70" strokeWidth="3" /><path d="M 0 -10 L 0 -4 M 0 4 L 0 10 M -10 0 L -4 0 M 4 0 L 10 0" stroke="#1b3d70" strokeWidth="2" strokeLinecap="round" /></g>
                <g transform="translate(320, 100)"><circle r="26" fill="#ffffff" opacity="0.85" /><path d="M -10 -6 L -10 12 M 10 -6 L 10 12 M -10 0 L 10 0" stroke="#7d2f4d" strokeWidth="3" strokeLinecap="round" /><circle cx="-10" cy="-10" r="3" fill="#7d2f4d" /><circle cx="10" cy="-10" r="3" fill="#7d2f4d" /></g>
              </svg>
            </div>
            <div className={styles.blogBody}>
              <div className={styles.blogMetaRow}>
                <span>فريق لاباس</span>
                <span className={styles.blogMetaDot} />
                <span>٦ دقائق</span>
              </div>
              <h3 className={styles.blogTtl}>خمس تغييرات في نمط الحياة تحسّن الأداء بدون دواء</h3>
              <p className={styles.blogEx}>النوم، الرياضة، التوتّر، التدخين، والوزن — الدراسات تؤكّد الأرقام.</p>
              <div className={styles.blogCite}>
                <div className={styles.blogCiteIc}>٣</div>
                <div><em>JAMA Internal Medicine</em>, <em>Am J Med</em></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className={styles.faq}>
        <div className={styles.secEyebrow}>
          <span className={styles.secEyebrowDot} />
          الأسئلة الشائعة
        </div>
        <h2 className={styles.secTtl}>إجابات مباشرة</h2>

        <div className={styles.faqList}>
          {faqItems.map((item, i) => (
            <div
              key={i}
              className={`${styles.faqItem} ${openFaq === i ? styles.faqItemOpen : ""}`}
            >
              <div className={styles.faqQ} onClick={() => toggleFaq(i)}>
                <span>{item.q}</span>
                <span className={styles.faqIcon}>+</span>
              </div>
              <div className={styles.faqA}>
                <div className={styles.faqAInner}>{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={styles.cta}>
        <div className={styles.ctaWrap}>
          <div className={styles.ctaEyebrow}>
            <span className={styles.ctaEyebrowDot} />
            ٤ دقائق فقط
          </div>
          <h2 className={styles.ctaTtl}>استعِد ثقتك — بدون حرج، من بيتك</h2>
          <p className={styles.ctaSub}>
            ابدأ التقييم الآن. الإجابات مشفّرة، ولا تتم مشاركتها مع أحد غير طبيبك المعالج.
          </p>
          <Link href="/sexualHealth/subscribe" className={styles.ctaBtn}>
            اشترك الآن
            <span className={styles.ctaBtnArr}>&larr;</span>
          </Link>
          <p className={styles.ctaFoot}>
            مشفّر &middot; متوافق مع PDPL السعودي
          </p>
        </div>
      </section>

      {/* ─── LICENSE TAG ─── */}
      <div style={{ background: "#f2faed", borderTop: "0.5px solid rgba(23,52,4,0.08)", padding: "8px 48px", textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#27500A", letterSpacing: "0.2px" }}>
        شركة سعودية مرخّصة من وزارة الصحة &middot; ترخيص رقم 1400055938
      </div>

      {/* ─── FOOTER ─── */}
      <footer className={styles.foot}>
        <div className={styles.footBrand}>
          <div className={styles.mark} style={{ width: "22px", height: "22px" }} />
          <span>لاباس &copy; ٢٠٢٦</span>
        </div>
        <div className={styles.footLinks}>
          <span>الشروط والأحكام</span>
          <span>سياسة الخصوصية</span>
          <span>تواصل معنا</span>
        </div>
        <span className={styles.footCopy}>
          متوافق مع PDPL &middot; مرخّص من وزارة الصحّة
        </span>
      </footer>

      {/* ─── ARTICLE READER OVERLAY ─── */}
      {openArticle !== null && (
        <div className={styles.artOverlay} onClick={() => setOpenArticle(null)}>
          <div className={styles.artPanel} onClick={(e) => e.stopPropagation()}>
            <button className={styles.artClose} onClick={() => setOpenArticle(null)}>&times;</button>
            <div className={styles.artCat}>{blogArticles[openArticle].cat}</div>
            <h2 className={styles.artTitle}>{blogArticles[openArticle].title}</h2>
            <div className={styles.artMeta}>
              <span>{blogArticles[openArticle].author}</span>
              {blogArticles[openArticle].date && <> · <span>{blogArticles[openArticle].date}</span></>}
              <> · <span>{blogArticles[openArticle].readTime}</span></>
            </div>
            <div className={styles.artBody}>
              {blogArticles[openArticle].content.map((block, i) => {
                switch (block.type) {
                  case "lead":
                    return <p key={i} className={styles.artLead}>{block.text}</p>;
                  case "heading":
                    return <h3 key={i} className={styles.artH3}>{block.text}</h3>;
                  case "paragraph":
                    return <p key={i} className={styles.artP}>{block.text}</p>;
                  case "callout":
                    return <div key={i} className={styles.artCallout}>{block.text}</div>;
                  default:
                    return null;
                }
              })}
            </div>
            <div className={styles.artRefs}>
              <div className={styles.artRefsIc}>{blogArticles[openArticle].refsCount}</div>
              <div>{blogArticles[openArticle].refs}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

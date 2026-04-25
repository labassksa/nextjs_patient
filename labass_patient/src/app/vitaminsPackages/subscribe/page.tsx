"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { loginPatient } from "@/app/login/_controllers/sendOTP.Controller";
import { verifyOTPandLogin } from "@/app/otp/_controllers/verifyOTPandLogin";
import s from "./subscribe.module.css";

const TOTAL_STEPS = 5;

const goalLabels: Record<string, string> = {
  energy: "طاقة أعلى",
  immunity: "تقوية المناعة",
  sleep: "نوم أفضل",
  weight: "إدارة الوزن",
  hair: "الشعر والبشرة",
  heart: "صحة القلب",
  digestion: "الجهاز الهضمي",
  focus: "التركيز",
  women: "صحة المرأة",
};

const cityOptions = [
  { value: "", label: "اختر مدينتك" },
  { value: "riyadh", label: "الرياض" },
];

export default function SubscribePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [plan, setPlan] = useState("quarterly");
  const [price, setPrice] = useState(810);
  const [planLabel, setPlanLabel] = useState("كل ٣ أشهر");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [city, setCity] = useState("riyadh");
  const [phoneError, setPhoneError] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpSent, setOtpSent] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isRecurring, setIsRecurring] = useState(false);

  // Backend state
  const [token, setToken] = useState<string | null>(null);
  const [vitaminBundles, setVitaminBundles] = useState<any[]>([]);
  const [selectedBundleId, setSelectedBundleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const cityLabel =
    cityOptions.find((c) => c.value === city)?.label || "";

  // Fetch vitamins bundles on mount
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bundles`)
      .then(({ data }) => {
        console.log("All bundles from API:", data);
        const list: any[] = Array.isArray(data) ? data : (data.data ?? []);
        const vitamins = list
          .filter((b) => b.type === "Vitamins")
          .sort((a, b) => Number(a.price) - Number(b.price)); // cheapest first
        setVitaminBundles(vitamins);
        if (vitamins.length > 0) {
          const defaultBundle = vitamins[vitamins.length - 1];
          setSelectedBundleId(defaultBundle.id);
          setPrice(Number(defaultBundle.price));
        }
      })
      .catch((err) => console.error("Bundles fetch error:", err));
  }, []);

  // OTP timer + send OTP when entering step 4
  useEffect(() => {
    if (currentStep === 4 && !otpSent) {
      setOtpTimer(60);
      setOtpSent(true);

      const cleanPhone = phone.replace(/\s/g, "");
      loginPatient(cleanPhone, "+966").catch(() => {});

      timerRef.current = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStep, otpSent]);

  const resendOtp = async () => {
    setOtp(["", "", "", ""]);
    setOtpTimer(60);
    setApiError(null);
    const cleanPhone = phone.replace(/\s/g, "");
    const result = await loginPatient(cleanPhone, "+966");
    if (!result.success) setApiError(result.message || "فشل إعادة إرسال الرمز");
    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    otpRefs.current[0]?.focus();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 1:
        return !!plan;
      case 2: {
        const phoneClean = phone.replace(/\s/g, "");
        const phoneValid = /^5\d{8}$/.test(phoneClean);
        return !!(name && phoneValid && age && gender && height && weight && city);
      }
      case 3:
        return goals.length > 0;
      case 4:
        return otp.every((d) => d !== "");
      default:
        return true;
    }
  }, [currentStep, plan, name, phone, age, gender, height, weight, city, goals, otp]);

  const selectPlan = (bundleId: number, pr: number, label: string, planKey: string) => {
    setPlan(planKey);
    setPrice(pr);
    setPlanLabel(label);
    setSelectedBundleId(bundleId);
  };

  const toggleGoal = (g: string) => {
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const goToStep = (n: number) => {
    setCurrentStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = async () => {
    setApiError(null);

    // Step 4: verify OTP → get token
    if (currentStep === 4) {
      setLoading(true);
      const fullPhone = "+966" + phone.replace(/\s/g, "");
      const result = await verifyOTPandLogin("patient", fullPhone, otp.join(""));
      setLoading(false);
      if (!result || !result.success) {
        setApiError(result?.message || "فشل التحقق من الرمز");
        return;
      }
      setToken(result.token!);
      goToStep(5);
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      goToStep(currentStep + 1);
    }
  };

  const handleSubscribe = () => {
    const authToken = token || localStorage.getItem("labass_token");
    if (!authToken) {
      setApiError("انتهت الجلسة، يرجى تسجيل الدخول مجدداً");
      return;
    }
    const bundleId = selectedBundleId;
    if (!bundleId) {
      setApiError("الباقة غير متاحة، تواصل مع الدعم");
      return;
    }
    const params = new URLSearchParams({
      bundleId: String(bundleId),
      discountedPrice: String(price),
      planLabel,
      isRecurring: String(isRecurring),
      subscriberType: "patient",
    });
    router.push(`/vitaminsPackages/payment?${params.toString()}`);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const getNextLabel = () => {
    switch (currentStep) {
      case 1:
        return "متابعة";
      case 2:
        return "متابعة";
      case 3:
        return "تحقّق";
      case 4:
        return "تأكيد الاشتراك";
      case 5:
        return "ابدأ رحلتك مع لاباس";
      default:
        return "متابعة";
    }
  };

  const progPct = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;
  const firstName = name.split(" ")[0] || "عزيزي";

  const stepLabels = [
    "اختر الباقة",
    "بياناتك الشخصية",
    "أهدافك الصحية",
    "تحقّق الجوّال",
    "تأكيد الاشتراك",
  ];

  return (
    <div dir="rtl" className={s.app}>
      {/* Nav */}
      <div className={s.nav}>
        <Link href="/vitaminsPackages" className={s.brand}>
          <div className={s.mark} />
          <div className={s.bname}>لاباس</div>
        </Link>
      </div>

      {/* Progress bar */}
      <div className={s.progWrap}>
        <div className={s.progSteps}>
          <div className={s.progLine} />
          <div className={s.progFill} style={{ width: `${progPct}%` }} />
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const cls =
              stepNum < currentStep
                ? s.progStepDone
                : stepNum === currentStep
                ? s.progStepActive
                : "";
            return (
              <div key={i} className={`${s.progStep} ${cls}`}>
                <div className={s.progDot}>
                  {stepNum < currentStep
                    ? "✓"
                    : (stepNum).toLocaleString("ar-SA")}
                </div>
                <div className={s.progLabel}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Plans */}
      {currentStep === 1 && (
        <div className={s.page} key="step1">
          <div className={s.eyebrow}>
            <div className={s.eyeDot} />
            الخطوة ١ من ٥
          </div>
          <h1 className={s.pageTtl}>اختر الباقة المناسبة لك</h1>
          <p className={s.pageSub}>
            كل الباقات تشمل فحص دم منزلي شامل من مختبر طبّي معتمد، تفسير الطبيب، والفيتامينات
            المخصّصة. الاختلاف في المدة ونسبة التوفير.
          </p>

          {vitaminBundles.length === 0 && (
            <p style={{ textAlign: "center", color: "#888", marginTop: 16 }}>جاري تحميل الباقات...</p>
          )}
          <div className={s.plans}>
            {vitaminBundles.map((bundle, i) => {
              const isSelected = selectedBundleId === bundle.id;
              const isPopular = i === vitaminBundles.length - 1 && vitaminBundles.length > 1;
              const bundlePrice = Number(bundle.price).toLocaleString("ar-SA");
              const label = bundle.description || (bundle.recurringType === "Monthly" ? "شهري" : `كل ${bundle.intervalDays || 90} يوم`);
              return (
                <div
                  key={bundle.id}
                  className={`${s.plan} ${isPopular ? s.planPopular : ""} ${isSelected ? s.planSelected : ""}`}
                  onClick={() => selectPlan(bundle.id, Number(bundle.price), label, `bundle_${bundle.id}`)}
                >
                  <div className={s.planRadio} />
                  {isPopular && <div className={s.planPop}>الأكثر طلباً</div>}
                  <div className={s.planName}>{label}</div>
                  <div className={s.planPrice}>
                    <div className={s.planNum}>{bundlePrice}</div>
                    <div className={s.planCur}>ريال</div>
                  </div>
                  {bundle.originalPrice && (
                    <div className={s.planPeriod} style={{ textDecoration: "line-through", opacity: 0.6 }}>
                      {Number(bundle.originalPrice).toLocaleString("ar-SA")} ريال
                    </div>
                  )}
                  <PlanFeatures />
                </div>
              );
            })}
          </div>

          {/* Recurring toggle */}
          <div className={s.recurringWrap}>
            <p className={s.recurringLabel}>نوع الدفع</p>
            <div className={s.recurringToggle}>
              <button
                className={`${s.recurringOpt} ${!isRecurring ? s.recurringOptActive : ""}`}
                onClick={() => setIsRecurring(false)}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                دفعة واحدة
              </button>
              <button
                className={`${s.recurringOpt} ${isRecurring ? s.recurringOptActive : ""}`}
                onClick={() => setIsRecurring(true)}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M1 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M23 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                اشتراك متكرّر
              </button>
            </div>
            <p className={s.recurringHint}>
              {isRecurring
                ? "سيتجدّد الاشتراك تلقائياً في نهاية كل دورة"
                : "ادفع مرة واحدة فقط بدون تجديد تلقائي"}
            </p>
          </div>

        </div>
      )}

      {/* Step 2: Personal Info */}
      {currentStep === 2 && (
        <div className={s.page} key="step2">
          <div className={s.eyebrow}>
            <div className={s.eyeDot} />
            الخطوة ٢ من ٥
          </div>
          <h1 className={s.pageTtl}>عرّفنا عن نفسك</h1>
          <p className={s.pageSub}>
            هذه البيانات تصل مباشرة لطبيبك ولن تُشارَك مع أي طرف آخر. محمية
            بمعايير PDPL السعودية.
          </p>

          <div className={s.formGrid}>
            <div className={`${s.field} ${s.fieldFull}`}>
              <label className={s.fieldLbl}>
                الاسم الكامل <span className={s.fieldReq}>*</span>
              </label>
              <input
                className={s.fieldInp}
                type="text"
                placeholder="أحمد بن محمد العتيبي"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={`${s.field} ${s.fieldFull}`}>
              <label className={s.fieldLbl}>
                رقم الجوّال <span className={s.fieldReq}>*</span>
              </label>
              <div className={s.phoneWrap}>
                <div className={s.phoneCode}>
                  <span className={s.phoneFlag} />
                  +٩٦٦
                </div>
                <input
                  className={`${s.fieldInp} ${s.phoneInp} ${phoneError ? s.fieldInpError : ""}`}
                  type="tel"
                  placeholder="5X XXX XXXX"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d\s]/g, "");
                    setPhone(val);
                    const clean = val.replace(/\s/g, "");
                    if (clean && !/^5/.test(clean)) {
                      setPhoneError("الرقم يجب أن يبدأ بـ 5");
                    } else if (clean && clean.length > 0 && clean.length !== 9) {
                      setPhoneError("الرقم يجب أن يكون ٩ أرقام");
                    } else {
                      setPhoneError("");
                    }
                  }}
                />
              </div>
              {phoneError && <span className={s.fieldError}>{phoneError}</span>}
            </div>

            <div className={s.field}>
              <label className={s.fieldLbl}>
                العمر <span className={s.fieldReq}>*</span>
              </label>
              <div className={s.dualInp}>
                <input
                  className={s.dualInpField}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="٣٠"
                  value={age}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v && !/^\d+$/.test(v)) return;
                    setAge(v);
                  }}
                />
                <div className={s.dualUnit}>سنة</div>
              </div>
            </div>

            <div className={s.field}>
              <label className={s.fieldLbl}>
                الجنس <span className={s.fieldReq}>*</span>
              </label>
              <div className={s.genderRow}>
                <div
                  className={`${s.genderOpt} ${
                    gender === "male" ? s.genderOptSelected : ""
                  }`}
                  onClick={() => setGender("male")}
                >
                  ذكر
                </div>
                <div
                  className={`${s.genderOpt} ${
                    gender === "female" ? s.genderOptSelected : ""
                  }`}
                  onClick={() => setGender("female")}
                >
                  أنثى
                </div>
              </div>
            </div>

            <div className={s.field}>
              <label className={s.fieldLbl}>
                الطول <span className={s.fieldReq}>*</span>
              </label>
              <div className={s.dualInp}>
                <input
                  className={s.dualInpField}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="١٧٥"
                  value={height}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v && !/^\d+$/.test(v)) return;
                    setHeight(v);
                  }}
                />
                <div className={s.dualUnit}>سم</div>
              </div>
            </div>

            <div className={s.field}>
              <label className={s.fieldLbl}>
                الوزن <span className={s.fieldReq}>*</span>
              </label>
              <div className={s.dualInp}>
                <input
                  className={s.dualInpField}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="٧٥"
                  value={weight}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v && !/^\d+$/.test(v)) return;
                    setWeight(v);
                  }}
                />
                <div className={s.dualUnit}>كجم</div>
              </div>
            </div>

            <div className={`${s.field} ${s.fieldFull}`}>
              <label className={s.fieldLbl}>
                المدينة{" "}
                <span className={s.fieldHint}>
                  لتحديد موعد زيارة الممرّض
                </span>
              </label>
              <div className={s.selectWrap}>
                <select
                  className={s.fieldInp}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ appearance: "none" }}
                >
                  {cityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={s.privacyNote}>
            <div className={s.privacyIc}>🔒</div>
            <p className={s.privacyTxt}>
              <strong>بياناتك مشفّرة وتُحفظ داخل المملكة.</strong> يطّلع عليها
              طبيبك المعالج فقط — لا نشاركها مع شركات التأمين أو جهات العمل،
              ويمكنك حذفها متى شئت.
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Health Goals */}
      {currentStep === 3 && (
        <div className={s.page} key="step3">
          <div className={s.eyebrow}>
            <div className={s.eyeDot} />
            الخطوة ٣ من ٥
          </div>
          <h1 className={s.pageTtl}>ما هي أهدافك الصحية؟</h1>
          <p className={s.pageSub}>
            اختر هدفاً واحداً أو أكثر. يعتمد طبيبك على هذه الاختيارات لتخصيص
            الفحوصات والفيتامينات التي ستصلك.
          </p>

          <div className={s.goalsGrid}>
            <GoalCard
              id="energy"
              title="طاقة يومية أعلى"
              desc="تعب مستمر، نعاس في النهار، تركيز منخفض"
              bg="linear-gradient(135deg, #FAEEDA, #FAC775)"
              selected={goals.includes("energy")}
              onToggle={() => toggleGoal("energy")}
              icon={
                <svg viewBox="0 0 80 80" width="64" height="64">
                  <circle cx="40" cy="40" r="26" fill="#EF9F27" />
                  <circle cx="40" cy="40" r="16" fill="#FAC775" />
                  <g stroke="#BA7517" strokeWidth="2.5" strokeLinecap="round" fill="none">
                    <line x1="40" y1="8" x2="40" y2="14" />
                    <line x1="40" y1="66" x2="40" y2="72" />
                    <line x1="8" y1="40" x2="14" y2="40" />
                    <line x1="66" y1="40" x2="72" y2="40" />
                    <line x1="17" y1="17" x2="22" y2="22" />
                    <line x1="58" y1="58" x2="63" y2="63" />
                    <line x1="17" y1="63" x2="22" y2="58" />
                    <line x1="58" y1="22" x2="63" y2="17" />
                  </g>
                </svg>
              }
            />
            <GoalCard
              id="immunity"
              title="تقوية المناعة"
              desc="نزلات برد متكرّرة، حساسية موسمية، التئام بطيء"
              bg="linear-gradient(135deg, #E1F5EE, #5DCAA5)"
              selected={goals.includes("immunity")}
              onToggle={() => toggleGoal("immunity")}
              icon={
                <svg viewBox="0 0 80 80" width="64" height="64">
                  <path d="M40 14 L62 22 L62 42 Q62 58 40 68 Q18 58 18 42 L18 22 Z" fill="#1D9E75" stroke="#0F6E56" strokeWidth="1.5" />
                  <path d="M40 20 L56 26 L56 42 Q56 52 40 60 Q24 52 24 42 L24 26 Z" fill="#5DCAA5" opacity="0.6" />
                  <path d="M30 40 L37 47 L50 32" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            <GoalCard
              id="sleep"
              title="نوم أفضل"
              desc="صعوبة في الاستغراق، استيقاظ متكرّر، تعب صباحي"
              bg="linear-gradient(135deg, #1a3a6e, #0f2550)"
              selected={goals.includes("sleep")}
              onToggle={() => toggleGoal("sleep")}
              icon={
                <svg viewBox="0 0 80 80" width="64" height="64">
                  <g fill="#EAF3DE" opacity="0.8">
                    <circle cx="18" cy="20" r="0.9" /><circle cx="60" cy="16" r="0.7" /><circle cx="25" cy="55" r="0.6" />
                    <circle cx="65" cy="52" r="0.9" /><circle cx="15" cy="42" r="0.5" /><circle cx="55" cy="60" r="0.6" />
                  </g>
                  <path d="M50 16 A26 26 0 1 0 55 58 A20 20 0 1 1 50 16 Z" fill="#FAEEDA" />
                  <circle cx="58" cy="26" r="1.5" fill="#FAEEDA" />
                  <circle cx="62" cy="38" r="1" fill="#FAEEDA" />
                </svg>
              }
            />
            <GoalCard
              id="weight"
              title="إدارة الوزن"
              desc="خسارة تدريجية أو بناء عضلات بشكل صحّي"
              bg="linear-gradient(135deg, #EAF3DE, #97C459)"
              selected={goals.includes("weight")}
              onToggle={() => toggleGoal("weight")}
              icon={
                <svg viewBox="0 0 80 80" width="64" height="64">
                  <rect x="14" y="30" width="52" height="32" rx="4" fill="#639922" stroke="#3B6D11" strokeWidth="1.5" />
                  <rect x="20" y="36" width="40" height="14" rx="2" fill="#EAF3DE" />
                  <g stroke="#173404" strokeWidth="1" strokeLinecap="round" opacity="0.4">
                    <line x1="28" y1="38" x2="28" y2="44" /><line x1="34" y1="38" x2="34" y2="46" />
                    <line x1="40" y1="38" x2="40" y2="48" /><line x1="46" y1="38" x2="46" y2="46" />
                    <line x1="52" y1="38" x2="52" y2="44" />
                  </g>
                  <line x1="40" y1="36" x2="40" y2="28" stroke="#173404" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="40" cy="27" r="3" fill="#173404" />
                </svg>
              }
            />
            <GoalCard
              id="hair"
              title="صحة الشعر والبشرة"
              desc="تساقط الشعر، جفاف البشرة، أظافر ضعيفة"
              bg="linear-gradient(135deg, #FBEAF0, #F4C0D1)"
              selected={goals.includes("hair")}
              onToggle={() => toggleGoal("hair")}
              icon={
                <svg viewBox="0 0 80 80" width="64" height="64">
                  <ellipse cx="40" cy="44" rx="18" ry="22" fill="#f4e2c8" />
                  <path d="M22 32 Q20 16 40 14 Q60 16 58 32 Q56 22 40 22 Q24 22 22 32 Z" fill="#5a3a20" />
                  <path d="M24 34 Q22 52 30 58" stroke="#5a3a20" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M56 34 Q58 52 50 58" stroke="#5a3a20" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <circle cx="34" cy="44" r="1.5" fill="#173404" />
                  <circle cx="46" cy="44" r="1.5" fill="#173404" />
                  <path d="M35 52 Q40 55 45 52" stroke="#D4537E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              }
            />
            <GoalCard
              id="heart"
              title="صحة القلب"
              desc="متابعة الكولسترول وضغط الدم وصحة الشرايين"
              bg="linear-gradient(135deg, #FCEBEB, #F09595)"
              selected={goals.includes("heart")}
              onToggle={() => toggleGoal("heart")}
              icon={
                <svg viewBox="0 0 80 80" width="64" height="64">
                  <path d="M40 62 L20 42 Q12 34 18 26 Q24 18 32 22 Q36 24 40 30 Q44 24 48 22 Q56 18 62 26 Q68 34 60 42 Z" fill="#E24B4A" />
                  <path d="M40 56 L25 42 Q20 37 23 32 Q27 26 33 28 Q37 30 40 34" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.4" />
                  <polyline points="12,48 22,48 26,40 32,56 38,44 44,48 68,48" fill="none" stroke="#791F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            <GoalCard
              id="digestion"
              title="صحة الجهاز الهضمي"
              desc="انتفاخ، اضطراب الأمعاء، حساسية الطعام"
              bg="linear-gradient(135deg, #FAECE7, #F0997B)"
              selected={goals.includes("digestion")}
              onToggle={() => toggleGoal("digestion")}
              icon={
                <svg viewBox="0 0 80 80" width="64" height="64">
                  <path d="M30 20 Q48 18 52 34 Q56 44 46 50 Q38 56 42 64 Q46 70 38 68" stroke="#D85A30" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <circle cx="30" cy="20" r="3.5" fill="#993C1D" />
                  <circle cx="38" cy="68" r="3.5" fill="#993C1D" />
                  <g fill="#1D9E75" opacity="0.85"><circle cx="52" cy="34" r="2" /><circle cx="46" cy="50" r="2.5" /></g>
                </svg>
              }
            />
            <GoalCard
              id="focus"
              title="تركيز أذهن"
              desc="ضباب ذهني، نسيان، صعوبة في الإنتاجية"
              bg="linear-gradient(135deg, #EEEDFE, #AFA9EC)"
              selected={goals.includes("focus")}
              onToggle={() => toggleGoal("focus")}
              icon={
                <svg viewBox="0 0 80 80" width="64" height="64">
                  <path d="M26 28 Q22 22 28 18 Q34 14 40 18 Q46 14 52 18 Q58 22 54 28 Q58 34 54 42 Q58 50 52 54 Q46 60 40 56 Q34 60 28 54 Q22 50 26 42 Q22 34 26 28 Z" fill="#7F77DD" />
                  <path d="M30 30 Q32 28 34 30 M46 30 Q48 28 50 30 M34 42 Q40 46 46 42 M32 38 Q35 36 38 38 M42 38 Q45 36 48 38" stroke="#3C3489" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                  <circle cx="40" cy="26" r="1.5" fill="#3C3489" />
                </svg>
              }
            />
            <GoalCard
              id="women"
              title="صحة المرأة"
              desc="الحديد، الهرمونات، صحة ما قبل الحمل"
              bg="linear-gradient(135deg, #FBEAF0, #ED93B1)"
              selected={goals.includes("women")}
              onToggle={() => toggleGoal("women")}
              icon={
                <svg viewBox="0 0 80 80" width="64" height="64">
                  <circle cx="40" cy="30" r="14" fill="none" stroke="#D4537E" strokeWidth="4" />
                  <line x1="40" y1="44" x2="40" y2="60" stroke="#D4537E" strokeWidth="4" strokeLinecap="round" />
                  <line x1="32" y1="52" x2="48" y2="52" stroke="#D4537E" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="40" cy="30" r="5" fill="#FBEAF0" />
                </svg>
              }
            />
          </div>

          <div className={s.goalsMeta}>
            <span className={s.goalsMetaTxt}>
              يمكنك اختيار أكثر من هدف
            </span>
            <span className={s.goalsCount}>
              المحدّد:{" "}
              <span className={s.goalsCountNum}>
                {goals.length.toLocaleString("ar-SA")}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Step 4: OTP Verification */}
      {currentStep === 4 && (
        <div className={s.page} key="step4">
          <div className={s.eyebrow}>
            <div className={s.eyeDot} />
            الخطوة ٤ من ٥
          </div>
          <h1 className={s.pageTtl}>تحقّق من رقم جوّالك</h1>
          <p className={s.pageSub}>
            أرسلنا رمز تحقّق مكوّن من ٤ أرقام إلى رقم جوّالك للتأكّد من
            هويّتك.
          </p>

          <div className={s.otpWrap}>
            <div className={s.otpIcon}>
              <div className={s.otpIconInner}>✉</div>
            </div>

            <div className={s.otpPhone}>+966 {phone}</div>

            <div className={s.otpInputs}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  className={`${s.otpDigit} ${digit ? s.otpDigitFilled : ""}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <div className={s.otpResend}>
              {otpTimer > 0 ? (
                <span>
                  إعادة الإرسال بعد{" "}
                  <span className={s.otpTimer}>
                    {otpTimer.toLocaleString("ar-SA")}
                  </span>{" "}
                  ثانية
                </span>
              ) : (
                <span>
                  لم يصلك الرمز؟{" "}
                  <button
                    className={s.otpResendBtn}
                    onClick={resendOtp}
                  >
                    أعد الإرسال
                  </button>
                </span>
              )}
            </div>
          </div>

          <div className={s.privacyNote}>
            <div className={s.privacyIc}>🔒</div>
            <p className={s.privacyTxt}>
              <strong>التحقّق يحمي حسابك.</strong> نتأكّد من رقم جوّالك حتى
              نضمن أن بياناتك الصحية تصل للشخص الصحيح فقط.
            </p>
          </div>
        </div>
      )}

      {/* Step 5: Confirmation */}
      {currentStep === 5 && (
        <div className={s.page} key="step5">
          <div className={s.confirmIconWrap}>
            <div className={s.confirmCircle}>
              <div className={s.confirmCheck}>✓</div>
            </div>
          </div>

          <h1 className={s.confirmTtl}>تم تأكيد اشتراكك، {firstName}</h1>
          <p className={s.confirmSub}>
            يسعدنا انضمامك إلى لاباس. سيصلك خلال دقائق رسالة على جوّالك فيها
            تفاصيل موعد زيارة الممرّض وخطوات تسجيل الدفع.
          </p>

          <div className={s.summary}>
            <p className={s.summaryTtl}>ملخّص اشتراكك</p>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>الباقة</span>
              <span className={s.summaryVal}>{planLabel}</span>
            </div>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>المدينة</span>
              <span className={s.summaryVal}>{cityLabel || "—"}</span>
            </div>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>الأهداف الصحية</span>
              <span className={s.summaryVal}>
                {goals.map((g) => goalLabels[g]).join("، ")}
              </span>
            </div>
            <div className={`${s.summaryRow} ${s.summaryRowTotal}`}>
              <span className={s.summaryLbl}>المبلغ المستحقّ</span>
              <span className={s.summaryVal}>
                <sub>ريال</sub>
                {price.toLocaleString("ar-SA")}
              </span>
            </div>
          </div>

          <div className={s.nextSteps}>
            <p className={s.nextTtl}>ماذا يحدث الآن؟</p>
            <ul className={s.nextList}>
              <li className={s.nextItem}>
                <div className={s.nextNum}>١</div>
                <div className={s.nextTxt}>
                  <strong>خلال ٢٤ ساعة:</strong> يتواصل معك فريقنا لتحديد
                  موعد زيارة الممرّض المناسب لك في المنزل. إذا كان لديك
                  تحليل دم حديث، يمكن تخطّي هذه الخطوة والانتقال مباشرة
                  لتفسير النتائج.
                </div>
              </li>
              <li className={s.nextItem}>
                <div className={s.nextNum}>٢</div>
                <div className={s.nextTxt}>
                  <strong>في الموعد:</strong> يزورك ممرّض مرخّص، يأخذ عيّنة
                  الدم ويرسلها للمختبر المعتمد.
                </div>
              </li>
              <li className={s.nextItem}>
                <div className={s.nextNum}>٣</div>
                <div className={s.nextTxt}>
                  <strong>خلال ٤٨ ساعة:</strong> يقرأ طبيبك نتائجك ويصمّم لك
                  خطة المكمّلات المخصّصة.
                </div>
              </li>
              <li className={s.nextItem}>
                <div className={s.nextNum}>٤</div>
                <div className={s.nextTxt}>
                  <strong>خلال أسبوع:</strong> تصلك الفيتامينات إلى بابك،
                  وتبدأ رحلتك مع لاباس.
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      {apiError && (
        <div style={{ color: "red", textAlign: "center", padding: "8px 16px", fontSize: 14 }}>
          {apiError}
        </div>
      )}
      <div className={s.actions}>
        <button
          className={`${s.btnBack} ${
            currentStep === 1 ? s.btnBackHidden : ""
          }`}
          onClick={prevStep}
          disabled={loading}
        >
          السابق
        </button>
        <button
          className={s.btnNext}
          onClick={currentStep === 5 ? handleSubscribe : nextStep}
          disabled={!isStepValid() || loading}
        >
          {loading ? "جاري التحميل..." : getNextLabel()}
          {!loading && <div className={s.btnNextArr}>←</div>}
        </button>
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function PlanFeatures() {
  const features = [
    "فحص دم من مختبر معتمد بأعلى معايير الجودة",
    "طبيب يحلل نتائجك",
    "فيتامينات ومعادن مخصّصة لك توصلك لبيتك",
    "استشر الطبيب 24/7",
  ];
  return (
    <ul className={s.planFeats}>
      {features.map((f, i) => (
        <li key={i} className={s.planFeat}>
          <div className={s.planCk}>✓</div>
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

function GoalCard({
  id,
  title,
  desc,
  bg,
  selected,
  onToggle,
  icon,
}: {
  id: string;
  title: string;
  desc: string;
  bg: string;
  selected: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`${s.goal} ${selected ? s.goalSelected : ""}`}
      onClick={onToggle}
    >
      <div className={s.goalCk} />
      <div className={s.goalArt} style={{ background: bg }}>
        {icon}
      </div>
      <h4 className={s.goalTtl}>{title}</h4>
      <p className={s.goalDesc}>{desc}</p>
    </div>
  );
}

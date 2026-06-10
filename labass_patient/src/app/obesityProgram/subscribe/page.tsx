"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { loginPatient } from "@/app/login/_controllers/sendOTP.Controller";
import { verifyOTPandLogin } from "@/app/otp/_controllers/verifyOTPandLogin";
import s from "./subscribe.module.css";

const TOTAL_PROGRESS_STEPS = 9;

const goalLabels: Record<string, string> = {
  lose: "إنقاص وزن",
  maintain: "ثبات وزن",
  fitness: "زيادة لياقة",
  nutrition: "تحسين تغذية",
};

const stepLabels = [
  "اختر الباقة",
  "قياسات الجسم",
  "عادات الأكل",
  "النشاط البدني",
  "النوم والحياة",
  "التاريخ الطبّي",
  "الحالة النفسية",
  "رقم الجوّال",
  "التحقّق",
];

/* ── Sub-components (outside to prevent remount on state change) ── */

const QuestionBlock = ({
  num,
  text,
  note,
  children,
}: {
  num: string;
  text: string;
  note?: string;
  children: React.ReactNode;
}) => (
  <div className={s.qBlock}>
    <div className={s.qLbl}>
      <div className={s.qNum}>{num}</div>
      <div className={s.qTxt}>
        {text}
        {note && (
          <>
            {" "}
            <span className={s.qNote}>({note})</span>
          </>
        )}
      </div>
    </div>
    {children}
  </div>
);

const SingleSelect = ({
  qKey,
  options,
  className,
  value,
  onPick,
}: {
  qKey: string;
  options: { label: string; value: string }[];
  className?: string;
  value?: string;
  onPick: (key: string, val: string) => void;
}) => (
  <div className={className || s.qOpts}>
    {options.map((o) => (
      <div
        key={o.value}
        className={`${s.qOpt} ${value === o.value ? s.qOptSelected : ""}`}
        onClick={() => onPick(qKey, o.value)}
      >
        {o.label}
      </div>
    ))}
  </div>
);

const YesNo = ({
  qKey,
  value,
  onPick,
}: {
  qKey: string;
  value?: string;
  onPick: (key: string, val: string) => void;
}) => (
  <div className={s.qYesno}>
    {[
      { label: "نعم", value: "yes" },
      { label: "لا", value: "no" },
    ].map((o) => (
      <div
        key={o.value}
        className={`${s.qOpt} ${value === o.value ? s.qOptSelected : ""}`}
        onClick={() => onPick(qKey, o.value)}
      >
        {o.label}
      </div>
    ))}
  </div>
);

const NumberInput = ({
  qKey,
  unit,
  value,
  onChangeValue,
}: {
  qKey: string;
  unit: string;
  value: string;
  onChangeValue: (key: string, val: string) => void;
}) => (
  <div className={s.qInpWrap}>
    <input
      className={s.qInp}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        if (v && !/^\d+$/.test(v)) return;
        onChangeValue(qKey, v);
      }}
    />
    <div className={s.qInpUnit}>{unit}</div>
  </div>
);

const MultiSelect = ({
  qKey,
  options,
  selected,
  onToggle,
}: {
  qKey: string;
  options: { label: string; value: string }[];
  selected: string[];
  onToggle: (key: string, val: string) => void;
}) => (
  <div className={s.qCbGrid}>
    {options.map((o) => {
      const isSelected = selected.includes(o.value);
      return (
        <div
          key={o.value}
          className={`${s.qCb} ${isSelected ? s.qCbSelected : ""}`}
          onClick={() => onToggle(qKey, o.value)}
        >
          <div className={s.qCbBox}>{isSelected ? "✓" : ""}</div>
          {o.label}
        </div>
      );
    })}
  </div>
);

export default function ObesitySubscribePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({ qCity: "riyadh" });
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const [selectedInterval, setSelectedInterval] = useState<"monthly" | "quarterly">("quarterly");
  const [monthlyBundle, setMonthlyBundle] = useState<{ id: number; price: number } | null>(null);
  const [quarterlyBundle, setQuarterlyBundle] = useState<{ id: number; price: number } | null>(null);
  const selectedBundle = selectedInterval === "monthly" ? monthlyBundle : quarterlyBundle;
  const bundleId = selectedBundle?.id ?? null;
  const price = selectedBundle?.price ?? 0;
  const planLabel = selectedInterval === "monthly" ? "شهري" : "كل ٣ أشهر";
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /* OTP timer */
  useEffect(() => {
    if (otpTimer > 0) {
      timerRef.current = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [otpTimer]);

  useEffect(() => {
    const stored = localStorage.getItem("labass_token");
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bundles`)
      .then(({ data }) => {
        const list: any[] = Array.isArray(data) ? data : (data.data ?? []);
        const filtered = list.filter(
          (b: any) => b.type === "Obesity Program" && b.whoSubscribes === "individual"
        );
        const monthly = filtered.find((b: any) => b.intervalDays === 30);
        const quarterly = filtered.find((b: any) => b.intervalDays === 90);
        if (monthly) setMonthlyBundle({ id: monthly.id, price: Number(monthly.price) });
        if (quarterly) setQuarterlyBundle({ id: quarterly.id, price: Number(quarterly.price) });
      })
      .catch(() => {});
  }, []);

  const startOtpTimer = () => {
    setOtpTimer(30);
    setOtp(["", "", "", ""]);
    setTimeout(() => otpRefs.current[0]?.focus(), 200);
  };

  /* helpers */
  const pickOne = (key: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const toggleCb = (key: string, val: string) => {
    setAnswers((prev) => {
      const list = Array.isArray(prev[key]) ? [...(prev[key] as string[])] : [];
      if (list.includes(val)) return { ...prev, [key]: list.filter((v) => v !== val) };
      return { ...prev, [key]: [...list, val] };
    });
  };

  const setInput = (key: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  /* validation */
  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 1:
        return !!selectedInterval;
      case 2:
        return !!(answers.q1 && answers.q2 && answers.q3 && answers.qCity);
      case 3:
        return ["q4", "q5", "q6", "q7", "q8", "q9", "q10"].every(
          (k) => answers[k]
        );
      case 4: {
        const q12 = answers.q12;
        return !!(
          answers.q11 &&
          Array.isArray(q12) &&
          q12.length > 0 &&
          answers.q13 &&
          answers.q14
        );
      }
      case 5:
        return ["q15", "q16", "q17", "q18"].every((k) => answers[k]);
      case 6: {
        const q19 = answers.q19;
        return !!(
          Array.isArray(q19) &&
          q19.length > 0 &&
          answers.q20 &&
          answers.q21 &&
          answers.q22 &&
          answers.q23
        );
      }
      case 7:
        return ["q24", "q25", "q26"].every((k) => answers[k]);
      case 8: {
        if (token) return true;
        const clean = phone.replace(/\s/g, "");
        return /^5\d{8}$/.test(clean);
      }
      case 9:
        return otp.every((d) => d !== "");
      default:
        return true;
    }
  }, [currentStep, answers, phone, otp, token, selectedInterval]);

  const buildSurveyAnswers = () => {
    const map: Record<string, string> = {
      q1:    "What is your current weight? (kg)",
      q2:    "What is your height? (cm)",
      q3:    "What is your waist circumference? (cm)",
      qCity: "What is your city?",
      q4:    "How many main meals do you eat per day?",
      q5:    "Do you eat snacks between meals?",
      q6:    "How many cups of water do you drink per day?",
      q7:    "Do you drink sugary sodas or sweetened juices?",
      q8:    "Do you eat fast food?",
      q9:    "Do you eat until completely full?",
      q10:   "Do you eat while watching TV or on your phone?",
      q11:   "How many times per week do you exercise?",
      q12:   "What types of physical activity do you do?",
      q13:   "How many hours per day do you sit?",
      q14:   "Do you use a car for short distances?",
      q15:   "How many hours do you sleep per day?",
      q16:   "Do you have sleep problems?",
      q17:   "Do you smoke?",
      q18:   "How would you rate your stress level?",
      q19:   "Have you been diagnosed with any of the following?",
      q20:   "Is there a family history of obesity?",
      q21:   "Do you take any medications that may affect your weight?",
      q22:   "Have you followed a diet before?",
      q23:   "Have you had weight loss surgery before?",
      q24:   "Do you eat when feeling stressed or sad?",
      q25:   "Are you satisfied with your current weight?",
      q26:   "What is your primary goal?",
    };
    return Object.entries(map)
      .filter(([key]) => {
        const v = answers[key];
        return v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0);
      })
      .map(([key, question]) => ({ question, answer: answers[key] as string | string[] }));
  };

  /* navigation */
  const goNext = async () => {
    setApiError(null);
    if (currentStep === 8) {
      if (token) {
        localStorage.setItem("vitamin_survey_answers", JSON.stringify(buildSurveyAnswers()));
        router.push(`/subscription/payment?bundleId=${bundleId}&discountedPrice=${price}&subscriberType=patient&isRecurring=false`);
        return;
      }
      setLoading(true);
      const cleanPhone = phone.replace(/\s/g, "");
      const result = await loginPatient(cleanPhone, "+966");
      setLoading(false);
      if (result.success) {
        startOtpTimer();
        setCurrentStep(9);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setApiError(result.message || "فشل إرسال رمز التحقق");
      }
      return;
    }
    if (currentStep === 9) {
      setLoading(true);
      const fullPhone = "+966" + phone.replace(/\s/g, "");
      const result = await verifyOTPandLogin("patient", fullPhone, otp.join(""));
      setLoading(false);
      if (result && result.success) {
        setCurrentStep(10);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setApiError((result && result.message) || "حدث خطأ ، حاول مرة أخرى");
      }
      return;
    }
    if (currentStep === 10) {
      localStorage.setItem("vitamin_survey_answers", JSON.stringify(buildSurveyAnswers()));
      router.push(`/subscription/payment?bundleId=${bundleId}&discountedPrice=${price}&subscriberType=patient&isRecurring=false`);
      return;
    }
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* OTP handlers */
  const handleOtp = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 3) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      const next = [...otp];
      next[idx - 1] = "";
      setOtp(next);
      otpRefs.current[idx - 1]?.focus();
    }
  };

  /* progress */
  const progPct =
    currentStep <= TOTAL_PROGRESS_STEPS
      ? ((currentStep - 1) / (TOTAL_PROGRESS_STEPS - 1)) * 100
      : 100;

  /* button label */
  const btnLabel = () => {
    if (currentStep === 10) return "الانتقال للدفع";
    if (currentStep === 9) return loading ? "جاري التحقّق..." : "تأكيد وإكمال الاشتراك";
    if (currentStep === 8) return loading ? "جاري الإرسال..." : token ? "الانتقال للدفع" : "إرسال رمز التحقّق";
    if (currentStep === 7) return "متابعة للتحقّق";
    return "متابعة";
  };

  /* BMI */
  const calcBmi = () => {
    const w = parseFloat(answers.q1 as string);
    const h = parseFloat(answers.q2 as string) / 100;
    if (w && h) return (w / (h * h)).toFixed(1);
    return "—";
  };

  /* ── RENDER ── */
  return (
    <div dir="rtl" className={s.app}>
      {/* NAV */}
      <div className={s.nav}>
        <Link href="/obesityProgram" className={s.brand}>
          <div className={s.mark} />
          <div className={s.bname}>لاباس</div>
        </Link>
      </div>

      {/* PROGRESS BAR */}
      {currentStep <= TOTAL_PROGRESS_STEPS && (
        <div className={s.progWrap}>
          <div className={s.progSteps}>
            <div className={s.progLine} />
            <div className={s.progFill} style={{ width: `${progPct}%` }} />
            {stepLabels.map((label, i) => {
              const stepNum = i + 1;
              let cls = s.progStep;
              if (stepNum < currentStep) cls += ` ${s.progStepDone}`;
              else if (stepNum === currentStep) cls += ` ${s.progStepActive}`;
              return (
                <div key={stepNum} className={cls}>
                  <div className={s.progDot}>
                    {stepNum < currentStep ? "✓" : (stepNum).toLocaleString("ar-SA")}
                  </div>
                  <div className={s.progLabel}>{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ STEP 1: اختر الباقة ═══ */}
      {currentStep === 1 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            اختر باقتك
          </div>
          <h2 className={s.svTtl}>ابدأ رحلة إدارة وزنك</h2>
          <p className={s.svSub}>
            اختر الباقة التي تناسبك — يمكنك التغيير لاحقاً.
          </p>

          <div className={s.plans}>
            <div
              className={`${s.plan} ${selectedInterval === "quarterly" ? s.planSelected : ""}`}
              onClick={() => setSelectedInterval("quarterly")}
            >
              <div className={s.planPop}>الأوفر</div>
              <input type="radio" className={s.planRadio} checked={selectedInterval === "quarterly"} readOnly />
              <div className={s.planName}>كل ٣ أشهر</div>
              <div className={s.planPrice}>
                <span className={s.planNum}>{quarterlyBundle?.price ?? "—"}</span>
                <span className={s.planCur}>ريال</span>
                <span className={s.planPeriod}> / ٩٠ يوم</span>
              </div>
            </div>

            <div
              className={`${s.plan} ${selectedInterval === "monthly" ? s.planSelected : ""}`}
              onClick={() => setSelectedInterval("monthly")}
            >
              <input type="radio" className={s.planRadio} checked={selectedInterval === "monthly"} readOnly />
              <div className={s.planName}>شهري</div>
              <div className={s.planPrice}>
                <span className={s.planNum}>{monthlyBundle?.price ?? "—"}</span>
                <span className={s.planCur}>ريال</span>
                <span className={s.planPeriod}> / شهر</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 2: قياسات الجسم ═══ */}
      {currentStep === 2 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            القسم ١ من ٦ · قياسات الجسم
          </div>
          <h2 className={s.svTtl}>لنبدأ بأرقام جسمك</h2>
          <p className={s.svSub}>
            ثلاثة أرقام يستخدمها طبيبك كنقطة انطلاق لحساب مؤشّر كتلة الجسم
            ونسب الدهون.
          </p>

          <QuestionBlock num="١" text="ما وزنك الحالي؟">
            <NumberInput qKey="q1" unit="كجم" value={(answers.q1 as string) || ""} onChangeValue={setInput} />
          </QuestionBlock>
          <QuestionBlock num="٢" text="ما طولك؟">
            <NumberInput qKey="q2" unit="سم" value={(answers.q2 as string) || ""} onChangeValue={setInput} />
          </QuestionBlock>
          <QuestionBlock num="٣" text="ما محيط خصرك؟">
            <NumberInput qKey="q3" unit="سم" value={(answers.q3 as string) || ""} onChangeValue={setInput} />
          </QuestionBlock>
          <QuestionBlock num="٤" text="ما مدينتك؟" note="الخدمة متوفّرة حالياً في الرياض فقط">
            <SingleSelect qKey="qCity" value={answers.qCity as string} onPick={pickOne} options={[
              { label: "الرياض", value: "riyadh" },
            ]} />
          </QuestionBlock>
        </div>
      )}

      {/* ═══ STEP 3: عادات الأكل ═══ */}
      {currentStep === 3 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            القسم ٢ من ٦ · عادات الأكل
          </div>
          <h2 className={s.svTtl}>كيف تبدو علاقتك بالطعام؟</h2>
          <p className={s.svSub}>
            سبعة أسئلة عن عاداتك الغذائية اليومية — هي أساس خطّتك.
          </p>

          <QuestionBlock num="٤" text="كم وجبة رئيسية تتناول يومياً؟">
            <SingleSelect qKey="q4" value={answers.q4 as string} onPick={pickOne} options={[
              { label: "١", value: "1" },
              { label: "٢", value: "2" },
              { label: "٣", value: "3" },
              { label: "أكثر من ٣", value: "3+" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="٥" text="هل تتناول وجبات خفيفة بين الوجبات؟">
            <SingleSelect qKey="q5" value={answers.q5 as string} onPick={pickOne} options={[
              { label: "أبداً", value: "never" },
              { label: "أحياناً", value: "sometimes" },
              { label: "غالباً", value: "often" },
              { label: "دائماً", value: "always" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="٦" text="كم كوب ماء تشرب يومياً؟">
            <SingleSelect qKey="q6" value={answers.q6 as string} onPick={pickOne} options={[
              { label: "أقل من ٤", value: "<4" },
              { label: "٤–٦", value: "4-6" },
              { label: "٧–٩", value: "7-9" },
              { label: "١٠+", value: "10+" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="٧" text="هل تتناول المشروبات الغازية أو العصائر المحلّاة؟">
            <SingleSelect qKey="q7" value={answers.q7 as string} onPick={pickOne} options={[
              { label: "يومياً", value: "daily" },
              { label: "أسبوعياً", value: "weekly" },
              { label: "نادراً", value: "rarely" },
              { label: "أبداً", value: "never" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="٨" text="هل تتناول الوجبات السريعة؟">
            <SingleSelect qKey="q8" value={answers.q8 as string} onPick={pickOne} options={[
              { label: "يومياً", value: "daily" },
              { label: "٢–٣ أسبوعياً", value: "2-3" },
              { label: "مرة أسبوعياً", value: "weekly" },
              { label: "نادراً", value: "rarely" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="٩" text="هل تأكل حتى الشبع الكامل؟">
            <SingleSelect qKey="q9" value={answers.q9 as string} onPick={pickOne} options={[
              { label: "دائماً", value: "always" },
              { label: "غالباً", value: "often" },
              { label: "أحياناً", value: "sometimes" },
              { label: "نادراً", value: "rarely" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="١٠" text="هل تأكل أثناء مشاهدة التلفاز أو الجوال؟">
            <YesNo qKey="q10" value={answers.q10 as string} onPick={pickOne} />
          </QuestionBlock>
        </div>
      )}

      {/* ═══ STEP 4: النشاط البدني ═══ */}
      {currentStep === 4 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            القسم ٣ من ٦ · النشاط البدني
          </div>
          <h2 className={s.svTtl}>كم يتحرّك جسمك؟</h2>
          <p className={s.svSub}>
            مستوى حركتك اليومية يحدّد كمّية السعرات التي يحتاجها جسمك بدقّة.
          </p>

          <QuestionBlock num="١١" text="كم مرة تمارس الرياضة أسبوعياً؟">
            <SingleSelect qKey="q11" value={answers.q11 as string} onPick={pickOne} options={[
              { label: "لا أمارس", value: "none" },
              { label: "١–٢", value: "1-2" },
              { label: "٣–٤", value: "3-4" },
              { label: "٥+", value: "5+" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="١٢" text="ما نوع النشاط البدني؟" note="يمكن اختيار أكثر من نوع">
            <MultiSelect qKey="q12" selected={Array.isArray(answers.q12) ? answers.q12 as string[] : []} onToggle={toggleCb} options={[
              { label: "مشي", value: "walk" },
              { label: "جري", value: "run" },
              { label: "سباحة", value: "swim" },
              { label: "رياضة منزلية", value: "home" },
              { label: "نادي رياضي", value: "gym" },
              { label: "أخرى", value: "other" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="١٣" text="كم ساعة تجلس يومياً؟">
            <SingleSelect qKey="q13" value={answers.q13 as string} onPick={pickOne} options={[
              { label: "أقل من ٤", value: "<4" },
              { label: "٤–٨", value: "4-8" },
              { label: "أكثر من ٨", value: "8+" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="١٤" text="هل تستخدم السيارة للمسافات القصيرة؟">
            <YesNo qKey="q14" value={answers.q14 as string} onPick={pickOne} />
          </QuestionBlock>
        </div>
      )}

      {/* ═══ STEP 5: النوم ونمط الحياة ═══ */}
      {currentStep === 5 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            القسم ٤ من ٦ · النوم ونمط الحياة
          </div>
          <h2 className={s.svTtl}>كيف تنام وتعيش يومك؟</h2>
          <p className={s.svSub}>
            النوم والتوتّر والتدخين عوامل مباشرة في تغيّرات الوزن — غالباً أهم
            من الحمية نفسها.
          </p>

          <QuestionBlock num="١٥" text="كم ساعة تنام يومياً؟">
            <SingleSelect qKey="q15" value={answers.q15 as string} onPick={pickOne} options={[
              { label: "أقل من ٥", value: "<5" },
              { label: "٥–٧", value: "5-7" },
              { label: "٧–٩", value: "7-9" },
              { label: "أكثر من ٩", value: "9+" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="١٦" text="هل تعاني من مشاكل في النوم؟">
            <YesNo qKey="q16" value={answers.q16 as string} onPick={pickOne} />
          </QuestionBlock>

          <QuestionBlock num="١٧" text="هل تدخّن؟">
            <SingleSelect qKey="q17" value={answers.q17 as string} onPick={pickOne} options={[
              { label: "نعم", value: "yes" },
              { label: "سابقاً", value: "past" },
              { label: "لا", value: "no" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="١٨" text="كيف تقيّم مستوى التوتّر لديك؟">
            <SingleSelect qKey="q18" value={answers.q18 as string} onPick={pickOne} options={[
              { label: "منخفض", value: "low" },
              { label: "متوسط", value: "mid" },
              { label: "عالي", value: "high" },
            ]} />
          </QuestionBlock>
        </div>
      )}

      {/* ═══ STEP 6: التاريخ الطبّي ═══ */}
      {currentStep === 6 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            القسم ٥ من ٦ · التاريخ الطبّي
          </div>
          <h2 className={s.svTtl}>ما يعرفه طبيبك عنك مسبقاً</h2>
          <p className={s.svSub}>
            معلومات طبّية مهمّة تساعد في تخصيص التحاليل المناسبة ومنع
            التعارضات الدوائية.
          </p>

          <QuestionBlock num="١٩" text="هل تم تشخيصك بأي من التالي؟" note="يمكن اختيار أكثر من واحد">
            <MultiSelect qKey="q19" selected={Array.isArray(answers.q19) ? answers.q19 as string[] : []} onToggle={toggleCb} options={[
              { label: "سكّري", value: "diabetes" },
              { label: "ضغط", value: "bp" },
              { label: "كولسترول", value: "chol" },
              { label: "الغدة الدرقية", value: "thyroid" },
              { label: "لا شيء", value: "none" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="٢٠" text="هل يوجد تاريخ عائلي للسمنة؟">
            <YesNo qKey="q20" value={answers.q20 as string} onPick={pickOne} />
          </QuestionBlock>

          <QuestionBlock num="٢١" text="هل تتناول أدوية قد تؤثر على الوزن؟">
            <YesNo qKey="q21" value={answers.q21 as string} onPick={pickOne} />
          </QuestionBlock>

          <QuestionBlock num="٢٢" text="هل سبق لك اتباع حمية غذائية؟">
            <SingleSelect qKey="q22" value={answers.q22 as string} onPick={pickOne} options={[
              { label: "نعم ونجحت", value: "yes_success" },
              { label: "نعم ولم تنجح", value: "yes_fail" },
              { label: "لا", value: "no" },
            ]} />
          </QuestionBlock>

          <QuestionBlock num="٢٣" text="هل أجريت عملية لإنقاص الوزن سابقاً؟">
            <YesNo qKey="q23" value={answers.q23 as string} onPick={pickOne} />
          </QuestionBlock>
        </div>
      )}

      {/* ═══ STEP 7: الحالة النفسية والأهداف ═══ */}
      {currentStep === 7 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            القسم ٦ من ٦ · الحالة النفسية والأهداف
          </div>
          <h2 className={s.svTtl}>علاقتك بوزنك وأهدافك</h2>
          <p className={s.svSub}>
            الجانب النفسي جزء لا يتجزّأ من إدارة الوزن — طبيبك يأخذه في
            الاعتبار عند بناء خطّتك.
          </p>

          <QuestionBlock num="٢٤" text="هل تأكل عند الشعور بالتوتر أو الحزن؟">
            <YesNo qKey="q24" value={answers.q24 as string} onPick={pickOne} />
          </QuestionBlock>

          <QuestionBlock num="٢٥" text="هل أنت راضٍ عن وزنك الحالي؟">
            <YesNo qKey="q25" value={answers.q25 as string} onPick={pickOne} />
          </QuestionBlock>

          <QuestionBlock num="٢٦" text="ما هدفك الأساسي؟">
            <SingleSelect qKey="q26" value={answers.q26 as string} onPick={pickOne} className={s.qGoalGrid} options={[
              { label: "إنقاص وزن", value: "lose" },
              { label: "ثبات وزن", value: "maintain" },
              { label: "زيادة لياقة", value: "fitness" },
              { label: "تحسين تغذية", value: "nutrition" },
            ]} />
          </QuestionBlock>

          <div className={s.secIntro}>
            <strong>شكراً على صبرك.</strong> تبقّت خطوتان فقط: تزويدنا برقم
            جوّالك، ثم تأكيد الرمز الذي سيصلك.
          </div>
        </div>
      )}

      {/* ═══ STEP 8: رقم الجوّال ═══ */}
      {currentStep === 8 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            الخطوة ٨ من ٩ · رقم الجوّال
          </div>
          <h2 className={s.svTtl}>رقم جوّالك للتواصل</h2>
          <p className={s.svSub}>
            نستخدم رقم جوّالك لتأكيد هويّتك، وإرسال تفاصيل موعد زيارة
            الممرّض، والتواصل معك من طبيبك.
          </p>

          <div className={s.formCenter}>
            <div className={s.fieldLbl}>
              رقم الجوّال{" "}
              <span style={{ color: "#D4537E", fontSize: "11px" }}>*</span>
            </div>
            <div className={s.phoneWrap}>
              <div className={s.phoneCode}>
                <span className={s.phoneFlag} />
                +٩٦٦
              </div>
              <input
                className={`${s.phoneInp} ${phoneError ? s.phoneInpError : ""}`}
                type="tel"
                placeholder="5X XXX XXXX"
                maxLength={10}
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
            {phoneError && <div className={s.phoneError}>{phoneError}</div>}

            <div className={s.privacyNote}>
              <div className={s.privacyIc}>🔒</div>
              <p className={s.privacyTxt}>
                <strong>رقمك لن يُشارَك.</strong> نستخدمه فقط لتأكيد الحساب
                والتواصل من طبيبك. لا نرسل إعلانات ولا نبيع البيانات لطرف
                ثالث.
              </p>
            </div>

            <div className={s.termsText}>
              بالمتابعة أنت توافق على{" "}
              <span className={s.termsLink}>الشروط والأحكام</span> و
              <span className={s.termsLink}>سياسة الخصوصية</span>.
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 9: التحقّق ═══ */}
      {currentStep === 9 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            الخطوة ٩ من ٩ · التحقّق من الرقم
          </div>
          <h2 className={s.svTtl}>أدخل رمز التحقّق</h2>
          <p className={s.svSub}>
            أرسلنا رمزاً مكوّناً من ٤ أرقام إلى جوّالك{" "}
            <strong>+٩٦٦ {phone}</strong>. أدخله هنا لإكمال اشتراكك.
          </p>

          <div className={s.formCenter}>
            <div className={s.otpRow}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  className={`${s.otpDigit} ${d ? s.otpDigitFilled : ""}`}
                  type="tel"
                  maxLength={1}
                  inputMode="numeric"
                  value={d}
                  onChange={(e) => handleOtp(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(e, i)}
                />
              ))}
            </div>

            <div className={s.otpResend}>
              لم يصلك الرمز؟{" "}
              {otpTimer > 0 ? (
                <span className={s.otpResendDisabled}>
                  إعادة الإرسال خلال {otpTimer.toLocaleString("ar-SA")}ث
                </span>
              ) : (
                <button
                  className={s.otpResendBtn}
                  onClick={startOtpTimer}
                >
                  إعادة إرسال الرمز
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ═══ STEP 10: التأكيد ═══ */}
      {currentStep === 10 && (
        <div className={s.svPage}>
          <div className={s.confirmIconWrap}>
            <div className={s.confirmCircle}>
              <div className={s.confirmCheck}>✓</div>
            </div>
          </div>
          <h1 className={s.confirmTtl}>اكتمل التحقّق بنجاح</h1>
          <p className={s.confirmSub}>
            راجع ملخّص اشتراكك أدناه ثم انتقل للدفع لإكمال التسجيل.
          </p>

          <div className={s.summary}>
            <p className={s.summaryTtl}>ملخّص اشتراكك</p>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>الباقة</span>
              <span className={s.summaryVal}>{planLabel}</span>
            </div>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>رقم الجوّال</span>
              <span className={s.summaryVal}>+٩٦٦ {phone}</span>
            </div>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>المدينة</span>
              <span className={s.summaryVal}>الرياض</span>
            </div>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>الوزن الحالي</span>
              <span className={s.summaryVal}>{(answers.q1 as string) || "—"} كجم</span>
            </div>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>مؤشّر كتلة الجسم</span>
              <span className={s.summaryVal}>{calcBmi()}</span>
            </div>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>الهدف الأساسي</span>
              <span className={s.summaryVal}>{goalLabels[(answers.q26 as string)] || "—"}</span>
            </div>
            <div className={`${s.summaryRow} ${s.summaryRowTotal}`}>
              <span className={s.summaryLbl}>المبلغ المستحقّ</span>
              <span className={s.summaryValBig}>
                <sub>ريال</sub>
                {price.toLocaleString("ar-SA")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ACTIONS BAR */}
      {apiError && (
        <div style={{ color: "red", textAlign: "center", padding: "8px 16px", fontSize: 14 }}>
          {apiError}
        </div>
      )}
      <div className={s.actions}>
        <button
          className={`${s.btnBack} ${currentStep === 1 ? s.btnBackHidden : ""}`}
          onClick={goBack}
          disabled={loading}
        >
          السابق
        </button>

        <button
          className={s.btnNext}
          disabled={!isStepValid() || loading}
          onClick={goNext}
        >
          {btnLabel()}
          {!loading && currentStep < 8 && <div className={s.btnNextArr}>←</div>}
        </button>
      </div>
    </div>
  );
}

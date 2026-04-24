"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import s from "./subscribe.module.css";

const TOTAL_PROGRESS_STEPS = 7;

const PLANS: Record<string, { price: number; label: string }> = {
  monthly: { price: 149, label: "شهرياً" },
  quarterly: { price: 357, label: "كل ٣ أشهر" },
  annual: { price: 1250, label: "سنوياً" },
};

const PREF_LABEL: Record<string, string> = {
  asneeded: "عند الحاجة — سريع المفعول",
  daily: "مفعول طويل — حتى ٣٦ ساعة",
};

const stepLabels = [
  "عنك",
  "الأعراض",
  "الصحة العامة",
  "الأدوية",
  "نمط الحياة",
  "الجوّال",
  "التحقّق",
];

export default function SexualHealthSubscribePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const plan = "quarterly";
  const price = PLANS[plan].price;
  const planLabel = PLANS[plan].label;

  /* OTP timer */
  useEffect(() => {
    if (otpTimer > 0) {
      timerRef.current = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [otpTimer]);

  const startOtpTimer = () => {
    setOtpTimer(30);
    setOtpSent(true);
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

      // "none" logic
      if (val === "none") {
        // selecting "none" deselects everything else
        return { ...prev, [key]: ["none"] };
      }

      // selecting any other option removes "none"
      const filtered = list.filter((v) => v !== "none");

      if (filtered.includes(val)) {
        return { ...prev, [key]: filtered.filter((v) => v !== val) };
      }
      return { ...prev, [key]: [...filtered, val] };
    });
  };

  const setInput = (key: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  /* validation */
  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 1: {
        const name = (answers.q1 as string) || "";
        const age = parseInt(answers.q2 as string);
        const height = parseInt(answers.q3 as string);
        const weight = parseInt(answers.q4 as string);
        return (
          name.length >= 2 &&
          age >= 18 && age <= 100 &&
          height >= 140 && height <= 220 &&
          weight >= 40 && weight <= 200
        );
      }
      case 2:
        return ["q5", "q6", "q7", "q8", "q9", "q10", "q11"].every(
          (k) => answers[k]
        );
      case 3: {
        const q12 = answers.q12;
        return !!(
          Array.isArray(q12) &&
          q12.length > 0 &&
          answers.q13 &&
          answers.q14 &&
          answers.q15 &&
          answers.q16 &&
          answers.q17
        );
      }
      case 4: {
        const q18 = answers.q18;
        return !!(
          Array.isArray(q18) &&
          q18.length > 0 &&
          answers.q19 &&
          answers.q20 &&
          answers.q21
        );
      }
      case 5:
        return ["q22", "q23", "q24", "q25", "q26"].every((k) => answers[k]);
      case 6: {
        const clean = phone.replace(/\s/g, "");
        return /^5\d{8}$/.test(clean);
      }
      case 7:
        return otp.every((d) => d !== "");
      default:
        return true;
    }
  }, [currentStep, answers, phone, otp]);

  /* navigation */
  const goNext = () => {
    if (currentStep === 6) startOtpTimer();
    if (currentStep < 8) {
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
    if (currentStep <= 5) return "متابعة";
    if (currentStep === 6) return "إرسال رمز التحقّق";
    if (currentStep === 7) return "تأكيد";
    return "";
  };

  /* first name from q1 */
  const firstName = () => {
    const name = (answers.q1 as string) || "";
    return name.split(" ")[0] || "مرحباً";
  };

  /* ── Reusable mini-components ── */
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
  }: {
    qKey: string;
    options: { label: string; value: string }[];
    className?: string;
  }) => (
    <div className={className || s.qOpts}>
      {options.map((o) => (
        <div
          key={o.value}
          className={`${s.qOpt} ${answers[qKey] === o.value ? s.qOptSelected : ""}`}
          onClick={() => pickOne(qKey, o.value)}
        >
          {o.label}
        </div>
      ))}
    </div>
  );

  const YesNo = ({
    qKey,
    labels,
  }: {
    qKey: string;
    labels?: { yes: string; no: string };
  }) => {
    const yesLabel = labels?.yes || "نعم";
    const noLabel = labels?.no || "لا";
    return (
      <div className={s.qYesno}>
        {[
          { label: yesLabel, value: "yes" },
          { label: noLabel, value: "no" },
        ].map((o) => (
          <div
            key={o.value}
            className={`${s.qOpt} ${answers[qKey] === o.value ? s.qOptSelected : ""}`}
            onClick={() => pickOne(qKey, o.value)}
          >
            {o.label}
          </div>
        ))}
      </div>
    );
  };

  const NumberInput = ({
    qKey,
    unit,
    type = "number",
    placeholder,
  }: {
    qKey: string;
    unit?: string;
    type?: string;
    placeholder?: string;
  }) => (
    <div className={s.qInpWrap}>
      <input
        className={s.qInp}
        type={type}
        placeholder={placeholder}
        value={(answers[qKey] as string) || ""}
        onInput={(e) => setInput(qKey, (e.target as HTMLInputElement).value)}
      />
      {unit && <div className={s.qInpUnit}>{unit}</div>}
    </div>
  );

  const MultiSelect = ({
    qKey,
    options,
  }: {
    qKey: string;
    options: { label: string; value: string }[];
  }) => (
    <div className={s.qCbGrid}>
      {options.map((o) => {
        const selected =
          Array.isArray(answers[qKey]) &&
          (answers[qKey] as string[]).includes(o.value);
        return (
          <div
            key={o.value}
            className={`${s.qCb} ${selected ? s.qCbSelected : ""}`}
            onClick={() => toggleCb(qKey, o.value)}
          >
            <div className={s.qCbBox}>{selected ? "✓" : ""}</div>
            {o.label}
          </div>
        );
      })}
    </div>
  );

  /* ── RENDER ── */
  return (
    <div dir="rtl" className={s.app}>
      {/* NAV */}
      <div className={s.nav}>
        <Link href="/sexualHealth" className={s.brand}>
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

      {/* ═══ STEP 1: عنك ═══ */}
      {currentStep === 1 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            القسم ١ من ٥ · عنك
          </div>
          <h2 className={s.svTtl}>لنتعرّف عليك</h2>
          <p className={s.svSub}>
            بيانات أساسية يحتاجها طبيبك لتقييم أهليّتك الطبّية. لن تُشارَك مع
            أي جهة خارجية.
          </p>

          <QuestionBlock num="١" text="ما اسمك الكامل؟">
            <NumberInput qKey="q1" type="text" placeholder="مثال: محمد عبدالله" />
          </QuestionBlock>
          <QuestionBlock num="٢" text="ما عمرك؟">
            <NumberInput qKey="q2" unit="سنة" />
          </QuestionBlock>
          <QuestionBlock num="٣" text="ما طولك؟">
            <NumberInput qKey="q3" unit="سم" />
          </QuestionBlock>
          <QuestionBlock num="٤" text="ما وزنك؟">
            <NumberInput qKey="q4" unit="كجم" />
          </QuestionBlock>
        </div>
      )}

      {/* ═══ STEP 2: الأعراض ═══ */}
      {currentStep === 2 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            القسم ٢ من ٥ · الأعراض
          </div>
          <h2 className={s.svTtl}>أخبرنا عن حالتك</h2>
          <p className={s.svSub}>
            خمس أسئلة سريرية معتمدة عالمياً (IIEF-5) لتقييم درجة الحالة.
            الإجابات محميّة وتصل مباشرة لطبيبك.
          </p>

          <QuestionBlock
            num="٥"
            text="خلال الأسابيع الستة الماضية، ما مدى ثقتك في قدرتك على الحصول على انتصاب والمحافظة عليه؟"
          >
            <SingleSelect
              qKey="q5"
              options={[
                { label: "عالية جداً", value: "very-high" },
                { label: "عالية", value: "high" },
                { label: "متوسطة", value: "mid" },
                { label: "منخفضة", value: "low" },
                { label: "منخفضة جداً", value: "very-low" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock
            num="٦"
            text="عند الإثارة، كم مرة كان الانتصاب قوياً بما يكفي للإيلاج؟"
          >
            <SingleSelect
              qKey="q6"
              options={[
                { label: "دائماً تقريباً", value: "always" },
                { label: "في أغلب الأحيان", value: "most" },
                { label: "أحياناً", value: "sometimes" },
                { label: "قليلاً", value: "few" },
                { label: "أبداً", value: "never" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock
            num="٧"
            text="خلال الجماع، كم مرة تمكّنت من الحفاظ على الانتصاب بعد الإيلاج؟"
          >
            <SingleSelect
              qKey="q7"
              options={[
                { label: "دائماً تقريباً", value: "always" },
                { label: "في أغلب الأحيان", value: "most" },
                { label: "أحياناً", value: "sometimes" },
                { label: "قليلاً", value: "few" },
                { label: "أبداً", value: "never" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock
            num="٨"
            text="خلال الجماع، ما مدى صعوبة الحفاظ على الانتصاب حتى إكمال الجماع؟"
          >
            <SingleSelect
              qKey="q8"
              options={[
                { label: "صعب للغاية", value: "extremely" },
                { label: "صعب جداً", value: "very" },
                { label: "صعب", value: "difficult" },
                { label: "صعب قليلاً", value: "little" },
                { label: "ليس صعباً", value: "not" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock
            num="٩"
            text="عند محاولة الجماع، كم مرة كان الأمر مرضياً لك؟"
          >
            <SingleSelect
              qKey="q9"
              options={[
                { label: "دائماً تقريباً", value: "always" },
                { label: "في أغلب الأحيان", value: "most" },
                { label: "أحياناً", value: "sometimes" },
                { label: "قليلاً", value: "few" },
                { label: "أبداً", value: "never" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock num="١٠" text="متى بدأت تلاحظ المشكلة؟">
            <SingleSelect
              qKey="q10"
              options={[
                { label: "أقل من ٣ أشهر", value: "<3m" },
                { label: "٣-١٢ شهراً", value: "3-12m" },
                { label: "١-٣ سنوات", value: "1-3y" },
                { label: "أكثر من ٣ سنوات", value: "3y+" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock
            num="١١"
            text="هل تلاحظ انتصاباً تلقائياً في الصباح أو أثناء النوم؟"
          >
            <YesNo
              qKey="q11"
              labels={{ yes: "نعم، أحياناً", no: "نادراً أو لا" }}
            />
          </QuestionBlock>
        </div>
      )}

      {/* ═══ STEP 3: الصحة العامة ═══ */}
      {currentStep === 3 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            القسم ٣ من ٥ · الصحة العامة
          </div>
          <h2 className={s.svTtl}>ملفّك الصحّي</h2>
          <p className={s.svSub}>
            حالات صحّية قد تؤثّر على الدواء أو الجرعة. كن صريحاً — السرّية
            مضمونة.
          </p>

          <QuestionBlock
            num="١٢"
            text="هل شُخّصت بأي من التالي؟"
            note="يمكن اختيار أكثر من واحد"
          >
            <MultiSelect
              qKey="q12"
              options={[
                { label: "أمراض القلب", value: "heart" },
                { label: "ارتفاع ضغط الدم", value: "bp-high" },
                { label: "انخفاض ضغط الدم", value: "bp-low" },
                { label: "سكّري", value: "diabetes" },
                { label: "كولسترول مرتفع", value: "chol" },
                { label: "أمراض كبد", value: "liver" },
                { label: "أمراض كلى", value: "kidney" },
                { label: "لا شيء ممّا سبق", value: "none" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock
            num="١٣"
            text="هل أُصبت بنوبة قلبية أو جلطة دماغية خلال الستة أشهر الماضية؟"
          >
            <YesNo qKey="q13" />
          </QuestionBlock>

          <QuestionBlock
            num="١٤"
            text="هل تشعر بألم في الصدر عند المجهود أو الجماع؟"
          >
            <YesNo qKey="q14" />
          </QuestionBlock>

          <QuestionBlock
            num="١٥"
            text="هل هناك تاريخ عائلي لوفاة مبكّرة بأمراض القلب؟"
          >
            <YesNo qKey="q15" />
          </QuestionBlock>

          <QuestionBlock
            num="١٦"
            text="هل خضعت لأي عملية جراحية في الجهاز التناسلي أو البروستاتا؟"
          >
            <YesNo qKey="q16" />
          </QuestionBlock>

          <QuestionBlock
            num="١٧"
            text="هل لديك مرض في شبكية العين (اعتلال شبكي صباغي)؟"
          >
            <YesNo qKey="q17" />
          </QuestionBlock>
        </div>
      )}

      {/* ═══ STEP 4: الأدوية الحالية ═══ */}
      {currentStep === 4 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            القسم ٤ من ٥ · الأدوية الحالية
          </div>
          <h2 className={s.svTtl}>ما تتناوله حالياً</h2>
          <p className={s.svSub}>
            التعارض الدوائي هو أخطر ما يواجه مرضى ED. هذه الأسئلة حرجة.
          </p>

          <div className={s.secIntro}>
            <strong>تنبيه مهمّ:</strong> إذا كنت تستخدم أي دواء يحتوي على{" "}
            <em>نترات</em> (مثل Nitroglycerin, Isordil) لعلاج القلب أو ألم
            الصدر، فإن مثبّطات PDE5{" "}
            <strong>ممنوعة عليك تماماً</strong> — قد يحدث هبوط حادّ في ضغط الدم.
          </div>

          <QuestionBlock num="١٨" text="هل تتناول أي من الأدوية التالية؟">
            <MultiSelect
              qKey="q18"
              options={[
                { label: "نترات (Nitroglycerin، Isordil)", value: "nitrates" },
                { label: "حاصرات ألفا (Tamsulosin)", value: "alpha" },
                { label: "مضادّات الفطريات (Ketoconazole)", value: "antifungal" },
                { label: "مضادّات حيوية", value: "antibiotic" },
                { label: "أدوية ضغط الدم", value: "antihyper" },
                { label: "مضادّات اكتئاب (SSRIs)", value: "antidepressant" },
                { label: "أدوية HIV (Ritonavir)", value: "hiv" },
                { label: "لا شيء من هذه", value: "none" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock
            num="١٩"
            text="هل جرّبت Viagra أو Cialis من قبل؟"
          >
            <SingleSelect
              qKey="q19"
              options={[
                { label: "نعم، عمل معي", value: "yes-works" },
                { label: "نعم، جزئياً", value: "yes-partial" },
                { label: "نعم، لم يعمل", value: "yes-no" },
                { label: "لم أجرّب", value: "no" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock
            num="٢٠"
            text="هل عانيت من آثار جانبية مع أي دواء سابقاً (صداع، احمرار، عسر هضم)؟"
          >
            <YesNo qKey="q20" />
          </QuestionBlock>

          <QuestionBlock num="٢١" text="هل لديك حساسية من أي دواء؟">
            <YesNo qKey="q21" />
          </QuestionBlock>
        </div>
      )}

      {/* ═══ STEP 5: نمط الحياة والتفضيلات ═══ */}
      {currentStep === 5 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            القسم ٥ من ٥ · نمط الحياة والتفضيلات
          </div>
          <h2 className={s.svTtl}>آخر الأسئلة — لتحديد الدواء المناسب</h2>
          <p className={s.svSub}>
            نمط حياتك يحدّد أيّ دواء وأيّ جرعة. كُن دقيقاً.
          </p>

          <QuestionBlock num="٢٢" text="هل تدخّن؟">
            <SingleSelect
              qKey="q22"
              options={[
                { label: "نعم، يومياً", value: "yes" },
                { label: "أحياناً", value: "occasional" },
                { label: "أقلعت", value: "past" },
                { label: "لم أدخّن أبداً", value: "never" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock num="٢٣" text="كم مرة تمارس الرياضة أسبوعياً؟">
            <SingleSelect
              qKey="q23"
              options={[
                { label: "نادراً", value: "none" },
                { label: "١-٢ مرة", value: "1-2" },
                { label: "٣-٤ مرات", value: "3-4" },
                { label: "٥+ مرات", value: "5+" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock num="٢٤" text="كيف تقيّم مستوى التوتّر لديك مؤخراً؟">
            <SingleSelect
              qKey="q24"
              options={[
                { label: "منخفض", value: "low" },
                { label: "متوسط", value: "mid" },
                { label: "عالٍ", value: "high" },
                { label: "عالٍ جداً", value: "very-high" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock num="٢٥" text="هل تشعر بقلق قبل أو أثناء الجماع؟">
            <SingleSelect
              qKey="q25"
              options={[
                { label: "أبداً", value: "never" },
                { label: "أحياناً", value: "sometimes" },
                { label: "غالباً", value: "often" },
                { label: "دائماً", value: "always" },
              ]}
            />
          </QuestionBlock>

          <QuestionBlock num="٢٦" text="أيّ الخيارين يناسبك أكثر؟">
            <SingleSelect
              qKey="q26"
              className={s.qPrefGrid}
              options={[
                {
                  label: "عند الحاجة · سريع المفعول (٤-٥ ساعات)",
                  value: "asneeded",
                },
                {
                  label: "مفعول طويل (حتى ٣٦ ساعة) · للعفوية",
                  value: "daily",
                },
              ]}
            />
          </QuestionBlock>

          <div className={s.secIntro}>
            <strong>تبقّت خطوتان:</strong> رقم جوّالك، ثم رمز التحقّق لتأكيد
            هويّتك.
          </div>
        </div>
      )}

      {/* ═══ STEP 6: رقم الجوّال ═══ */}
      {currentStep === 6 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            الخطوة ٦ من ٧ · رقم الجوّال
          </div>
          <h2 className={s.svTtl}>رقم جوّالك للتواصل</h2>
          <p className={s.svSub}>
            نستخدم رقمك فقط لتأكيد الهويّة والتواصل من طبيبك. لن نرسل لك
            إعلانات، ولا نبيع الرقم.
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
                <strong>سرّيّتك أولاً.</strong> الدفع يظهر في بيانك البنكي باسم
                &quot;Labass&quot; فقط. رقم جوّالك لا
                يُشارَك مع طرف ثالث.
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

      {/* ═══ STEP 7: التحقّق ═══ */}
      {currentStep === 7 && (
        <div className={s.svPage}>
          <div className={s.svEyebrow}>
            <div className={s.svEyeDot} />
            الخطوة ٧ من ٧ · التحقّق من الرقم
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

      {/* ═══ STEP 8: التأكيد ═══ */}
      {currentStep === 8 && (
        <div className={s.svPage}>
          <div className={s.confirmIconWrap}>
            <div className={s.confirmCircle}>
              <div className={s.confirmCheck}>✓</div>
            </div>
          </div>
          <h1 className={s.confirmTtl}>
            تمّ الاشتراك بنجاح، {firstName()}
          </h1>
          <p className={s.confirmSub}>
            بياناتك الآن تحت مراجعة طبيبك. سيراجع ملفّك ويصف لك العلاج المناسب
            خلال ٢٤ ساعة.
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
              <span className={s.summaryLbl}>التفضيل</span>
              <span className={s.summaryVal}>
                {PREF_LABEL[(answers.q26 as string)] || "—"}
              </span>
            </div>
            <div className={`${s.summaryRow} ${s.summaryRowTotal}`}>
              <span className={s.summaryLbl}>المبلغ المستحقّ</span>
              <span className={s.summaryValBig}>
                <sub>ريال</sub>
                {price.toLocaleString("ar-SA")}
              </span>
            </div>
          </div>

          <div className={s.nextSteps}>
            <p className={s.nextTtl}>الخطوات القادمة</p>
            <ul className={s.nextList}>
              <li className={s.nextItem}>
                <div className={s.nextNum}>١</div>
                <div className={s.nextTxt}>
                  <strong>خلال ٢٤ ساعة:</strong> طبيبك يراجع ملفّك ويختار
                  الدواء والجرعة المناسبة.
                </div>
              </li>
              <li className={s.nextItem}>
                <div className={s.nextNum}>٢</div>
                <div className={s.nextTxt}>
                  <strong>تأكيد الوصفة:</strong> يصلك إشعار بقبول الوصفة
                  وتفاصيل التوصيل.
                </div>
              </li>
              <li className={s.nextItem}>
                <div className={s.nextNum}>٣</div>
                <div className={s.nextTxt}>
                  <strong>٤٨-٧٢ ساعة:</strong> الطلبية توصلك لبابك.
                </div>
              </li>
              <li className={s.nextItem}>
                <div className={s.nextNum}>٤</div>
                <div className={s.nextTxt}>
                  <strong>تواصل متى شئت:</strong> طبيبك متاح عبر المحادثة لأي
                  سؤال — بدون رسوم.
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ACTIONS BAR */}
      {currentStep <= 7 && (
        <div className={s.actions}>
          <button
            className={`${s.btnBack} ${
              currentStep === 1 ? s.btnBackHidden : ""
            }`}
            onClick={goBack}
          >
            السابق
          </button>

          <button
            className={s.btnNext}
            disabled={!isStepValid()}
            onClick={goNext}
          >
            {btnLabel()}
            <div className={s.btnNextArr}>←</div>
          </button>
        </div>
      )}

      {/* Confirmation: link back */}
      {currentStep === 8 && (
        <div className={s.actions}>
          <div />
          <Link href="/sexualHealth" className={s.btnNext}>
            تمّ · العودة للرئيسية
          </Link>
        </div>
      )}
    </div>
  );
}

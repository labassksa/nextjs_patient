"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { loginPatient } from "@/app/login/_controllers/sendOTP.Controller";
import { verifyOTPandLogin } from "@/app/otp/_controllers/verifyOTPandLogin";
import s from "./subscribe.module.css";

const TOTAL_STEPS = 4;

const cityOptions = [
  { value: "riyadh", label: "الرياض" },
];

const planMeta: Record<string, { period: string; popular: boolean; fallbackLabel: string }> = {
  monthly:   { period: "/ شهرياً",      popular: false, fallbackLabel: "شهري"       },
  quarterly: { period: "/ كل ٣ أشهر", popular: true,  fallbackLabel: "كل ٣ أشهر" },
};

const planFeaturesList = [
  "استشارة طبية فورية 24/7 مع طبيب أسرة",
  "إعادة صرف وصفاتك الدائمة",
  "وصفة إلكترونية معتمدة",
  "تواصل مباشر مع الطبيب",
];

export default function GeneralPackageSubscribePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Plan
  const [selectedPlanId, setSelectedPlanId] = useState("quarterly");
  const [monthlyBundle,   setMonthlyBundle]   = useState<{ id: number; price: number; description: string } | null>(null);
  const [quarterlyBundle, setQuarterlyBundle] = useState<{ id: number; price: number; description: string } | null>(null);
  const selectedBundle = selectedPlanId === "monthly" ? monthlyBundle : quarterlyBundle;
  const bundleId  = selectedBundle?.id ?? null;
  const price     = selectedBundle?.price ?? 0;
  const planLabel = selectedBundle?.description || planMeta[selectedPlanId].fallbackLabel;

  // Personal info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("riyadh");
  const [phoneError, setPhoneError] = useState("");

  // OTP
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auth
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch individual GP bundles and map to monthly / quarterly by intervalDays
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bundles`)
      .then(({ data }) => {
        const list: any[] = Array.isArray(data) ? data : (data.data ?? []);
        const individualGP = list.filter(
          (b: any) => b.type === "GP Consultations" && b.whoSubscribes === "individual"
        );
        const monthly   = individualGP.find((b: any) => b.intervalDays === 30);
        const quarterly = individualGP.find((b: any) => b.intervalDays === 90);
        if (monthly)   setMonthlyBundle({ id: monthly.id, price: Number(monthly.price), description: monthly.description || "" });
        if (quarterly) setQuarterlyBundle({ id: quarterly.id, price: Number(quarterly.price), description: quarterly.description || "" });
      })
      .catch(() => {});
  }, []);

  // Start countdown timer when arriving at step 3
  useEffect(() => {
    if (currentStep === 3) {
      setOtpTimer(60);
      timerRef.current = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) { if (timerRef.current) clearInterval(timerRef.current); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentStep]);

  const resendOtp = async () => {
    setOtp(["", "", "", ""]);
    setOtpTimer(60);
    setApiError(null);
    const cleanPhone = phone.replace(/\s/g, "");
    const result = await loginPatient(cleanPhone, "+966");
    if (!result.success) setApiError(result.message || "فشل إعادة إرسال الرمز");
    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) { if (timerRef.current) clearInterval(timerRef.current); return 0; }
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
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 1: return !!selectedPlanId;
      case 2: {
        const clean = phone.replace(/\s/g, "");
        return !!(name && /^5\d{8}$/.test(clean) && city);
      }
      case 3: return otp.every((d) => d !== "");
      default: return true;
    }
  }, [currentStep, selectedPlanId, name, phone, city, otp]);

  const goToStep = (n: number) => {
    setCurrentStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = async () => {
    setApiError(null);
    if (currentStep === 2) {
      setLoading(true);
      const cleanPhone = phone.replace(/\s/g, "");
      const result = await loginPatient(cleanPhone, "+966");
      setLoading(false);
      if (result.success) {
        goToStep(3);
      } else {
        setApiError(result.message || "فشل إرسال رمز التحقق");
      }
      return;
    }
    if (currentStep === 3) {
      setLoading(true);
      const fullPhone = "+966" + phone.replace(/\s/g, "");
      const result = await verifyOTPandLogin("patient", fullPhone, otp.join(""));
      setLoading(false);
      if (result && result.success) {
        setToken(result.token!);
        goToStep(4);
      } else if (result) {
        setApiError(result.message ?? "حدث خطأ ، حاول مرة أخرى");
      } else {
        setApiError("حدث خطأ ، حاول مرة أخرى");
      }
      return;
    }
    if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
  };

  const handleSubscribe = () => {
    if (!bundleId) { setApiError("لم يتم تحديد الباقة، يرجى المحاولة مجدداً"); return; }
    router.push(
      `/subscription/payment?bundleId=${bundleId}&discountedPrice=${price}&subscriberType=patient&isRecurring=false`
    );
  };

  const prevStep = () => { if (currentStep > 1) goToStep(currentStep - 1); };

  const getNextLabel = () => {
    if (currentStep === 3) return "مراجعة الطلب";
    if (currentStep === 4) return "الانتقال للدفع";
    return "متابعة";
  };

  const progPct = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;
  const stepLabels = ["اختر الباقة", "بياناتك الشخصية", "تحقّق الجوّال", "مراجعة ودفع"];
  const arabicStep = ["١", "٢", "٣", "٤"];

  return (
    <div dir="rtl" className={s.app}>
      {/* Nav */}
      <div className={s.nav}>
        <Link href="/generalPackage" className={s.brand}>
          <div className={s.mark} />
          <div className={s.bname}>لاباس</div>
        </Link>
      </div>

      {/* Progress */}
      <div className={s.progWrap}>
        <div className={s.progSteps}>
          <div className={s.progLine} />
          <div className={s.progFill} style={{ width: `${progPct}%` }} />
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const cls = stepNum < currentStep ? s.progStepDone : stepNum === currentStep ? s.progStepActive : "";
            return (
              <div key={i} className={`${s.progStep} ${cls}`}>
                <div className={s.progDot}>{stepNum < currentStep ? "✓" : arabicStep[i]}</div>
                <div className={s.progLabel}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step 1: Plan ── */}
      {currentStep === 1 && (
        <div className={s.page} key="step1">
          <div className={s.eyebrow}><div className={s.eyeDot} />الخطوة ١ من ٤</div>
          <h1 className={s.pageTtl}>اختر الباقة المناسبة لك</h1>
          <p className={s.pageSub}>استشارة طبية 24/7 مع طبيب أسرة مرخّص.</p>

          <div className={s.plans}>
            {(["monthly", "quarterly"] as const).map((planId) => {
              const meta   = planMeta[planId];
              const bundle = planId === "monthly" ? monthlyBundle : quarterlyBundle;
              const isSelected = selectedPlanId === planId;
              return (
                <div
                  key={planId}
                  className={`${s.plan} ${meta.popular ? s.planPopular : ""} ${isSelected ? s.planSelected : ""}`}
                  onClick={() => setSelectedPlanId(planId)}
                >
                  <div className={s.planRadio} />
                  {meta.popular && <div className={s.planPop}>الأكثر طلباً</div>}
                  <div className={s.planName}>{bundle?.description || meta.fallbackLabel}</div>
                  <div className={s.planPrice}>
                    <div className={s.planNum}>
                      {bundle ? bundle.price.toLocaleString("ar-SA") : "—"}
                    </div>
                    <div className={s.planCur}>ريال</div>
                  </div>
                  <p className={s.planPeriod}>{meta.period}</p>
                  <ul className={s.planFeats}>
                    {planFeaturesList.map((f, i) => (
                      <li key={i} className={s.planFeat}>
                        <div className={s.planCk}>✓</div>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className={s.recurringWrap} style={{ opacity: 0.4, pointerEvents: "none" }}>
            <p className={s.recurringLabel}>نوع الدفع</p>
            <div className={s.recurringToggle}>
              <button className={`${s.recurringOpt} ${s.recurringOptActive}`} type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" /></svg>
                دفعة واحدة
              </button>
              <button className={s.recurringOpt} type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M23 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                اشتراك متكرّر
              </button>
            </div>
            <p className={s.recurringHint}>ادفع مرة واحدة فقط بدون تجديد تلقائي</p>
          </div>
        </div>
      )}

      {/* ── Step 2: Personal info ── */}
      {currentStep === 2 && (
        <div className={s.page} key="step2">
          <div className={s.eyebrow}><div className={s.eyeDot} />الخطوة ٢ من ٤</div>
          <h1 className={s.pageTtl}>عرّفنا عن نفسك</h1>
          <p className={s.pageSub}>هذه البيانات تصل مباشرة لطبيبك ولن تُشارَك مع أي طرف آخر. محمية بمعايير PDPL السعودية.</p>

          <div className={s.formGrid}>
            <div className={`${s.field} ${s.fieldFull}`}>
              <label className={s.fieldLbl}>الاسم الكامل <span className={s.fieldReq}>*</span></label>
              <input className={s.fieldInp} type="text" placeholder="أحمد بن محمد العتيبي" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className={`${s.field} ${s.fieldFull}`}>
              <label className={s.fieldLbl}>رقم الجوّال <span className={s.fieldReq}>*</span></label>
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
                    if (clean && !/^5/.test(clean)) setPhoneError("الرقم يجب أن يبدأ بـ 5");
                    else if (clean && clean.length > 0 && clean.length !== 9) setPhoneError("الرقم يجب أن يكون ٩ أرقام");
                    else setPhoneError("");
                  }}
                />
              </div>
              {phoneError && <span className={s.fieldError}>{phoneError}</span>}
            </div>

            <div className={`${s.field} ${s.fieldFull}`}>
              <label className={s.fieldLbl}>المدينة</label>
              <div className={s.selectWrap}>
                <select className={s.fieldInp} value={city} onChange={(e) => setCity(e.target.value)} style={{ appearance: "none" }}>
                  {cityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={s.privacyNote}>
            <div className={s.privacyIc}>🔒</div>
            <p className={s.privacyTxt}><strong>بياناتك مشفّرة وتُحفظ داخل المملكة.</strong> يطّلع عليها طبيبك المعالج فقط.</p>
          </div>
        </div>
      )}

      {/* ── Step 3: OTP ── */}
      {currentStep === 3 && (
        <div className={s.page} key="step3">
          <div className={s.eyebrow}><div className={s.eyeDot} />الخطوة ٣ من ٤</div>
          <h1 className={s.pageTtl}>تحقّق من رقم جوّالك</h1>
          <p className={s.pageSub}>أرسلنا رمز تحقّق مكوّن من ٤ أرقام للتأكّد من هويّتك.</p>

          <div className={s.otpWrap}>
            <div className={s.otpIcon}><div className={s.otpIconInner}>✉</div></div>
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
                <span>إعادة الإرسال بعد <span className={s.otpTimer}>{otpTimer.toLocaleString("ar-SA")}</span> ثانية</span>
              ) : (
                <span>لم يصلك الرمز؟ <button className={s.otpResendBtn} onClick={resendOtp}>أعد الإرسال</button></span>
              )}
            </div>
          </div>

          <div className={s.privacyNote}>
            <div className={s.privacyIc}>🔒</div>
            <p className={s.privacyTxt}><strong>التحقّق يحمي حسابك.</strong> نتأكّد من رقم جوّالك حتى نضمن أن بياناتك تصل للشخص الصحيح.</p>
          </div>
        </div>
      )}

      {/* ── Step 4: Review ── */}
      {currentStep === 4 && (
        <div className={s.page} key="step4">
          <div className={s.eyebrow}><div className={s.eyeDot} />الخطوة ٤ من ٤</div>
          <h1 className={s.pageTtl}>مراجعة طلبك</h1>
          <p className={s.pageSub}>تأكّد من التفاصيل أدناه ثم انتقل لصفحة الدفع.</p>

          <div className={s.summary}>
            <p className={s.summaryTtl}>ملخّص الطلب</p>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>الباقة</span>
              <span className={s.summaryVal}>{planLabel}</span>
            </div>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>الاسم</span>
              <span className={s.summaryVal}>{name}</span>
            </div>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>رقم الجوّال</span>
              <span className={s.summaryVal} style={{ direction: "ltr" }}>+966 {phone}</span>
            </div>
            <div className={s.summaryRow}>
              <span className={s.summaryLbl}>نوع الدفع</span>
              <span className={s.summaryVal}>دفعة واحدة</span>
            </div>
            <div className={`${s.summaryRow} ${s.summaryRowTotal}`}>
              <span className={s.summaryLbl}>المبلغ المستحقّ</span>
              <span className={s.summaryVal}><sub>ريال</sub>{price.toLocaleString("ar-SA")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer actions */}
      {apiError && (
        <div style={{ color: "red", textAlign: "center", padding: "8px 16px", fontSize: 14 }}>
          {apiError}
        </div>
      )}
      <div className={s.actions}>
        <button className={`${s.btnBack} ${currentStep === 1 ? s.btnBackHidden : ""}`} onClick={prevStep} disabled={loading}>
          السابق
        </button>
        <button className={s.btnNext} onClick={currentStep === 4 ? handleSubscribe : nextStep} disabled={!isStepValid() || loading}>
          {loading ? "جاري التحميل..." : getNextLabel()}
          {!loading && <div className={s.btnNextArr}>←</div>}
        </button>
      </div>
    </div>
  );
}

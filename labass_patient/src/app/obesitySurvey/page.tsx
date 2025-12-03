"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

interface SurveyData {
  weight: string;
  height: string;
  bmi: number | null;
  medicalConditions: string[];
  currentMedications: string[];
  otherMedication: string;
  medicationPreference: string;
  goals: string[];
}

const ObesitySurveyContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [surveyData, setSurveyData] = useState<SurveyData>({
    weight: "",
    height: "",
    bmi: null,
    medicalConditions: [],
    currentMedications: [],
    otherMedication: "",
    medicationPreference: "",
    goals: [],
  });

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (surveyData.weight && surveyData.height) {
      const weightNum = parseFloat(surveyData.weight);
      const heightNum = parseFloat(surveyData.height);
      if (weightNum > 0 && heightNum > 0) {
        const bmiValue = weightNum / ((heightNum / 100) ** 2);
        setSurveyData((prev) => ({ ...prev, bmi: parseFloat(bmiValue.toFixed(1)) }));
      }
    }
  }, [surveyData.weight, surveyData.height]);

  const getBMICategory = (bmi: number | null) => {
    if (!bmi) return "";
    if (bmi < 18.5) return "نحيف";
    if (bmi < 25) return "وزن طبيعي";
    if (bmi < 30) return "زيادة وزن";
    if (bmi < 35) return "سمنة من الدرجة الأولى";
    if (bmi < 40) return "سمنة من الدرجة الثانية";
    return "سمنة مفرطة";
  };

  const getBMIRange = (bmi: number | null) => {
    if (!bmi) return "";
    if (bmi < 18.5) return "أقل من 18.5";
    if (bmi < 25) return "18.5 - 24.9";
    if (bmi < 30) return "25 - 29.9";
    if (bmi < 35) return "30 - 34.9";
    if (bmi < 40) return "35 - 39.9";
    return "40 فأكثر";
  };

  const medicalConditionsList = [
    "تاريخ شخصي أو عائلي للإصابة بسرطان الغدة الدرقية النخاعي أو متلازمة الورم الصماوي المتعدد",
    "حاليًا تخضع لعلاج السرطان",
    "السكري أو اعتلال الشبكية السكري الحاد",
    "تاريخ سابق من الاكتئاب أو الأفكار الانتحارية",
    "مرض الكلى المزمن",
    "تم تشخيصك باضطراب الأكل",
    "متلقي لعملية زرع عضو",
    "خضعت لجراحة السمنة خلال العام الماضي",
    "تاريخ شخصي من التهاب البنكرياس",
    "لا شيء مما سبق",
  ];

  const currentMedicationsList = [
    "أدوية ضغط الدم مثل مضادات ارتفاع الضغط",
    "أدوية العلاج بالهرمونات البديلة مثل ليفوثيروكسين",
    "موانع الحمل الفموية",
    "أدوية تحتوي على الستيرويدات",
    "أدوية لإنقاص الوزن",
    "أخرى [يرجى التحديد]",
    "لا، لا أتناول أي أدوية أو فيتامينات",
  ];

  const goalsList = [
    "أبغى برنامج مخصص لخسارة الوزن تحت إشراف طبي",
    "أبغى خطة وجبات شخصية تناسبني",
    "أبغى أتابع وزني ومؤشرات صحتي",
    "أبغى أحجز استشارات مع أطباء وأخصائيين تغذية",
    "أبغى أبني عادات صحية",
    "كل اللي أبغاه أنزل وزني، ساعدوني",
    "مدري، بس قاعد أستكشف",
  ];

  const toggleSelection = (list: string[], item: string, field: keyof SurveyData) => {
    const currentList = surveyData[field] as string[];

    // Handle "لا شيء مما سبق" / "لا، لا أتناول أي أدوية أو فيتامينات" exclusivity
    const noneOption = field === "medicalConditions" ? "لا شيء مما سبق" :
                       field === "currentMedications" ? "لا، لا أتناول أي أدوية أو فيتامينات" :
                       null;

    if (noneOption && item === noneOption) {
      // If clicking "none", clear all other selections
      setSurveyData({ ...surveyData, [field]: [item] });
    } else {
      // If clicking other option, remove "none" if present
      let newList = currentList.filter(i => i !== noneOption);

      if (currentList.includes(item)) {
        newList = newList.filter((i) => i !== item);
      } else {
        newList = [...newList, item];
      }

      setSurveyData({ ...surveyData, [field]: newList });
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Get consultationId from URL params or localStorage
      const consultationId = searchParams.get("consultationId") || localStorage.getItem("obesityConsultationId");

      if (!consultationId) {
        console.error("No consultation ID found");
        alert("حدث خطأ: لم يتم العثور على رقم الاستشارة");
        setIsSubmitting(false);
        return;
      }

      // Get token for authorization
      const token = localStorage.getItem("labass_token");
      if (!token) {
        alert("يرجى تسجيل الدخول أولاً");
        setIsSubmitting(false);
        return;
      }

      // Format survey data for backend
      const surveyPayload = {
        survey: [
          { question: "الوزن الحالي", answer: `${surveyData.weight} كج` },
          { question: "الطول", answer: `${surveyData.height} سم` },
          { question: "مؤشر كتلة الجسم (BMI)", answer: surveyData.bmi?.toString() || "" },
          { question: "هل لديك هذه الحالات؟", answer: surveyData.medicalConditions.join(", ") },
          { question: "هل تتناول حاليًا أي من:", answer: surveyData.currentMedications.join(", ") },
          ...(surveyData.otherMedication ? [{ question: "أدوية أخرى", answer: surveyData.otherMedication }] : []),
          { question: "تفضيل الأدوية", answer: surveyData.medicationPreference === "with_medication" ? "أريد أدوية مع البرنامج" : "لا أريد الأدوية.. فقط البرنامج" },
          { question: "ويش اللي تدور عليه؟", answer: surveyData.goals.join(", ") },
        ]
      };

      // Send survey data to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultationId}/obesity-survey`,
        surveyPayload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        // Clear localStorage after successful save
        localStorage.removeItem("consultationType");
        localStorage.removeItem("obesityConsultationId");
        localStorage.removeItem("obesitySurveyData");

        // Redirect to chat with consultationId
        router.push(`/chat/${consultationId}`);
      }
    } catch (error: any) {
      console.error("Error submitting survey:", error);
      const errorMessage = error.response?.data?.message || error.message || "حدث خطأ أثناء إرسال الاستبيان";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true; // Welcome screen
      case 1:
        return surveyData.weight && surveyData.height; // BMI
      case 2:
        return surveyData.medicalConditions.length > 0; // Medical conditions
      case 3:
        return surveyData.currentMedications.length > 0; // Current medications
      case 4:
        return surveyData.medicationPreference !== ""; // Medication preference
      case 5:
        return surveyData.goals.length > 0; // Goals
      default:
        return false;
    }
  };

  const renderProgressBar = () => {
    const totalSteps = 6;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
      <div className="w-full bg-gray-200 h-1 mb-4">
        <div
          className="bg-red-500 h-1 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Header with back arrow */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={handleBack}
          className={`text-2xl ${currentStep === 0 ? "invisible" : ""}`}
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-sm font-semibold">
            {currentStep + 1}/{6}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto">
        {/* Step 0: Welcome */}
        {currentStep === 0 && (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-800">
                نحتاج نعرفك أول..
              </h1>
              <p className="text-gray-600">
                ونصمم لك الخطة المناسبة تالي
              </p>
              <p className="text-sm text-gray-500 mt-4">
                إجاباتك الدقيقة = خطة تناسبك أكثر
              </p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              لنبدأ الآن
            </button>
          </div>
        )}

        {/* Step 1: BMI Calculator */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                ← مؤشر كتلة الجسم
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">وزني الحالي</label>
                <input
                  type="number"
                  placeholder="كج"
                  value={surveyData.weight}
                  onChange={(e) =>
                    setSurveyData({ ...surveyData, weight: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 text-right text-gray-800"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">الطول</label>
                <input
                  type="number"
                  placeholder="سم"
                  value={surveyData.height}
                  onChange={(e) =>
                    setSurveyData({ ...surveyData, height: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 text-right text-gray-800"
                />
              </div>

              {surveyData.bmi && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">مؤشر كتلة الجسم الحالي (BMI)</span>
                    <span className="text-gray-900 font-semibold">
                      {surveyData.bmi}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    يتم حسابها باستخدام طولك ووزنك.
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{getBMIRange(surveyData.bmi)}</span>
                      <span className="font-semibold text-gray-900">{getBMICategory(surveyData.bmi)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-gray-300 text-white py-4 rounded-lg font-semibold disabled:opacity-50 enabled:bg-blue-500 enabled:hover:bg-blue-600 transition-colors"
            >
              التالي
            </button>
          </div>
        )}

        {/* Step 2: Medical Conditions */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                ← هل لديك هذه الحالات؟
              </h2>
            </div>

            <div className="space-y-3">
              {medicalConditionsList.map((condition, index) => {
                const isSelected = surveyData.medicalConditions.includes(condition);
                return (
                  <button
                    key={index}
                    onClick={() =>
                      toggleSelection(medicalConditionsList, condition, "medicalConditions")
                    }
                    className={`w-full p-4 rounded-lg border text-right transition-colors ${
                      isSelected
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {condition}
                    {isSelected && <span className="float-left">✓</span>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-gray-300 text-white py-4 rounded-lg font-semibold disabled:opacity-50 enabled:bg-blue-500 enabled:hover:bg-blue-600 transition-colors"
            >
              التالي
            </button>
          </div>
        )}

        {/* Step 3: Current Medications */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                ← هل تتناول حاليًا أي من:
              </h2>
            </div>

            <div className="space-y-3">
              {currentMedicationsList.map((medication, index) => {
                const isSelected = surveyData.currentMedications.includes(medication);
                return (
                  <button
                    key={index}
                    onClick={() =>
                      toggleSelection(currentMedicationsList, medication, "currentMedications")
                    }
                    className={`w-full p-4 rounded-lg border text-right transition-colors ${
                      isSelected
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {medication}
                    {isSelected && <span className="float-left">✓</span>}
                  </button>
                );
              })}

              {surveyData.currentMedications.includes("أخرى [يرجى التحديد]") && (
                <textarea
                  value={surveyData.otherMedication}
                  onChange={(e) =>
                    setSurveyData({ ...surveyData, otherMedication: e.target.value })
                  }
                  placeholder="اكتب هنا"
                  className="w-full border border-gray-300 rounded-lg p-3 text-right min-h-[100px] text-gray-800"
                />
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-gray-300 text-white py-4 rounded-lg font-semibold disabled:opacity-50 enabled:bg-blue-500 enabled:hover:bg-blue-600 transition-colors"
            >
              التالي
            </button>
          </div>
        )}

        {/* Step 4: Medication Preference */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                ← سؤال لك
              </h2>
              <p className="text-gray-600">
                كيف تفضل/ي برنامج فقدان الوزن؟<br />
                مع أدوية أو من غير أدوية
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() =>
                  setSurveyData({ ...surveyData, medicationPreference: "with_medication" })
                }
                className={`w-full p-4 rounded-lg border text-right transition-colors ${
                  surveyData.medicationPreference === "with_medication"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                }`}
              >
                أريد أدوية مع البرنامج
              </button>

              <button
                onClick={() =>
                  setSurveyData({ ...surveyData, medicationPreference: "without_medication" })
                }
                className={`w-full p-4 rounded-lg border text-right transition-colors ${
                  surveyData.medicationPreference === "without_medication"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                }`}
              >
                لا أريد الأدوية.. فقط البرنامج
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-gray-300 text-white py-4 rounded-lg font-semibold disabled:opacity-50 enabled:bg-blue-500 enabled:hover:bg-blue-600 transition-colors"
            >
              التالي
            </button>
          </div>
        )}

        {/* Step 5: Goals */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                ← ويش اللي تدور عليه؟
              </h2>
            </div>

            <div className="space-y-3">
              {goalsList.map((goal, index) => {
                const isSelected = surveyData.goals.includes(goal);
                return (
                  <button
                    key={index}
                    onClick={() => toggleSelection(goalsList, goal, "goals")}
                    className={`w-full p-4 rounded-lg border text-right transition-colors ${
                      isSelected
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {goal}
                    {isSelected && <span className="float-left">✓</span>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="w-full bg-gray-300 text-white py-4 rounded-lg font-semibold disabled:opacity-50 enabled:bg-blue-500 enabled:hover:bg-blue-600 transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="spinner" />
                </div>
              ) : (
                "التالي"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ObesitySurveyPage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ObesitySurveyContent />
  </Suspense>
);

export default ObesitySurveyPage;

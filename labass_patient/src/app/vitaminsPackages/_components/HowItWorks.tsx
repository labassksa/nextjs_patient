import React from "react";
import Image from "next/image";

const steps = [
  {
    number: "١",
    title: "اشترك واختر باقتك",
    description:
      "اختر الباقة المناسبة لك — شهرية، ربع سنوية، أو سنوية — وسجّل بياناتك بسهولة.",
    pill: null,
  },
  {
    number: "٢",
    title: "ممرض يزورك + طبيب يحلل نتائجك",
    description:
      "يأخذ الممرض عينة الدم في بيتك، والطبيب يقرأ النتائج ويحدد اللي تحتاجه.",
    pill: null,
  },
  {
    number: "٣",
    title: "تجيك فيتاميناتك لبيتك",
    description:
      "بناءً على تفسير الطبيب لنتائجك، نصمم لك مكملات غذائية مخصصة.",
    pill: "/images/pill5.png",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-8 md:py-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-black text-center mb-6 md:mb-8">
        كيف نشتغل؟
      </h2>
      <div className="space-y-4 md:space-y-6">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex items-start gap-3 md:gap-4 bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-custom-green text-white flex items-center justify-center font-bold text-sm md:text-lg flex-shrink-0">
              {step.number}
            </div>
            <div className="flex-1">
              <h3 className="text-sm md:text-lg font-semibold text-black mb-1">
                {step.title}
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">{step.description}</p>
            </div>
            {step.pill && (
              <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                <Image
                  src={step.pill}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;

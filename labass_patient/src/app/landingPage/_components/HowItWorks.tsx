import React from "react";

const steps = [
  {
    number: "١",
    title: "سجّل برقم جوالك",
    description: "دخول سريع بدون كلمة مرور",
  },
  {
    number: "٢",
    title: "اختر خدمتك",
    description: "استشارة، وصفة، أو قراءة تحاليل",
  },
  {
    number: "٣",
    title: "تواصل مع طبيبك",
    description: "محادثة أو فيديو في أقل من دقيقة",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 px-5 bg-gray-50">
      <div className="max-w-lg mx-auto">
        <p className="text-xs font-bold text-custom-green text-center mb-2 tracking-wider">
          كيف تبدأ؟
        </p>
        <h2 className="text-2xl font-black text-black text-center mb-10">
          ثلاث خطوات فقط
        </h2>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute right-6 top-8 bottom-8 w-px bg-gradient-to-b from-custom-green/30 via-custom-green/20 to-transparent" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center gap-5">
                <div
                  className={`relative z-10 w-12 h-12 rounded-full bg-custom-green text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-md shadow-custom-green/20 ${
                    index === 0 ? "ring-4 ring-custom-green/10" : ""
                  }`}
                >
                  {step.number}
                </div>
                <div>
                  <h3 className="text-base font-bold text-black">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

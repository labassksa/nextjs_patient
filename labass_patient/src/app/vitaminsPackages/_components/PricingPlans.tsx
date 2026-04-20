import React from "react";

const plans = [
  {
    name: "شهري",
    price: "٢٩٩",
    period: "ريال / شهرياً",
    badge: null,
    highlight: false,
  },
  {
    name: "كل ٣ أشهر",
    price: "٨١٠",
    period: "ريال / كل ٣ أشهر",
    badge: "وفّر ١٠٪",
    highlight: true,
  },
  {
    name: "سنوي",
    price: "٢٬٨٧٠",
    period: "ريال / سنوياً",
    badge: "وفّر ٢٠٪",
    highlight: false,
  },
];

const PricingPlans: React.FC = () => {
  return (
    <section className="py-8 md:py-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-black text-center mb-6 md:mb-8">
        اختر باقتك
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl p-4 md:p-6 text-center shadow-md border-2 ${
              plan.highlight
                ? "border-custom-green bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-custom-green text-white text-xs font-bold px-3 md:px-4 py-1 rounded-full">
                {plan.badge}
              </span>
            )}
            <h3 className="text-base md:text-lg font-semibold text-black mt-2 mb-3 md:mb-4">
              {plan.name}
            </h3>
            <div className="text-3xl md:text-4xl font-bold text-custom-green mb-1">
              {plan.price}
            </div>
            <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">{plan.period}</p>
            <ul className="text-xs md:text-sm text-gray-700 space-y-2 mb-4 md:mb-6 text-right">
              <li className="flex items-center gap-2">
                <span className="text-custom-green">&#10003;</span>
                فحص دم منزلي شامل
              </li>
              <li className="flex items-center gap-2">
                <span className="text-custom-green">&#10003;</span>
                تحليل متقدم للنتائج
              </li>
              <li className="flex items-center gap-2">
                <span className="text-custom-green">&#10003;</span>
                فيتامينات مخصصة لك
              </li>
              <li className="flex items-center gap-2">
                <span className="text-custom-green">&#10003;</span>
                استشارة مع طبيب عام
              </li>
            </ul>
            <button
              className={`w-full py-2.5 md:py-3 rounded-full font-bold text-xs md:text-sm transition-opacity hover:opacity-90 ${
                plan.highlight
                  ? "bg-custom-green text-white"
                  : "bg-white text-custom-green border-2 border-custom-green"
              }`}
            >
              اشترك الآن
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingPlans;

import React from "react";
import Link from "next/link";

const plans = [
  {
    name: "شهري",
    price: "٢٨٩",
    period: "ريال / شهرياً",
    badge: null,
    highlight: false,
  },
  {
    name: "كل ٣ أشهر",
    price: "٧٧٩",
    period: "ريال / كل ٣ أشهر",
    badge: "وفّر ١٠٪",
    highlight: true,
  },
];

const PricingPlans: React.FC = () => {
  return (
    <section className="py-8 md:py-10 md:px-4 md:max-w-4xl md:mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-black text-center mb-6 md:mb-8 px-4">
        اختر باقتك
      </h2>

      {/* Mobile: horizontal scroll */}
      <div className="flex md:hidden gap-3 overflow-x-auto snap-x snap-mandatory px-4 pt-4 pb-4 scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative flex-shrink-0 w-[75vw] snap-center rounded-2xl p-5 shadow-md border-2 ${
              plan.highlight
                ? "border-custom-green bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 right-4 bg-custom-green text-white text-xs font-bold px-3 py-1 rounded-full">
                {plan.badge}
              </span>
            )}
            <h3 className="text-base font-semibold text-black mt-1 mb-3">
              {plan.name}
            </h3>
            <div className="text-3xl font-bold text-custom-green mb-1">
              {plan.price}
            </div>
            <p className="text-xs text-gray-500 mb-4">{plan.period}</p>
            <ul className="text-xs text-gray-700 space-y-2 mb-5 text-right">
              <li className="flex items-center gap-2">
                <span className="text-custom-green">&#10003;</span>
                فحص دم من مختبر معتمد بأعلى معايير الجودة
              </li>
              <li className="flex items-center gap-2">
                <span className="text-custom-green">&#10003;</span>
                طبيب يحلل نتائجك
              </li>
              <li className="flex items-center gap-2">
                <span className="text-custom-green">&#10003;</span>
                فيتامينات مخصصة لك توصلك لبيتك
              </li>
              <li className="flex items-center gap-2">
                <span className="text-custom-green">&#10003;</span>
                استشر الطبيب في أي وقت
              </li>
            </ul>
            <Link
              href="/vitaminsPackages/subscribe"
              className={`block w-full py-2.5 rounded-full font-bold text-xs text-center transition-opacity hover:opacity-90 ${
                plan.highlight
                  ? "bg-custom-green text-white"
                  : "bg-white text-custom-green border-2 border-custom-green"
              }`}
            >
              اشترك الآن
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl p-6 text-center shadow-md border-2 ${
              plan.highlight
                ? "border-custom-green bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-custom-green text-white text-xs font-bold px-4 py-1 rounded-full">
                {plan.badge}
              </span>
            )}
            <h3 className="text-lg font-semibold text-black mt-2 mb-4">
              {plan.name}
            </h3>
            <div className="text-4xl font-bold text-custom-green mb-1">
              {plan.price}
            </div>
            <p className="text-sm text-gray-500 mb-6">{plan.period}</p>
            <ul className="text-sm text-gray-700 space-y-2 mb-6 text-right">
              <li className="flex items-center gap-2">
                <span className="text-custom-green">&#10003;</span>
                فحص دم من مختبر معتمد بأعلى معايير الجودة
              </li>
              <li className="flex items-center gap-2">
                <span className="text-custom-green">&#10003;</span>
                طبيب يحلل نتائجك
              </li>
              <li className="flex items-center gap-2">
                <span className="text-custom-green">&#10003;</span>
                فيتامينات مخصصة لك توصلك لبيتك
              </li>
              <li className="flex items-center gap-2">
                <span className="text-custom-green">&#10003;</span>
                استشر الطبيب في أي وقت
              </li>
            </ul>
            <Link
              href="/vitaminsPackages/subscribe"
              className={`block w-full py-3 rounded-full font-bold text-sm text-center transition-opacity hover:opacity-90 ${
                plan.highlight
                  ? "bg-custom-green text-white"
                  : "bg-white text-custom-green border-2 border-custom-green"
              }`}
            >
              اشترك الآن
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingPlans;

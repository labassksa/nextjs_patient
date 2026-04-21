import React from "react";
import Image from "next/image";

const features = [
  {
    title: "طبيب يتابع حالتك",
    description:
      "طبيب مرخّص يقرأ نتائج تحاليلك ويفسّرها لك ويحدد الفيتامينات اللي تحتاجها بالضبط.",
    icon: "/icons/widgets/icon-doctor.svg",
  },
  {
    title: "فحص دم شامل في المنزل",
    description:
      "يزورك ممرض لأخذ عينة الدم والتأكد أن الفيتامينات فعالة — بدون ما تطلع من بيتك.",
    icon: "/icons/widgets/icon-lab.svg",
  },
  {
    title: "فيتامينات مخصصة لك",
    description:
      "مكملات غذائية يختارها الطبيب بناءً على نتائج تحاليلك الشخصية.",
    icon: "/icons/widgets/icon-anxiety.svg",
  },
  {
    title: "استشارة طبية في أي وقت",
    description:
      "تقدر تتواصل مع طبيبك وتستشيره عن صحتك أو فيتاميناتك متى ما احتجت.",
    icon: "/icons/widgets/icon-sex.svg",
  },
];

const WhatsIncluded: React.FC = () => {
  return (
    <section className="py-8 md:py-10 px-4 bg-gradient-to-l from-custom-green to-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-black text-center mb-6 md:mb-8">
          ماذا يشمل الاشتراك؟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 flex items-center gap-3 md:gap-4"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                {feature.icon && (
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-semibold text-black mb-1 md:mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatsIncluded;

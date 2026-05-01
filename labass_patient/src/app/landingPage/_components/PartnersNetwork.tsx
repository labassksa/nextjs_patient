import React from "react";

const partners = [
  {
    count: "+١٠٠٠",
    title: "صيدلية",
    subtitle: "صرف إلكتروني فوري",
  },
  {
    count: "+٥٠",
    title: "مختبر طبي",
    subtitle: "تحاليل وفحوصات",
  },
  {
    count: "+٥٠",
    title: "مدرسة",
    subtitle: "رعاية صحية عن بُعد",
  },
];

const PartnersNetwork: React.FC = () => {
  return (
    <section className="py-16 px-5">
      <div className="max-w-lg mx-auto">
        <p className="text-xs font-bold text-custom-green text-center mb-2 tracking-wider">
          شركاؤنا
        </p>
        <h2 className="text-2xl font-black text-black text-center mb-10">
          شبكة واسعة تخدمك أينما كنت
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl border border-gray-100 p-5 text-center hover:border-custom-green/30 hover:shadow-lg hover:shadow-custom-green/5 hover:-translate-y-1 transition-all duration-300 aspect-square flex flex-col items-center justify-center"
            >
              <div className="text-2xl font-black text-custom-green mb-2 group-hover:scale-110 transition-transform duration-300">
                {partner.count}
              </div>
              <h3 className="text-sm font-bold text-black mb-1">
                {partner.title}
              </h3>
              <p className="text-[10px] text-gray-400 leading-tight">
                {partner.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersNetwork;

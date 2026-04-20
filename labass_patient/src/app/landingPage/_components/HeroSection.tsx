import React from "react";

const stats = [
  { number: "+١٠٠٠", label: "صيدلية" },
  { number: "+٥٠", label: "مختبر طبي" },
  { number: "+٥٠", label: "مدرسة" },
];

const HeroSection: React.FC = () => {
  return (
    <section className="relative mt-24 pt-20 pb-16 px-6 text-center bg-white">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-custom-green/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="animate-fade-in-up">
          <span className="inline-block bg-custom-green/10 text-custom-green text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide">
            مرخّصة من وزارة الصحة
          </span>
        </div>

        <h1 className="animate-fade-in-up delay-100 text-4xl font-black text-black mb-3 leading-[1.3]">
          طبيبك على بُعد
          <br />
          <span className="text-custom-green">نقرة واحدة</span>
        </h1>

        <p className="animate-fade-in-up delay-200 text-base text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
          استشارة طبية فورية مع أطباء مرخّصين — وصفات معتمدة، قراءة تحاليل،
          وصرف أدوية من منزلك
        </p>

        <div className="animate-scale-in delay-300">
          <button className="bg-custom-green text-white font-bold py-4 px-14 rounded-full text-base shadow-lg shadow-custom-green/30 hover:shadow-xl hover:shadow-custom-green/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
            ابدأ استشارتك الآن
          </button>
        </div>

        <div className="mt-14 max-w-sm mx-auto grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`animate-count-up delay-${(index + 4) * 100}`}
            >
              <div className="text-3xl font-black text-custom-green">
                {stat.number}
              </div>
              <div className="text-xs text-gray-400 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

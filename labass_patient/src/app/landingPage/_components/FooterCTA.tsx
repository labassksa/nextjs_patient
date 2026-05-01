import React from "react";

const FooterCTA: React.FC = () => {
  return (
    <section className="relative py-16 px-6 text-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-custom-green" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />

      <div className="relative z-10">
        <h2 className="text-3xl font-black text-white mb-3 leading-tight">
          صحتك لا تنتظر
        </h2>
        <p className="text-sm text-white/80 mb-10 max-w-xs mx-auto">
          ابدأ استشارتك الطبية الآن مع أطباء مرخّصين على مدار الساعة
        </p>

        <button className="bg-white text-custom-green font-bold py-4 px-14 rounded-full text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
          ابدأ الآن
        </button>

        <div className="mt-12 pt-8 border-t border-white/15">
          <p className="text-[11px] text-white/50">
            شركة معالم التطوير — مرخصة من وزارة الصحة برقم ١٤٠٠٠٥٥٩٣٨
          </p>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;

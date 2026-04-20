import React from "react";

const FooterCTA: React.FC = () => {
  return (
    <section className="bg-custom-green py-8 md:py-12 px-5 md:px-6 text-center text-white">
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
        وش تنتظر، ابدأ رحلة صحتك اليوم
      </h2>
      <p className="text-xs md:text-sm mb-6 md:mb-8 opacity-90">
        فحص دم شامل في منزلك، تحليل متقدم، ومكملات غذائية مصممة خصيصاً لك كل
        شهر
      </p>
      <button className="bg-white text-custom-green font-bold py-3 px-8 md:px-10 rounded-full text-base md:text-lg shadow-lg hover:opacity-90 transition-opacity mb-6 md:mb-8">
        اشترك الآن
      </button>
      <div className="flex items-center justify-center gap-4 md:gap-6 text-xs md:text-sm opacity-80">
        <a href="mailto:hello@jdar.sa" className="underline">
          hello@jdar.sa
        </a>
        <a
          href="https://wa.me/966115001303"
          className="underline"
          dir="ltr"
        >
          +966 11 500 1303
        </a>
      </div>
    </section>
  );
};

export default FooterCTA;

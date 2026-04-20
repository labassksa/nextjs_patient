import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-l from-custom-green to-white min-h-[60vh] md:min-h-[80vh] flex items-center">
      <div className="w-full max-w-5xl mx-auto px-5 md:px-16 py-10 md:py-24 flex flex-col justify-center">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black mb-3 md:mb-5 leading-tight">
          صحتك بيدك… وبياناتك هي الدليل
        </h1>
        <h2 className="text-base sm:text-lg md:text-2xl text-gray-800 mb-4 md:mb-6 leading-relaxed">
          فحص دم منزلي + فيتامينات مخصصة
        </h2>
        <p className="text-sm md:text-lg text-gray-600 mb-6 md:mb-10 leading-relaxed max-w-lg">
          طبيب يقرأ تحاليلك ويختار لك الفيتامينات المناسبة.
          <br />
          فحص دم في منزلك، مكملات مخصصة، واستشر الطبيب في أي وقت
        </p>
        <button className="bg-custom-green text-white font-bold py-3 px-8 md:py-4 md:px-12 rounded-full text-base md:text-lg shadow-lg hover:opacity-90 transition-opacity w-fit">
          اشترك الآن
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

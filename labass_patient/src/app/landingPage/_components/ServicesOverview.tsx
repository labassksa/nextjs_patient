import React from "react";

const services = [
  {
    title: "استشارة فورية",
    description: "تواصل مع طبيب مرخّص في أقل من دقيقة عبر المحادثة أو الفيديو",
    icon: "🩺",
  },
  {
    title: "وصفات معتمدة",
    description: "وصفة طبية إلكترونية تشمل المضادات الحيوية تُصرف فوراً",
    icon: "💊",
  },
  {
    title: "قراءة تحاليل",
    description: "ارفع نتائجك واحصل على تفسير طبي متخصص وتوصيات فورية",
    icon: "🔬",
  },
  {
    title: "إعادة صرف أدوية",
    description: "جدّد وصفتك الطبية بسهولة دون زيارة العيادة أو الانتظار",
    icon: "📋",
  },
];

const ServicesOverview: React.FC = () => {
  return (
    <section className="py-16 px-5">
      <div className="max-w-lg mx-auto">
        <p className="text-xs font-bold text-custom-green text-center mb-2 tracking-wider">
          خدماتنا
        </p>
        <h2 className="text-2xl font-black text-black text-center mb-3">
          كل ما تحتاجه في مكان واحد
        </h2>
        <p className="text-sm text-gray-400 text-center mb-10">
          خدمات طبية متكاملة بين يديك
        </p>

        <div className="space-y-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="group flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 hover:border-custom-green/30 hover:shadow-md hover:shadow-custom-green/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-custom-green/10 flex items-center justify-center text-xl transition-colors duration-300 flex-shrink-0">
                {service.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-black mb-0.5">
                  {service.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;

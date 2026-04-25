"use client";

import React, { useState } from "react";

const faqs = [
  {
    question: "كيف يتم أخذ عينة الدم؟",
    answer:
      "يزورك ممرض مؤهل ومرخص في منزلك في الموعد المحدد لأخذ عينة الدم بطريقة آمنة ومريحة باستخدام أدوات معقمة.",
  },
  {
    question: "متى أحصل على نتائج التحليل؟",
    answer:
      "تصلك نتائج التحليل خلال ٤٨ ساعة من أخذ العينة، مع توصيات مخصصة لحالتك الصحية.",
  },
  {
    question: "هل الفيتامينات والمعادن آمنة؟",
    answer:
      "نعم، جميع المكملات الغذائية من فيتامينات وأملاح ومعادن مرخصة من هيئة الغذاء والدواء ومصممة خصيصاً بناءً على نتائج تحاليلك الشخصية.",
  },
  {
    question: "هل يمكنني إلغاء الاشتراك في أي وقت؟",
    answer:
      "نعم، يمكنك إلغاء اشتراكك في أي وقت بدون أي رسوم إضافية أو غرامات.",
  },
  {
    question: "ما هي المناطق المتاحة للخدمة؟",
    answer:
      "الخدمة متاحة حالياً في جميع المدن الرئيسية في المملكة العربية السعودية ونعمل على التوسع لتغطية المزيد من المناطق.",
  },
  {
    question: "كم عدد التحاليل المشمولة في الفحص؟",
    answer:
      "يشمل الفحص أكثر من ٣٠ مؤشراً حيوياً تتضمن الفيتامينات والأملاح والمعادن ووظائف الأعضاء والهرمونات والدهون وغيرها.",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-8 md:py-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-black text-center mb-6 md:mb-8">
        الأسئلة الشائعة
      </h2>
      <div className="space-y-2 md:space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="w-full flex items-center justify-between p-3 md:p-4 text-right"
            >
              <span className="font-semibold text-black text-xs md:text-sm">
                {faq.question}
              </span>
              <span
                className={`text-custom-green text-lg md:text-xl transition-transform flex-shrink-0 mr-2 ${
                  openIndex === index ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            {openIndex === index && (
              <div className="px-3 pb-3 md:px-4 md:pb-4">
                <p className="text-gray-600 text-xs md:text-sm">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;

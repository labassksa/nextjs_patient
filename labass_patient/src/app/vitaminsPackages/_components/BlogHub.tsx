import React from "react";

const articles = [
  {
    title: "نقص فيتامين D في الخليج: الأسباب والحلول",
    excerpt:
      "رغم الشمس القوية، نقص فيتامين D من أكثر المشاكل الصحية انتشاراً في السعودية. تعرّف على الأسباب وكيف تعالجها.",
    tag: "فيتامين D",
  },
  {
    title: "الحديد ومستويات الطاقة: متى تحتاج مكمل؟",
    excerpt:
      "التعب المستمر ممكن يكون بسبب نقص الحديد. تعرّف على الأعراض ومتى تحتاج تفحص مستوياتك.",
    tag: "الحديد",
  },
  {
    title: "كيف تقرأ نتائج تحليل الدم؟",
    excerpt:
      "دليل مبسّط يساعدك تفهم أرقام تحاليلك وتعرف إذا مستوياتك طبيعية أو تحتاج متابعة.",
    tag: "تحاليل",
  },
];

const BlogHub: React.FC = () => {
  return (
    <section className="py-8 md:py-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-black text-center mb-2 md:mb-3">
        المدوّنة
      </h2>
      <p className="text-gray-500 text-xs md:text-sm text-center mb-6 md:mb-8">
        محتوى صحي موثوق باللغة العربية
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col"
          >
            <span className="inline-block self-start bg-green-50 text-custom-green text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
              {article.tag}
            </span>
            <h3 className="text-sm md:text-base font-semibold text-black mb-2">
              {article.title}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 flex-1">
              {article.excerpt}
            </p>
            <span className="text-custom-green text-xs font-semibold cursor-pointer hover:underline">
              اقرأ المزيد ←
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogHub;

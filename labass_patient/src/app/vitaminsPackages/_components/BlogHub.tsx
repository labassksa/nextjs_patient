import React from "react";
import Link from "next/link";

const articles = [
  {
    slug: "vitamin-d-gulf",
    title: "فيتامين D في الخليج: لماذا ٨٠٪ يعانون من نقصه؟",
    excerpt:
      "رغم الشمس القوية، نقص فيتامين D من أكثر المشاكل الصحية انتشاراً في السعودية. تعرّف على الأسباب وكيف تعالجها.",
    tag: "فيتامينات",
  },
  {
    slug: "iron-women-ferritin",
    title: "الحديد والنساء: دليلك لفهم نتائج الفيرّتين",
    excerpt:
      "التعب المستمر ممكن يكون بسبب نقص الحديد. تعرّف على الأعراض ومتى تحتاج تفحص مستوياتك.",
    tag: "صحة المرأة",
  },
  {
    slug: "read-blood-tests",
    title: "كيف تقرأ نتائج تحاليل دمك بنفسك؟",
    excerpt:
      "دليل مبسّط يساعدك تفهم أرقام تحاليلك وتعرف إذا مستوياتك طبيعية أو تحتاج متابعة.",
    tag: "تحاليل دم",
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
          <Link
            key={index}
            href={`/vitaminsPackages/blog/${article.slug}`}
            className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col no-underline"
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
            <span className="text-custom-green text-xs font-semibold">
              اقرأ المزيد ←
            </span>
          </Link>
        ))}
      </div>
      <div className="text-center mt-6">
        <Link
          href="/vitaminsPackages/blog"
          className="inline-block bg-white text-custom-green font-bold py-2.5 px-6 rounded-full text-sm border-2 border-custom-green hover:opacity-90 transition-opacity no-underline"
        >
          جميع المقالات
        </Link>
      </div>
    </section>
  );
};

export default BlogHub;

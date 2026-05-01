"use client";

import React, { useState } from "react";

type ContentBlock = {
  type: "lead" | "heading" | "paragraph" | "callout";
  text: string;
};

const articles: {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  author: string;
  readTime: string;
  refs: string;
  refsCount: string;
  content: ContentBlock[];
}[] = [
  {
    slug: "vitamin-d-gulf",
    title: "فيتامين D في الخليج: لماذا ٨٠٪ يعانون من نقصه؟",
    excerpt:
      "رغم الشمس القوية، نقص فيتامين D من أكثر المشاكل الصحية انتشاراً في السعودية. تعرّف على الأسباب وكيف تعالجها.",
    tag: "فيتامينات",
    author: "فريق لاباس · القسم الطبّي",
    readTime: "٨ دقائق قراءة",
    refs: "مراجع من: Saudi Medical Journal, J Bone Mineral Research",
    refsCount: "٤",
    content: [
      { type: "lead", text: "رغم أن المملكة العربية السعودية من أكثر الدول المشمسة في العالم، إلا أن نقص فيتامين D يصيب ما بين ٦٠٪ إلى ٨٠٪ من السكان. المفارقة التي تستحق الفهم." },
      { type: "heading", text: "لماذا ينتشر نقص فيتامين D رغم الشمس؟" },
      { type: "paragraph", text: "الحرارة العالية تجعل معظم الناس يتجنبون التعرّض المباشر للشمس. البقاء في أماكن مغلقة ومكيّفة معظم اليوم يقلل بشكل كبير من إنتاج الجسم لفيتامين D عبر الجلد." },
      { type: "paragraph", text: "بالإضافة إلى ذلك، استخدام واقي الشمس، ونمط الحياة المكتبي، وقلة الأطعمة الغنية بفيتامين D في النظام الغذائي اليومي — كلها عوامل تساهم في انتشار النقص." },
      { type: "heading", text: "ما هي أعراض نقص فيتامين D؟" },
      { type: "paragraph", text: "الإرهاق المستمر، آلام العظام والعضلات، تساقط الشعر، ضعف المناعة والإصابة المتكررة بالعدوى، وتقلّبات المزاج — كلها علامات شائعة لنقص فيتامين D." },
      { type: "callout", text: "المستوى الطبيعي لفيتامين D في الدم هو ٣٠-١٠٠ ng/mL. أقل من ٢٠ يُعتبر نقصاً يحتاج علاجاً. فحص الدم هو الطريقة الوحيدة للتأكد." },
      { type: "heading", text: "كيف تعالج نقص فيتامين D؟" },
      { type: "paragraph", text: "المكملات الغذائية هي الحل الأكثر فعالية، خاصة فيتامين D3 (كوليكالسيفيرول). الجرعة تعتمد على مستوى النقص — لذلك فحص الدم أولاً ضروري لتحديد الجرعة المناسبة." },
      { type: "paragraph", text: "في لاباس، يقرأ الطبيب نتائج تحاليلك ويحدد الجرعة الدقيقة التي تحتاجها، مع متابعة دورية للتأكد من تحسّن المستويات." },
    ],
  },
  {
    slug: "iron-women-ferritin",
    title: "الحديد والنساء: دليلك لفهم نتائج الفيرّتين",
    excerpt:
      "التعب المستمر ممكن يكون بسبب نقص الحديد. تعرّف على الأعراض ومتى تحتاج تفحص مستوياتك.",
    tag: "صحة المرأة",
    author: "فريق لاباس · القسم الطبّي",
    readTime: "٧ دقائق قراءة",
    refs: "مراجع من: WHO, The Lancet Haematology",
    refsCount: "٣",
    content: [
      { type: "lead", text: "نقص الحديد هو أكثر نقص غذائي انتشاراً عند النساء عالمياً. الفيرّتين هو المؤشر الأهم لمخزون الحديد في جسمك." },
      { type: "heading", text: "لماذا النساء أكثر عرضة لنقص الحديد؟" },
      { type: "paragraph", text: "الدورة الشهرية هي السبب الأول — فقدان الدم الشهري يستنزف مخزون الحديد تدريجياً. الحمل والرضاعة يزيدان الحاجة للحديد بشكل كبير. كما أن أنماط الأكل التي تفتقر للحوم الحمراء تقلل امتصاص الحديد." },
      { type: "heading", text: "أعراض نقص الحديد" },
      { type: "paragraph", text: "التعب المستمر والإرهاق حتى مع النوم الكافي، شحوب البشرة، تساقط الشعر، هشاشة الأظافر، صعوبة التركيز، والدوخة — كلها علامات تستحق الفحص." },
      { type: "callout", text: "مستوى الفيرّتين الطبيعي للنساء: ٢٠-٢٠٠ ng/mL. أقل من ١٥ يعني نقص حديد واضح. بين ١٥-٣٠ يعني مخزون منخفض يحتاج متابعة." },
      { type: "heading", text: "كيف ترفعين مستوى الحديد؟" },
      { type: "paragraph", text: "مكملات الحديد مع فيتامين C (لتعزيز الامتصاص) هي الخطوة الأولى. تجنّبي شرب الشاي والقهوة مع الوجبات لأنها تقلل امتصاص الحديد. الأطعمة الغنية بالحديد: اللحوم الحمراء، السبانخ، العدس، والتمر." },
    ],
  },
  {
    slug: "read-blood-tests",
    title: "كيف تقرأ نتائج تحاليل دمك بنفسك؟",
    excerpt:
      "دليل مبسّط يساعدك تفهم أرقام تحاليلك وتعرف إذا مستوياتك طبيعية أو تحتاج متابعة.",
    tag: "تحاليل دم",
    author: "فريق لاباس · القسم الطبّي",
    readTime: "٩ دقائق قراءة",
    refs: "مراجع من: Mayo Clinic, MedlinePlus",
    refsCount: "٥",
    content: [
      { type: "lead", text: "تحاليل الدم من أهم أدوات الطب الوقائي. فهم نتائجك يساعدك تتخذ قرارات صحية أفضل — حتى قبل ما تظهر أعراض." },
      { type: "heading", text: "تحليل الدم الشامل CBC" },
      { type: "paragraph", text: "يقيس مكونات الدم الأساسية: كريات الدم الحمراء (تنقل الأكسجين)، كريات الدم البيضاء (المناعة)، والصفائح الدموية (التجلط). انخفاض الهيموجلوبين قد يعني فقر دم." },
      { type: "heading", text: "الفيتامينات والمعادن" },
      { type: "paragraph", text: "فيتامين D، B12، الحديد (الفيرّتين)، المغنيسيوم، الزنك، والكالسيوم — هذه أهم المؤشرات التي تكشف نقص التغذية. نقصها يسبب أعراض يومية مثل التعب وتساقط الشعر وضعف التركيز." },
      { type: "callout", text: "النتائج \"ضمن المعدل الطبيعي\" لا تعني بالضرورة أنها مثالية. المستوى الأمثل يختلف عن الحد الأدنى الطبيعي. طبيب لاباس يساعدك تفهم الفرق." },
      { type: "heading", text: "وظائف الغدة الدرقية" },
      { type: "paragraph", text: "TSH هو المؤشر الأهم. ارتفاعه يعني خمول الغدة (أعراض: زيادة وزن، تعب، برودة). انخفاضه يعني فرط نشاط (أعراض: نقص وزن، قلق، خفقان)." },
      { type: "heading", text: "الدهون والسكر" },
      { type: "paragraph", text: "الكوليسترول الكلي، LDL (الضار)، HDL (النافع)، والدهون الثلاثية — أرقام مهمة لصحة القلب. السكر التراكمي HbA1c يكشف متوسط السكر خلال ٣ أشهر." },
    ],
  },
];

const BlogHub: React.FC = () => {
  const [openArticle, setOpenArticle] = useState<number | null>(null);

  return (
    <>
      <section className="py-8 md:py-10 max-w-4xl mx-auto">
        <div className="px-4">
          <h2 className="text-xl md:text-2xl font-bold text-black text-center mb-2 md:mb-3">
            المدوّنة
          </h2>
          <p className="text-gray-500 text-xs md:text-sm text-center mb-6 md:mb-8">
            محتوى صحي موثوق باللغة العربية
          </p>
        </div>
        <div
          className="flex md:grid md:grid-cols-3 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory px-4 pb-2 md:pb-0"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {articles.map((article, index) => (
            <button
              key={index}
              onClick={() => setOpenArticle(index)}
              className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col text-right flex-shrink-0 w-[72%] md:w-auto snap-start"
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
            </button>
          ))}
        </div>
        <style>{`
          section > div:nth-child(2)::-webkit-scrollbar { display: none; }
        `}</style>
      </section>

      {/* ─── ARTICLE READER OVERLAY ─── */}
      {openArticle !== null && (
        <div
          onClick={() => setOpenArticle(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            overflowY: "auto",
            padding: "40px 16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              maxWidth: 680,
              width: "100%",
              padding: "36px 28px",
              position: "relative",
              animation: "fadeIn .25s ease",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setOpenArticle(null)}
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                background: "#f3f4f6",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                fontSize: 22,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#374151",
              }}
            >
              &times;
            </button>

            {/* Category badge */}
            <span
              style={{
                display: "inline-block",
                background: "#f0fdf4",
                color: "#16a34a",
                fontSize: 12,
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: 99,
                marginBottom: 12,
              }}
            >
              {articles[openArticle].tag}
            </span>

            {/* Title */}
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.5,
                marginBottom: 12,
              }}
            >
              {articles[openArticle].title}
            </h2>

            {/* Meta */}
            <div
              style={{
                fontSize: 12,
                color: "#9ca3af",
                marginBottom: 24,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span>{articles[openArticle].author}</span>
              <span>·</span>
              <span>{articles[openArticle].readTime}</span>
            </div>

            {/* Body */}
            <div>
              {articles[openArticle].content.map((block, i) => {
                switch (block.type) {
                  case "lead":
                    return (
                      <p
                        key={i}
                        style={{
                          fontSize: 15,
                          color: "#374151",
                          lineHeight: 1.8,
                          fontWeight: 500,
                          marginBottom: 20,
                          borderRight: "3px solid #22c55e",
                          paddingRight: 14,
                        }}
                      >
                        {block.text}
                      </p>
                    );
                  case "heading":
                    return (
                      <h3
                        key={i}
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          color: "#111",
                          marginTop: 24,
                          marginBottom: 10,
                        }}
                      >
                        {block.text}
                      </h3>
                    );
                  case "paragraph":
                    return (
                      <p
                        key={i}
                        style={{
                          fontSize: 14,
                          color: "#4b5563",
                          lineHeight: 1.85,
                          marginBottom: 14,
                        }}
                      >
                        {block.text}
                      </p>
                    );
                  case "callout":
                    return (
                      <div
                        key={i}
                        style={{
                          background: "#f0fdf4",
                          borderRight: "3px solid #22c55e",
                          padding: "14px 18px",
                          borderRadius: 10,
                          fontSize: 13,
                          color: "#15803d",
                          lineHeight: 1.8,
                          margin: "18px 0",
                          fontWeight: 500,
                        }}
                      >
                        {block.text}
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>

            {/* References */}
            <div
              style={{
                marginTop: 28,
                padding: "12px 16px",
                background: "#f9fafb",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              <div
                style={{
                  background: "#e5e7eb",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 11,
                  flexShrink: 0,
                }}
              >
                {articles[openArticle].refsCount}
              </div>
              <div>{articles[openArticle].refs}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogHub;

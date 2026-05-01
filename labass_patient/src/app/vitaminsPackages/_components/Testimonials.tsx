import React from "react";
import s from "./Testimonials.module.css";


const testimonials = [
  {
    initials: "ن.ش",
    name: "نورة الشهري",
    meta: "٢٨ سنة · الرياض",
    avClass: s.av1,
    biomarker: "الفيرّتين (مخزون الحديد)",
    before: 12,
    after: 58,
    unit: "ng/mL",
    spark: {
      area: "M 0 38 L 60 32 L 120 18 L 180 4 L 180 44 L 0 44 Z",
      line: "M 0 38 L 60 32 L 120 18 L 180 4",
      points: [
        { cx: 0, cy: 38 },
        { cx: 60, cy: 32 },
        { cx: 120, cy: 18 },
        { cx: 180, cy: 4 },
      ],
    },
    quote: "التعب الصباحي اللي كنت أعاني منه لسنوات اختفى تقريباً. شعري بدأ يرجع لطبيعته.",
  },
  {
    initials: "ر.م",
    name: "ريم المطيري",
    meta: "٣٢ سنة · الرياض",
    avClass: s.av2,
    biomarker: "فيتامين D",
    before: 14,
    after: 42,
    unit: "ng/mL",
    spark: {
      area: "M 0 36 L 60 28 L 120 18 L 180 8 L 180 44 L 0 44 Z",
      line: "M 0 36 L 60 28 L 120 18 L 180 8",
      points: [
        { cx: 0, cy: 36 },
        { cx: 60, cy: 28 },
        { cx: 120, cy: 18 },
        { cx: 180, cy: 8 },
      ],
    },
    quote: "كنت أعاني من إرهاق مستمر وبشرتي باهتة. بعد ٣ أشهر من المكملات الفرق واضح جداً.",
  },
  {
    initials: "ل.ع",
    name: "لمياء العنزي",
    meta: "٣٨ سنة · الرياض",
    avClass: s.av3,
    biomarker: "فيتامين B12",
    before: 180,
    after: 620,
    unit: "pg/mL",
    spark: {
      area: "M 0 34 L 60 30 L 120 14 L 180 6 L 180 44 L 0 44 Z",
      line: "M 0 34 L 60 30 L 120 14 L 180 6",
      points: [
        { cx: 0, cy: 34 },
        { cx: 60, cy: 30 },
        { cx: 120, cy: 14 },
        { cx: 180, cy: 6 },
      ],
    },
    quote: "تركيزي تحسّن بشكل ملحوظ ونومي صار أعمق. الطبيب كان متابع معاي طوال الفترة.",
  },
];

const stats = [
  { num: "٢٬٤٠٠", sup: "+", label: "مشتركة فعّالة في المملكة" },
  { num: "٨٧", sup: "%", label: "تحسّنت مؤشّراتهن خلال ٩٠ يوم" },
];

const Testimonials: React.FC = () => {
  return (
    <section className={s.wrap}>
      <div className={s.head}>
        <div className={s.eyebrow}>
          <div className={s.dot} />
          قصص حقيقية، أرقام حقيقية
        </div>
        <h2 className={s.title}>
          نتائج موثّقة،
          <br />
          بياناتك هي الدليل
        </h2>
        <p className={s.sub}>
          تغيّرت نتائج تحاليل مشتركاتنا خلال ٩٠ يوماً من الفيتامينات والمعادن المخصّصة
          التي يختارها الطبيب بناءً على أرقامهن الشخصية.
        </p>
      </div>

      <div className={s.grid}>
        {testimonials.map((t, i) => (
          <div key={i} className={s.card}>
            <div className={s.headRow}>
              <div className={`${s.av} ${t.avClass}`}>{t.initials}</div>
              <div>
                <div className={s.name}>{t.name}</div>
                <div className={s.meta}>{t.meta}</div>
              </div>
              <div className={s.verified}>موثّق</div>
            </div>

            <div className={s.bio}>
              <span className={s.bioSpan}>{t.biomarker}</span>
            </div>

            <div className={s.nums}>
              <div className={s.col}>
                <div className={s.lbl}>قبل</div>
                <div className={s.num}>{t.before}</div>
              </div>
              <div className={s.arr}>→</div>
              <div className={s.col}>
                <div className={s.lbl}>بعد ٩٠ يوم</div>
                <div className={`${s.num} ${s.numUp}`}>{t.after}</div>
              </div>
              <div className={s.unit}>{t.unit}</div>
            </div>

            <svg
              className={s.spark}
              viewBox="0 0 180 44"
              preserveAspectRatio="none"
            >
              <path
                className={s.sparkArea}
                d={t.spark.area}
                fill="#C0DD97"
                opacity="0.35"
              />
              <path
                className={s.sparkLine}
                d={t.spark.line}
                stroke="#3B6D11"
              />
              {t.spark.points.map((p, j) => (
                <circle
                  key={j}
                  className={`${s.sparkCircle} ${
                    j === 0
                      ? s.p1
                      : j === 1
                      ? s.p2
                      : j === 2
                      ? s.p3
                      : s.p4
                  }`}
                  cx={p.cx}
                  cy={p.cy}
                  r={j === 3 ? 3.5 : 2.5}
                  fill="#3B6D11"
                  stroke={j === 3 ? "#ffffff" : undefined}
                  strokeWidth={j === 3 ? 1.5 : undefined}
                />
              ))}
            </svg>

            <p className={s.quote}>&ldquo;{t.quote}</p>
          </div>
        ))}
      </div>

      <div className={s.stats}>
        {stats.map((st, i) => (
          <div key={i} className={s.stat}>
            <div className={s.statNum}>
              {st.num}
              <sup className={s.statSup}>{st.sup}</sup>
            </div>
            <div className={s.statLbl}>{st.label}</div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Testimonials;

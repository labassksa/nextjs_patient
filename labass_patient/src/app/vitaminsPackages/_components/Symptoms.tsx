import React from "react";
import Image from "next/image";

const symptoms = [
  {
    icon: "/icons/widgets/icon-sleep.svg",
    title: "مشاكل النوم",
    description: "أرق، نوم متقطّع، أو تعب حتى بعد نوم كافي",
    vitamins: "نقص: فيتامين D، المغنيسيوم، B12",
    color: "#27500A",
    bg: "#E8F5E0",
  },
  {
    icon: "/icons/widgets/icon-hair.svg",
    title: "تساقط الشعر",
    description: "شعر خفيف، تساقط ملحوظ، أو بطء نمو الشعر",
    vitamins: "نقص: الحديد، الزنك، البيوتين، فيتامين D",
    color: "#27500A",
    bg: "#E8F5E0",
  },
  {
    icon: "/icons/widgets/icon-skin.svg",
    title: "بشرة باهتة وجافة",
    description: "جفاف البشرة، شحوب الوجه، أو ظهور حبوب",
    vitamins: "نقص: فيتامين C، E، الزنك، أوميغا ٣",
    color: "#27500A",
    bg: "#E8F5E0",
  },
  {
    icon: "/icons/widgets/icon-focus.svg",
    title: "ضعف التركيز",
    description: "صعوبة التركيز، نسيان متكرر، أو ضبابية ذهنية",
    vitamins: "نقص: B12، الحديد، أوميغا ٣، المغنيسيوم",
    color: "#27500A",
    bg: "#E8F5E0",
  },
  {
    icon: "/icons/widgets/icon-fatigue.svg",
    title: "إرهاق مستمر",
    description: "تعب طوال اليوم وانخفاض الطاقة بدون سبب واضح",
    vitamins: "نقص: الحديد (الفيرّتين)، B12، فيتامين D",
    color: "#27500A",
    bg: "#E8F5E0",
  },
  {
    icon: "/icons/widgets/icon-bones.svg",
    title: "آلام العظام والعضلات",
    description: "ألم في المفاصل، تشنّجات عضلية، أو ضعف عام",
    vitamins: "نقص: فيتامين D، الكالسيوم، المغنيسيوم",
    color: "#27500A",
    bg: "#E8F5E0",
  },
];

const Symptoms: React.FC = () => {
  return (
    <section
      style={{
        padding: "48px 0",
        background: "#f8faf5",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto", paddingInline: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(23,52,4,0.06)",
              border: "0.5px solid rgba(23,52,4,0.12)",
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 500,
              color: "#27500A",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#3B6D11",
              }}
            />
            هل تعاني من هذه الأعراض؟
          </div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#0d2002",
              lineHeight: 1.3,
              margin: "0 0 10px",
            }}
          >
            علامات نقص الفيتامينات والمعادن
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#4b5563",
              lineHeight: 1.7,
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            أعراض يومية كثيرة سببها نقص بسيط في الفيتامينات أو المعادن — فحص دم واحد يكشف السبب
          </p>
        </div>
      </div>

      {/* Horizontal scrollable cards */}
      <div
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          paddingInline: 20,
          paddingBottom: 8,
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {symptoms.map((s, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "24px 20px",
              border: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 14,
              minWidth: "calc(66.6% - 8px)",
              maxWidth: "calc(66.6% - 8px)",
              flexShrink: 0,
              scrollSnapAlign: "start",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                flexShrink: 0,
                position: "relative",
              }}
            >
              <Image
                src={s.icon}
                alt={s.title}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#111",
                  margin: "0 0 6px",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  lineHeight: 1.7,
                  margin: "0 0 12px",
                }}
              >
                {s.description}
              </p>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: s.color,
                  background: s.bg,
                  padding: "6px 12px",
                  borderRadius: 8,
                  display: "inline-block",
                }}
              >
                {s.vitamins}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hide scrollbar with inline style tag */}
      <style>{`
        section > div:nth-child(2)::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default Symptoms;

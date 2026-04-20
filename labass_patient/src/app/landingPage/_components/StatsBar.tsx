import React from "react";

const stats = [
  { number: "+١٠٠٠", label: "صيدلية" },
  { number: "+٥٠", label: "مختبر طبي" },
  { number: "+٥٠", label: "مدرسة" },
];

const StatsBar: React.FC = () => {
  return (
    <section className="py-8 px-4 bg-custom-green">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center text-white">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="text-3xl font-bold mb-1">{stat.number}</div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsBar;

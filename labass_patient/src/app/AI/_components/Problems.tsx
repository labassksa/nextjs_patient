import React from "react";

const problems = [
  {
    icon: "⏱",
    title: "Doctors Buried in Paperwork",
    desc: "Saudi clinicians spend up to 40% of their day on documentation instead of patients.",
  },
  {
    icon: "📋",
    title: "Inconsistent Patient Intake",
    desc: "Manual intake forms lead to errors, missing data, and delayed diagnoses.",
  },
  {
    icon: "🔁",
    title: "Poor Follow-up Rates",
    desc: "Without automation, follow-up falls through the cracks — hurting outcomes and revenue.",
  },
  {
    icon: "💸",
    title: "Rising Operational Costs",
    desc: "Staff overhead, manual billing errors, and inefficiency drain profitability.",
  },
];

const Problems: React.FC = () => {
  return (
    <section className="py-24 bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-[#4DA514] text-xs font-bold uppercase tracking-widest">
            The Problem
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 text-white">
            Healthcare in KSA is ready for AI.
            <br />
            <span className="text-gray-400">Most tools are not.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((p, i) => (
            <div
              key={i}
              className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-[#4DA514]/40 hover:bg-gray-900/80 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problems;

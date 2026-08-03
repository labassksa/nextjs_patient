"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

const G = "#4DA514";
const S = { stroke: G, strokeWidth: "1.7", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

const icons = [
  /* team member / person + spark */
  <svg key="0" viewBox="0 0 24 24" className="w-6 h-6" {...S}>
    <circle cx="9" cy="7" r="3" />
    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
    <path d="M17 3l1.5 3L22 7.5 19.5 9 18 12l-1.5-3L13 7.5 15.5 6 17 3z" />
  </svg>,

  /* pen writing notes */
  <svg key="1" viewBox="0 0 24 24" className="w-6 h-6" {...S}>
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>,

  /* message / chat bubble */
  <svg key="2" viewBox="0 0 24 24" className="w-6 h-6" {...S}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="2.5" />
  </svg>,

  /* clipboard / intake form */
  <svg key="3" viewBox="0 0 24 24" className="w-6 h-6" {...S}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>,

  /* bar chart / analytics */
  <svg key="4" viewBox="0 0 24 24" className="w-6 h-6" {...S}>
    <path d="M18 20V10M12 20V4M6 20v-6" />
    <path d="M2 20h20" />
  </svg>,

  /* refresh / always running */
  <svg key="5" viewBox="0 0 24 24" className="w-6 h-6" {...S}>
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>,
];

const t = {
  en: {
    badge: "Plain English",
    heading: "What does LaBas AI actually do?",
    sub: "No jargon — here's exactly what changes when you turn it on",
    summary: "The short version?",
    summaryText: "LaBas AI takes all the boring, repetitive work off your team's plate — so your doctors spend more time on patients and your business runs smoother without hiring more people",
    cards: [
      { title: "It's like having an extra team member", desc: "Imagine hiring someone who never sleeps, never forgets, and does boring tasks instantly — that's what LaBas AI does for your clinic" },
      { title: "It writes notes for your doctors", desc: "Right now your doctors spend hours writing the same notes every day — LaBas AI listens to the visit and writes everything automatically" },
      { title: "It texts your patients for you", desc: "Forgot to follow up? LaBas AI sends reminders, checks in after appointments, and makes sure no patient falls through the cracks" },
      { title: "It handles the paperwork before the visit", desc: "Patients fill out their info at home on their phone — by the time they arrive, your team already knows everything they need" },
      { title: "It shows you what's happening in your business", desc: "Like a scoreboard for your clinic — you can see how many patients came in, how long they waited, and where you're losing money" },
      { title: "It works every day without being asked", desc: "You don't turn it on or manage it — it runs in the background doing its job while your team focuses on patients" },
    ],
  },
  ar: {
    badge: "بكلام بسيط",
    heading: "ماذا يفعل لاباس AI فعلاً؟",
    sub: "بدون مصطلحات — إليك ما يتغيّر تحديداً حين تشغّله",
    summary: "باختصار شديد؟",
    summaryText: "لاباس AI يتولى كل المهام المملة والمتكررة عن فريقك — فيصبح أطباؤك قادرين على تخصيص وقت أكبر للمرضى، وعملك يسير بسلاسة دون الحاجة لتوظيف المزيد",
    cards: [
      { title: "كأنك وظّفت موظفاً لا ينام أبداً", desc: "تخيّل أنك وظّفت شخصاً لا ينام، لا ينسى، ويؤدي المهام الروتينية فوراً — هذا بالضبط ما يفعله لاباس AI لعيادتك" },
      { title: "يكتب الملاحظات لأطبائك", desc: "حالياً يقضي أطباؤك ساعات في كتابة نفس الملاحظات يومياً — لاباس AI يستمع للزيارة ويكتب كل شيء تلقائياً" },
      { title: "يراسل مرضاك نيابةً عنك", desc: "نسيت المتابعة؟ لاباس AI يرسل التذكيرات، يطمئن على المرضى بعد المواعيد، ويضمن عدم إغفال أي مريض" },
      { title: "يتولى الأوراق قبل الزيارة", desc: "يملأ المرضى معلوماتهم على هاتفهم من المنزل — حين يصلون، يكون فريقك قد اطّلع على كل شيء" },
      { title: "يُظهر لك ما يجري في عملك", desc: "كلوحة نتائج لعيادتك — ترى عدد المرضى، وقت الانتظار، وأين تتسرب الأموال" },
      { title: "يعمل كل يوم دون أن يُطلب منه", desc: "لا تشغّله أو تديره — يعمل في الخلفية ويؤدي مهامه، بينما يركز فريقك على المرضى" },
    ],
  },
};

const ELI11: React.FC = () => {
  const { lang, isAr } = useLanguage();
  const tx = t[lang];

  return (
    <section id="eli11" className="py-24 bg-gray-950">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className={`inline-block bg-[#4DA514]/10 text-[#4DA514] text-xs font-bold px-3 py-1 rounded-full mb-4 ${isAr ? "font-cairo" : ""}`}>
            {tx.badge}
          </div>
          <h2 className={`text-3xl md:text-4xl font-black text-white ${isAr ? "font-cairo" : ""}`}>
            {tx.heading}
          </h2>
          <p className={`text-gray-500 mt-3 max-w-md mx-auto text-base ${isAr ? "font-cairo" : ""}`}>
            {tx.sub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tx.cards.map((c, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-[#4DA514]/30 transition-all duration-200 group"
            >
              {/* Icon container */}
              <div className="w-11 h-11 rounded-xl bg-[#4DA514]/10 group-hover:bg-[#4DA514]/15 flex items-center justify-center mb-5 transition-colors duration-200">
                {icons[i]}
              </div>

              <h3 className={`text-white font-bold text-base mb-2 leading-snug ${isAr ? "font-cairo text-right" : ""}`}>
                {c.title}
              </h3>
              <p className={`text-gray-400 text-sm leading-relaxed ${isAr ? "font-cairo text-right" : ""}`}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <p className={`text-2xl font-black text-white mb-2 ${isAr ? "font-cairo" : ""}`}>
            {tx.summary}
          </p>
          <p className={`text-gray-400 text-base max-w-2xl mx-auto leading-relaxed ${isAr ? "font-cairo" : ""}`}>
            {tx.summaryText}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ELI11;

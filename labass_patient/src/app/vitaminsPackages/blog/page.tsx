"use client";

import React, { useState } from "react";
import Link from "next/link";
import s from "./blog.module.css";
import { articles } from "./data";

const categories = ["الكل", "فيتامينات", "صحة المرأة", "تحاليل دم", "نمط حياة"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("الكل");

  const featured = articles.find((a) => a.featured);
  const filtered =
    activeCategory === "الكل"
      ? articles.filter((a) => !a.featured)
      : articles.filter((a) => a.category === activeCategory && !a.featured);

  const getCategoryCount = (cat: string) => {
    if (cat === "الكل") return articles.length;
    return articles.filter((a) => a.category === cat).length;
  };

  return (
    <div dir="rtl" className={s.app}>
      <div className={s.nav}>
        <Link href="/vitaminsPackages" className={s.brand}>
          <div className={s.mark} />
          <div className={s.bname}>لاباس</div>
        </Link>
        <div className={s.crumbs}>
          <span className={s.activeCrumb}>المدوّنة</span>
        </div>
      </div>

      <div className={s.idxWrap}>
        <div className={s.eyebrow}>
          <div className={s.dot} />
          المدوّنة
        </div>
        <h1 className={s.idxTitle}>اعرف أكثر عن صحتك</h1>
        <p className={s.idxSub}>
          مقالات يكتبها فريق لاباس بمراجعة علمية محلية ودولية. كل مقال مستند
          إلى دراسات منشورة، بلغة واضحة وبياناتك الخليجية.
        </p>

        <div className={s.cats}>
          {categories.map((cat) => (
            <div
              key={cat}
              className={`${s.cat} ${
                activeCategory === cat ? s.catActive : s.catInactive
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              <span className={s.cnt}>
                {getCategoryCount(cat).toLocaleString("ar-SA")}
              </span>
            </div>
          ))}
        </div>

        {featured && activeCategory === "الكل" && (
          <Link
            href={`/vitaminsPackages/blog/${featured.slug}`}
            className={s.feat}
          >
            <div className={s.featImg}>
              <div className={s.badge}>مقال مميّز</div>
              <svg
                viewBox="0 0 400 220"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <radialGradient id="f-sun" cx="0.3" cy="0.35" r="0.6">
                    <stop offset="0" stopColor="#FAC775" />
                    <stop offset="0.5" stopColor="#EF9F27" />
                    <stop offset="1" stopColor="#BA7517" />
                  </radialGradient>
                  <linearGradient id="f-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#EAF3DE" />
                    <stop offset="1" stopColor="#C0DD97" />
                  </linearGradient>
                </defs>
                <rect width="400" height="220" fill="url(#f-sky)" />
                <circle cx="130" cy="80" r="55" fill="url(#f-sun)" />
                <path
                  d="M 0 200 Q 100 180 200 195 T 400 190 L 400 220 L 0 220 Z"
                  fill="#639922"
                  opacity="0.35"
                />
              </svg>
            </div>
            <div className={s.fbody}>
              <div>
                <div className={s.cpill}>{featured.category}</div>
                <h3 className={s.fttl}>{featured.title}</h3>
                <p className={s.fexc}>{featured.subtitle}</p>
              </div>
              <div className={s.fmeta}>
                <div className={s.auth}>
                  <div className={s.av}>لا</div>
                  <span className={s.authNm}>فريق لاباس</span>
                </div>
                <div className={s.mdot} />
                <span className={s.rt}>{featured.readTime}</span>
                <div className={s.mdot} />
                <span className={s.rt}>{featured.date}</span>
              </div>
            </div>
          </Link>
        )}

        <div className={s.grid}>
          {(activeCategory === "الكل"
            ? articles.filter((a) => !a.featured)
            : articles.filter((a) => a.category === activeCategory)
          ).map((article) => (
            <Link
              key={article.slug}
              href={`/vitaminsPackages/blog/${article.slug}`}
              className={s.card}
            >
              <div className={s.thumb}>
                <svg
                  viewBox="0 0 200 110"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect width="200" height="110" fill="#EAF3DE" />
                  <circle cx="100" cy="55" r="30" fill="#C0DD97" />
                </svg>
              </div>
              <div className={s.cbody}>
                <div className={s.cpill}>{article.category}</div>
                <p className={s.cttl}>{article.title}</p>
                <div className={s.rt}>⏱ {article.readTime}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className={s.nl}>
          <div>
            <p className={s.nlTtl}>وصّلك جديد المدوّنة</p>
            <p className={s.nlSub}>
              مقال طبّي كل أسبوع — بدون إزعاج، بدون إعلانات.
            </p>
          </div>
          <div className={s.nlForm}>
            <input
              className={s.nlInp}
              type="email"
              placeholder="بريدك الإلكتروني"
            />
            <button className={s.nlBtn}>اشترك</button>
          </div>
        </div>
      </div>
    </div>
  );
}

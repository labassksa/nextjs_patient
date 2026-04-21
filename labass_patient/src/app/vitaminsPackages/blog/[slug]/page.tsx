"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import s from "../blog.module.css";
import { articles } from "../data";

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div dir="rtl" className={s.app}>
        <div className={s.nav}>
          <Link href="/vitaminsPackages/blog" className={s.brand}>
            <div className={s.mark} />
            <div className={s.bname}>لاباس</div>
          </Link>
        </div>
        <div className={s.idxWrap}>
          <p>المقال غير موجود</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className={s.app}>
      <div className={s.nav}>
        <Link href="/vitaminsPackages/blog" className={s.brand}>
          <div className={s.mark} />
          <div className={s.bname}>لاباس</div>
        </Link>
        <div className={s.crumbs}>
          <Link href="/vitaminsPackages/blog">المدوّنة</Link>
          <span className={s.sep}>/</span>
          <span className={s.activeCrumb}>{article.category}</span>
        </div>
      </div>

      <div className={s.artHero}>
        <Link href="/vitaminsPackages/blog" className={s.artBack}>
          → العودة للمدوّنة
        </Link>
        <div className={s.artCpill}>{article.category}</div>
        <h1 className={s.artTtl}>{article.title}</h1>
        <p className={s.artSub}>{article.subtitle}</p>
        <div className={s.artMeta}>
          <div className={s.artAuthor}>
            <div className={s.artAv}>لا</div>
            <div>
              <div className={s.artBy}>فريق لاباس</div>
              <div className={s.artRole}>القسم الطبّي</div>
            </div>
          </div>
          <div className={s.artDot} />
          <div className={s.artDt}>{article.date}</div>
          <div className={s.artDot} />
          <div className={s.artRt}>{article.readTime}</div>
        </div>
      </div>

      <div className={s.artBody}>
        {article.content.map((block, i) => {
          switch (block.type) {
            case "lead":
              return (
                <p key={i} className={s.artLead}>
                  {block.text}
                </p>
              );
            case "paragraph":
              return (
                <p
                  key={i}
                  className={s.artP}
                  dangerouslySetInnerHTML={{ __html: block.text || "" }}
                />
              );
            case "heading":
              return (
                <h3 key={i} className={s.artH3}>
                  {block.text}
                </h3>
              );
            case "callout":
              return (
                <div key={i} className={s.artCall}>
                  <p className={s.artCallLbl}>{block.label}</p>
                  <div className={s.artCallNum}>
                    {block.num}
                    <sup className={s.artCallSup}>{block.sup}</sup>
                  </div>
                  <p className={s.artCallDesc}>{block.desc}</p>
                </div>
              );
            case "table":
              return (
                <table key={i} className={s.artTbl}>
                  <thead>
                    <tr>
                      {block.headers?.map((h, j) => (
                        <th key={j}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows?.map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => (
                          <td key={k}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            default:
              return null;
          }
        })}
      </div>

      <div className={s.artTags}>
        <span className={s.artTagsLbl}>الوسوم</span>
        {article.tags.map((tag, i) => (
          <span key={i} className={s.artTag}>
            {tag}
          </span>
        ))}
      </div>

      <div className={s.artRefs}>
        <p className={s.artRefsTtl}>المراجع العلمية</p>
        {article.references.map((ref, i) => (
          <div key={i} className={s.artRef}>
            <div className={s.artRnum}>
              {(i + 1).toLocaleString("ar-SA")}
            </div>
            <div>{ref}</div>
          </div>
        ))}
      </div>

      <div className={s.pager}>
        {article.prev ? (
          <Link
            href={`/vitaminsPackages/blog/${article.prev.slug}`}
            className={s.pnav}
          >
            <div className={s.pdir}>← السابق</div>
            <div className={s.pttl}>{article.prev.title}</div>
          </Link>
        ) : (
          <div className={`${s.pnav} ${s.pnavDisabled}`}>
            <div className={s.pdir}>← السابق</div>
            <div className={s.pttl}>—</div>
          </div>
        )}
        {article.next ? (
          <Link
            href={`/vitaminsPackages/blog/${article.next.slug}`}
            className={s.pnav}
          >
            <div className={s.pdir}>التالي →</div>
            <div className={s.pttl}>{article.next.title}</div>
          </Link>
        ) : (
          <Link href="/vitaminsPackages/blog" className={s.pnav}>
            <div className={s.pdir}>التالي →</div>
            <div className={s.pttl}>العودة لفهرس المدوّنة</div>
          </Link>
        )}
      </div>
    </div>
  );
}

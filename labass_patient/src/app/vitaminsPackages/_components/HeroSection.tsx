import React from "react";
import Link from "next/link";
import styles from "./HeroSection.module.css";

const HeroSection: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.grain} />

      <div className={styles.content}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>
            شركة مرخصة من وزارة الصحة
          </div>

          <h1 className={styles.headline}>
            صحتك بيدك<span className={styles.dim}>…</span>
            <br />
            وبياناتك هي الدليل
          </h1>

          <p className={styles.sub}>فيتامينات مخصصة لاحتياجك الشخصي</p>
          <p className={styles.desc}>
            ممرض يزورك للتحليل، طبيب يقرأ تحاليلك ويختار لك الفيتامينات المناسبة. فحص دم في
            منزلك، مكمّلات مصمَّمة لك، واستشر طبيبك في أي وقت.
          </p>

          <div className={styles.ctas}>
            <Link href="/vitaminsPackages/subscribe" className={styles.btnPrimary}>
              اشترك الآن
              <span className={styles.arrow}>←</span>
            </Link>
          </div>

          <div className={styles.trust}>
            <div className={styles.trustItem}>
              <div className={styles.check}>✓</div> طبيب مرخّص
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.ring1} />
          <div className={styles.ring2} />

          <div className={styles.pillShadow} />
          <div className={styles.pillWrap}>
            <div className={styles.pillTilt}>
              <div className={styles.pill}>
                <div className={styles.pillSpec} />
                <div className={styles.pillText}>labass</div>
              </div>
            </div>
          </div>

          <div className={`${styles.chip} ${styles.chipVit}`}>
            <div className={styles.chipDot} />
            فيتامين D — منخفض
          </div>
          <div className={`${styles.chip} ${styles.chipLab}`}>
            <div className={styles.chipDot} style={{ background: "#BA7517" }} />
            الحديد — ضمن المعدل
          </div>
          <div className={`${styles.chip} ${styles.chipDoc}`}>
            <div className={styles.chipDot} style={{ background: "#1D9E75" }} />
            د. سارة تقدم لك استشارة
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

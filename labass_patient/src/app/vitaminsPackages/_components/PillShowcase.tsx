import React from "react";
import styles from "./PillShowcase.module.css";

const PillShowcase: React.FC = () => {
  return (
    <section className="py-8 md:py-10">
      <h2 className="text-xl md:text-2xl font-bold text-black text-center mb-6 md:mb-8 px-4">
        فيتامينات بجودة عالية
      </h2>
      <div className={styles.stage}>
          <div className={styles.groundTint} />
          <div className={styles.shadow} />
          <div className={styles.lift}>
            <div className={styles.tilt}>
              <div className={styles.pill}>
                <div className={styles.rim} />
                <div className={styles.text}>novo</div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default PillShowcase;

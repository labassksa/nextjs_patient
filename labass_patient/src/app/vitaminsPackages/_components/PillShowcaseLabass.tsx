import React from "react";
import styles from "./PillShowcaseLabass.module.css";

const PillShowcaseLabass: React.FC = () => {
  return (
    <div className={styles.stage}>
      <div className={styles.groundTint} />
      <div className={styles.shadow} />
      <div className={styles.lift}>
        <div className={styles.tilt}>
          <div className={styles.pill}>
            <div className={styles.rim} />
            <div className={styles.text}>labass</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PillShowcaseLabass;

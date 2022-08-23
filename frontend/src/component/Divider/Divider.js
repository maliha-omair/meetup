import React from "react"
import styles from "../Divider/Divider.module.css"
const Divider = ({ children }) => {

    return (
      <div className={styles.container}>
        <div className={styles.border} />
        <span className={styles.content}>
          {children}
        </span>
        <div className={styles.border} />
      </div>
    );

};

export default Divider;
import styles from "./hero.module.scss";

export default function hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.conteinerText}>
        <h1>Unlock Your Potential, Together!</h1>
        <h3>
          Ditch the Old Ways. Harness the Best Minds. Right Now. Right Here.
        </h3>
        <button className={styles.button1}>Find Wizard</button>
        <button className={styles.button2}>Become Wizard</button>
      </div>
      <div className={styles.conteinerImg}></div>
    </section>
  );
}

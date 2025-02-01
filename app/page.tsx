import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Scalability Test Methods</h1>
        <p>This project has 3 methods for handling GET requests:</p>
        <ul>
          <li><strong>/largeScale:</strong> handles 600 requests per second.</li>
          <li><strong>/largeScaleLimited:</strong> limited method.</li>
          <li><strong>/largeScaleNoCache:</strong> handles 200 requests per second.</li>
        </ul>
      </main>
      <footer className={styles.footer}>
   
      </footer>
    </div>
  );
}

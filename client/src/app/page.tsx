import styles from "./page.module.css";
import SensorData from "@/app/components/sensorData";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <SensorData />
      </div>
    </main>
  );
}

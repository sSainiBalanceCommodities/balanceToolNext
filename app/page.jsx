import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "../components/navbar/Navbar";


export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.infoSection} >
        <div className={styles.info} >
          <text className={styles.companyName} >Balance Commodities</text>
          <text className={styles.description} >All the tools are here of Balance Commodities</text>
        </div>
        <div className={styles.officialSite} >
          <text className={styles.description} >Directly access our official site</text>
          <div className={styles.iconBox} >p</div>
        </div>
      </div>
      <div className="divider" ></div>
      <div className={styles.contentSetion} >
        <div className={styles.eventSection} >
          {/* <EventCard /> */}
        </div>
        <div className={styles.ToolSection} >
        </div>
      </div>
    </div>
  );
}

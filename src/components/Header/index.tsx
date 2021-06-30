import styles from "./styles.module.scss";
import { RiBookMarkLine } from "react-icons/ri";
import Link from "next/link";
import { SignInOutButton } from "../SignInOutButton";
export function Header() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a className={styles.logo}>
            <RiBookMarkLine />
            <span>bookApp</span>
          </a>
        </Link>
        <SignInOutButton />
      </div>
    </div>
  );
}

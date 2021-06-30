import Head from "next/head";
import Image from "next/image";
import imgReader from "../assets/readers.png";
import styles from "./home.module.scss";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { useEffect } from "react";
export default function LandingPage() {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/home");
    }
  }, [session]);

  return (
    <div className={styles.landingPageContainer}>
      <div className={styles.landingPageContent}>
        <span>
          A better way to consume your books
          <FaHeart fontSize="1.5rem" style={{ marginLeft: "0.6rem" }} />
        </span>
        <Image src={imgReader} />
      </div>
    </div>
  );
}

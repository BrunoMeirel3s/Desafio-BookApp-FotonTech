import styles from "./styles.module.scss";
import { FaGoogle } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/client";

export function SignInOutButton() {
  const [session] = useSession();

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      {" "}
      <img
        src={session.user.image}
        alt="User Image"
        style={{ width: "2rem", borderRadius: "1rem", marginRight: "0.6rem" }}
      />{" "}
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn("google")}
    >
      {" "}
      <FaGoogle color="#fff6e5" /> Sign in with Google
    </button>
  );
}

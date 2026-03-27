"use client";

import { signOut } from "next-auth/react";
import styles from "./SignOutButton.module.css";

export default function SignOutButton() {
  return (
    <button 
      className={styles.logoutBtn}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Logout
    </button>
  );
}

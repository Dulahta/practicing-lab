"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingCredentials, setLoadingCredentials] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState("");

  async function handleCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoadingCredentials(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result) {
        setError("Unable to login. Please try again.");
        return;
      }

      if (result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong during login.");
    } finally {
      setLoadingCredentials(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoadingGoogle(true);

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch {
      setError("Google login failed. Please try again.");
      setLoadingGoogle(false);
    }
  }

  // const session = await getServerSession(authOptions);

  // if (!session?.user?.id) {
  //   redirect("/login");
  // }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Login</h1>

        <form onSubmit={handleCredentials} className={styles.form}>
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? <p className={styles.error}>{error}</p> : null}

          <button type="submit" disabled={loadingCredentials || loadingGoogle}>
            {loadingCredentials ? "Logging in..." : "Login with credentials"}
          </button>
        </form>

        <button
          className={styles.googleBtn}
          onClick={handleGoogleLogin}
          disabled={loadingCredentials || loadingGoogle}
        >
          {loadingGoogle ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <p className={styles.signUpText}>
          Don't have an account? <a href="/register">Sign up here</a>
        </p>
      </div>
    </main>
  );
}

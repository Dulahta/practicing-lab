"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type RegisterResponse = {
  error?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: RegisterResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Unable to create account. Please try again.");
        return;
      }

      setSuccess("Account created successfully. Redirecting to login...");
      setForm({ name: "", email: "", password: "" });

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Register</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />

          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          {error ? <p className={styles.error}>{error}</p> : null}
          {success ? <p className={styles.success}>{success}</p> : null}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
          <p className={styles.loginLink}>
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </main>
  );
}
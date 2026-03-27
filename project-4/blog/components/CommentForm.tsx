"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CommentForm.module.css";

type Props = {
  articleId: number;
};

type CommentResponse = {
  ok?: boolean;
  error?: string;
};

export default function CommentForm({ articleId }: Props) {
  const router = useRouter();

  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!body.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, body }),
      });

      const data: CommentResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Unable to post comment.");
        return;
      }

      setBody("");
      setSuccess("Comment added successfully.");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        placeholder="Write a comment..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
      />

      {error ? <p className={styles.error}>{error}</p> : null}
      {success ? <p className={styles.success}>{success}</p> : null}

      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Add comment"}
      </button>
    </form>
  );
}

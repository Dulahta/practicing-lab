"use client";

import { useState } from "react";
import styles from "./ArticleModal.module.css";

type Props = {
  article: {
    id: number;
    title: string;
    content: string;
    published: number;
  } | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function ArticleModal({ article, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(article?.title ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [published, setPublished] = useState(Boolean(article?.published));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setIsLoading(true);

    try {
      const payload = { title, content, published };

      const res = await fetch(
        article ? `/api/articles/${article.id}` : "/api/articles",
        {
          method: article ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        onSaved();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Failed to ${article ? "update" : "create"} article. Please try again.`);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{article ? "Edit article" : "Create article"}</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            disabled={isLoading}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            disabled={isLoading}
          />

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              disabled={isLoading}
            />
            Published
          </label>

          <div className={styles.actions}>
            <button 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (article ? "Updating..." : "Creating...") : (article ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

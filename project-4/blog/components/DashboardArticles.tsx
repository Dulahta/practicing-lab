"use client";

import { useState } from "react";
import ArticleModal from "./ArticleModal";
import styles from "./DashboardArticles.module.css";
import { Article } from "@/lib/queries/articles";


type Props = {
  initialArticles: Article[];
};


export default function DashboardArticles({ initialArticles }: Props) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);

  async function refreshArticles() {
    const res = await fetch("/api/articles", { cache: "no-store" });
    const data = await res.json();
    setArticles(data);
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (res.ok) {
      await refreshArticles();
    }
  }

  return (
    <section className={styles.wrapper}>
      <button
        className={styles.createBtn}
        onClick={() => {
          setEditing(null);
          setOpen(true);
        }}
      >
        Create article
      </button>

      <div className={styles.list}>
        {articles.map((article) => (
          <div className={styles.card} key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            <small>{article.published ? "Published" : "Draft"}</small>

            <div className={styles.actions}>
              <button
                onClick={() => {
                  setEditing(article);
                  setOpen(true);
                }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(article.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <ArticleModal
          article={editing}
          onClose={() => setOpen(false)}
          onSaved={async () => {
            setOpen(false);
            await refreshArticles();
          }}
        />
      )}
    </section>
  );
}

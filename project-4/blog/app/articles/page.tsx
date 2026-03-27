import db from "@/lib/db";
import { getCommentsByArticles } from "@/lib/queries/comments";
import CommentForm from "@/components/CommentForm";
import styles from "./page.module.css";
import Link from "next/dist/client/link";
import SignOutButton from "@/components/SignOutButton";

export const revalidate = 60;

export default async function ArticlesPage() {
  const articles = db
    .prepare(
      `
    SELECT a.*, u.name AS author_name
    FROM articles a
    JOIN users u ON u.id = a.author_id
    WHERE a.published = 1
    ORDER BY a.created_at DESC
  `,
    )
    .all() as Array<{
    id: number;
    title: string;
    content: string;
    author_name: string;
  }>;

  // Batch load all comments at once (fixes N+1 query problem)
  const articleIds = articles.map((a) => a.id);
  const commentsByArticle = getCommentsByArticles(articleIds);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>All Articles</h1>
        </div>
        <div>
          <Link href="/dashboard">Dashboard</Link>
          <SignOutButton />
        </div>
      </header>

      <div className={styles.list}>
        {articles.map((article) => {
          const comments = commentsByArticle[article.id] || [];

          return (
            <article className={styles.card} key={article.id}>
              <h2>{article.title}</h2>
              <p className={styles.meta}>By {article.author_name}</p>
              <p>{article.content}</p>

              <section className={styles.comments}>
                <h3>Comments</h3>
                {comments.map((comment) => (
                  <div key={comment.id} className={styles.comment}>
                    <strong>{comment.user_name}</strong>
                    <p>{comment.body}</p>
                  </div>
                ))}

                <CommentForm articleId={article.id} />
              </section>
            </article>
          );
        })}
      </div>
    </main>
  );
}

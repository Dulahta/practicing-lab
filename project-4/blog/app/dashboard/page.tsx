import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getArticlesByAuthor } from "@/lib/queries/articles";
import DashboardArticles from "@/components/DashboardArticles";
import SignOutButton from "@/components/SignOutButton";
import styles from "./page.module.css";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const initialArticles = getArticlesByAuthor(Number(session.user.id));

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {session.user.name}</p>
        </div>
        <div>
          <Link href="/articles">View all articles</Link>
          <SignOutButton />
        </div>
      </header>

      <div className={styles.wrapper}>
        <DashboardArticles initialArticles={initialArticles} />
      </div>
    </main>
  );
}

import db from "../db";

export type Article = {
  id: number;
  author_id: number;
  title: string;
  slug: string;
  content: string;
  published: number;
  created_at: string;
  updated_at: string;
};

export function createArticle(input: {
  authorId: number;
  title: string;
  slug: string;
  content: string;
  published: number;
}) {
  const result = db
    .prepare(
      `
    INSERT INTO articles (author_id, title, slug, content, published)
    VALUES (@authorId, @title, @slug, @content, @published)
  `,
    )
    .run(input);

  return getArticleById(Number(result.lastInsertRowid));
}

export function getArticleById(id: number) {
  return db
    .prepare(
      `
    SELECT a.*, u.name AS author_name
    FROM articles a
    JOIN users u ON u.id = a.author_id
    WHERE a.id = ?
  `,
    )
    .get(id);
}

export function getArticlesByAuthor(authorId: number) {
  return db
    .prepare(
      `
    SELECT *
    FROM articles
    WHERE author_id = ?
    ORDER BY created_at DESC
  `,
    )
    .all(authorId) as Article[];
}

export function getAllPublishedArticles() {
  return db
    .prepare(
      `
    SELECT a.*, u.name AS author_name
    FROM articles a
    JOIN users u ON u.id = a.author_id
    WHERE a.published = 1
    ORDER BY a.created_at DESC
  `,
    )
    .all();
}

export function updateArticle(input: {
  id: number;
  authorId: number;
  title: string;
  slug: string;
  content: string;
  published: number;
}) {
  db.prepare(
    `
    UPDATE articles
    SET title = @title,
        slug = @slug,
        content = @content,
        published = @published
    WHERE id = @id AND author_id = @authorId
  `,
  ).run(input);

  return getArticleById(input.id);
}

export function deleteArticle(id: number, authorId: number) {
  db.prepare(
    `
    DELETE FROM articles
    WHERE id = ? AND author_id = ?
  `,
  ).run(id, authorId);
}

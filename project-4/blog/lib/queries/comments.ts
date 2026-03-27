import db from "../db";

export function createComment(input: {
  articleId: number;
  userId: number;
  body: string;
}) {
  db.prepare(
    `
    INSERT INTO comments (article_id, user_id, body)
    VALUES (@articleId, @userId, @body)
  `,
  ).run(input);
}

export function getCommentsByArticle(articleId: number) {
  return db
    .prepare(
      `
    SELECT c.*, u.name AS user_name
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.article_id = ?
    ORDER BY c.created_at ASC
  `,
    )
    .all(articleId);
}

// Batch load comments for multiple articles (fixes N+1 query problem)
export function getCommentsByArticles(articleIds: number[]) {
  if (articleIds.length === 0) return {};
  
  const placeholders = articleIds.map(() => "?").join(",");
  const results = db
    .prepare(
      `
    SELECT c.*, u.name AS user_name
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.article_id IN (${placeholders})
    ORDER BY c.article_id, c.created_at ASC
  `,
    )
    .all(...articleIds) as Array<{
    id: number;
    article_id: number;
    body: string;
    user_name: string;
  }>;

  // Group comments by article_id
  const commentsByArticle: { [key: number]: typeof results } = {};
  results.forEach((comment) => {
    if (!commentsByArticle[comment.article_id]) {
      commentsByArticle[comment.article_id] = [];
    }
    commentsByArticle[comment.article_id].push(comment);
  });

  return commentsByArticle;
}

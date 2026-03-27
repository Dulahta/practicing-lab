import db from "../db";

const insertComment = db.prepare(`
    INSERT INTO comments (article_id, user_id, body)
    VALUES (@article_id, @user_id, @body)
    `)

export function createComment(input : {
    article_id: number;
    user_id: number;
    body: string
}){
    return insertComment.run(input)
}

const getCommentsByArticle= db.prepare(`
    SELECT c.*, u.name FROM comments c JOIN users u ON u.id = c.user_id WHERE c.article_id = ?
`)

export function listCommentsByArticle(articleId : number) {
    getCommentsByArticle.run(articleId)
}

const deleteCommentStmt = db.prepare(`
    DELETE FROM comments WHERE id = ?
`)

export function deleteComment(id: number){
    deleteCommentStmt.run(id)
}
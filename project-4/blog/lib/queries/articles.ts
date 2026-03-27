import db from "../db";

const insertArticle = db.prepare(`
    INSERT INTO articles (author_id, title, slug, content) VALUES (@author_id, @title, @slug, @content)
    `);

export function createArticle(input : {
    author_id: string;
    title: string;
    slug: string;
    content: string
}){
    return insertArticle.run({...input})
}

const getAllArticles = db.prepare(`
    SELECT a.*, u.name as author_name FROM articles a JOIN users u ON u.id = a.author_id
    `)

export function listAllArticles() {
    getAllArticles.all()
}

const getBySlug = db.prepare(`
    SELECT a.*, u.name as author_name FROM articles a JOIN users u ON u.id = a.author_id WHERE a.slug = ?
    `)

export function findArticleBySlug(slug: string) {
    return getBySlug.get(slug);
}

export function updateArticle(input: {
    id: number;
    title?: string;
    content?: string
}){
    const fields: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values : any[] = [];

    if (input.title !== undefined) {
        fields.push('title = ?');
        values.push(input.title)        
    }

    if (input.content !== undefined) {
        fields.push('content = ?');
        values.push(input.content)        
    }

const query = `
        UPDATE articles SET ${fields.join(', ')}
        WHERE id = ?
        `;

    values.push(input.id);
    return db.prepare(query).run(...values);
}

const deleteArticleStlt = db.prepare(`
    DELETE FROM articles where id = ?
    `);

export function deleteArticle(id: number) {
     return deleteArticleStlt.run(id);
}




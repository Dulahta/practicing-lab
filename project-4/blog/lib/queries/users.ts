import db from "../db";

const insertUser = db.prepare(`
   INSERT INTRO users (name, email, password) VALUES (@name, @email, @password)
   `);

export function createUser(input: {
    name: string;
    email: string;
    password: string;
}){
    return insertUser.run(input).lastInsertRowid;
}

const getUserByEmail = db.prepare(`SELECT * FROM users WHERE email = ?`)

export function findUserByEmail(email: string) {
    return getUserByEmail.get(email) 
}
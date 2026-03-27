import db from "../db";

export type DbUser = {
  id: number;
  name: string;
  email: string;
  password_hash: string | null;
  image: string | null;
  created_at: string;
};

export function findUserByEmail(email: string) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
    | DbUser
    | undefined;
}

export function findUserById(id: number) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | DbUser
    | undefined;
}

export function createUser(input: {
  name: string;
  email: string;
  passwordHash?: string | null;
  image?: string | null;
}) {
  const result = db
    .prepare(
      `
      INSERT INTO users (name, email, password_hash, image)
      VALUES (@name, @email, @passwordHash, @image)
    `,
    )
    .run({
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash ?? null,
      image: input.image ?? null,
    });

  return findUserById(Number(result.lastInsertRowid));
}

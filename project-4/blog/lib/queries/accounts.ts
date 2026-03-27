import db from "../db";

export function findAccount(provider: string, providerAccountId: string) {
  return db
    .prepare(
      `
      SELECT * FROM accounts
      WHERE provider = ? AND provider_account_id = ?
    `,
    )
    .get(provider, providerAccountId) as
    | {
        id: number;
        user_id: number;
        provider: string;
        provider_account_id: string;
      }
    | undefined;
}

export function createAccount(input: {
  userId: number;
  provider: string;
  providerAccountId: string;
}) {
  db.prepare(
    `
    INSERT OR IGNORE INTO accounts (user_id, provider, provider_account_id)
    VALUES (@userId, @provider, @providerAccountId)
  `,
  ).run(input);
}

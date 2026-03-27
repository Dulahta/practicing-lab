import db from "../db";

export function createSession(input: {
  sessionId: string;
  userId: number;
  token: string;
  expiresAt: string;
}) {
  db.prepare(
    `
    INSERT INTO sessions (session_id, user_id, token, expires_at)
    VALUES (@sessionId, @userId, @token, @expiresAt)
  `,
  ).run(input);
}

export function findSessionBySessionId(sessionId: string) {
  return db
    .prepare("SELECT * FROM sessions WHERE session_id = ?")
    .get(sessionId) as
    | {
        id: number;
        session_id: string;
        user_id: number;
        token: string;
        expires_at: string;
      }
    | undefined;
}

export function deleteSessionBySessionId(sessionId: string) {
  db.prepare("DELETE FROM sessions WHERE session_id = ?").run(sessionId);
}

export function deleteExpiredSessions() {
  db.prepare("DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP").run();
}

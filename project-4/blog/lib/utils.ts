import crypto from "crypto";

export function generateSessionId() {
  return crypto.randomUUID();
}

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

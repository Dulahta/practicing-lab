import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/schemas";
import { findUserByEmail, createUser } from "@/lib/queries/users";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue =
        parsed.error.issues[0]?.message || "Invalid form data.";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const existing = findUserByEmail(parsed.data.email);

    if (existing) {
      return NextResponse.json(
        { error: "An account already exists with this email." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const user = createUser({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Server error while creating account." },
      { status: 500 },
    );
  }
}

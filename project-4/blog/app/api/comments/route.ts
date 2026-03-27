import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { commentSchema } from "@/lib/schemas";
import { createComment } from "@/lib/queries/comments";
import { getArticleById } from "@/lib/queries/articles";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to comment." },
        { status: 401 },
      );
    }

    const body = await req.json();

    const parsed = commentSchema.safeParse({
      articleId: Number(body.articleId),
      body: body.body,
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Invalid comment.";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    // Verify article exists and is published
    const article = getArticleById(parsed.data.articleId);
    if (!article) {
      return NextResponse.json(
        { error: "Article not found." },
        { status: 404 },
      );
    }

    if (!article.published) {
      return NextResponse.json(
        { error: "Cannot comment on unpublished articles." },
        { status: 403 },
      );
    }

    createComment({
      articleId: parsed.data.articleId,
      userId: Number(session.user.id),
      body: parsed.data.body,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Server error while posting comment." },
      { status: 500 },
    );
  }
}

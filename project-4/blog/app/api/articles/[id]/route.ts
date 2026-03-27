// src/app/api/articles/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { articleSchema } from "@/lib/schemas";
import { updateArticle, deleteArticle, getArticleById } from "@/lib/queries/articles";
import { slugify } from "@/lib/utils";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = articleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Verify user owns the article before updating
  const existing = getArticleById(Number(id));
  if (!existing || existing.author_id !== Number(session.user.id)) {
    return NextResponse.json(
      { error: "Not authorized to update this article" },
      { status: 403 },
    );
  }

  const article = updateArticle({
    id: Number(id),
    authorId: Number(session.user.id),
    title: parsed.data.title,
    slug: `${slugify(parsed.data.title)}-${id}`,
    content: parsed.data.content,
    published: parsed.data.published ? 1 : 0,
  });

  return NextResponse.json(article);
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify user owns the article before deleting
  const existing = getArticleById(Number(id));
  if (!existing || existing.author_id !== Number(session.user.id)) {
    return NextResponse.json(
      { error: "Not authorized to delete this article" },
      { status: 403 },
    );
  }

  deleteArticle(Number(id), Number(session.user.id));

  return NextResponse.json({ ok: true });
}

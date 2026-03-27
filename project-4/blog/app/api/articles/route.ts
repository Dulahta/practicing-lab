import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { articleSchema } from "@/lib/schemas";
import { createArticle, getArticlesByAuthor } from "@/lib/queries/articles";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = getArticlesByAuthor(Number(session.user.id));
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = articleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const article = createArticle({
    authorId: Number(session.user.id),
    title: parsed.data.title,
    slug: `${slugify(parsed.data.title)}-${Date.now()}`,
    content: parsed.data.content,
    published: parsed.data.published ? 1 : 0,
  });

  return NextResponse.json(article, { status: 201 });
}

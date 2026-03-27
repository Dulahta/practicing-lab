import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles | Blog",
  description: "Browse all published articles from our blog community",
  openGraph: {
    title: "Articles | Blog",
    description: "Browse all published articles from our blog community",
    type: "website",
  },
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

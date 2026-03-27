import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Blog",
  description: "Sign in to your blog account to access your dashboard",
  openGraph: {
    title: "Login | Blog",
    description: "Sign in to your blog account to access your dashboard",
    type: "website",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

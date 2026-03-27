import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Blog",
  description: "Create a new blog account and start publishing your articles",
  openGraph: {
    title: "Register | Blog",
    description: "Create a new blog account and start publishing your articles",
    type: "website",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

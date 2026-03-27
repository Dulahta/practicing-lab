import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Blog",
  description: "Manage your articles and content from your personal dashboard",
  openGraph: {
    title: "Dashboard | Blog",
    description: "Manage your articles and content from your personal dashboard",
    type: "website",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

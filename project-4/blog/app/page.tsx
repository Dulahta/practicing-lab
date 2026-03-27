import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
    if (!session?.user?.id) {
      redirect("/login");
    } else {
      redirect("/dashboard");
    }
}

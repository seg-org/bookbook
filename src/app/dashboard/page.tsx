import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/Button";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Welcome, {session.user.name}</h2>
            <div className="space-y-4">
              <p>Email: {session.user.email}</p>
              <Button>
                <Link href="/seller-registration">Become a Seller</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

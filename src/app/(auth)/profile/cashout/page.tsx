import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/data/user";
import { CashOutForm } from "./CashOutForm";
export default async function CashOutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const userProfile = await getUserProfile(session.user.id);
  if (!userProfile || userProfile instanceof Error) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">ถอนเงิน</h1>
      <CashOutForm initialData={userProfile} />
    </div>
  );
}

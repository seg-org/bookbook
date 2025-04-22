import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { getUserProfile } from "@/data/user";
import { authOptions } from "@/lib/auth";

import { ProfileForm } from "./ProfileForm";
import { forbidden } from "next/navigation";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.isAdmin === true;

  if (!isAdmin) {
    forbidden();
  }

  const userProfile = await getUserProfile(id);

  if (!userProfile || userProfile instanceof Error) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">ระงับบัญชีผู้ขาย</h1>
      <ProfileForm initialData={userProfile} />
    </div>
  );
}

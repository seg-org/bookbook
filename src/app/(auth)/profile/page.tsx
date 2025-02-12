import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import { ProfileForm } from "./ProfileForm";

async function getUserProfile(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      sellerProfile: true,
    },
  });
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const userProfile = await getUserProfile(session.user.id);

  if (!userProfile) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">ข้อมูลผู้ใช้</h1>
      <ProfileForm initialData={userProfile} />
    </div>
  );
}

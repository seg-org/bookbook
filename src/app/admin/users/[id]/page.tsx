import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

import { verifyAdmin } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

import styles from "./styles.module.scss";
import UserBan from "./UserBan";
import { Button } from "@/components/ui/Button";

export default async function ManageUserPage({ params }: { params: Promise<{ id: string }> }) {
  await verifyAdmin();

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      sellerProfile: true,
    },
  });

  if (!user) {
    notFound();
  }

  const userPosts = await prisma.post.findMany({
    where: {
      sellerId: id,
    },
    select: {
      id: true,
    },
  });

  const userPostsId = userPosts.map((post) => post.id);

  const reports = await prisma.postReport.findMany({
    where: {
      postId: { in: userPostsId },
    },
  });

  async function updateUser(formData: FormData) {
    "use server";

    await verifyAdmin();

    const firstName = formData.get("firstName")?.toString();
    const lastName = formData.get("lastName")?.toString();
    const email = formData.get("email")?.toString();
    const phone = formData.get("phone")?.toString();
    const address = formData.get("address")?.toString();

    if (!firstName || !lastName || !email) {
      throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
    }

    await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        address,
      },
    });

    revalidatePath("/admin/users");
  }

  return (
    <main className="mx-auto w-screen max-w-2xl rounded-xl bg-white shadow-lg">
      <h1 className="text-2xl font-bold">จัดการผู้ใช้</h1>

      <form action={updateUser} className={styles.userManageForm}>
        <div>
          <div>
            <label htmlFor="firstName">ชื่อ</label>
            <input type="text" name="firstName" id="firstName" defaultValue={user.firstName} required />
          </div>
          <div>
            <label htmlFor="lastName">นามสกุล</label>
            <input type="text" name="lastName" id="lastName" defaultValue={user.lastName} required />
          </div>
        </div>

        <div>
          <div>
            <label htmlFor="email">อีเมล</label>
            <input type="email" name="email" id="email" defaultValue={user.email} required />
          </div>
          <div>
            <label htmlFor="phone">เบอร์โทรศัพท์</label>
            <input type="tel" name="phone" id="phone" defaultValue={user.phoneNumber ?? ""} />
          </div>
        </div>

        <div>
          <label htmlFor="address">ที่อยู่</label>
          <textarea name="address" id="address" defaultValue={user.address ?? ""} />
        </div>

        <button type="submit">บันทึกข้อมูล</button>
      </form>

      {user.isSeller &&
        user.sellerProfile &&
        user.sellerProfile.isApproved && (
          <>
            <h2 className="text-xl font-bold">จัดการโปรไฟล์ผู้ขาย</h2>

            <div className="mt-4 flex w-full flex-col items-center gap-4 p-4">
              <Button variant="link" size="lg" className="w-fit bg-pink-200">
                <Link href={`/admin/verify-sellers/revoke/${user.id}`}>ระงับบัญชีผู้ขาย</Link>
              </Button>
            </div>

            {reports.length > 0 && (
              <>
                <h2 className="text-xl font-bold">ประวัติการถูกรายงานโพสต์</h2>

                <div className="mt-2 flex w-full flex-col gap-2 px-4">
                  {reports.map((report) => (
                    <div key={report.id} className="rounded-lg border border-black p-2">
                      <Link href={`/post/${report.postId}`} className="text-blue-500">
                        ดูรายละเอียดโพสต์
                      </Link>
                      <p>เหตุผล: {report.reason}</p>
                      <p>เวลาที่รายงาน: {report.createdAt.toLocaleString("th-TH")}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>,
        )}

      <UserBan user={user} />
    </main>
  );
}

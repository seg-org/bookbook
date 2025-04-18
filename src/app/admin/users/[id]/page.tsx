import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { verifyAdmin } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

import styles from "./styles.module.scss";

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

  async function updateSellerProfile(formData: FormData) {
    "use server";

    await verifyAdmin();

    const bankName = formData.get("bankName")?.toString();
    const bankAccount = formData.get("bankAccount")?.toString();

    if (!bankName || !bankAccount) {
      throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
    }

    await prisma.sellerProfile.update({
      where: { userId: id },
      data: {
        bankName,
        bankAccount,
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

      {user.isSeller && user.sellerProfile && (
        <>
          <h2 className="text-xl font-bold">จัดการโปรไฟล์ผู้ขาย</h2>

          <form action={updateSellerProfile} className={styles.userManageForm}>
            <div>
              <div>
                <label htmlFor="bankName">ชื่อธนาคาร</label>
                <input
                  type="text"
                  name="bankName"
                  id="bankName"
                  defaultValue={user.sellerProfile.bankName ?? ""}
                  required
                />
              </div>
              <div>
                <label htmlFor="bankAccount">หมายเลขบัญชีธนาคาร</label>
                <input
                  type="text"
                  name="bankAccount"
                  id="bankAccount"
                  defaultValue={user.sellerProfile.bankAccount ?? ""}
                  required
                />
              </div>
            </div>

            <div>
              <div>
                <label htmlFor="idCardNumber">เลขประจำตัวประชาชน</label>
                <input
                  type="text"
                  name="idCardNumber"
                  id="idCardNumber"
                  value={user.sellerProfile.idCardNumber ?? ""}
                  disabled
                />
              </div>
              <div>
                <label htmlFor="idCardImage">อนุมัติเมื่อ</label>
                <input
                  type="text"
                  name="idCardImage"
                  id="idCardImage"
                  value={
                    user.sellerProfile.isApproved && user.sellerProfile.approvedAt
                      ? user.sellerProfile.approvedAt.toLocaleString("th-TH")
                      : "ยังไม่ถูกอนุมัติ"
                  }
                  disabled
                />
              </div>
            </div>

            <button type="submit">บันทึกข้อมูล</button>
          </form>
        </>
      )}
    </main>
  );
}

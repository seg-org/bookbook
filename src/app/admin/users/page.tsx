import { verifyAdmin } from "@/lib/authorization";

import { getUsers } from "./query";
import UserCard from "./UserCard";

export default async function AdminManageUsersPage() {
  await verifyAdmin();

  const users = await getUsers();

  return (
    <main className="p-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">จัดการผู้ใช้</h1>
      <p className="text-sm text-muted-foreground">จัดการผู้ใช้ในระบบ</p>

      <hr className="my-4" />

      <ul className="flex flex-col gap-4">
        {users.map((user) => (
          <li key={user.id}>
            <UserCard user={user} />
          </li>
        ))}
      </ul>
    </main>
  );
}

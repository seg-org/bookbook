import { redirect } from "next/navigation";

import { verifyAdmin } from "@/lib/authorization";

export default async function AdminPage() {
  await verifyAdmin();

  redirect("/admin/dashboard");
}

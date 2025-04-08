import { verifyAdmin } from "@/lib/authorization";

export default async function AdminPage() {
  await verifyAdmin();

  // todo redirect to admin dashboard (when it's done) and remove this page

  return (
    <section className="p-6">
      <h1 className="mb-2 text-2xl font-bold text-red-500">hello world</h1>
      <p className="text-sm text-muted-foreground">we love yuri</p>
    </section>
  );
}

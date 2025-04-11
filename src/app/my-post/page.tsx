import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { Pagination } from "./components/Pagination";
import { PostList } from "./components/PostList";

export default async function MyPostPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id || session.expires < new Date().toISOString()) {
    // Redirect to login page if user is not logged in
    redirect("/login");
  }

  return (
    <>
      <div className="m-0 box-border p-0">
        <div className="mt-8 p-3 text-4xl font-bold"> หน้าร้านของคุณ</div>
        <PostList />
        <Pagination />
      </div>
    </>
  );
}

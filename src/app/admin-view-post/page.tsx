"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Pagination } from "./components/Pagination";
import { PostList } from "./components/PostList";

function AdminPostPage() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();
  if (!isAuthenticated) {
    router.push("/login");
    return;
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

export default AdminPostPage;

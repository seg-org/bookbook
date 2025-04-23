"use client";

import { Megaphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
// import { FaShoppingBasket } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";

import { Button } from "@/components/ui/Button";
import { createChatRoom } from "@/data/chat";

import PostReportForm from "./PostReportForm";

export default function PostAction({ postId }: { postId: string; bookTitle: string; postPrice: number }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [openReportMenu, setOpenReportMenu] = useState(false);

  const router = useRouter();

  // const initiate_transaction = () => {
  //   if (!isAuthenticated) {
  //     router.push("/login");
  //     return;
  //   }
  //   router.push("/checkout");
  // };

  const handleChatWithSeller = async (postId: string) => {
    if (!isAuthenticated || !session?.user) {
      router.push("/login");
      return;
    }

    await createChatRoom({ subject: "post", subjectId: postId });
    router.push(`/chat`);
  };

  return (
    <>
      <div className="flex flex-row justify-end gap-4">
        <Button variant="destructive" onClick={() => setOpenReportMenu(!openReportMenu)} data-test-id="report-post">
          <Megaphone />
          <span>{openReportMenu ? "ปิดเมนู" : "รายงาน"}</span>
        </Button>
        <Button onClick={() => handleChatWithSeller(postId)} data-test-id="chat-with-seller">
          <div className="flex items-center justify-center gap-x-2">
            <IoLogoWechat className="h-6 w-6" /> แชทกับผู้ขาย
          </div>
        </Button>
        {/* <Button onClick={initiate_transaction}>
          <div className="flex items-center justify-center gap-x-2">
            <FaShoppingBasket className="h-6 w-6" /> สั่งซื้อ
          </div>
        </Button> */}
      </div>
      {openReportMenu && <PostReportForm postId={postId} />}
    </>
  );
}

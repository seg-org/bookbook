"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaShoppingBasket } from "react-icons/fa";
import { IoLogoWechat } from "react-icons/io5";

import { Button } from "@/components/ui/Button";
import { createChatRoom } from "@/data/chat";

export default function PostAction({
  postId,
  bookTitle,
  postPrice,
}: {
  postId: string;
  bookTitle: string;
  postPrice: number;
}) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const router = useRouter();

  const initiate_transaction = () => {
    const encodedPostId = encodeURIComponent(postId);
    const encodedBookTitle = encodeURIComponent(bookTitle);
    const encodedPostPrice = encodeURIComponent(postPrice.toString());
    router.push(`/buy?postId=${encodedPostId}&bookTitle=${encodedBookTitle}&postPrice=${encodedPostPrice}`);
  };

  const handleChatWithSeller = async (postId: string) => {
    if (!isAuthenticated || !session?.user) {
      router.push("/login");
      return;
    }

    await createChatRoom({ subject: "post", subjectId: postId });
    router.push(`/chat`);
  };

  return (
    <div className="flex flex-row justify-end gap-4">
      <Button onClick={() => handleChatWithSeller(postId)} data-test-id="chat-with-seller">
        <div className="flex items-center justify-center gap-x-2">
          <IoLogoWechat className="h-6 w-6" /> แชทกับผู้ขาย
        </div>
      </Button>
      <Button variant="success" onClick={initiate_transaction}>
        <div className="flex items-center justify-center gap-x-2">
          <FaShoppingBasket className="h-6 w-6" /> เพิ่มใส่ตะกร้า
        </div>
      </Button>
    </div>
  );
}

"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation"; // Correct import for Next.js 13+
import { useState } from "react";

const ReportSellerPage = () => {
  const router = useRouter(); // Initialize router for navigation
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId"); // Get query params
  const reporterId = searchParams.get("reporterId");

  const [formData, setFormData] = useState({
    reporterId: reporterId,
    roomId: roomId,
    reason: "",
  });
  // const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("api/chat/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    console.log(response.ok);

    if (response.ok) {
      alert("ขอขอบคุณสำหรับการรายงาน");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      alert("ไม่สามารถรายงานได้ กรุณาลองอีกครั้ง!");
    }
  };

  return (
    <div className="my-8 box-border flex w-full justify-center border">
      <div className="m-2 flex flex-row max-lg:flex-col md:w-[50%]">
        <div className="relative m-1.5 mr-1.5 h-[190px] min-w-[250px] self-center max-md:w-full">
          <Image src="/images/report/women-with-message.png" alt="Illustration" fill />
        </div>
        <div className="w-full">
          <h1 className="m-1.5 mb-4 text-2xl font-bold">รายงานผู้ใช้งาน</h1>

          {/* {successMessage && <p className="mb-4 text-green-500">{successMessage}</p>} */}

          <form onSubmit={handleSubmit} className="m-1.5 space-y-4 md:w-[100%]">
            <div>
              <label className="block font-semibold">เหตุผลในการรายงาน:</label>
              <textarea
                name="reason"
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-2"
                placeholder="ระบุรายละเอียดเพิ่มเติม..."
                rows={4}
              ></textarea>
            </div>

            <button type="submit" className="mb-2.5 w-full rounded-lg bg-red-500 py-2 text-white hover:bg-red-700">
              รายงานผู้ใช้
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportSellerPage;

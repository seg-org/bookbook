"use client";
import Image from "next/image";
import { useState } from "react";

const ReportSellerPage = () => {
  const [formData, setFormData] = useState({
    user: "",
    reason: "",
    details: "",
  });
  // const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
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
              <label className="block font-semibold">ชื่อผู้ใช้:</label>
              <input
                type="text"
                name="seller"
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-2"
                placeholder="กรอกชื่อผู้ใช้"
              />
            </div>

            <div>
              <label className="block font-semibold">เหตุผลในการรายงาน:</label>
              <input
                type="text"
                name="reason"
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-2"
                placeholder="เช่น ฉ้อโกง, คุกคาม"
              />
            </div>

            <div>
              <label className="block font-semibold">รายละเอียดเพิ่มเติม:</label>
              <textarea
                name="details"
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

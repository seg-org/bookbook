import React, { useState } from "react";

function SearchByDetail() {
  const [formData, setFormData] = useState({ title: "", author: "", publisher: "", isbn: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Form Data:", formData);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body:
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "การลงทะเบียนล้มเหลว");
    }
  };

  return (
    <>
      <div className="mb-3 pr-3 font-semibold">ค้นหาหนังสือด้วยรายละเอียดเพิ่มเติม</div>
      <form className="grid gap-2.5" onSubmit={handleSubmit}>
        <input
          className="rounded-md border border-gray-300 p-2.5"
          name="title"
          type="text"
          placeholder="ชื่อหนังสือ"
          value={formData.title}
          onChange={handleChange}
        ></input>
        <input
          className="rounded-md border border-gray-300 p-2.5"
          name="author"
          type="text"
          placeholder="ผู้เขียน"
          value={formData.author}
          onChange={handleChange}
        ></input>
        <input
          className="rounded-md border border-gray-300 p-2.5"
          name="publisher"
          type="text"
          placeholder="สำนักพิมพ์"
          value={formData.publisher}
          onChange={handleChange}
        ></input>
        <input
          className="rounded-md border border-gray-300 p-2.5"
          name="isbn"
          type="text"
          placeholder="ISBN"
          value={formData.isbn}
          onChange={handleChange}
        ></input>
        <button className="cursor-pointer rounded-md border-none bg-[#9dc4de] p-2.5 text-white">
          ค้นหาข้อมูลด้วยรายละเอียดเพิ่มเติม
        </button>
      </form>
    </>
  );
}

export default SearchByDetail;

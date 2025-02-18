"use client";
import Image from "next/image";
import { useState } from "react";

const ReportSellerPage = () => {
  const [formData, setFormData] = useState({
    seller: "",
    reason: "",
    details: "",
    pic: "idk",
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
    <div className="my-8 box-border flex justify-center border">
      <div className="m-2 flex flex-row max-md:flex-col">
        <div className="relative m-1.5 mr-1.5 h-[250px] min-w-[330px] self-center max-md:w-full">
          <Image src="/images/report/women-with-message.png" alt="Illustration" fill />
        </div>
        <div className="w-full">
          <h1 className="m-1.5 mb-4 text-2xl font-bold">Report a Seller</h1>

          {/* {successMessage && <p className="mb-4 text-green-500">{successMessage}</p>} */}

          <form onSubmit={handleSubmit} className="m-1.5 space-y-4 md:w-[100%]">
            <div>
              <label className="block font-semibold">Seller:</label>
              <input
                type="text"
                name="seller"
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-2"
                placeholder="Enter seller"
              />
            </div>

            <div>
              <label className="block font-semibold">Reason for Report:</label>
              <input
                type="text"
                name="reason"
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-2"
                placeholder="E.g., Fraud, Harassment"
              />
            </div>

            <div>
              <label className="block font-semibold">Additional Details:</label>
              <textarea
                name="details"
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-2"
                placeholder="Provide more details..."
                rows={4}
              ></textarea>
            </div>

            <div>
              <label className="block font-semibold">Upload Evidence (Image):</label>
              <input type="file" accept="image/*" className="w-full rounded-lg border p-2" />
            </div>

            <button type="submit" className="mb-2.5 w-full rounded-lg bg-red-500 py-2 text-white hover:bg-red-700">
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportSellerPage;

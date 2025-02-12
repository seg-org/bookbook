"use client";

import Image from "next/image";

const RequestBook = () => {
  return (
    <div className="m-8 mx-auto max-w-lg p-6">
      <div className="relative h-[200px] w-[300px]">
        <Image src="/images/search/man-with-book.png" alt="Illustration" fill={true} />
      </div>
      <h1 className="mb-4 text-2xl font-bold">Request a New Book</h1>
      <form className="space-y-4">
        <input type="text" name="title" placeholder="Book Title" required className="w-full rounded border p-2" />
        <input type="text" name="author" placeholder="Author" required className="w-full rounded border p-2" />
        <textarea name="description" placeholder="Description" required className="w-full rounded border p-2" />
        <input type="number" name="price" placeholder="Price" required className="w-full rounded border p-2" />
        <input type="file" accept="image/*" className="w-full rounded border p-2" />
        <button type="submit" className="w-full rounded bg-blue-500 py-2 text-white">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestBook;

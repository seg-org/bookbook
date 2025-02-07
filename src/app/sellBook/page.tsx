"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  description: z.string().optional(),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  pages: z.coerce.number().min(1, "Pages must be greater than 0"),
  coverImageUrl: z.string().url().optional(),
});

export default function SellerPostPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookSchema),
  });

  const [message, setMessage] = useState("");

  const onSubmit = async (data: any) => {
    console.log("Mock Submission:", data);
    setMessage("Book posted successfully (mock data)!");
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4 text-center">Post a Book for Sale</h1>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <label>
          Book Title:
          <input {...register("title")} placeholder="Book Title" className="block w-full input mt-1" />
          {errors.title?.message && <p className="text-red-500">{String(errors.title.message)}</p>}
        </label>

        <label>
          Author:
          <input {...register("author")} placeholder="Author" className="block w-full input mt-1" />
          {errors.author?.message && <p className="text-red-500">{String(errors.author.message)}</p>}
        </label>

        <label>
          Genre:
          <input {...register("genre")} placeholder="Genre" className="block w-full input mt-1" />
          {errors.genre?.message && <p className="text-red-500">{String(errors.genre.message)}</p>}
        </label>

        <label>
          Description:
          <textarea {...register("description")} placeholder="Description" className="block w-full input mt-1"></textarea>
        </label>

        <label>
          ISBN:
          <input {...register("isbn")} placeholder="ISBN" className="block w-full input mt-1" />
          {errors.isbn?.message && <p className="text-red-500">{String(errors.isbn.message)}</p>}
        </label>

        <label>
          Number of Pages:
          <input type="number" {...register("pages")} placeholder="Number of Pages" className="block w-full input mt-1" />
          {errors.pages?.message && <p className="text-red-500">{String(errors.pages.message)}</p>}
        </label>

        <label>
          Cover Image URL:
          <input {...register("coverImageUrl")} placeholder="Cover Image URL" className="block w-full input mt-1" />
          {errors.coverImageUrl?.message && <p className="text-red-500">{String(errors.coverImageUrl.message)}</p>}
        </label>

        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
          Post Book
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}

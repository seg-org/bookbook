"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    console.log("Mock Submission:", data);
    setMessage("Book posted successfully (mock data)!");
  };

  return (
    <div className="mx-auto mt-10 max-w-lg">
      {/* Title */}
      <h1 className="mb-4 text-center text-2xl font-bold">Post a Book for Sale</h1>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <label>
          Book Title:
          <input {...register("title")} placeholder="Book Title" className="input mt-1 block w-full" />
          {errors.title?.message && <p className="text-red-500">{String(errors.title.message)}</p>}
        </label>

        <label>
          Author:
          <input {...register("author")} placeholder="Author" className="input mt-1 block w-full" />
          {errors.author?.message && <p className="text-red-500">{String(errors.author.message)}</p>}
        </label>

        <label>
          Genre:
          <input {...register("genre")} placeholder="Genre" className="input mt-1 block w-full" />
          {errors.genre?.message && <p className="text-red-500">{String(errors.genre.message)}</p>}
        </label>

        <label>
          Description:
          <textarea
            {...register("description")}
            placeholder="Description"
            className="input mt-1 block w-full"
          ></textarea>
        </label>

        <label>
          ISBN:
          <input {...register("isbn")} placeholder="ISBN" className="input mt-1 block w-full" />
          {errors.isbn?.message && <p className="text-red-500">{String(errors.isbn.message)}</p>}
        </label>

        <label>
          Number of Pages:
          <input
            type="number"
            {...register("pages")}
            placeholder="Number of Pages"
            className="input mt-1 block w-full"
          />
          {errors.pages?.message && <p className="text-red-500">{String(errors.pages.message)}</p>}
        </label>

        <label>
          Cover Image URL:
          <input {...register("coverImageUrl")} placeholder="Cover Image URL" className="input mt-1 block w-full" />
          {errors.coverImageUrl?.message && <p className="text-red-500">{String(errors.coverImageUrl.message)}</p>}
        </label>

        <button type="submit" className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-700">
          Post Book
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}

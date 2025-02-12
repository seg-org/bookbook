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
  coverImageKey: z.string().optional(),
});

export default function SellerPostPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookSchema),
  });

  const [message, setMessage] = useState("");
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sellerId = "mock_seller_123"; // Replace with actual seller ID from auth

  // Fetch description based on title
  const fetchDescription = async (title: string) => {
    if (!title) return;
    setLoadingDescription(true);

    try {
      const response = await fetch("/api/books/gen-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();
      if (response.ok && data.description) {
        setValue("description", data.description);
      }
    } catch (error) {
      console.error("Error fetching description:", error);
    } finally {
      setLoadingDescription(false);
    }
  };

  // **Handle File Upload**
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      // Step 1: Get a presigned URL for uploading the image
      const presignedRes = await fetch("/api/objects/s3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, fileType: file.type }),
      });

      const presignedData = await presignedRes.json();
      if (!presignedRes.ok) {
        throw new Error("Failed to get presigned URL");
      }

      // Step 2: Upload the file directly to S3
      const uploadRes = await fetch(presignedData.url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        throw new Error("File upload failed");
      }

      // Step 3: Store the image key in form state
      setValue("coverImageKey", presignedData.key);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload cover image.");
    } finally {
      setUploading(false);
    }
  };

  // **Upload Book Data to API**
  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      // Ensure coverImageKey exists
      if (!data.coverImageKey) {
        throw new Error("Cover image upload is required.");
      }

      // Step 2: Send book data to API
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sellerId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Book posted successfully!");
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error posting book:", error);
      setMessage("Failed to post book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-lg">
      <h1 className="mb-4 text-center text-2xl font-bold">Post a Book for Sale</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <label>
          Book Title:
          <input
            {...register("title")}
            placeholder="Book Title"
            className="input mt-1 block w-full"
            onBlur={(e) => fetchDescription(e.target.value)}
          />
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
          {loadingDescription && <p className="text-blue-500">Generating description...</p>}
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
          Cover Image:
          <input
            type="file"
            accept="image/*"
            className="input mt-1 block w-full"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          {uploading && <p className="text-blue-500">Uploading image...</p>}
          {errors.coverImageKey?.message && <p className="text-red-500">{String(errors.coverImageKey.message)}</p>}
        </label>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-700"
          disabled={loading || uploading}
        >
          {loading ? "Posting..." : "Post Book"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}

"use client";

import { getObjectUrl, putObject } from "@/data/object";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  description: z.string(),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  pages: z.coerce.number().min(1, "Pages must be greater than 0"),
  coverImageKey: z.string(),
  sellerId: z.string(),
});
type CreateBookFormData = z.infer<typeof bookSchema>;

export default function SellerPostPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateBookFormData>({
    resolver: zodResolver(bookSchema),
  });

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (!isAuthenticated) {
    redirect("/login");
  }

  setValue("sellerId", session?.user?.id);

  const [message, setMessage] = useState("");
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const uploadedImage = await putObject(file);
      if (uploadedImage instanceof Error) {
        throw new Error("Failed to upload cover image");
      }
      const getObjectRes = await getObjectUrl(uploadedImage.key, uploadedImage.folder);
      if (getObjectRes instanceof Error) {
        throw new Error("Failed to get object URL");
      }

      setValue("coverImageKey", uploadedImage.key);
      setImageUrl(getObjectRes.signedUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload cover image.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: CreateBookFormData) => {
    setLoading(true);
    try {
      if (!data.coverImageKey) {
        throw new Error("Cover image upload is required.");
      }

      // Step 2: Send book data to API
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
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
        {imageUrl && <Image src={imageUrl} alt="Cover Image" width={200} height={200} />}

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

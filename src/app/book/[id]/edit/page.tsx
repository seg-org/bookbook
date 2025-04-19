"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { bookImageFolderName } from "@/constants/s3FolderName";
import { editBook } from "@/data/book";
import { getObjectUrl, putObject } from "@/data/object";
import { useGetBook } from "@/hooks/useGetBook";

const bookSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  author: z.string().min(5, "Author must be at least 5 characters long"),
  genre: z.string().min(3, "Genre must be at least 3 characters long"),
  description: z.string().min(20, "Description must be at least 20 characters long"),
  isbn: z.string().refine((val) => /^\d{10}$|^\d{13}$/.test(val), {
    message: "ISBN must be either 10 or 13 digits",
  }),
  publisher: z.string().min(5, "Publisher must be at least 5 characters long"),
  pages: z.coerce.number().min(1, "Pages must be greater than 0"),
  coverImageKey: z.string().optional(),
  recommendPrice: z.coerce.number().min(0, "Recommend price must be greater than or equal to 0").optional(),
});
export type EditBookFormData = z.infer<typeof bookSchema>;

export default function EditBookPage() {
  const { id: bookId } = useParams();
  const id = bookId as string;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditBookFormData>({
    resolver: zodResolver(bookSchema),
  });

  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";

  if (!isAuthenticated) {
    redirect("/login");
  }
  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  const { book, loading: bookLoading, error: bookError } = useGetBook(id);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    if (book) {
      setValue("title", book.title);
      setValue("author", book.author);
      setValue("genre", /*book.genre*/ "oo");
      setValue("description", book.description);
      setValue("isbn", book.isbn);
      setValue("publisher", book.publisher);
      setValue("pages", book.pages);
      setValue("coverImageKey", book.coverImageKey);
      setValue("recommendPrice", book.recommendPrice ?? undefined);
      setImageUrl(book.coverImageUrl);
    }
  }, [book, setValue]);

  if (bookLoading) {
    return <p>Loading...</p>;
  }
  if (bookError || !book) {
    console.error(bookError);
    return <p>Error loading book: {String(bookError)}</p>;
  }

  const onSubmit = async (data: EditBookFormData) => {
    setLoading(true);
    try {
      const res = await editBook(data, id);
      if (res instanceof Error) {
        console.error(res);
        setMessage(`Error: ${res.message}`);
      }
      setMessage("Book updated successfully!");
    } catch (error) {
      console.error("Error posting book:", error);
      setMessage("Failed to post book.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const uploadedImage = await putObject(file, bookImageFolderName);
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

  return (
    <div className="mx-auto my-10 max-w-lg">
      <h1 className="mb-4 text-center text-2xl font-bold">แก้ไขหนังสือเพื่อเตรียมขาย</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <label>
          ชื่อหนังสือ:
          <input {...register("title")} placeholder="ชื่อหนังสือ" className="mt-1 block w-full rounded p-2" />
          {errors.title?.message && <p className="text-red-500">{String(errors.title.message)}</p>}
        </label>

        <label>
          ผู้แต่ง:
          <input {...register("author")} placeholder="ผู้แต่ง" className="mt-1 block w-full rounded p-2" />
          {errors.author?.message && <p className="text-red-500">{String(errors.author.message)}</p>}
        </label>

        <label>
          ประเภทหนังสือ:
          <input {...register("genre")} placeholder="ประเภทหนังสือ" className="mt-1 block w-full rounded p-2" />
          {errors.genre?.message && <p className="text-red-500">{String(errors.genre.message)}</p>}
        </label>

        <label>
          เนื้อเรื่องย่อ:
          <textarea
            {...register("description")}
            placeholder="เนื้อเรื่องย่อ"
            className="mt-1 block w-full rounded p-2"
          ></textarea>
          {errors.description?.message && <p className="text-red-500">{String(errors.description.message)}</p>}
        </label>

        <label>
          ISBN:
          <input {...register("isbn")} placeholder="ISBN" className="mt-1 block w-full rounded p-2" />
          {errors.isbn?.message && <p className="text-red-500">{String(errors.isbn.message)}</p>}
        </label>

        <label>
          สำนักพิมพ์:
          <input {...register("publisher")} placeholder="สำนักพิมพ์" className="mt-1 block w-full rounded p-2" />
          {errors.publisher?.message && <p className="text-red-500">{String(errors.publisher.message)}</p>}
        </label>

        <label>
          จำนวนหน้า:
          <input
            type="number"
            {...register("pages")}
            placeholder="จำนวนหน้า"
            className="mt-1 block w-full rounded p-2"
          />
          {errors.pages?.message && <p className="text-red-500">{String(errors.pages.message)}</p>}
        </label>

        <label>
          รูปหน้าปก (เลือกอัปโหลดใหม่หรือใช้รูปเดิม):
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full rounded p-2"
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

        <label>
          ราคาขายแนะนำ:
          <input
            type="number"
            {...register("recommendPrice")}
            placeholder="(ราคาขายแนะนำ)"
            className="mt-1 block w-full rounded p-2"
          />
          {errors.recommendPrice?.message && <p className="text-red-500">{String(errors.recommendPrice.message)}</p>}
        </label>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-700"
          disabled={loading || uploading}
        >
          {loading ? "กำลังแก้ไขหนังสือ..." : "แก้ไขหนังสือ"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}

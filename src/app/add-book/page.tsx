"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { bookImageFolderName } from "@/constants/s3FolderName";
import { getObjectUrl, putObject } from "@/data/object";

import { BookTagType, GenreType } from "../api/books/book_enum";

import Select from "react-select";
import { Controller } from "react-hook-form";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  description: z.string(),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  publisher: z.string().min(1, "Publisher is required"),
  pages: z.coerce.number().min(1, "Pages must be greater than 0"),
  coverImageKey: z.string(),
  bookGenres: z.array(GenreType),
  bookTags: z.array(BookTagType),
});
type CreateBookFormData = z.infer<typeof bookSchema>;

export default function AddBookPage() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateBookFormData>({
    resolver: zodResolver(bookSchema),
  });

  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  type GenreOption = {
    value: GenreType;
    label: string;
  };
  const genreOptions = GenreType.options.map((g) => ({
    value: g,
    label: g.replace(/_/g, " "),
  }));

  type BookTagOption = {
    value: BookTagType;
    label: string;
  };
  const bookTagOptions = BookTagType.options.map((tag) => ({
    value: tag,
    label: tag.replace(/_/g, " "),
  }));

  // if (!isAuthenticated) {
  //   redirect("/login");
  // }

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

  const onSubmit = async (data: CreateBookFormData) => {
    setLoading(true);
    if (data !== undefined) console.log("recieve");
    try {
      if (!data.coverImageKey) {
        throw new Error("Cover image upload is required.");
      }
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
    <div className="mx-auto my-10 max-w-lg">
      <h1 className="mb-4 text-center text-2xl font-bold">เพิ่มหนังสือเพื่อเตรียมขาย</h1>
      <p className="mb-4 text-center text-gray-500">
        หนังสือที่เพิ่มยังไม่ถือว่าประกาศขาย
        ผู้ใช้จะต้องสร้างโพสต์ขายหนังสือที่แนบหนังสือที่สร้างแล้วเพื่อให้สามารถประกาศขายได้
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <label>
          ชื่อหนังสือ:
          <input
            {...register("title")}
            placeholder="ชื่อหนังสือ"
            className="mt-1 block w-full rounded p-2"
            onBlur={(e) => fetchDescription(e.target.value)}
          />
          {errors.title?.message && <p className="text-red-500">{String(errors.title.message)}</p>}
        </label>

        <label>
          ผู้แต่ง:
          <input {...register("author")} placeholder="ผู้แต่ง" className="mt-1 block w-full rounded p-2" />
          {errors.author?.message && <p className="text-red-500">{String(errors.author.message)}</p>}
        </label>

        <label>
          หมวดหมู่ (Genres):
          <Controller
            control={control}
            name="bookGenres"
            render={({ field }) => (
              <Select<GenreOption, true>
                isMulti
                options={genreOptions}
                value={genreOptions.filter((opt) => field.value?.includes(opt.value))}
                onChange={(selected) => field.onChange(selected.map((opt) => opt.value))}
              />
            )}
          />
          {errors.bookGenres?.message && <p className="text-red-500">{String(errors.bookGenres.message)}</p>}
        </label>

        <label>
          แท็กหนังสือ (Tags):
          <Controller
            control={control}
            name="bookTags"
            render={({ field }) => (
              <Select<BookTagOption, true>
                isMulti
                options={bookTagOptions}
                value={bookTagOptions.filter((opt) => field.value?.includes(opt.value))}
                onChange={(selected) => field.onChange(selected.map((opt) => opt.value))}
              />
            )}
          />
          {errors.bookTags?.message && <p className="text-red-500">{String(errors.bookTags.message)}</p>}
        </label>

        <label>
          เนื้อเรื่องย่อ:
          <textarea
            {...register("description")}
            placeholder="เนื้อเรื่องย่อ"
            className="mt-1 block w-full rounded p-2"
          ></textarea>
          {loadingDescription && <p className="text-blue-500">กำลังสรุปเนื้อเรื่องย่อย...</p>}
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
          รูปหน้าปก:
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

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-700"
          disabled={loading || uploading}
        >
          {loading ? "กำลังสร้างหนังสือ..." : "สร้างหนังสือ"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";

export default function SellerPostPage() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    isbn: "",
    pages: "",
    coverImageUrl: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.title) return "Title is required";
    if (!formData.author) return "Author is required";
    if (!formData.genre) return "Genre is required";
    if (formData.isbn.length < 10) return "ISBN must be at least 10 characters";
    if (isNaN(Number(formData.pages)) || Number(formData.pages) < 1) return "Pages must be a positive number";
    if (formData.coverImageUrl && !formData.coverImageUrl.startsWith("http"))
      return "Cover Image URL must be a valid URL";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }
    console.log("Mock Submission:", formData);
    setMessage("Book posted successfully (mock data)!");
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Post a Book for Sale</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Book Title" className="input" />
        <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="input" />
        <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" className="input" />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="input"
        ></textarea>
        <input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN" className="input" />
        <input name="pages" value={formData.pages} onChange={handleChange} placeholder="Number of Pages" className="input" />
        <input
          name="coverImageUrl"
          value={formData.coverImageUrl}
          onChange={handleChange}
          placeholder="Cover Image URL"
          className="input"
        />
        <button type="submit" className="btn">Post Book</button>
      </form>
      {message && <p className={`mt-4 ${message.includes("successfully") ? "text-green-600" : "text-red-500"}`}>{message}</p>}
    </div>
  );
}

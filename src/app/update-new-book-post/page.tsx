"use client"
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";

const EditPost = () => {
//   const router = useRouter();
//   const { id } = router.query; // Get post ID from URL

//   const [post, setPost] = useState({
//     title: "",
//     content: "",
//     price: 0,
//     published: false,
//   });

//   useEffect(() => {
//     if (id) {
//       fetch(`/api/posts/${id}`)
//         .then((res) => res.json())
//         .then((data) => setPost(data));
//     }
//   }, [id]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     setPost((prev) => ({
//       ...prev,
//       [name]: type === "number" ? parseFloat(value) : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await fetch(`/api/posts/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(post),
//     });
//     router.push("/posts");
//   };

    const post = {
        title : "หนังสือยูริของลีโอ",
        content : "content คือไรวะ กูไม่เข้าใจ",
        price : 6969,
        published : true
    }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <form className="m-2.5">
        <label className="">Title</label>
        <input
          type="text"
          name="title"
          value={post.title}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />
        <label>content</label>
        <textarea
          name="content"
          value={post.content}
          placeholder="Content"
          className="w-full p-2 border rounded"
        />
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={post.price}
          placeholder="Price"
          className="w-full p-2 border rounded"
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            name="published"
            checked={post.published}
          />
          <span className="ml-2">Published</span>
        </label>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;

import Image from "next/image";

const EditPost = () => {
  //อันที่จะupdate
  const post = {
    //กดอันไหนมาก็อันนั้นอะ
    title: "ชื่อหนังสือที่จะupdate",
    content: "contentที่จะupdate",
    price: 1234,
    published: true,
  };

  return (
    <>
      <div className="mx-auto max-w-lg p-4">
        <div className="relative m-10 h-[200px] w-auto">
          <Image src="/images/searchPage/man-with-book.png" alt="Illustration" fill={true} />
        </div>
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <form className="m-4">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            placeholder="ชื่อหนังสือ"
            className="w-full rounded border p-2"
          />
          <label>Content</label>
          <textarea name="content" value={post.content} placeholder="Content" className="w-full rounded border p-2" />
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={post.price}
            placeholder="Price"
            className="w-full rounded border p-2"
          />
          <label className="flex items-center">
            <input type="checkbox" name="published" checked={post.published} />
            <span className="ml-2">Published</span>
          </label>
          <button type="submit" className="w-full rounded bg-blue-500 py-2 text-white">
            Update Post
          </button>
        </form>
      </div>
    </>
  );
};

export default EditPost;

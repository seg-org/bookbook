import { useEffect, useState } from "react";

import { usePostContext } from "@/context/postContext";

function SearchByDetail() {
  const [author, setAuthor] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [publisher, setPublisher] = useState<string>("");
  const [isbn, setIsbn] = useState<string>("");

  const { setPostsFilters } = usePostContext();
  useEffect(() => {
    setPostsFilters((prev) => ({
      ...prev,
      author: author.length !== 0 ? author : undefined,
      genre: genre.length !== 0 ? genre : undefined,
      publisher: publisher.length !== 0 ? publisher : undefined,
      isbn: isbn.length !== 0 ? isbn : undefined,
    }));
  }, [author, genre, publisher, isbn]);

  return (
    <>
      <div className="mb-3 pr-3 font-semibold">ค้นหาหนังสือด้วยรายละเอียดเพิ่มเติม</div>
      <form className="grid gap-2.5">
        <input
          className="rounded-sm border border-gray-300 p-2.5"
          type="text"
          placeholder="ผู้เขียน"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          className="rounded-sm border border-gray-300 p-2.5"
          type="text"
          placeholder="ประเภท"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <input
          className="rounded-sm border border-gray-300 p-2.5"
          type="text"
          placeholder="สำนักพิมพ์"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
        />
        <input
          className="rounded-sm border border-gray-300 p-2.5"
          type="text"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
      </form>
    </>
  );
}

export default SearchByDetail;

import { useEffect, useState } from "react";

import { usePostContext } from "@/context/postContext";

function SearchByDetail() {
  const [author, setAuthor] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [publisher, setPublisher] = useState<string>("");
  const [isbn, setIsbn] = useState<string>("");
  const [minPages, setMinPages] = useState<string>("");
  const [maxPages, setMaxPages] = useState<string>("");
  const { setPostsFilters } = usePostContext();
  useEffect(() => {
    setPostsFilters((prev) => ({
      ...prev,
      author: author.length !== 0 ? author : undefined,
      genre: genre.length !== 0 ? genre : undefined,
      publisher: publisher.length !== 0 ? publisher : undefined,
      isbn: isbn.length !== 0 ? isbn : undefined,
      minPages: minPages.length !== 0 && !isNaN(parseInt(minPages, 10)) ? parseInt(minPages, 10) : undefined,
      maxPages: maxPages.length !== 0 && !isNaN(parseInt(maxPages, 10)) ? parseInt(maxPages, 10) : undefined,
    }));
  }, [author, genre, publisher, isbn, minPages, maxPages, setPostsFilters]);

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
        {/* <input
          className="rounded-sm border border-gray-300 p-2.5"
          type="text"
          placeholder="ประเภท"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        /> */}
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
        {/* Grid 2 column of number of pages from, to*/}
        <div className="grid grid-cols-2 gap-2.5">
          <input
            className="rounded-sm border border-gray-300 p-2.5"
            type="text"
            placeholder="จำนวนหน้าอย่างน้อย"
            value={minPages}
            onChange={(e) => setMinPages(e.target.value)}
          />
          <input
            className="rounded-sm border border-gray-300 p-2.5"
            type="text"
            placeholder="จำนวนหน้าไม่เกิน"
            value={maxPages}
            onChange={(e) => setMaxPages(e.target.value)}
          />
        </div>
      </form>
    </>
  );
}

export default SearchByDetail;

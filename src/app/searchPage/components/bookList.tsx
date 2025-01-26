import BookCard from "@/app/searchPage/components/bookCard";


function BookList({books}:any) {
    return (
        <div className="book-list">
        {books.map((book : any) => (
          <BookCard book={book} key={book.id}></BookCard>
        ))}
        </div>
    )
}

export default BookList;


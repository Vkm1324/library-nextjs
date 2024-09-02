
import { fetchFilteredBooks } from "@/lib/book-management/books.repository";
import { IBook } from "@/lib/book-management/models/books.model";

export default async function BooksGrid({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
    }) {
  const books: IBook[] = await fetchFilteredBooks(query, currentPage);
  
  return (
    <section className="w-full py-12    bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-8">Search Results</h2>

        {/* Display Books or No Results Message */}
        {books.length > 0 ? (
          <>
            {/* Books Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-4">
                    <h3 className="font-bold underline">{book.title}</h3>
                    <h1 className="italic">{book.publisher}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {book.author}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {" "}
                      genre:{" "}{book.genre}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      isbn:{" "}{book.isbnNo}
                    </p>
                    <p
                      className={`text-sm ${
                        book.availableNumberOfCopies > 0
                          ? "text-black"
                          : "text-red-500"
                      } dark:text-gray-400`}
                    >
                      Book:{" "}
                      {book.availableNumberOfCopies > 0
                        ? "Available"
                        : "Not Available"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-lg text-center text-gray-700 dark:text-gray-300">
            <b> No books found.</b>
          </p>
        )}
      </div>
    </section>
  );
};
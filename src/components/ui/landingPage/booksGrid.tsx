import { fetchFilteredBooks } from "@/lib/book-management/books.repository";
import { IBook } from "@/lib/book-management/models/books.model";
import { Card,} from "@/components/ui/card"; 
import BookCard from "@/components/bookCard";
import { auth } from "../../../../auth";

export default async function BooksGrid({
  query,
  currentPage,
    key,
  sortOrd
}: {
  query: string;
  currentPage: number;
  key?: keyof IBook;
  sortOrd?: string;
}) {
  const books: IBook[] = await fetchFilteredBooks(
    query,
    currentPage,
    key,
    sortOrd
  );
  const session = await auth();
  const uid = session?.user.uId;
  return (
    <section className="w-full py-12 bg-background">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          Search Results
        </h2>

        {books.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} uid={uid} />
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-lg text-center text-muted-foreground font-semibold">
              No books found.
            </p>
          </Card>
        )}
      </div>
    </section>
  );
}

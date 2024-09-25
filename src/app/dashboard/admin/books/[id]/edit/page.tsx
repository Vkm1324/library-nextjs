 import { notFound } from "next/navigation";
import Form from "@/components/ui/dashboard/books/edit-form"; 
import { BookRepository } from "@/lib/book-management/books.repository";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const book = new BookRepository();
  const bookData = await book.getById(+id); 
      if (!bookData) {
        notFound();
      }
  return (
    <main>
      <Form book={bookData}  />
    </main>
  );
}

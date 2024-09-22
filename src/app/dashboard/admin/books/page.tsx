import { Suspense } from "react";
import Pagination from "@/components/ui/landingPage/pagination";
import Search from "@/components/ui/landingPage/search";
import BooksTable from "@/components/ui/dashboard/books/table";
import UsersTableSkeleton from "@/components/ui/skeletons/users-table";
import { CreateBook } from "@/components/ui/dashboard/books/buttons";
import {
  fetchBooksCount,
  fetchFilteredBooks,
} from "@/lib/book-management/books.repository";
import { fetchPendingTransaction } from "@/lib/transaction/transaction.repository";
import { IBook } from "@/lib/book-management/models/books.model";
import { PageTemplate } from "@/components/ui/pageTemplate";

export default async function UserPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    key?: keyof IBook;
    sortOrd?: string;
  };
}) {
  const query = searchParams!.query || "";
  const key = searchParams!.key;
  const sortOrd = searchParams!.sortOrd || "";
  const currentPage = Number(searchParams?.page) || 1;

  const [totalPages, totalBooks, pendingReturnTransactions] = await Promise.all(
    [
      fetchBooksCount(query),
      fetchFilteredBooks(query, currentPage, key, sortOrd),
      fetchPendingTransaction().then((transactions) =>
        transactions.map((book) => book.bookId)
      ),
    ]
  );
  return (
    <main className="flex flex-col">
      <span className="flex flex-row justify-end">
      <CreateBook/>
      </span>
      <PageTemplate 
        totalPages={totalPages}
        fallback={<UsersTableSkeleton />}
        suspenseKey={currentPage}
      >
        <BooksTable
          data={totalBooks}
          pendingReturnTransactions={pendingReturnTransactions}
        />
      </PageTemplate>
    </main>
  );
}
 

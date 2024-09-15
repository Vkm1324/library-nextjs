import { Suspense } from "react";
import Pagination from "@/components/ui/landingPage/pagination"; 
import Search from "@/components/ui/landingPage/search"; 
import BooksTable from "@/components/ui/dashboard/books/table";
import UsersTableSkeleton from "@/components/ui/skeletons/users-table";
import { auth } from "../../../../../auth"; 
import { CreateBook } from "@/components/ui/dashboard/books/buttons";
import { fetchBooksCount, fetchFilteredBooks } from "@/lib/book-management/books.repository";
import { fetchPendingTransaction } from "@/lib/transaction/transaction.repository";

export default async function UserPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await auth();
  const adminUId = session?.user.id!;

  const query = searchParams!.query || "";
  const currentPage = Number(searchParams?.page) || 1; 
const [totalPages, totalBooks, pendingReturnTransactions] = await Promise.all([
  fetchBooksCount(query),
  fetchFilteredBooks(query, currentPage),
  fetchPendingTransaction().then((transactions) =>
    transactions.map((book) => book.bookId)
  ),
]);
  // console.log(pendingReturnTransactions);
  return (
    <main className="flex flex-col ">
      <section className="w-full">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="mt-4 px-0 flex gap-10 md:mt-8">
              <Search placeholder="Search... " />
              <CreateBook />
            </div>
            <Suspense
              key={adminUId + currentPage}
              fallback={<UsersTableSkeleton />}
            >
              <BooksTable
                data={totalBooks}
                pendingReturnTransactions={pendingReturnTransactions}
              />
              +
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

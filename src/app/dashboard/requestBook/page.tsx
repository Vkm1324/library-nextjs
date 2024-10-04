 import Search from "@/components/ui/landingPage/search";
import { Suspense } from "react";
import { fetchBooksCount } from "@/lib/book-management/books.repository";
import Pagination from "@/components/ui/landingPage/pagination";
import BooksGrid from "@/components/ui/landingPage/booksGrid";
 
// UI-Skeletons
import BooksGridSkeleton from "@/components/ui/skeletons/booksGrid";

export default async function BookRequestPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchBooksCount(query);

  return (
    <main className="flex-1">
      <h1 className="text-3xl pl-4 font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
        Welcome to Library...
      </h1>
      <section className="w-full py-12 md:py-24 lg:py-0 xl:py-0">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start space-y-4 text-center">
            {/* Rendering the search client component */}
            <div className="mt-4 px-0 flex items-start justify-between gap-2 md:mt-8">
              <Search placeholder="Search.. Enter title " />
            </div>
            <p>Click on a book to make a request.</p>
            {/* Rendering the Books Table component */}
            {
              <Suspense
                key={query + currentPage}
                fallback={<BooksGridSkeleton />}
              >
                <BooksGrid query={query} currentPage={currentPage} />
              </Suspense>
            }
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

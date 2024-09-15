import Table from "@/components/ui/dashboard/transaction/table";
import { fetchFilteredTransaction, fetchTransactionPageCount } from "@/lib/transaction/transaction.repository";
import { Suspense } from "react";
import Pagination from "@/components/ui/landingPage/pagination";
import TransactionTableSkeleton from "@/components/ui/skeletons/TransactionTable";
import Search from "@/components/ui/landingPage/search";

export default async function TransactionPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
  }) {
    const currentPage = Number(searchParams?.page) || 1;
    const query = searchParams?.query || "";
    const totalPages = await fetchTransactionPageCount(query);
    const transactions = await fetchFilteredTransaction(query, currentPage);
  return (
    <main>
      <section className="w-full py-12 md:py-24 lg:py-0 xl:py-0">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start space-y-4 text-center">
            {/* Rendering the search client component */}
            <div className="mt-4 px-0 flex items-start justify-between gap-2 md:mt-8">
              <Search placeholder="Search... " />
            </div>
            {/* Rendering the Books Table component */}
            {
              <Suspense
                key={query + currentPage}
                fallback={<TransactionTableSkeleton />}
              >
                <Table data={transactions} />
              </Suspense>
            }
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          </div>
        </div>
      </section>
      ;
    </main>
  );
}

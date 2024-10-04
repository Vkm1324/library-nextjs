import Table from "@/components/ui/dashboard/transaction/table";
import {
  fetchFilteredTransaction,fetchFilteredTransactionPageCount,
  lateFeesCalculator,
} from "@/lib/transaction/transaction.repository";
import { Suspense } from "react";
import Pagination from "@/components/ui/landingPage/pagination";
import TransactionTableSkeleton from "@/components/ui/skeletons/TransactionTable";
import Search from "@/components/ui/landingPage/search";
import { PageTemplate } from "@/components/ui/pageTemplate"; 
import { dueList } from "@/lib/actions";


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
  const [totalPages, transactions] = await Promise.all([
    fetchFilteredTransactionPageCount(undefined,query),
    fetchFilteredTransaction(currentPage),
  ]);
  return (
    <main>
      <PageTemplate
        totalPages={totalPages}
        fallback={<TransactionTableSkeleton />}
        suspenseKey={query + currentPage}
      >
        <Table data={
          transactions
        } />
      </PageTemplate>
    </main>
  );
}

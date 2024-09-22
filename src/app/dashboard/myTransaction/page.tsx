import {
  fetchFilteredTransaction,
  fetchFilteredTransactionPageCount,
  lateFeesCalculator,
} from "@/lib/transaction/transaction.repository";
import { Suspense } from "react";
import Pagination from "@/components/ui/landingPage/pagination";
import TransactionTableSkeleton from "@/components/ui/skeletons/TransactionTable";
import { auth } from "../../../../auth";
import MyTransactionTable from "@/components/ui/dashboard/profile-menu/myTransaction/table";
import Search from "@/components/ui/landingPage/search";
import { PageTemplate } from "@/components/ui/pageTemplate";

export default async function MyTransactionPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    key?: string;
    sortOrd?: string;
  };
}) {
  const session = await auth();
  const uId = session?.user.uId!;
  const currentPage = Number(searchParams?.page) || 1;
  const query = searchParams?.query || "";
  const key = searchParams?.key || "";
  const sortOrd = searchParams?.sortOrd || "";
  const totalPages = await fetchFilteredTransactionPageCount(uId, query);
  const fetchedTransactions = await fetchFilteredTransaction(
    currentPage,
    uId,
    query
  );

  const transactions = fetchedTransactions.map((transaction) => ({
    ...transaction,
    lateFees: lateFeesCalculator(transaction.dueDate),
  }));

  return (
    <main>
      <PageTemplate
        totalPages={totalPages}
        fallback={<TransactionTableSkeleton />}
        suspenseKey={uId + currentPage}
      >
        <MyTransactionTable data={transactions} />
      </PageTemplate>
    </main>
  );
}

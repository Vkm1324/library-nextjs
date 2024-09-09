import Table from "@/components/ui/dashboard/profile-menu/table";
import { fetchTransactionPageCount } from "@/lib/transaction/transaction.repository";
import { auth } from "../../../../auth";
import { Suspense } from "react";
import Pagination from "@/components/ui/landingPage/pagination";
import TransactionTableSkeleton from "@/components/ui/skeletons/TransactionTable";

export default async function MyRequestsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await auth();
  const uId = session?.user.id!;
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchTransactionPageCount(uId);
  return (
    <>
      {
        <Suspense
          key={uId + currentPage}
          fallback={<TransactionTableSkeleton />}
        >
          <Table query={uId} currentPage={currentPage} />
        </Suspense>
      }
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}

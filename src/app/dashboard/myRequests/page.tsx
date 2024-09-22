import Table from "@/components/ui/dashboard/profile-menu/myRequests/table";
import { auth } from "../../../../auth";
import { Suspense } from "react";
import Pagination from "@/components/ui/landingPage/pagination";
import TransactionTableSkeleton from "@/components/ui/skeletons/TransactionTable";
import {
  fetchFilteredBookRequest,
  fetchFilteredBookRequestPageCount,
} from "@/lib/book-requests/book-request.repository";
import Search from "@/components/ui/landingPage/search";
import { PageTemplate } from "@/components/ui/pageTemplate";

export default async function MyRequestsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    key?: string;
    sortOrd?:string;
  };
}) {
  const session = await auth();
  const uId = session?.user.uId!;
  const currentPage = Number(searchParams?.page) || 1;
  
  const query =(searchParams?.query) || "";
  const key=(searchParams?.key) || "";
  const sortOrd =(searchParams?.sortOrd) || "";
  const totalPages = await fetchFilteredBookRequestPageCount(uId, query);
    const bookRequests = await fetchFilteredBookRequest(
      currentPage,
      +uId,
      query
    );
  return (
    <main>
      <PageTemplate
        totalPages={totalPages}
        fallback={<TransactionTableSkeleton />}
        suspenseKey={uId + currentPage}
      >
        <Table data={bookRequests} />
      </PageTemplate>
      ;
    </main>
  );
}


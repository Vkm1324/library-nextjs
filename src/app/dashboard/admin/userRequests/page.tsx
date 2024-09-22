import { Suspense } from "react";
import Pagination from "@/components/ui/landingPage/pagination"; 
import {
  BookRequestRepository,
  fetchFilteredBookRequest,
  fetchFilteredBookRequestPageCount,
} from "@/lib/book-requests/book-request.repository";
import BookRequestTable from "@/components/ui/dashboard/user-request/table";
import Search from "@/components/ui/landingPage/search";
import UsersBookRequestTableSkeleton from "@/components/ui/skeletons/users-request";
import { PageTemplate } from "@/components/ui/pageTemplate";

export default async function UserRequestsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {

  const query = searchParams!.query || "";
  const currentPage = Number(searchParams?.page) || 1; 
  const totalPages = await fetchFilteredBookRequestPageCount(undefined, query);
    const bookRequests = await fetchFilteredBookRequest(
      currentPage,
      undefined,
      query,
    );
  
  return (
    <main>
      <PageTemplate
        totalPages={totalPages}
        fallback={<UsersBookRequestTableSkeleton />}
        suspenseKey={query + currentPage}
      >
        <BookRequestTable data={bookRequests} />
      </PageTemplate>
      ;
    </main>
  );
}

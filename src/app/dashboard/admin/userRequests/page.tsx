import { Suspense } from "react";
import Pagination from "@/components/ui/landingPage/pagination";
import { auth } from "../../../../../auth";
import { BookRequestRepository } from "@/lib/book-requests/book-request.repository";
import BookRequestTable from "@/components/ui/dashboard/user-request/table";
import Search from "@/components/ui/landingPage/search";
import UsersBookRequestTableSkeleton from "@/components/ui/skeletons/users-request";

export default async function UserRequestsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await auth();
  const uId = session?.user.id!;

  const query = searchParams!.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const bookReq = new BookRequestRepository();
  const totalPages = await bookReq.fetchAllUserRequestsPageCount(query);
  return (
    <div className="flex flex-col items-start space-y-4 text-center">
      <div className="mt-4 px-0 flex items-start justify-between gap-2 md:mt-8">
        <Search placeholder="Search... " />
      </div>
      {
        <Suspense
          key={uId + currentPage}
          fallback={<UsersBookRequestTableSkeleton />}
        >
          <BookRequestTable query={query} currentPage={currentPage} />
        </Suspense>
      }
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

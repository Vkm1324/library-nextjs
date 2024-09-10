import { Suspense } from "react";
import Pagination from "@/components/ui/landingPage/pagination";
import TransactionTableSkeleton from "@/components/ui/skeletons/TransactionTable";
import Search from "@/components/ui/landingPage/search";
import { UserRepository } from "@/lib/user-management/user.repository";
import UsersTable from "@/components/ui/dashboard/users/table";
import UsersTableSkeleton from "@/components/ui/skeletons/users-table";
import { auth } from "../../../../../auth";

export default async function UserPage({
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
  const users = new UserRepository();
  const totalPages = await users.fetchAllUsersPageCount(query);
  return (
    <div className="flex flex-col items-start space-y-4 text-center">
      <div className="mt-4 px-0 flex items-start justify-between gap-2 md:mt-8">
        <Search placeholder="Search...  " />
      </div>
      {
        <Suspense key={uId + currentPage} fallback={<UsersTableSkeleton  />}>
          <UsersTable query={query} currentPage={currentPage} />
        </Suspense>
      }
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

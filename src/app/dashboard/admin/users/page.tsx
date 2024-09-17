import { Suspense } from "react";
import Pagination from "@/components/ui/landingPage/pagination"; 
import Search from "@/components/ui/landingPage/search";
import { UserRepository } from "@/lib/user-management/user.repository";
import UsersTable from "@/components/ui/dashboard/users/table";
import UsersTableSkeleton from "@/components/ui/skeletons/users-table";
import { auth } from "../../../../../auth"; 
import { CreateUser } from "@/components/ui/dashboard/users/buttons";

export default async function UserPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await auth();
  const adminUId = session?.user.uId!;

  const query = searchParams!.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const users = new UserRepository();
  const totalPages = await users.fetchAllUsersPageCount(query);
  const totalUsers = await users.fetchFilteredUsers(query, currentPage);
  return (
    <main className="flex flex-col ">
      <section className="w-full">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="mt-4 px-0 flex gap-10 md:mt-8">
              <Search placeholder="Search... " />
              <CreateUser />
            </div>
            <Suspense
              key={adminUId + currentPage}
              fallback={<UsersTableSkeleton />}
            >
              <UsersTable adminUId={adminUId} data={totalUsers} />+
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

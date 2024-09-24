import { UserRepository } from "@/lib/user-management/user.repository";
import UsersTable from "@/components/ui/dashboard/users/table";
import UsersTableSkeleton from "@/components/ui/skeletons/users-table";
import { auth } from "../../../../../auth";
import { CreateUser } from "@/components/ui/dashboard/users/buttons";
import { PageTemplate } from "@/components/ui/pageTemplate";

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
      <span className=" flex flex-row  justify-center  ">
        <CreateUser />
      </span>
      <PageTemplate
        totalPages={totalPages}
        fallback={<UsersTableSkeleton />}
        suspenseKey={adminUId + currentPage}
      >
        <UsersTable adminUId={adminUId} data={totalUsers} />
      </PageTemplate>
    </main>
  );
}

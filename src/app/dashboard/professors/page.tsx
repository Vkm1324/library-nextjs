 import UsersTableSkeleton from "@/components/ui/skeletons/users-table"; 
import {
  fetchBooksCount,
  fetchFilteredBooks,
} from "@/lib/book-management/books.repository"; 
import { PageTemplate } from "@/components/ui/pageTemplate";
import MeetingsListPage from "./table";
import { fetchFilteredprofessors } from "@/lib/professors/professors.repsitory";
import { IProfessor } from "@/lib/professors/models/model";
 

export default async function UserPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    key?: keyof IProfessor;
    sortOrd?: string;
  };
  }) {
  const query = searchParams!.query || "";
  const key = searchParams!.key;
  const sortOrd = searchParams!.sortOrd || "";
  const currentPage = Number(searchParams?.page) || 1;
  const [totalPages, totalProfessors] = await Promise.all([
    fetchBooksCount(query),
    fetchFilteredprofessors(query, currentPage, key),
  ]);
  return (
    <main className="flex flex-col">
      <span className="flex flex-row justify-end">
      </span>
      <PageTemplate
        totalPages={1}
        fallback={<UsersTableSkeleton />}
        suspenseKey={currentPage}
      >
        <MeetingsListPage data={totalProfessors}></MeetingsListPage>
      </PageTemplate>
    </main>
  );
}



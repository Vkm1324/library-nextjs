export function CreateBook() {
  return (
    <Link
      href="/dashboard/admin/books/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Books</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateBook({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/admin/books/${id}/edit`}
      className="flex items-center gap-2 rounded-md border p-2 bg-blue-500 text-white hover:bg-blue-600"
    >
      <PencilIcon className="w-5" />
      <span>Edit</span>
    </Link>
  );
}

import { deleteBook } from "@/lib/actions";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

export function DeleteBook({ id }: { id: number }) {
  const deleteBookWithId = deleteBook.bind(null, id);
  return (
    <form action={deleteBookWithId}>
      <button
        className="flex items-center gap-2 rounded-md border p-2 bg-red-500 text-white hover:bg-red-600"
        type="submit"
      >
        <TrashIcon className="w-5" />
        <span>Delete</span>
      </button>
    </form>
  );
}

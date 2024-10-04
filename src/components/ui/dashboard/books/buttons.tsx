"use client";
export function UpdateBook({ id, title }: { id: number; title: string }) {
  return (
    <EditAlertDialog
      id={id}
      entity="Book"
      editPath="/dashboard/admin/books"
      description={`This action will take you to the edit page for the "${title}" book. Any unsaved changes on the current page will be lost.`}
    />
  );
}

export function CreateBook() {
  return (
    <Link
      href="/dashboard/admin/books/create"
      className=" max-w-fit flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Books</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}


import { deleteBook } from "@/lib/actions";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { EditAlertDialog } from "../../alerts/edit-alert";

// export function DeleteBook({ id }: { id: number }) {
//   const deleteBookWithId = deleteBook.bind(null, id);
//   return (
//     <form action={  deleteBookWithId}>
//       <button
//         className="flex items-center gap-2 rounded-md border p-2 bg-red-500 text-white hover:bg-red-600"
//         type="submit"
//       >
//         <TrashIcon className="w-5" />
//         <span>Delete</span>
//       </button>
//     </form>
//   );
// }

export function DeleteBook({ id }: { id: number }) {
  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission

    const response = await deleteBook(id); // Call your deleteBook function with the id
    if (response.message) {
      console.log(response.message); // Handle the response message as needed
    }
  };

  return (
    <form onSubmit={handleDelete}>
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
"use client"
export function CreateUser() {
  return (
    <Link
      href="/dashboard/admin/users/create"
      className="max-w-fit flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add User</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateUser({ id, name }: { id: number; name: string }) {
  return (
    <EditAlertDialog
      id={id}
      entity="User"
      editPath="/dashboard/admin/users"
      description={`This action will take you to the edit page for the "${name}". Any unsaved changes on the current page will be lost.`}
    />
  );
}

import { deleteUser } from "@/lib/actions";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { EditAlertDialog } from "../../alerts/edit-alert";

// export function DeleteUser({ id }: { id: number }) {
//   const deleteUserWithId = deleteUser.bind(null, id);
//   return (
//     <form action={deleteUserWithId}>
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

export function DeleteUser({ id }: { id: number }) {
  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission

    const response = await deleteUser(id); // Call your deleteUser function with the id
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
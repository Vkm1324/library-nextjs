"use client";

import { UpdateUser, DeleteUser } from "./buttons";
import { GenericColumn } from "../../table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { IUser } from "@/lib/user-management/models/user.model";
import { getRoleName } from "@/middleware";

// Define columns for DataTable
const userColumns: GenericColumn<IUser>[] = [
  {
    accessorKey: "id",
    header: "User ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
{
  accessorKey: "role",
  header: "Role",
  cell: (info) => <span>{getRoleName(info.row.original.role)}</span>, 
},
  {
    header: "Actions",
    cell: (info) => (
      <div className="flex justify-end gap-3">
        <UpdateUser id={info.row.original.id} />
        {info.row.original.id !== info.row.original.adminUId && (
          <DeleteUser id={info.row.original.id} />
        )}
      </div>
    ),
    accessorKey: "image"
  },
];

export default function UsersTable({
  data,
  adminUId,
}: {
  data: IUser[];
  adminUId: number;
}) {
  // Add adminUId to each user in the formatted data
  const formattedData = data.map((user) => ({
    ...user,
    adminUId, // Adding adminUId to each user for conditional rendering
  }));

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {formattedData.map((user) => (
              <div
                key={user.id}
                className="mb-2 w-full rounded-md bg-white p-4 shadow-md"
              >
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <p className="text-sm text-gray-500">{user.name}</p>
                    <p className="ml-4 text-sm text-gray-500">
                      {getRoleName(user.role)}
                    </p>
                  </div>
                  <div className="flex justify-start gap-3 pt-4">
                    <UpdateUser id={user.id} />
                    {user.id !== adminUId && <DeleteUser id={user.id} />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view using DataTable */}
          <DataTable
            columns={userColumns}
            data={formattedData}
            initialSortBy="id" // Default sorting column
          />
        </div>
      </div>
    </div>
  );
}

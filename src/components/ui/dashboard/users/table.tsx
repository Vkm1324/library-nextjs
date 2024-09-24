"use client";

import { UpdateUser, DeleteUser } from "./buttons";
import { GenericColumn } from "../../table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { IUser } from "@/lib/user-management/models/user.model";
import { getRole } from "@/middleware";
import Image from "next/image";
import { UserRound } from "lucide-react";
import clsx from "clsx";

interface IUserTable extends IUser {
  adminUId: number; // Adding adminUId for table comparison
}
// Define columns for DataTable
const userColumns: GenericColumn<IUserTable>[] = [
  {
    accessorKey: "id",
    header: "User Id",
  },

  {
    header: "User Image",
    render: (user: IUser) => {
      return user.image ? (
        <Image
          className="rounded-full"
          src={user.image}
          height={40}
          width={40}
          alt={""}
        ></Image>
      ) : (
        <span>
          {" "}
          <UserRound className=" rounded-sm"></UserRound>{" "}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "User Name",
  },

  {
    accessorKey: "phoneNum",
    header: "Phone Number",
    render: (user: IUser) => (
      <span
        className={clsx({
          "text-red-500": !user.phoneNum,
        })}
      >
        {user.phoneNum ? user.phoneNum : "N / A"}
      </span>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    render: (user: IUser) => (
      <span
        className={clsx({
          "text-red-500": !user.address,
        })}
      >
        {user.address ? user.address : "N / A"}
      </span>
    ),
  },

  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    render: (user: IUserTable) => <span>{getRole(user.role)}</span>,
  },
  {
    header: "Actions",
    render: (user: IUserTable) => (
      <div className="flex justify-start gap-3">
        <UpdateUser id={user.id} />
        {user.id !== user.adminUId && <DeleteUser id={user.id} />}
      </div>
    ),
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
                      {getRole(user.role)}
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
            initialSortKey="id" // Default sorting column
          />
        </div>
      </div>
    </div>
  );
}

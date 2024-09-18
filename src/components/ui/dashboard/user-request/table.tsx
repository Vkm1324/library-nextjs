"use client";

import { formatDateToLocal } from "@/lib/utils";
import { ApproveRequest, RejectRequest } from "../user-request/buttons";
import { GenericColumn } from "../../table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { IBookResquest } from "@/lib/book-requests/models/books-request.model";

const bookRequestsColumns: GenericColumn<IBookResquest>[] = [
  {
    accessorKey: "id",
    header: "Request ID",
  },
  {
    accessorKey: "bookId",
    header: "Book Id",
  },
  {
    accessorKey: "bookTitle",
    header: "Book Title ",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "username",
    header: "User Name",
  },
  {
    accessorKey: "requestDate",
    header: "Request Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <span
        className={`${
          info.row.original.status === "approved"
            ? "text-green-800"
            : info.row.original.status === "rejected"
            ? "text-red-800"
            : "text-yellow-800"
        }`}
      >
        {info.row.original.status}
      </span>
    ),
  },
  {
    header: "Action",
    cell: (info) => (
      <div className="flex justify-end gap-3">
        {info.row.original.status === "pending" && (
          <>
            <ApproveRequest id={info.row.original.id} />
            <RejectRequest id={info.row.original.id} />
          </>
        )}
      </div>
    ),
    accessorKey: "bookTitle"
  },
];

export default function BookRequestTable({ data }: { data: IBookResquest[] }) {
  const formattedData = data.map((request) => ({
    ...request,
    requestDate: formatDateToLocal(request.requestDate.toDateString()), // Format the request date
  }));

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {formattedData?.map((request) => (
              <div
                key={request.id}
                className="mb-4 w-full rounded-md bg-white p-4 shadow-md"
              >
                {/* First row with Request ID, User ID, and Book ID */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      Request ID:
                    </p>
                    <p className="text-sm text-gray-500">{request.id}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      User ID:
                    </p>
                    <p className="text-sm text-gray-500">{request.userId}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      Book ID:
                    </p>
                    <p className="text-sm text-gray-500">{request.bookId}</p>
                  </div>
                </div>

                {/* Second row with Approve and Reject buttons */}
                <div className="flex justify-between gap-4 ">
                  { request.status !=="pending"? 
                    <><ApproveRequest id={request.id} /><RejectRequest id={request.id} /></>
                    :" "
                  }
                </div>

                {/* Status */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">Status:</p>
                  <p
                    className={`text-sm 
                      ${
                        request.status === "approved"
                          ? "text-green-800"
                          : request.status === "rejected"
                          ? "text-red-800"
                          : "text-yellow-800"
                      }`}
                  >
                    {request.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view using DataTable */}
          <DataTable columns={bookRequestsColumns} data={formattedData}  />
        </div>
      </div>
    </div>
  );
}

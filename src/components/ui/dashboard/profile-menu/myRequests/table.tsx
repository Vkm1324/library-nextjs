"use client";

import { GenericColumn } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { IBookResquestTable } from "@/lib/book-requests/models/books-request.model";
import { formatDateToLocal } from "@/lib/utils";
import clsx from "clsx";


const bookRequestColumns: GenericColumn<IBookResquestTable>[] = [
  {
    accessorKey: "id",
    header: "Request ID",
  },
  {
    header: "Book",
    render: (request: IBookResquestTable) => (
      <span
        className={clsx({
          "text-red-500": !request.title,
        })}
      >
        {request.title ? request.title : "Deleted Book"}
      </span>
    ),
  },
  {
    accessorKey: "requestDate",
    header: "Request Date",
    render: (request: IBookResquestTable) => (
      <span>{formatDateToLocal(request.requestDate.toDateString())}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export default function BookRequestTable({ data }: { data: IBookResquestTable[] }) {
  const formattedData = data.map((request) => ({
    ...request,
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
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <p className="text-sm text-gray-500 mr-1">{request.bookId}</p>
                  <p className="text-sm text-gray-500">{request.title}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <p className="text-sm text-gray-500">{formatDateToLocal(request.requestDate.toDateString())}</p>
                  <p className="text-xl font-medium">{request.status}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view using DataTable */}
          <DataTable columns={bookRequestColumns} data={formattedData} />
        </div>
      </div>
    </div>
  );
}

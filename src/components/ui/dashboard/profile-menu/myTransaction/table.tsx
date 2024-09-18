"use client";

import { GenericColumn } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { ITransaction } from "@/lib/transaction/model/transaction.model";
import { formatDateToLocal } from "@/lib/utils"; 

const transactionColumns: GenericColumn<ITransaction>[] = [
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
  },
  {
    accessorKey: "bookTitle",
    header: "Book",
  },
  {
    accessorKey: "lateFees",
    header: "Late Fees",
  },
  {
    accessorKey: "issueddate",
    header: "Issued Date",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "returnDate",
    header: "Return Date",
  },
  {
    accessorKey: "transactionType",
    header: "Status",
    cell: ({ row }) =>
      row.original.transactionType === "borrow" ? (
        <span className="text-yellow-500">Pending</span>
      ) : row.original.returnDate > row.original.dueDate ? (
        <span className="text-red-500">Overdue</span>
      ) : (
        <span className="text-green-500">Completed</span>
      ),
  },
];


interface MyTransactionTableProps {
  data: ITransaction[];
}

export default function MyTransactionTable({
  data,
}: MyTransactionTableProps) {
  const formattedData = data.map((transaction) => ({
    ...transaction,
    issueddate: formatDateToLocal(transaction.issueddate.toDateString()),
    dueDate: formatDateToLocal(transaction.dueDate.toDateString()),
    returnDate: transaction.returnDate
      ? formatDateToLocal(transaction.returnDate.toDateString())
      : "N/A",
  }));

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {formattedData?.map((transaction) => (
              <div
                key={transaction.transactionId}
                className="mb-4 w-full rounded-lg bg-white shadow-md p-4"
              >
                <div className="flex flex-col space-y-2 border-b pb-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      Transaction ID
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.transactionId}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      Book Title
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.bookTitle}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      Due Date
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.dueDate}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      Return Date
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.returnDate}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <p className="text-sm text-gray-500">
                    {transaction.transactionType === "borrow"
                      ? "Pending"
                      : transaction.status}
                  </p>
                </div>
                <div className="flex justify-between pt-2">
                  <p className="text-sm font-medium text-gray-700">Late Fees</p>
                  <p className="text-sm text-gray-500">
                    {transaction.lateFees}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view using DataTable */}
          <DataTable
            columns={(transactionColumns)}
            data={formattedData} 
          />
        </div>
      </div>
    </div>
  );
}

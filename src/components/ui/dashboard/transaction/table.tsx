"use client";

import { formatDateToLocal } from "@/lib/utils";
import { ReturnBookButton } from "./buttons";
import { ITransaction } from "@/lib/transaction/model/transaction.model";
import { DataTable } from "@/components/ui/table/data-table"; // Import DataTable for desktop view

interface MyTransactionTableProps {
  data: ITransaction[];
}

const transactionColumns = [
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
  },
  {
    accessorKey: "bookId",
    header: "Book ID",
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
    cell: ({ row }) => {
      const transaction = row.original;
      return transaction.transactionType === "borrow" ? (
        <span className="text-yellow-500">Pending</span>
      ) : transaction.returnDate > transaction.dueDate ? (
        <span className="text-red-500">Overdue</span>
      ) : (
        <span className="text-green-500">Completed</span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const transaction = row.original;
      return transaction.transactionType === "borrow" ? (
        <ReturnBookButton id={transaction.transactionId} />
      ) : null;
    },
  },
];

export default function TransactionTable({ data }: MyTransactionTableProps) {
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
            {formattedData.map((transaction) => (
              <div
                key={transaction.transactionId}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <p className="text-sm text-gray-500">{transaction.bookId}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.lateFees}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.transactionType === "borrow"
                      ? "Pending"
                      : transaction.returnDate > transaction.dueDate
                      ? "Overdue"
                      : "Completed"}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <p className="text-xl font-medium">
                    {formatDateToLocal(transaction.issueddate)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateToLocal(transaction.dueDate)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.returnDate === "N/A"
                      ? "N/A"
                      : formatDateToLocal(transaction.returnDate)}
                  </p>
                </div>
                {transaction.transactionType === "borrow" && (
                  <div className="mt-4">
                    <ReturnBookButton id={transaction.transactionId} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop view */}
          <DataTable
            columns={transactionColumns}
            data={formattedData}
            initialSortBy="status"
          />
        </div>
      </div>
    </div>
  );
}

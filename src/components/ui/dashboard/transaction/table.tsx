"use client";
import { ITransaction } from "@/lib/transaction/model/transaction.model";
import { CellContext } from "@tanstack/react-table";
import { ReturnBookButton } from "./buttons";
import { formatDateToLocal } from "@/lib/utils";
import { DataTable } from "../../table/data-table";

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
    cell: (info: CellContext<ITransaction, unknown>) => {
      const issuedDate = info.row.original.issueddate;
      return <span>{formatDateToLocal(issuedDate.toDateString())}</span>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: (info: CellContext<ITransaction, unknown>) => {
      const dueDate = info.row.original.dueDate;
      return <span>{formatDateToLocal(dueDate.toDateString())}</span>;
    },
  },
  {
    accessorKey: "returnDate",
    header: "Return Date",
    cell: (info: CellContext<ITransaction, unknown>) => {
      const returnDate = info.row.original.returnDate;
      return (
        <span>
          {returnDate ? formatDateToLocal(returnDate.toDateString()) : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info: CellContext<ITransaction, unknown>) => {
      const { transactionType, returnDate, dueDate } = info.row.original;
      const status =
        transactionType === "borrow"
          ? "Pending"
          : returnDate && returnDate > dueDate
          ? "Overdue"
          : "Completed";

      const statusClass =
        transactionType === "borrow"
          ? "text-yellow-800"
          : returnDate && returnDate > dueDate
          ? "text-red-800"
          : "text-green-800";

      return <span className={statusClass}>{status}</span>;
    },
  },
  {
    header: "Action",
    cell: (info: CellContext<ITransaction, unknown>) => {
      const { transactionType, transactionId } = info.row.original;
      return (
        <div className="flex justify-end gap-3">
          {transactionType === "borrow" && (
            <ReturnBookButton id={transactionId} />
          )}
        </div>
      );
    },
    accessorKey: "", // Empty because it's a custom action column
  },
];

interface MyTransactionTableProps {
  data: ITransaction[];
}

export default function TransactionTable({ data }: MyTransactionTableProps) {
  const formattedData = data.map((transaction) => ({
    ...transaction,
    // Keep the original dates for logic, format them only when rendering
  }));

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {data.map((transaction) => (
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
                      : transaction.returnDate &&
                        transaction.returnDate > transaction.dueDate
                      ? "Overdue"
                      : "Completed"}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <p className="text-xl font-medium">
                    {formatDateToLocal(transaction.issueddate.toDateString())}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateToLocal(transaction.dueDate.toDateString())}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.returnDate
                      ? formatDateToLocal(transaction.returnDate.toDateString())
                      : "N/A"}
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
            data={data} 
          />
        </div>
      </div>
    </div>
  );
}

"use client";
import { ITransaction } from "@/lib/transaction/model/transaction.model";
import { ReturnBookButton } from "./buttons";
import { formatDateToLocal } from "@/lib/utils";
import { DataTable } from "../../table/data-table";
import { GenericColumn } from "../../table/columns";

interface ITransactionTable extends ITransaction {
  userName: string;
  title: string;
}

const createTransactionColumns = (): GenericColumn<ITransactionTable>[] => [
  {
    accessorKey: "transactionId",
    header: "Transaction Id",
  },
  // {
  //   accessorKey: "bookId",
  //   header: "Book Id",
  // },
  {
    header: "Book Title",
    render: (transaction: ITransactionTable) => {
      return <span>{transaction.title}</span>;
    },
  },
  // {
  //   accessorKey: "userId",
  //   header: "User ID",
  // },
  {
    header: "User Name",
    render: (transaction: ITransactionTable) => {
      return <span>{transaction.userName}</span>;
    },
  },
  {
    accessorKey: "lateFees",
    header: "Late Fees",
  },
  {
    header: "Issued Date",
    render: (transaction: ITransaction) => {
      const issuedDate = transaction.issueddate;
      return <span>{formatDateToLocal(issuedDate.toDateString())}</span>;
    },
  },
  {
    header: "Due Date",
    render: (transaction: ITransaction) => {
      const dueDate = transaction.dueDate;
      return <span>{formatDateToLocal(dueDate.toDateString())}</span>;
    },
  },
  {
    header: "Return Date",
    render: (transaction: ITransaction) => {
      const returnDate = transaction.returnDate;
      return (
        <span>
          {returnDate ? formatDateToLocal(returnDate.toDateString()) : "N/A"}
        </span>
      );
    },
  },
  {
    header: "Status",
    accessorKey:"status",
    render: (transaction: ITransaction) => {
      const statusClass =
        transaction.status === "overdue"
          ? "text-red-800"
          : transaction.status === "completed"
          ? "text-green-800"
          : "text-yellow-800";

      return <span className={statusClass}>{transaction.status}</span>;
    },
  },
  {
    header: "Actions",
    render: (transaction: ITransaction) => {
      const { transactionType, transactionId } = transaction;
      return (
        <div className="flex justify-end gap-3">
          {transactionType === "borrow" && (
            <ReturnBookButton id={transactionId} />
          )}
        </div>
      );
    },
  },
];

interface MyTransactionTableProps {
  data: ITransactionTable[];
}

export default function TransactionTable({ data }: MyTransactionTableProps) {
  const formattedData = data.map((transaction) => ({
    ...transaction,
    // Keeping the original dates for logic, format them only when rendering
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
            columns={createTransactionColumns()}
            data={formattedData}
          />
        </div>
      </div>
    </div>
  );
}

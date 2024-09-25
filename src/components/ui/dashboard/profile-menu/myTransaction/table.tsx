"use client";

import { GenericColumn } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { ITransaction, ITransactionTable } from "@/lib/transaction/model/transaction.model"; 
import { formatDateToLocal } from "@/lib/utils";
import clsx from "clsx";
import { TranslatedLabel } from "../myRequests/lalbelWrapper";
 
interface MyTransactionTable
  extends ITransaction {
  title: string;
  userName: string;
  
}

const transactionColumns: GenericColumn<MyTransactionTable>[] = [
  {
    accessorKey: "transactionId",
    header: "Transaction Id",
  },
  {
    header: "Book Id",
    accessorKey: "bookId",
  },
  {
    header: "Book Title",
    render: (transaction: ITransactionTable) => (
      <span
        className={clsx({
          "text-red-500": !transaction.title,
        })}
      >
        {transaction.title ? (
          transaction.title
        ) : (
          <TranslatedLabel nameSpace={"TableData"} value={"Deleted Book"} />
        )}
      </span>
    ),
  },
  {
    accessorKey: "lateFees",
    header: "Late Fees",
  },
  {
    accessorKey: "issueddate",
    header: "Issued Date",
    render: (transaction: MyTransactionTable) => (
      <span>{formatDateToLocal(transaction.issueddate.toString())}</span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    render: (transaction: MyTransactionTable) => (
      <span>{formatDateToLocal(transaction.dueDate.toString())}</span>
    ),
  },
  {
    accessorKey: "returnDate",
    header: "Return Date",
    render: (transaction: MyTransactionTable) => (
      <span>
        {transaction.returnDate ? (
          formatDateToLocal(transaction.returnDate.toString())
        ) : (
          <TranslatedLabel nameSpace={"TableData"} value={"N / A"} />
        )}
      </span>
    ),
  },
  {
    accessorKey: "transactionType",
    header: "Status",
    render: (transaction: MyTransactionTable) =>
      transaction.transactionType === "borrow" ? (
        <span className="text-yellow-500">
          <TranslatedLabel nameSpace={"TableData"} value={"Not Returned"} />
        </span>
      ) : new Date(transaction.returnDate) > new Date(transaction.dueDate) ? (
        <span className="text-red-500">
          <TranslatedLabel nameSpace={"TableData"} value={"Overdue"} />
        </span>
      ) : (
        <span className="text-green-500">
          <TranslatedLabel
            nameSpace={"TableData"}
            value={"Completed"}
          />
        </span>
      ),
  },
];

interface MyTransactionTableProps {
  data: MyTransactionTable[];
}

export default function MyTransactionTable({ data }: MyTransactionTableProps) {
  const formattedData = data ? data.map((transaction) => ({
    ...transaction,
    issueddate: formatDateToLocal(transaction.issueddate.toString()),
    dueDate: formatDateToLocal(transaction.dueDate.toString()),
    returnDate: transaction.returnDate
      ? formatDateToLocal(transaction.returnDate.toString())
      : "N/A",
  })) : null;

  return (
    <div className="mt-6 flow-root min-w-full">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg min-w-full bg-gray-50 p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden max-w-[375px]">
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
                    <p className="text-sm font-medium text-gray-700">Title</p>
                    <p className="text-sm text-gray-500 truncate max-w-[150px] pl-2">
                      {transaction.title}
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
                  <p
                    className={clsx("text-sm", {
                      "text-yellow-500":
                        transaction.transactionType === "borrow",
                      "text-red-500":
                        new Date(transaction.returnDate) >
                        new Date(transaction.dueDate),
                      "text-green-500":
                        !(transaction.transactionType === "borrow") &&
                        !(
                          new Date(transaction.returnDate) >
                          new Date(transaction.dueDate)
                        ),
                    })}
                  >
                    {transaction.transactionType === "borrow"
                      ? "Pending"
                      : new Date(transaction.returnDate) >
                        new Date(transaction.dueDate)
                      ? "Overdue"
                      : "Completed"}
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
          <DataTable columns={transactionColumns} data={data} />
        </div>
      </div>
    </div>
  );
}

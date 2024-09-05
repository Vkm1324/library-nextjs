import { formatDateToLocal } from "@/lib/utils";
import { fetchFilteredTransaction } from "@/lib/transaction/transaction.repository";

export default async function TransactionTable({
  query,
  currentPage,
}: {
  query: number;
  currentPage: number;
}) {
  const transactions = await fetchFilteredTransaction(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {transactions?.map((transaction) => (
              <div
                key={transaction.transactionId}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <p className="text-sm text-gray-500">{transaction.bookId}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.lateFees}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.status}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.transactionType}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <p className="text-xl font-medium">
                    {formatDateToLocal(transaction.issueddate.toDateString())}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateToLocal(transaction.dueDate.toDateString())}
                  </p>
                  <p>
                    {formatDateToLocal(transaction.returnDate.toDateString())}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Transaction ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Book ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Late Fees
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Transaction Type
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Issued Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Due Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Return Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {transactions?.map((transaction) => (
                <tr
                  key={transaction.transactionId}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {transaction.transactionId}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {transaction.bookId}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {transaction.lateFees}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {transaction.transactionType}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(transaction.issueddate.toDateString())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(transaction.dueDate.toDateString())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(transaction.returnDate.toDateString())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {transaction.status}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {/* <div className="flex justify-end gap-3"> */}
                      {/* <UpdateTransaction id={transaction.transactionId} />
                      <DeleteTransaction id={transaction.transactionId} />
                    </div> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

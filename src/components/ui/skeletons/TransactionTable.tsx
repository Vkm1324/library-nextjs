import React from "react";

export default function TransactionTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile view skeleton */}
          <div className="md:hidden">
            <div className="mb-2 w-full rounded-md bg-white p-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="h-4 w-16 bg-gray-300"></div>
                <div className="h-4 w-16 bg-gray-300"></div>
                <div className="h-4 w-16 bg-gray-300"></div>
                <div className="h-4 w-16 bg-gray-300"></div>
              </div>
              <div className="flex w-full items-center justify-between pt-4">
                <div className="h-6 w-24 bg-gray-300"></div>
                <div className="h-4 w-20 bg-gray-300"></div>
                <div className="h-4 w-20 bg-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Desktop view skeleton */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">
                  Transaction ID
                </th>
                <th className="px-3 py-5 font-medium">Book ID</th>
                <th className="px-3 py-5 font-medium">Late Fees</th>
                <th className="px-3 py-5 font-medium">Transaction Type</th>
                <th className="px-3 py-5 font-medium">Issued Date</th>
                <th className="px-3 py-5 font-medium">Due Date</th>
                <th className="px-3 py-5 font-medium">Return Date</th>
                <th className="px-3 py-5 font-medium">Status</th>
                <th className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b py-3 text-sm last-of-type:border-none">
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="h-4 w-24 bg-gray-300"></div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="h-4 w-16 bg-gray-300"></div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="h-4 w-16 bg-gray-300"></div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="h-4 w-16 bg-gray-300"></div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="h-4 w-20 bg-gray-300"></div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="h-4 w-20 bg-gray-300"></div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="h-4 w-20 bg-gray-300"></div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="h-4 w-16 bg-gray-300"></div>
                </td>
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="h-4 w-16 bg-gray-300"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { BookRequestRepository } from "@/lib/book-requests/book-request.repository";
import { formatDateToLocal } from "@/lib/utils";
import { ApproveRequest, RejectRequest } from "../user-request/buttons";

export default async function BookRequestTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const db = new BookRequestRepository();
  // TODO make fetchFilteredBookRequest compatible ( currently it accepts only user id)
  const bookRequests = await db.fetchFilteredBookRequest(
    query,
    currentPage
  );
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {bookRequests?.map((request) => (
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
                <div className="flex justify-between gap-4">
                  <ApproveRequest id={request.id}  />
                  <RejectRequest id={request.id}  />
                </div>

                {/* Status  */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">Status:</p>
                  <p
                    className={`text-sm ${
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

          {/* Desktop view */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Request ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Book ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  User ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Request Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="px-3 py-5 font-semibold">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {bookRequests?.map((request) => (
                <tr
                  key={request.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {request.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {request.bookId}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {request.userId}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(request.requestDate.toDateString())}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-3 ${
                      request.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : request.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {request.status}
                  </td>

                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {request.status === "pending" && (
                      <div className="flex justify-end gap-3">
                        <ApproveRequest id={request.id} />
                        <RejectRequest id={request.id} />
                      </div>
                    )}
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

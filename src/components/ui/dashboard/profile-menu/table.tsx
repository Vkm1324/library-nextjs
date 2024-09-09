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
      const bookreq = new BookRequestRepository();
      // TODO make fetchFilteredBookRequest compatible ( currently it accepts only user id) 
      const bookRequests = await bookreq.fetchFilteredBookRequest(
        +query,
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
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <p className="text-sm text-gray-500">{request.bookId}</p>
                      <p className="text-sm text-gray-500">{request.userId}</p>
                      <p className="text-sm text-gray-500">{request.status}</p>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <p className="text-xl font-medium">
                        {formatDateToLocal(request.requestDate.toDateString())}
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
                            ? "text-green-800"
                            : request.status === "rejected"
                            ? "text-red-800"
                            : "bg-yellow-100 "
                        }`}
                      >
                        {request.status}
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

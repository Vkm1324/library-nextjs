export default function UsersBookRequestTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="bg-gray-300 h-4 w-24 rounded"></div>
                    <div className="bg-gray-300 h-4 w-24 rounded"></div>
                    <div className="bg-gray-300 h-4 w-24 rounded"></div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div className="bg-gray-300 h-6 w-32 rounded"></div>
                  </div>
                </div>
              ))}
          </div>

          {/* Desktop view */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <div className="bg-gray-300 h-4 w-16 rounded"></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <tr
                    key={index}
                    className="w-full border-b py-3 text-sm last-of-type:border-none"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="bg-gray-300 h-4 w-24 rounded"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="bg-gray-300 h-4 w-24 rounded"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="bg-gray-300 h-4 w-24 rounded"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="bg-gray-300 h-4 w-32 rounded"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="bg-gray-300 h-4 w-24 rounded"></div>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <div className="bg-gray-300 h-6 w-12 rounded"></div>
                        <div className="bg-gray-300 h-6 w-12 rounded"></div>
                      </div>
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

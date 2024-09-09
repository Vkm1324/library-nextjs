export default async function UsersTableSkeleton() {
  return (
    <div className="bg-gray-100 p-4">
      {/* Mobile view */}
      <div className="block md:hidden">
        <div className="bg-gray-300 h-6 w-1/2 mb-2 rounded"></div>
        <div className="bg-gray-300 h-6 w-3/4 mb-2 rounded"></div>
        <div className="bg-gray-300 h-6 w-2/3 mb-2 rounded"></div>
      </div>

      {/* Desktop view */}
      <table className="w-full table-auto hidden md:table">
        <thead>
          <tr>
            <th className="px-4 py-2">User ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Dummy rows */}
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <tr key={index} className="bg-gray-200">
                <td className="px-4 py-2">
                  <div className="bg-gray-300 h-6 w-24 rounded"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="bg-gray-300 h-6 w-32 rounded"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="bg-gray-300 h-6 w-48 rounded"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="bg-gray-300 h-6 w-20 rounded"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="bg-gray-300 h-6 w-16 rounded"></div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

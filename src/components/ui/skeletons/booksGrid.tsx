 export default function BooksGridSkeleton() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-8">Search Results</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="p-4">
                <div className="bg-gray-300 dark:bg-gray-700 h-6 mb-2 rounded"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 mb-2 rounded"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 mb-2 rounded"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 mb-2 rounded"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 mb-2 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

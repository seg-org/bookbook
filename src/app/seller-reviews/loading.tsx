export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded-md bg-gray-200"></div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="h-10 w-full animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 md:w-48"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
                  <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
                  <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1 h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200"></div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="h-4 w-1/3 rounded bg-gray-200"></div>
                <div className="h-8 w-28 rounded-md bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

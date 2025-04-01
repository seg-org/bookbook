export default function ReviewLoadingSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-3xl animate-pulse space-y-6 rounded-lg bg-white p-6 shadow-md">
        <div className="flex gap-6">
          <div className="h-[180px] w-[120px] rounded-lg bg-gray-200" />
          <div className="flex flex-1 flex-col justify-center space-y-3">
            <div className="h-6 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-3 w-1/4 rounded bg-gray-100" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-5 w-24 rounded bg-gray-200" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-10 rounded-full bg-gray-200" />
            ))}
          </div>
          <div>
            <div className="mb-2 h-5 w-24 rounded bg-gray-200" />
            <div className="h-[160px] w-full rounded bg-gray-100" />
          </div>
          <div className="h-10 w-full rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
}

// app/components/SkeletonLayout.js
export default function SkeletonLayout() {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Skeleton Navbar */}
        <div className="bg-gray-200 p-4 shadow-md animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
            <div className="flex space-x-4">
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
        {/* Skeleton Main Content */}
        <main className="flex-grow container mx-auto p-4">
          <div className="h-8 w-1/3 bg-gray-300 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-200 p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-300 rounded mb-4"></div>
              <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-300 rounded mb-4"></div>
              <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-300 rounded mb-4"></div>
              <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }
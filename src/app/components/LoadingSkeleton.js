export default function LoadingSkeleton() {
    return (
      <div className="container mx-auto p-4">
        <div className="h-8 w-1/3 bg-gray-300 rounded mb-6 animate-pulse"></div>
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
      </div>
    );
  }
import { Skeleton } from "@/components/ui/skeleton";

const ThreadSidebarSkeleton = () => {
  return (
    <div className="w-120 border-l flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="border-b h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="size-8 rounded-md" />
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 overflow-y-auto">
        {/* Parent Message Skeleton */}
        <div className="p-4 border-b bg-muted/20">
          <div className="flex space-x-3">
            {/* Avatar Skeleton */}
            <Skeleton className="size-8 rounded-full shrink-0" />

            <div className="flex-1 space-y-2 min-w-0">
              {/* Author Name and Timestamp */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>

              {/* Content Lines */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/6" />
              </div>
            </div>
          </div>
        </div>

        {/* Thread Replies Section Skeleton */}
        <div className="p-2">
          {/* Reply Count Skeleton */}
          <div className="mb-3 px-2">
            <Skeleton className="h-3 w-16" />
          </div>

          {/* Reply Skeletons */}
          <div className="space-y-1">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex space-x-3 p-3 rounded-lg">
                {/* Avatar */}
                <Skeleton className="size-8 rounded-full shrink-0 mt-1" />

                <div className="flex-1 space-y-2 min-w-0">
                  {/* Author and Time */}
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>

                  {/* Reply Content */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reply Input Skeleton */}
      <div className="border-t p-4">
        <div className="space-y-2">
          <Skeleton className="h-20 w-full rounded-lg" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadSidebarSkeleton;

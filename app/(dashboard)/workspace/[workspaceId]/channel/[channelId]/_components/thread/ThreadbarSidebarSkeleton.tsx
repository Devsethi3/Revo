import { Skeleton } from "@/components/ui/skeleton";

const ThreadSidebarSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header Skeleton */}
      <div className="border-b h-12 sm:h-14 px-2 sm:px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Skeleton className="size-4 rounded shrink-0" />
          <Skeleton className="h-3.5 sm:h-4 w-10 sm:w-14" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* SummarizeThread button skeleton */}
          <Skeleton className="size-8 sm:size-9 rounded-md" />
          {/* Close button skeleton */}
          <Skeleton className="size-8 sm:size-9 rounded-md" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Parent Message Skeleton */}
        <div className="p-3 sm:p-4 border-b bg-muted/20">
          <div className="flex gap-2 sm:gap-3">
            {/* Avatar Skeleton */}
            <Skeleton className="size-7 sm:size-8 rounded-full shrink-0" />

            <div className="flex-1 space-y-1 min-w-0">
              {/* Author Name and Timestamp */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <Skeleton className="h-3 sm:h-3.5 w-16 sm:w-20 md:w-24" />
                <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16 md:w-20" />
              </div>

              {/* Content Lines */}
              <div className="space-y-1.5 sm:space-y-2 pt-0.5">
                <Skeleton className="h-3 sm:h-3.5 w-full" />
                <Skeleton className="h-3 sm:h-3.5 w-[90%] sm:w-5/6" />
                <Skeleton className="h-3 sm:h-3.5 w-[70%] sm:w-4/6" />
              </div>

              {/* Optional Image Skeleton - shows on larger screens */}
              <div className="mt-2 hidden sm:block">
                <Skeleton className="w-full max-w-[200px] sm:max-w-[280px] md:max-w-[320px] h-28 sm:h-36 md:h-44 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Thread Replies Section Skeleton */}
        <div className="p-2 sm:p-3">
          {/* Reply Count Skeleton */}
          <div className="px-1 sm:px-2 mb-2 sm:mb-3">
            <Skeleton className="h-2.5 sm:h-3 w-10 sm:w-14" />
          </div>

          {/* Reply Skeletons */}
          <div className="space-y-0.5 sm:space-y-1">
            {[1, 2, 3].map((index) => (
              <ThreadReplySkeleton key={index} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Reply Input Skeleton */}
      <div className="border-t p-2 sm:p-3 md:p-4 shrink-0">
        <div className="space-y-2 sm:space-y-2.5">
          <Skeleton className="h-16 sm:h-18 md:h-20 w-full rounded-lg" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Skeleton className="size-6 sm:size-7 md:size-8 rounded" />
              <Skeleton className="size-6 sm:size-7 md:size-8 rounded hidden xs:block" />
              <Skeleton className="size-6 sm:size-7 md:size-8 rounded hidden sm:block" />
            </div>
            <Skeleton className="h-7 sm:h-8 md:h-9 w-14 sm:w-16 md:w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate component for reply skeleton with varied content lengths
const ThreadReplySkeleton = ({ index }: { index: number }) => {
  // Vary content length based on index for more realistic look
  const contentVariants = [
    { lines: 2, lastWidth: "w-4/5" },
    { lines: 1, lastWidth: "w-3/5" },
    { lines: 3, lastWidth: "w-2/3" },
  ];

  const variant = contentVariants[index % contentVariants.length];

  return (
    <div className="flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg">
      {/* Avatar */}
      <Skeleton className="size-7 sm:size-8 rounded-full shrink-0" />

      <div className="flex-1 space-y-1 sm:space-y-1.5 min-w-0">
        {/* Author and Time */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <Skeleton className="h-3 sm:h-3.5 w-14 sm:w-16 md:w-20" />
          <Skeleton className="h-2.5 sm:h-3 w-10 sm:w-12 md:w-14" />
        </div>

        {/* Reply Content - varied based on index */}
        <div className="space-y-1 sm:space-y-1.5">
          {Array.from({ length: variant.lines }).map((_, lineIndex) => (
            <Skeleton
              key={lineIndex}
              className={`h-3 sm:h-3.5 ${
                lineIndex === variant.lines - 1 ? variant.lastWidth : "w-full"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreadSidebarSkeleton;

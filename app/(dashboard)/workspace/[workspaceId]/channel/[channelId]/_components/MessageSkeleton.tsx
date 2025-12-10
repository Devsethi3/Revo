import { Skeleton } from "@/components/ui/skeleton";

const MessageSkeleton = () => {
  return (
    <div className="space-y-4 px-3 py-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="flex items-start gap-3">
          
          {/* Avatar */}
          <Skeleton className="size-9 rounded-full" />

          {/* Message content */}
          <div className="flex flex-col gap-2 w-full max-w-xl">

            {/* Username + timestamp */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-2.5 w-14 rounded" />
            </div>

            {/* Message bubble lines */}
            <div className="flex flex-col gap-2">
              <Skeleton
                className={`h-4 rounded-md ${
                  idx % 4 === 0
                    ? "w-[95%]"
                    : idx % 4 === 1
                    ? "w-[80%]"
                    : idx % 4 === 2
                    ? "w-[65%]"
                    : "w-[75%]"
                }`}
              />

              {/* Some messages have 2 lines */}
              {idx % 3 !== 1 && (
                <Skeleton
                  className={`h-4 rounded-md ${
                    idx % 2 === 0 ? "w-[60%]" : "w-[45%]"
                  }`}
                />
              )}

              {/* Additional 3rd line sometimes */}
              {idx % 5 === 0 && (
                <Skeleton className="h-4 w-[40%] rounded-md" />
              )}
            </div>

            {/* Occasional image (like screenshot) */}
            {idx % 6 === 0 && (
              <Skeleton className="h-52 w-full max-w-md rounded-lg mt-2" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;

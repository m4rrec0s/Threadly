import { Skeleton } from "./ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="flex items-center py-6 h-full overflow-y-hidden">
      <div className="space-y-6 w-full flex flex-col items-center max-w-2xl mx-auto">
        <div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="mt-3">
            <Skeleton className="h-[500px] w-[500px]" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-5 w-96" />
              <Skeleton className="h-5 w-80" />
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="mt-3">
            <Skeleton className="h-[500px] w-[500px]" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-5 w-96" />
              <Skeleton className="h-5 w-80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;

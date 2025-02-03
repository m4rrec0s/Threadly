import { Skeleton } from "@/app/components/ui/skeleton";

export default function PostSkeleton() {
  return (
    <div className="flex-grow">
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Imagem do post */}
        <div className="relative w-full h-full">
          <Skeleton className="w-full h-full" />
        </div>
        {/* Conteúdo do post */}
        <div className="flex flex-col justify-between h-full overflow-y-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-4 w-32" />
            <div className="border-b border-gray-600 my-2"></div>
            {/* Comentários */}
            <div className="flex flex-col gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <div className="border-b border-gray-600 w-full"></div>
            <div className="my-6 space-y-6">
              <div className="flex gap-3 items-center w-fit">
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-7 w-7" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="border-b border-gray-600 w-full"></div>
            <div className="flex gap-3 items-center">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

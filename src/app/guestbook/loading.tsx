import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const CardSkeleton = () => {
  return (
    <Card className="flex h-36 flex-col justify-between p-6">
      <Skeleton className="h-5 w-3/4" />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-12 w-16" />
      </div>
    </Card>
  );
};

// Shown instantly on navigation while the session and posts load (mirrors page.tsx's layout).
export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="title text-balance text-4xl sm:text-4xl">sign my guestbook.</h1>
        <Skeleton className="h-9 w-48" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

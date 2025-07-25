import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const CardSkeleton = () => {
  return (
    <Card className="flex h-36 flex-col justify-between">
      <Skeleton className="h-12 w-full" />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-16 w-16" />
      </div>
    </Card>
  );
};

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
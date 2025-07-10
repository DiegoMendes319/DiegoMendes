import { Card, CardContent } from "@/components/ui/card";

export default function SkeletonLoader() {
  return (
    <Card className="overflow-hidden">
      <div className="skeleton h-48 w-full"></div>
      <CardContent className="p-6">
        <div className="skeleton h-6 w-3/4 mb-2 rounded"></div>
        <div className="skeleton h-4 w-1/2 mb-4 rounded"></div>
        <div className="flex gap-2 mb-4">
          <div className="skeleton h-6 w-16 rounded-full"></div>
          <div className="skeleton h-6 w-20 rounded-full"></div>
        </div>
        <div className="skeleton h-4 w-full mb-4 rounded"></div>
        <div className="skeleton h-10 w-full rounded-lg"></div>
      </CardContent>
    </Card>
  );
}

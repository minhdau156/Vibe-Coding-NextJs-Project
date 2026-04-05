import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ItemsByTypeLoading() {
  return (
    <div className="container mx-auto py-8 px-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-16" /> {/* Dashboard */}
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-20" /> {/* Type */}
        </div>
        <Skeleton className="h-9 w-48" /> {/* Title */}
        <Skeleton className="h-5 w-72" /> {/* Description */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="h-full flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-4 rounded-full shrink-0" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              
              <div className="flex gap-2 mt-auto pt-2">
                <Skeleton className="h-4 w-12 rounded-full" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

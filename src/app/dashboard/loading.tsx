import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 flex flex-col gap-6">
          {/* Pinned Items Skeleton */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2 rounded-lg border p-4 h-full">
                    <div className="flex justify-between gap-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Items Skeleton */}
          <Card>
             <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardHeader>
            <CardContent className="mt-4 flex flex-col gap-3">
               {Array.from({ length: 3 }).map((_, i) => (
                 <div key={i} className="flex gap-4 p-3 border rounded-lg">
                   <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                   <div className="flex-1 flex flex-col justify-center gap-2">
                     <Skeleton className="h-4 w-40" />
                     <Skeleton className="h-3 w-20" />
                   </div>
                   <Skeleton className="h-3 w-16 my-auto" />
                 </div>
               ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column Skeleton */}
        <div className="col-span-3 flex flex-col gap-6">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
               <div className="flex flex-col gap-4">
                 {Array.from({ length: 5 }).map((_, i) => (
                   <div key={i} className="p-4 border rounded-lg flex justify-between items-center">
                     <div className="flex flex-col gap-2">
                       <Skeleton className="h-5 w-32" />
                       <Skeleton className="h-3 w-24" />
                     </div>
                     <Skeleton className="h-6 w-20 rounded-full" />
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

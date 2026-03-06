import { Skeleton } from '@/shared/ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* ACWR Panel skeleton */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-4 w-full">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-32" />
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto md:min-w-[400px]">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg col-span-2" />
          </div>
        </div>
      </section>

      {/* Two-column layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Chart skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <Skeleton className="h-4 w-40 mb-4" />
            <Skeleton className="h-48" />
          </div>
        </div>

        {/* Sessions skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  );
}

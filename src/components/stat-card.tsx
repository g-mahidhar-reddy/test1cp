import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StatCardData } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

export function StatCard({ title, value, change, icon: Icon, isLoading }: StatCardData & { isLoading?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <Skeleton className="h-8 w-20" />
        ) : (
            <div className="text-2xl font-bold">{value}</div>
        )}
        {change && !isLoading && (
          <p className="text-xs text-muted-foreground">{change}</p>
        )}
      </CardContent>
    </Card>
  );
}

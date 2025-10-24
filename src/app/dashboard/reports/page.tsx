import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { OverviewChart } from "@/components/overview-chart";
import { StatCard } from "@/components/stat-card";
import { Users, Briefcase, FileText, ArrowUpRight } from "lucide-react";

const reportStats = [
  { title: "Total Students Placed", value: "350", icon: Users },
  { title: "Total Companies Engaged", value: "85", icon: Briefcase },
  { title: "Active MoUs", value: "42", icon: FileText },
  { title: "Total Credits Awarded", value: "5,400", icon: ArrowUpRight },
];

export default function ReportsPage() {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {reportStats.map(stat => (
           <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle>Placements by Department</CardTitle>
                <CardDescription>A breakdown of internship placements across different departments.</CardDescription>
            </CardHeader>
            <CardContent>
                <OverviewChart />
            </CardContent>
         </Card>
         <Card>
            <CardHeader>
                <CardTitle>Company Engagement</CardTitle>
                <CardDescription>Number of internships posted by top partner companies.</CardDescription>
            </CardHeader>
            <CardContent>
                <OverviewChart />
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

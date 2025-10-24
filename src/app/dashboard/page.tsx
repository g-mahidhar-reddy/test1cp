import {
  Activity,
  ArrowUpRight,
  Briefcase,
  FileText,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/stat-card";
import { OverviewChart } from "@/components/overview-chart";
import { mockApplications } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// This would come from useAuth() in a client component
const userRole = "student"; // 'student', 'faculty', 'industry'
const userId = "student1"; // This would also come from the user object

const studentStats = [
  {
    title: "Internships Applied",
    value: "12",
    change: "+2 from last month",
    icon: Briefcase,
  },
  {
    title: "Active Applications",
    value: "3",
    change: "+1 from last week",
    icon: Activity,
  },
  {
    title: "Credits Earned",
    value: "20",
    change: "10 this semester",
    icon: ArrowUpRight,
  },
  {
    title: "Companies Connected",
    value: "8",
    change: "+5%",
    icon: Users,
  },
];

const facultyStats = [
  { title: "Active MoUs", value: "25", icon: FileText },
  { title: "Students on Internships", value: "150", icon: Users },
  { title: "Companies Partnered", value: "40", icon: Briefcase },
  { title: "Total Credits Approved", value: "1,200", icon: ArrowUpRight },
];

const industryStats = [
  { title: "Active Internships", value: "5", icon: Briefcase },
  { title: "Total Applicants", value: "250", icon: Users },
  { title: "Shortlisted Candidates", value: "15", icon: Activity },
  { title: "Successful Hires", value: "4", icon: ArrowUpRight },
];

const getStats = (role: string) => {
  switch (role) {
    case "faculty":
      return facultyStats;
    case "industry":
      return industryStats;
    default:
      return studentStats;
  }
};

export default function DashboardPage() {
  const stats = getStats(userRole);
  
  // Filter applications for the current user and take the most recent 5.
  const myApplications = mockApplications.filter(app => app.studentId === userId);
  const recentApplications = myApplications.slice(0, 5);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Internship Progress</CardTitle>
            <CardDescription>
              Your application and completion overview for this year.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              You have {myApplications.length} total applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                           <AvatarImage src={app.internshipDetails?.companyLogoUrl} alt="Avatar" />
                           <AvatarFallback>
                            {app.internshipDetails?.companyName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{app.internshipDetails?.companyName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                       <Badge variant={app.status === 'accepted' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>
                        {app.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
